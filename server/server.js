import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//   })
// );
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// cheat log in- always logged in as the same user
const CURRENT_USER_ID = (
  await prisma.user.findFirst({ where: { name: "Kyle" } })
).id;

app.use((req, res, next) => {
  if (req.cookies.userId !== CURRENT_USER_ID) {
    req.cookies.userId = CURRENT_USER_ID;
    res.clearCookie("userId");
    res.cookie("userId", CURRENT_USER_ID);
  }

  next();
});

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  res.status(200).json(posts);
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.post
    .findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        body: true,
        title: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            ...COMMENT_SELECT_FIELDS,
            _count: { select: { likes: true } },
          },
        },
      },
    })
    .then(async (post) => {
      // finding all the likes from the logged in user
      const likes = await prisma.like.findMany({
        where: {
          userId: req.cookies.userId,
          commentId: { in: post.comments.map((comment) => comment.id) },
        },
      });

      // we keep all the original post data, but we're editing the comments property to keep all the original comment fields but also add a new likedByMe Boolean property that tells us if the user has liked the comment or not, as well as a simple count of all the likes on the comment
      const completePost = {
        ...post,
        comments: post.comments.map((comment) => {
          const { _count, ...commentFields } = comment;
          return {
            ...commentFields,
            likedByMe: likes.find(
              (like) => like.commentId === comment.commentId
            ),
            likeCount: _count.likes,
          };
        }),
      };

      res.status(200).json(completePost);
    });
});

app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message === "" || req.body.message === null) {
    res.status(400).send("A comment cannot be empty");
  }

  await prisma.comment
    .create({
      data: {
        message: req.body.message,
        userId: req.cookies.userId,
        parentId: req.body.parentId,
        postId: req.params.id,
      },
      select: COMMENT_SELECT_FIELDS,
    })
    .then((comment) => {
      const newComment = {
        ...comment,
        likeCount: 0,
        likedByMe: false,
      };

      res.status(201).json(newComment);
    });
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  if (req.body.message === "" || req.body.message === null) {
    res.status(400).send("A comment cannot be empty");
  }

  const { userId } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });

  if (userId !== req.cookies.userId) {
    return res.status(403).send("You can't update someone else's comment!");
  }

  const updatedComment = await prisma.comment.update({
    where: { id: req.params.commentId },
    data: { message: req.body.message },
    select: { message: true },
  });

  res.status(200).json(updatedComment);
});

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { userId } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });

  if (userId !== req.cookies.userId) {
    return res.status(403).send("You can't delete someone else's comment!");
  }

  const deletedCommentId = await prisma.comment.delete({
    where: { id: req.params.commentId },
    select: { id: true },
  });

  res.status(200).json(deletedCommentId);
});

app.post("/posts/:postId/comments/:commentId/toggleLike", async (req, res) => {
  // as we need to toggle the like, we get the necessary data to determine if we need to like or unlike
  const data = {
    commentId: req.params.commentId,
    userId: req.cookies.userId,
  };

  const like = await prisma.like.findUnique({
    where: { userId_commentId: data },
  });

  // if null, we create the like
  // if not, we delete the like
  if (like == null) {
    await prisma.like.create({ data }).then(() => {
      const like = { addLike: true };
      res.status(201).json(like);
    });
  } else {
    await prisma.like
      .delete({
        where: {
          userId_commentId: data,
        },
      })
      .then(() => {
        const like = { addLike: false };
        res.status(200).json(like);
      });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

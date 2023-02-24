import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// cheat log in- always logged in as the same user
const CURRENT_USER_ID = await prisma.user.findFirst({
  where: {
    name: "Kyle",
  },
}).id;

app.use((req, res, next) => {
  if (req.cookies.userId !== CURRENT_USER_ID) {
    req.cookies.userId = CURRENT_USER_ID;
    res.clearCookie("userId");
    res.cookie("userId", CURRENT_USER_ID);
  }
  next();
});

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

  const post = await prisma.post.findUnique({
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
        },
      },
    },
  });

  res.status(200).json(post);
});

app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message === "" || req.body.message === null) {
    res.status(400).send("A comment cannot be empty");
  }

  await prisma.comment.create({
    data: {
      message: req.body.message,
      userId: req.cookies.userId,
      parentId: req.body.parentId,
      postId: req.params.id,
    },
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

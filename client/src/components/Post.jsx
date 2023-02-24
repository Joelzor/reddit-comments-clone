import React from "react";
import { usePost } from "../contexts/PostContext";
import { useAsyncFunction } from "../hooks/useAsync";
import Comments from "./Comments";
import CreateComment from "./CreateComment";
import { createComment } from "../utils/comments";

const Post = () => {
  const { post, rootComments, createLocalComment } = usePost();
  const {
    loading,
    error,
    execute: createCommentFn,
  } = useAsyncFunction(createComment);

  const onCommentCreate = (message) => {
    return createCommentFn({ postId: post.id, message }).then(
      createLocalComment
    );
  };

  return (
    <>
      <h1>{post.title}</h1>
      <article>{post.body}</article>
      <h3 className="comments-title">Comments</h3>
      <section>
        <CreateComment
          loading={loading}
          error={error}
          onSubmit={onCommentCreate}
        />
        {rootComments && rootComments.length > 0 && (
          <div className="mt-4">
            <Comments comments={rootComments} />
          </div>
        )}
      </section>
    </>
  );
};

export default Post;

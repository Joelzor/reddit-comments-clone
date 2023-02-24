import React, { useState } from "react";
import IconBtn from "./IconBtn";
import { FaHeart, FaReply, FaEdit, FaTrash } from "react-icons/fa";
import { usePost } from "../contexts/PostContext";
import Comments from "./Comments";
import CreateComment from "./CreateComment";
import { useAsyncFunction } from "../hooks/useAsync";
import { createComment } from "../utils/comments";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const Comment = ({ id, message, user, createdAt }) => {
  const {
    error,
    loading,
    execute: commentReplyFn,
  } = useAsyncFunction(createComment);
  const { getReplies, createLocalComment, post } = usePost();
  const commentReplies = getReplies(id);
  const [repliesHidden, setRepliesHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const onCommentReply = (message) => {
    return commentReplyFn({ postId: post.id, message, parentId: id }).then(
      (comment) => {
        createLocalComment(comment);
        setIsReplying(false);
      }
    );
  };

  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{user.name}</span>
          <span className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        <div className="message">{message}</div>
        <div className="footer">
          <IconBtn Icon={FaHeart} aria-label="Like">
            2
          </IconBtn>
          <IconBtn
            isActive={isReplying}
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
            onClick={() => setIsReplying(!isReplying)}
          />
          <IconBtn Icon={FaEdit} aria-label="Edit" />
          <IconBtn Icon={FaTrash} aria-label="Delete" color="danger" />
        </div>
      </div>
      {isReplying && (
        <div className="mt-1 ml-3">
          <CreateComment
            autoFocus
            onSubmit={onCommentReply}
            loading={loading}
            error={error}
          />
        </div>
      )}
      {commentReplies?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${repliesHidden ? "hide" : ""}`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setRepliesHidden(true)}
            />
            <div className="nested-comments">
              <Comments comments={commentReplies} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!repliesHidden ? "hide" : ""}`}
            onClick={() => setRepliesHidden(false)}
          >
            Show replies
          </button>
        </>
      )}
    </>
  );
};

export default Comment;

import React, { useState } from "react";
import IconBtn from "./IconBtn";
import { FaHeart, FaReply, FaEdit, FaTrash, FaRegHeart } from "react-icons/fa";
import { usePost } from "../contexts/PostContext";
import Comments from "./Comments";
import CreateComment from "./CreateComment";
import { useAsyncFunction } from "../hooks/useAsync";
import {
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} from "../utils/comments";
// import { useUser } from "../hooks/useUser";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const Comment = ({ id, message, user, createdAt, likeCount, likedByMe }) => {
  const {
    error,
    loading,
    execute: commentReplyFn,
  } = useAsyncFunction(createComment);

  const {
    error: updateError,
    loading: updateLoading,
    execute: commentUpdateFn,
  } = useAsyncFunction(updateComment);

  const {
    error: deleteError,
    loading: deleteLoading,
    execute: deleteCommentFn,
  } = useAsyncFunction(deleteComment);

  const { loading: likeLoading, execute: toggleLikeFn } =
    useAsyncFunction(toggleCommentLike);

  const {
    getReplies,
    createLocalComment,
    post,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike,
  } = usePost();
  const commentReplies = getReplies(id);
  const [repliesHidden, setRepliesHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const currentUser = useUser();
  // console.log(document.cookie);
  // console.log(currentUser);

  const onCommentReply = (message) => {
    return commentReplyFn({ postId: post.id, message, parentId: id }).then(
      (comment) => {
        setIsReplying(false);
        createLocalComment(comment);
      }
    );
  };

  const onCommentUpdate = (message) => {
    return commentUpdateFn({ postId: post.id, message, id }).then((comment) => {
      setIsEditing(false);
      updateLocalComment({ id, message: comment.message });
    });
  };

  const onCommentDelete = () => {
    return deleteCommentFn({ postId: post.id, id }).then(({ id }) => {
      deleteLocalComment(id);
    });
  };

  const onLikeToggle = () => {
    return toggleLikeFn({ postId: post.id, id }).then(({ addLike }) => {
      toggleLocalCommentLike(id, addLike);
    });
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
        {isEditing ? (
          <CreateComment
            autoFocus
            initialValue={message}
            onSubmit={onCommentUpdate}
            loading={updateLoading}
            error={updateError}
          />
        ) : (
          <div className="message">{message}</div>
        )}
        <div className="footer">
          <IconBtn
            Icon={likedByMe ? FaHeart : FaRegHeart}
            aria-label={likedByMe ? "Unlike" : "Like"}
            onClick={onLikeToggle}
            disabled={likeLoading}
          >
            {likeCount}
          </IconBtn>
          <IconBtn
            isActive={isReplying}
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
            onClick={() => setIsReplying(!isReplying)}
          />

          <IconBtn
            Icon={FaEdit}
            aria-label={isEditing ? "Cancel Edit" : "Edit"}
            isActive={isEditing}
            onClick={() => setIsEditing(!isEditing)}
          />
          <IconBtn
            Icon={FaTrash}
            aria-label="Delete"
            color="danger"
            onClick={onCommentDelete}
            disabled={deleteLoading}
          />
        </div>
        {deleteError && <div className="error-msg mt-1">{deleteError}</div>}
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

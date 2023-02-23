import React, { useState } from "react";
import IconBtn from "./IconBtn";
import { FaHeart, FaReply, FaEdit, FaTrash } from "react-icons/fa";
import { usePost } from "../contexts/PostContext";
import Comments from "./Comments";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const Comment = ({ id, message, user, createdAt }) => {
  const { getReplies } = usePost();
  const commentReplies = getReplies(id);
  const [repliesHidden, setRepliesHidden] = useState(false);
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
          <IconBtn Icon={FaReply} aria-label="Reply" />
          <IconBtn Icon={FaEdit} aria-label="Edit" />
          <IconBtn Icon={FaTrash} aria-label="Delete" color="danger" />
        </div>
      </div>
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

import React from "react";
import IconBtn from "./IconBtn";
import { FaHeart } from "react-icons/fa";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const Comment = ({ id, message, user, createdAt }) => {
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
          <IconBtn Icon={FaHeart}>2</IconBtn>
        </div>
      </div>
    </>
  );
};

export default Comment;

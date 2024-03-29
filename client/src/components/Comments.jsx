import React from "react";
import Comment from "./Comment";

const Comments = ({ comments }) => {
  return comments.map((comment) => {
    return (
      <div key={comment.id} className="comment-stack">
        <Comment {...comment} />
      </div>
    );
  });
};

export default Comments;

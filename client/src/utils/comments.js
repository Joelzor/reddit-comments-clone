import request from "./request";

export const createComment = ({ postId, message, parentId }) => {
  return request(`posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId },
  });
};

export const updateComment = ({ postId, message, commentId }) => {
  return request(`posts/${postId}/comments/${commentId}`, {
    method: "PUT",
    data: { message },
  });
};

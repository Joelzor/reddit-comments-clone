import request from "./request";

export const createComment = ({ postId, message, parentId }) => {
  return request(`posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId },
  });
};

export const updateComment = ({ postId, message, id }) => {
  return request(`posts/${postId}/comments/${id}`, {
    method: "PUT",
    data: { message },
  });
};

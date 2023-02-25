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

export const deleteComment = ({ postId, id }) => {
  return request(`posts/${postId}/comments/${id}`, {
    method: "DELETE",
  });
};

export const toggleCommentLike = ({ postId, id }) => {
  return request(`posts/${postId}/comments/${id}/toggleLike`, {
    method: "POST",
  });
};

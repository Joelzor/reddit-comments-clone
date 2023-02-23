import request from "./request";

export const createComment = ({ postId, message, parentId }) => {
  return request(`posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId },
  });
};

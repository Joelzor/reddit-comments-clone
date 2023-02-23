import request from "./request";

export const getPosts = () => {
  return request("/posts");
};

export const getPost = (id) => {
  return request(`/posts/${id}`);
};

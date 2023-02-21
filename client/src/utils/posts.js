import request from "./request";

const getPosts = () => {
  return request("/posts");
};

export default getPosts;

import { React, useEffect, useState } from "react";
import getPosts from "../utils/posts";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(setPosts);
  });

  return <div>{JSON.stringify(posts)}</div>;
};

export default Posts;

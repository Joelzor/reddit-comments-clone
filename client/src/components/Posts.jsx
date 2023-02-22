import { React, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import getPosts from "../utils/posts";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then((data) => {
      const { posts } = data;
      setPosts(posts);
    });
  }, []);

  return posts.map((post) => {
    return (
      <h1 key={post.id}>
        <a href={`/posts/${post.id}`}>{post.title}</a>
      </h1>
    );
  });
};

export default Posts;

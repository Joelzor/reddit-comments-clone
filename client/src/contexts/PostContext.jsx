import React from "react";
import { getPost } from "../utils/posts";
import { useAsync } from "../hooks/useAsync";
import { useParams } from "react-router-dom";
const Context = React.createContext();

// eslint-disable-next-line react/prop-types
const PostProvider = ({ children }) => {
  const { id } = useParams();
  // passing in callback to useAsync so we don't execute getPost immediately
  const { loading, error, value: post } = useAsync(() => getPost(id), [id]);
  return (
    <Context.Provider value={{ post }}>
      {/* ugh */}
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1 className="error-msg">{error.message}</h1>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

export default PostProvider;

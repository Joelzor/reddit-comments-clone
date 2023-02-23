import React, { useContext, useMemo } from "react";
import { getPost } from "../utils/posts";
import { useAsync } from "../hooks/useAsync";
import { useParams } from "react-router-dom";
const Context = React.createContext();

export const usePost = () => {
  return useContext(Context);
};

// eslint-disable-next-line react/prop-types
const PostProvider = ({ children }) => {
  const { id } = useParams();
  // passing in callback to useAsync so we don't execute getPost immediately
  const { loading, error, value: post } = useAsync(() => getPost(id), [id]);

  // creating an object of grouped comments for the nesting
  const commentsByParentId = useMemo(() => {
    if (post?.comments === null) return [];
    const group = {};
    post?.comments.forEach((comment) => {
      // if left hand is not falsy, do nothing
      // otherwise assign an empty array
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });

    return group;
  }, [post?.comments]);

  const getReplies = (parentId) => {
    return commentsByParentId[parentId];
  };

  return (
    <Context.Provider
      // commentsByParentId[null] is the group of comments that don't have parent id's - they are not nested comments
      value={{ post, getReplies, rootComments: commentsByParentId[null] }}
    >
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

import React, { useContext, useMemo, useState, useEffect } from "react";
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
  // creating local state for comments- we need to combine the newly created comments with the comments coming from the db
  const [comments, setComments] = useState([]);

  // console.log("comments", comments);

  // creating an object of grouped comments for the nesting
  const commentsByParentId = useMemo(() => {
    // if (comments === null) return [];
    const group = {};
    comments.forEach((comment) => {
      // if left hand is not falsy, do nothing
      // otherwise assign an empty array
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });

    return group;
  }, [comments]);

  useEffect(() => {
    if (post?.comments == null) return;
    setComments(post.comments);
  }, [post?.comments]);

  const getReplies = (parentId) => {
    return commentsByParentId[parentId];
  };

  const createLocalComment = (comment) => {
    setComments((prevComments) => {
      return [comment, ...prevComments];
    });
  };

  const updateLocalComment = ({ id, message }) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, message };
        } else {
          return comment;
        }
      });
    });
  };

  return (
    <Context.Provider
      // commentsByParentId[null] is the group of comments that don't have parent id's - they are not nested comments
      value={{
        post,
        getReplies,
        rootComments: commentsByParentId[null],
        createLocalComment,
        updateLocalComment,
      }}
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

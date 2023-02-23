import { React } from "react";
import Posts from "./components/Posts";
import Post from "./components/Post";
import PostProvider from "./contexts/PostContext";
import { Routes, Route } from "react-router-dom";
import "./styles.css";

const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route
          path="/posts/:id"
          element={
            <PostProvider>
              <Post />
            </PostProvider>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

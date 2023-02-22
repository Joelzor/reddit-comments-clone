import { React } from "react";
import Posts from "./components/Posts";
import { Routes, Route } from "react-router-dom";
import "./styles.css";

const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/posts/:id" element={null} />
      </Routes>
    </div>
  );
};

export default App;

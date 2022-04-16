import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import QuizComponent from "./components/Quiz";
import Signup from "./components/Signup";

const App = (props) => {
  return (
    <Routes>
      <Route path="/" element={<Quiz />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
};

const Quiz = (props) => {
  return (
    <>
      <QuizComponent />
    </>
  );
};

export default App;

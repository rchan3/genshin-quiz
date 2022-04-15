import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import QuizComponent from "./components/Quiz";
import LoginComponent from "./components/LogIn";

const App = (props) => {
  return (
    <Routes>
      <Route path="/" element={<Quiz />} />
    </Routes>
  );
};

const Quiz = (props) => {
  return (
    <>
      <header className="App-header">{<LoginComponent />}</header>
      <QuizComponent />
    </>
  );
};

export default App;

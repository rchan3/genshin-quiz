import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [isDupe, setIsDupe] = useState();

  const navigate = useNavigate();

  const getUser = async (user, pass) => {
    const res = await fetch(
      `http://localhost:3001/signup?username=${user}&pw=${pass}`,
      { method: "POST" }
    );
    const jsonData = await res.json();
    setIsDupe(jsonData.dupe);
  };

  const handleSignup = (i) => {
    i.preventDefault();
    getUser(username, password);
  };

  const signupResponse = () => {
    if (isDupe === undefined) {
      return <></>;
    } else if (isDupe === true) {
      return <p>username already exists</p>;
    } else {
      return navigate("/");
    }
  };

  return (
    <>
      <h1>signuppage</h1>
      <form onSubmit={handleSignup}>
        <label>
          username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" value="submit" />
      </form>
      {signupResponse()}
    </>
  );
};

export default Signup;

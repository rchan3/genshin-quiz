import React, { useState } from "react";
import "./Login.css";

const Login = (props) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  const getUser = async (user, pass) => {
    const res = await fetch(
      `http://localhost:3001/login?username=${user}&pw=${pass}`,
      { method: "GET" }
    );

    const jsonData = await res.json();
    console.log(jsonData.loggedIn);
    setIsLoggedIn(jsonData.loggedIn);
  };

  const handleLogin = (i) => {
    i.preventDefault();
    getUser(username, password);
  };

  const wrongUserOrPassword = () => {
    if (isLoggedIn === false) {
      return (
        <div>
          <p>the username or password is incorrect</p>
        </div>
      );
    } else {
      return <></>;
    }
  };

  if (isLoggedIn === true) {
    return (
      <div>
        <p>{`currently logged in as ${username}`}</p>
      </div>
    );
  } else {
    return (
      <div>
        <form onSubmit={handleLogin}>
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
        {wrongUserOrPassword()}
      </div>
    );
  }
};

export default Login;

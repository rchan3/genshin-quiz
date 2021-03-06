import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = (props) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const getUser = async (user, pass) => {
    const res = await fetch(
      `http://localhost:3001/login?username=${user}&pw=${pass}`,
      { method: "GET" }
    );

    const jsonLoggedIn = await res.json();

    setIsLoggedIn(jsonLoggedIn.loggedIn);
  };

  const handleLogin = (i) => {
    i.preventDefault();
    getUser(username, password);
  };

  const wrongUserOrPassword = () => {
    if (isLoggedIn === undefined) {
      return (
        <div>
          <p>wrong username</p>
        </div>
      );
    } else if (isLoggedIn === false) {
      return (
        <div>
          <p>wrong password</p>
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
        <button
          onClick={() => {
            setIsLoggedIn(null);
          }}
        >
          log out
        </button>
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
        <Link to="signup" className="signup">
          sign up
        </Link>
        {wrongUserOrPassword()}
      </div>
    );
  }
};

export default Login;

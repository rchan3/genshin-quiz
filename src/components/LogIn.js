import React, { useState } from "react";
import "./Login.css";

const Login = (props) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [checkUser, setCheckUser] = useState();

  const getUser = async (user, pass) => {
    const res = await fetch(
      `http://localhost:3001/login?username=${user}&pw=${pass}`,
      { method: "GET" }
    );
    console.log(res);
    const jsonData = await res.json();
    setCheckUser(jsonData);
  };

  const handleSubmit = (i) => {
    i.preventDefault();
    getUser(username, password);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Login;

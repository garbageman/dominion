import React from "react";
import styles from "./styles.css";

const Login = ({ username, setLoggedIn, setUsername }) => {
  return (
    <div className="login">
      <input
        type="text"
        value={username}
        onChange={event => setUsername(event.target.value)}
        onKeyPress={event => {
          if (event.key === "Enter") {
            setLoggedIn(true);
          }
        }}
        placeholder="Enter a username"
      />
      <button onClick={() => setLoggedIn(true)}>Connect!</button>
    </div>
  );
};

export default Login;

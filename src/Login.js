import './csss/login.css'
import welcome from './pictures/welcome.png'
import React, { useState } from 'react';
import { isRegistered, getDisplayName, getPassword, getProfilePhoto } from './registers';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isClose, setIsClose] = useState(true);

  const closeAlert = function () {
    setIsClose(true);
  }

  function myAlert(errorMsgParam) {
    setErrorMsg(errorMsgParam);
    setIsClose(false);
  }
  const navigate = useNavigate();
  const moveToRegister = function () {
    navigate("/register");
  }

  const validateUsername = function () {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;
    if (!isRegistered(username)) {
      return false;
    }

    return true;
  }

  const validatePassword = function () {
    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;
    console.log(password);
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;
    if (!(getPassword(username) === password)) {
      return false;
    }

    return true;
  }

  const login = function () {

    if (!validateUsername()) {
      myAlert("You are not registered");
      return false;
    }


    if (!validatePassword()) {
      myAlert("Wrong password");
      return false;
    }

    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;

    navigate("/chats", {
      state: {
        username: username,
        displayName: getDisplayName(username),
        picture: (getProfilePhoto(username))
      }
    });
  }

  return (
    <div id="login">
      {!isClose && (<div class="alert alert-danger alert-dismissible fade show absolute-top" role="alert">
        {errorMsg}
        <button type="button" class="close" onClick={closeAlert}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>)}
      <div className="container" id="loginBox">
        <form action="login.php" method="post">
          <div className="form-group">
            <br />
            <label htmlFor="username">enter username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              id="username"
              name="username"
              required=""
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">enter password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              id="password"
              name="password"
              required=""
            />
            <br />
          </div>
          <div className="mt-3 text-center">
            <button
              type="button"
              id="submitLogin"
              onClick={login}
              className="btn btn-primary"
            > login </button>
            don't have an account?
            <button class="invisible-button" onClick={moveToRegister}><b>click here</b></button>
            to register
          </div>
          <br />
        </form>
        <br />
      </div>
    </div>

  );
}

export default Login;
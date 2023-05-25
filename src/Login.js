import './csss/login.css'
import welcome from './pictures/welcome.png'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverGetToken } from './operations';
import { serverGetAcountInfo } from './operations'

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

  const validateUsernameAndPassword = async function() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;
    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;
    const token =  await serverGetToken(username, password)
    if (token === "") {
      myAlert("Incorrect username and/or password")
      return ""
    }

    return token
  }

  const login = async function () {

    const token = await validateUsernameAndPassword()
    if (token === "") {
      return;
    }

    console.log(token)
    const usernameInput = document.getElementById("username");
    const {username, displayName, profilePic} = await serverGetAcountInfo(token, usernameInput.value)
    console.log("info: " + username + " " + displayName + " " + profilePic)
    navigate("/chats", {
      state: {
        username: username,
        displayName: displayName,
        picture: profilePic,
        token: token
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
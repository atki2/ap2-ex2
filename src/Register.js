import './csss/register.css'

import grass from './pictures/grass.webp'
import empty from './pictures/empty.png'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser, isRegistered } from './registers';
import { useState } from 'react';
const registers = [];
function Register() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isClose, setIsClose] = useState(true);

  const closeAlert = function () {
    setIsClose(true);
  }

  function myAlert(errorMsgParam) {
    setErrorMsg(errorMsgParam);
    setIsClose(false);
  }
  const [imageUrl, setImageUrl] = useState(empty);

  function handleImageChange(event) {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      setImageUrl(event.target.result);
    };

    reader.readAsDataURL(selectedFile);
  }
  const navigate = useNavigate();
  const moveToLogin = function () {
    navigate("/");
  }
  const userNameTaken = function () {
    const username = document.getElementById('username');
    const user = registers.find(user => user.username === username.value);
    return user ? false : true;
  }

  const handleUser = function () {
    const username = document.getElementById('username');
    for (let i = 0; i < username.value.length; i++) {
      const charCode = username.value.charCodeAt(i);
      if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
        return true;
      }
    }
    return false;
  }

  const handlePassword = function () {
    let hasLetter = false;
    let hasDigit = false;
    const password = document.getElementById('password');
    if (password.value.length < 8) {
      return false;
    }
    for (let i = 0; i < password.value.length; i++) {
      const charCode = password.value.charCodeAt(i);
      if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
        hasLetter = true;
      }
      if (charCode >= 48 && charCode <= 57) {
        hasDigit = true;
      }
      if (hasDigit && hasLetter) {
        return true;
      }
    }

    return false;
  }

  const handleConfirmPassword = function () {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    return (confirmPassword == password)
  }

  const handleDisplay = function () {
    const displayName = document.getElementById('display');
    for (let i = 0; i < displayName.value.length; i++) {
      const charCode = displayName.value.charCodeAt(i);
      if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
        return true;
      }
    }

    return false;
  }

  const registerAddUser = function () {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const displayName = document.getElementById('display');
    const profilePhoto = document.getElementById('picture');
    if (!handleUser()) {
      myAlert("Invalid username\nusername must have at least one english letter");
      return;
    }

    if (!handlePassword()) {
      myAlert("Invalid password\npassword must contain at least 8 characters, combination of english letters and digits");
      return;
    }

    if (!handleConfirmPassword()) {
      myAlert("Passwords don't match");
      return;
    }

    if (!handleDisplay()) {
      myAlert("Invalid display name\ndisplay name must have at least one english letter");
      return;
    }

    if (isRegistered(username.value)) {
      myAlert("Invalid username\nusername already taken");
      return;
    }


    addUser(username.value, password.value, displayName.value, { imageUrl });
    navigate("/chats", {
      state: {
        username: username.value,
        displayName: displayName.value,
        picture: { imageUrl }
      }
    });
  }

  return (
    <div id="register">
      {!isClose && (<div class="alert alert-danger alert-dismissible show absolute-top" role="alert">
        {errorMsg}
        <button type="button" class="close" onClick={closeAlert}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>)}
      <div className="register container" id="registerBox">
        <br />
        <div className="register form-group row">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="register form-control"
            placeholder="username must have at least one english letter"
            id="username"
            name="username"
            required=""
          />
        </div>
        <div className="register form-group row">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="register form-control"
            placeholder="password must contain at least 8 characters, combination of english letters and digits"
            id="password"
            name="password"
            required=""
          />
        </div>
        <div className="register form-group row">
          <label htmlFor="password">Confirm password</label>
          <input
            type="password"
            className="register form-control"
            placeholder="confirm password"
            id="confirmPassword"
            name="confirm password"
            required=""
          />
        </div>
        <div className="register form-group row">
          <label htmlFor="username">Display name</label>
          <input
            type="text"
            className="register form-control"
            placeholder="display name must have at least one english letter"
            id="display"
            name="displayName"
            required=""
          />
        </div>
        <div>
          <div className="register form-group row">
            <label htmlFor="custom-file" className="register form-lable">
              Profile picture
            </label>
            <input type="file" accept="image/*" className="register form-control" id="picture" name="file" onChange={handleImageChange} required />
          </div>
          {imageUrl && (
            <img src={imageUrl} alt="profile picture" id="profilePic" />
          )}
        </div>
        <div className="register mt-3 text-center row">
          <div className="col-4">
            <button id="submitRegister" className="register btn btn-primary" onClick={registerAddUser}>submit</button>
          </div>
          <div className="col-8">
            already have an account?
            <button class="invisible-button" onClick={moveToLogin}><b>click here</b></button>
            to login
          </div>
        </div>
        <br />
      </div>
    </div>
  );
}

export default Register;
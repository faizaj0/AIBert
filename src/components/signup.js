

import Navigation from "./navigation";
import { useNavigate } from "react-router-dom";
import React from "react";
import "./components.css";
import Acorn from "../Images/acorn.png";
import globalVariables from "./globals/globalVariables";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState(""); // add state variable for error message
  const onError = (errors, e) => console.log(errors, e);

  const onSubmit = (data, e) => {
    console.log(data);
    if (data.password !== data.repeatPassword) {
      //ensuring the password and repeated password match
      setErrorMessage("Passwords do not match");
      return;
    }

    if (data.email == "") {
      setErrorMessage("Enter valid email");
      return;
    }
    if (data.username == "") {
      setErrorMessage("Enter valid username");
      return;
    }

    if (data.password == "") {
      //ensuring the password and repeated password match
      setErrorMessage("Please enter password");
      return;
    }

    if (data.password.length < 5) {
      setErrorMessage("Please enter password of at least length 5");
      return;
    }

    fetch("http://localhost:5000/register", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        repeatPassword: data.repeatPassword,
        email: data.email,
        experiencelvl: data.xp,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
        }
        return response.json();
      })
      .then((data) => {
        //inform user of their succesful registration and redirect to login page
        alert("Registration Succesful!");
        window.location.href = "/login";
        console.log(data);
      })
      .catch((error) => console.error(error));
  };
  return (
    <div>
      <Navigation />

      <div className="signuppage">
        <form
          className="signup_container"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <h2 className="signupTitle">Sign Up</h2>
          <p className="forgot-password">
            Already registered <a onClick={() => {navigate("/Login")}}> Log in?</a>
          </p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
          {/* conditionally render error message */}
          <div className="row">
            <div className="usernamecontainer">
              <label>Username </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                {...register("username")}
              />
            </div>

            <div className="usernamecontainer">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                {...register("email")}
              />
            </div>
          </div>
          <div className="radioDiv ">
            <p>Your AI Experience level:</p>

            <div class="l-radio">
              <input
                type="radio"
                id="f-option"
                value="Beginner"
                name="selector"
                tabindex="1"
                {...register("xp")}
              />
              <label for="f-option">Beginner</label>
            </div>

            <div class="l-radio">
              <input
                type="radio"
                id="s-option"
                value="Intermediate"
                name="selector"
                tabindex="2"
                {...register("xp")}
              />
              <label for="s-option">Intermediate</label>
            </div>

            <div class="l-radio">
              <input
                type="radio"
                id="t-option"
                value="Expert"
                name="selector"
                tabindex="3"
                {...register("xp")}
              />
              <label for="t-option">Expert</label>
            </div>
          </div>
          
          <div className="row">
            <div className="usernamecontainer">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                {...register("password")}
              />
            </div>

            <div className="usernamecontainer">
              <label>Repeat Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Repeat password"
                {...register("repeatPassword")}
              />
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="form__button">
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <div className="mascotAcorn">
        <img src={Acorn} alt=""></img>
        <div className="AI-Bert-speech">
          <div className="box sb3 signupspeech">
            Sign up to access full AI-Bert functionality!
          </div>
        </div>
      </div>
    </div>
  );
}
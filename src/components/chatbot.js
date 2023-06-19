import { useState, useEffect } from "react";
import squirrel from "../Images/squirrel.png";
import Details from "./details";
import bookmark from "../Images/bookmark.png";
import globalVariables from "./globals/globalVariables";
import './components.css';


export default function Chatbot() {

  return (
    <div className="chatbot flex-container">
      <div className="mascot">
        <img src={squirrel} alt="" style={{opacity: globalVariables.mini?0:1}}></img>
      </div>
      <Details/>
        <div className="responseButtons">
            <div className="responseButton" id="openCourse">Open</div>
            <div className="responseButton" id="notRelevant">Not Relevant</div>
            <div className="responseButton" id="tooEasy">Too Easy</div>
            <div className="responseButton" id="tooHard">Too Hard</div>
            <div className="responseButton" id="bookmark"><img src={bookmark} alt="Bookmark"/></div>
        </div>
      <div className="input-output-fields">
      
        <div className="AI-Bert-speech">
          <div className="box sb3" style={{opacity: globalVariables.mini?0:1}}>
            Hi! I'm AI-Bert, I am here to help you learn about AI!
          </div>
          <div className="topbox sb4">
            <div>Here's a course I found:</div>
          </div>
        </div>

        <div className="userInput">
          <div class="form__group field">
            <input
              type="input"
              class="form__field"
              placeholder="What would you like to learn?"
              name="input"
              id="input"
            />
            <label for="name" class="form__label">
              What would you like to learn?
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
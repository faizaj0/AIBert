import Navigation from "./navigation";
import globalVariables from "./globals/globalVariables";
import { useNavigate } from "react-router-dom";
import "./components.css";
import User from "../Images/user.png";
import { useState, useEffect } from "react";
import { courseData } from "./../courseData.js";
import { Link } from "react-scroll";

import Details from "./overlayDetails.js";
import fillDetails from "./globals/detailsFiller";
import CheckBookmark from './globals/checkBookmark.js';
import CheckComplete from './globals/checkComplete';

import filledBookmark from '../Images/filledSmallBookmark.png'
import Bookmark from '../Images/smallBookmark.png'
import Checkbox from '../Images/checkbox.png';
import emptyCheckbox from '../Images/EmptyCheckbox.png';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [progressPercent, setprogressPercent] = useState(0);
  const [listlength, setListlength] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/userdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    globalVariables.isLoggedIn = false;
    navigate("/Login");
  };

  function renderPercentage() {
    console.log(userData);

    if (userData && userData.data.completedCourses) {
      const percentage =  Math.round((userData.data.completedCourses.length / 27) * 100);
      console.log(percentage);
      return (
        <div>
          <div class="single-chart">
            <svg viewBox="0 0 36 36" class="circular-chart orange">
              <path
                class="circle-bg"
                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="circle"
                stroke-dasharray={`${percentage}, 100`}
                d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" class="percentage">
              {percentage}%
              </text>
            </svg>
          </div>
        </div>
      );
    }
  }

  async function showDetails (id) {
    globalVariables.currentCourseID = id;
    fillDetails(id);
    document.getElementsByClassName("overlayCourseSpan")[0].style.opacity = 1;
    document.getElementsByClassName("overlayCourseSpan")[0].style["pointer-events"] = "auto";

    let isBookmarked = await CheckBookmark();
    let bookmarkImage = document.getElementsByClassName("bookmarkImage")[0];
    if (isBookmarked == true){
        bookmarkImage.setAttribute("src", filledBookmark);
    } else {
        bookmarkImage.setAttribute("src", Bookmark);
    }
    let isComplete = await CheckComplete()
    let CheckmarkImage = document.getElementsByClassName("checkmarkImage")[0];
    if (isComplete == true){
        CheckmarkImage.setAttribute("src",  Checkbox);
    } else {
        CheckmarkImage.setAttribute("src", emptyCheckbox);
    }
    
    document.body.style["overflow"] = "hidden";
}

  function renderBookmarkitem(data) {
    for (let i = 0; i < courseData.length; i++) {
      if (courseData[i].id === data) {
        return (
          <div className="profileCourse" id={"book"+courseData[i].id} onClick={() => {showDetails(courseData[i].id)}}>
            <div className="bookmarkItem">
              <img classname="bookmarkImage" src={courseData[i].image}></img>
              <p>{courseData[i].name}</p>
            </div>
          </div>
        );
      }
    }
  }

  function renderCourseitem(data) {
    for (let i = 0; i < courseData.length; i++) {
      if (courseData[i].id === data) {
        return (
          <div className="profileCourse" id={"comp"+courseData[i].id} onClick={() => {showDetails(courseData[i].id)}}>
            <div className="completedItem">
              <img classname="courseImage" src={courseData[i].image}></img>
              <p>{courseData[i].name}</p>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <div>
      <Navigation />
      <div className="Profile">
        <div className="profile_container">
          <div className="profile_details">
            <div className="column1">
              <img src={User} className="userimage" alt=""></img>
            </div>
            <div className="column2">
              {userData && <h3>Welcome, {userData.data.username}!</h3>}

              {userData && userData.data.email && (
                <h5>{userData.data.email}</h5>
              )}
              {userData && userData.data.experiencelvl && (
                <h5>{userData.data.experiencelvl}</h5>
              )}
            </div>
          </div>

          <div className="completion">
            <p>Courses completed</p>
            <div>{renderPercentage()}</div>
          </div>
          <div className="completion">
            <Link
              className="form__button completebutton"
              to="completed"
              smooth={true}
              duration={500}
            >
              View Completed Courses
            </Link>
            <button class="form__button logoutbutton" onClick={handleLogout}>
              Log Out
            </button>
            <button class="form__button deletebutton" onClick={handleLogout}>
              Delete Profile
            </button>
          </div>
        </div>
        <div className="course_display">
          <div className="bookmarked_courses" id="bookmarks">
            <div>
              <h3 className="bookmarktitle">Bookmarked Courses</h3>
            </div>

            <div className="course_list">
              {userData &&
                userData.data.bookmarks &&
                userData.data.bookmarks.map((data, index) => {
                  return (
                    <div className="course-card">
                      {renderBookmarkitem(data)}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="completed_courses" id="completed">
            <div>
              <h3 className="bookmarktitle">Completed Courses</h3>
            </div>
            <div className="course_list">
              {userData &&
                userData.data.completedCourses &&
                userData.data.completedCourses.map((data, index) => {
                  return (
                    <div className="course-card">{renderCourseitem(data)}</div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <Details />
    </div>
  );
}

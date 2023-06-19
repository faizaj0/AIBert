import Navigation from "./navigation";
import "./components.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Details from "./overlayDetails.js";
import fillDetails from "./globals/detailsFiller";
import globalVariables from './globals/globalVariables.js';
import CheckBookmark from './globals/checkBookmark.js';
import CheckComplete from './globals/checkComplete';
import learningCanvas from "./globals/learningCanvas";

import filledBookmark from '../Images/filledSmallBookmark.png'
import Bookmark from '../Images/smallBookmark.png'
import Checkbox from '../Images/checkbox.png';
import emptyCheckbox from '../Images/EmptyCheckbox.png';

export default function LearningJourney() {

    const navigate = useNavigate();

    useEffect(() => {
        loadLearningJourneys();
    }, []);

  async function loadLearningJourneys() {
    if (!globalVariables.isLoggedIn) {
        document.getElementsByClassName("learningJourneyButtons")[0].remove();
        document.getElementById("loading").remove();
        createSplashScreen("Login to access Learning Journeys!");
        return;
    }
    var journeys = await getLearningJourneys().then(data => data);
    for (var i = journeys.length-1; i >= 0; i--) {
        if (document.getElementById(journeys[i].substring(9)) == null) await buildJourney(journeys[i]);
    }
    if (journeys.length == 0) {
        createSplashScreen("No Learning Journeys Yet!");
    }
    document.getElementsByClassName("learningJourneyButtons")[0].className = "learningJourneyButtons fade_animation";
    document.getElementsByClassName("learningJourneyButtons")[0].style.opacity = 1;
    console.log("Removing...");
    document.getElementById("loading").remove();
    console.log("Removed");
  }

  function createSplashScreen(message) {
    var h1 = document.createElement("h1");
    h1.innerHTML = message;

    var p = document.createElement("p");
    p.className = "description";
    p.innerHTML = "Learning Journeys are ordered collections of courses which help you explore the topics that inspire you.";

    document.getElementsByClassName("navigationPage")[0].after(p);
    document.getElementsByClassName("navigationPage")[0].after(h1);
  }

  async function buildJourney(journey) {
    var journeyDiv = document.createElement("div");
    journeyDiv.className = "learningJourney fade_animation";

    var returnList = await learningCanvas(journey);
    var canvasDiv = returnList[0];
    var completed = returnList[1];
    journeyDiv.appendChild(canvasDiv);

    var notCanvasDiv = document.createElement("div");
    notCanvasDiv.className = "notCanvas";

    var h2 = document.createElement("h2");
    h2.innerHTML = journey.substring(9);
    notCanvasDiv.appendChild(h2);

    var finished = (completed[0] && completed[1] && completed[2])

    var h3 = document.createElement("h3");
    h3.innerHTML = finished?"Completed":"Incomplete";
    h3.style["background-color"] = finished?"#53ad71":"#f1c232";
    notCanvasDiv.appendChild(h3);

    var h4 = document.createElement("h4");
    h4.innerHTML = "Delete";
    h4.id = journey;
    h4.onclick = (e) => {deleteLearningJourney(e); if (document.getElementsByClassName("learningJourney").length == 0) createSplashScreen("No Learning Journeys Yet!")};
    notCanvasDiv.appendChild(h4);

    journeyDiv.appendChild(notCanvasDiv);
    journeyDiv.id = journey.substring(9);

    if (document.getElementsByClassName("learningJourneyPage").length > 0) {
        document.getElementsByClassName("learningJourneyPage")[0].insertBefore(journeyDiv,document.getElementsByClassName("learningJourneyButtons")[0])
    }

    for (var i = 0; i < document.getElementsByClassName("treeCardStyle").length; i++) {
        document.getElementsByClassName("treeCardStyle")[i].onclick = (e) => {showDetails(e)};
    }

  }

  async function showDetails (event) {
    var id = event.currentTarget.id;
    globalVariables.currentCourseID = id;
    fillDetails(id);
    document.getElementsByClassName("overlayCourseSpan")[0].style.opacity = 1;
    document.getElementsByClassName("overlayCourseSpan")[0].style["pointer-events"] = "auto";

    let isBookmarked = await CheckBookmark()
    let bookmarkImage = document.getElementsByClassName("bookmarkImage")[0];
    if (isBookmarked){
        bookmarkImage.setAttribute("src", filledBookmark);
    } else {
        bookmarkImage.setAttribute("src", Bookmark);
    }
    let isComplete = await CheckComplete()
    let CheckmarkImage = document.getElementsByClassName("checkmarkImage")[0];
    if (isComplete){
        CheckmarkImage.setAttribute("src",  Checkbox);
    } else {
        CheckmarkImage.setAttribute("src", emptyCheckbox);
    }
    
    document.body.style["overflow"] = "hidden";
}

async function getLearningJourneys() {
    const response = await fetch("http://localhost:5000/getLearningJourneys", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            token: window.localStorage.getItem("token"),
        }),
    });
    const data = await response.json();
    return data.data;
}

async function deleteLearningJourney(event) {
    var courseIDs = event.currentTarget.id;
    await fetch("http://localhost:5000/deleteLearningJourney", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: window.localStorage.getItem("token"),
            courseIDs,
        }),
    })
        .then((response) => response.json())
        .then(event.currentTarget.parentElement.parentElement.remove())
        .catch((error) => console.error(error));
}

  return (
    <div className="learningJourneyPage">
      <Navigation />
      <div className="loading" id="loading">Loading...</div>
      <div className="learningJourneyButtons">
        <div className="learningJourneyButton" onClick={() => navigate("/CreateLearningJourney")}>
            Create Learning Journey
        </div>
      </div>

      <Details />
    </div>
  );
}

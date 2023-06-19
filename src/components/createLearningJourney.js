import Navigation from "./navigation";
import Details from "./overlayDetails";
import fillDetails from "./globals/detailsFiller";
import { useNavigate } from "react-router-dom";
import { courseData } from "../courseData";
import { useEffect } from "react";
import globalVariables from "./globals/globalVariables";
import getAllCompleted from "./globals/returnComplete";
import learningCanvas from "./globals/learningCanvas";
import CheckBookmark from "./globals/checkBookmark";
import CheckComplete from "./globals/checkComplete";
import "./components.css";

import filledBookmark from '../Images/filledSmallBookmark.png'
import Bookmark from '../Images/smallBookmark.png'
import Checkbox from '../Images/checkbox.png';
import emptyCheckbox from '../Images/EmptyCheckbox.png';

export default function CreateLearningJourney() {

    const navigate = useNavigate();
    var completed;

    useEffect(() => {
        globalVariables.forceDifficulty = 0;
        globalVariables.journeyList = [null,null,null];
        loadInitialCourses();
    }, []);

    async function loadInitialCourses() {
        globalVariables.eventListened = false;
        globalVariables.journey = "";
        completed = await getAllCompleted();
        document.getElementById("cssGrid").innerHTML = "";
        for (var i = 0; i < courseData.length; i++) {
            let element = courseData[i];
            if (element.id[0] !== "0" && !completed.includes(element.id)) {
                displayCourse(element);
            }
        }

        if (document.getElementById("loading") != null) document.getElementById("loading").remove();
        document.getElementById("cssGrid").className = "wrapperStyle fade_animation";
        document.getElementById("cssGrid").style.opacity = 1;
    }

    function loadSpecificCourses(courses) {
        document.getElementById("creationHeading").innerHTML = "Select the most relevant course:"
        document.getElementById("cssGrid").innerHTML = "";
        for (var i = 0; i < courses.length; i++) {
            displayCourse(courses[i]);
        }
        if (document.getElementById("loading") != null) document.getElementById("loading").remove();
    }

    function displayCourse(element) {
        var cardDiv = document.createElement("div");
        cardDiv.id = element.id;
        cardDiv.className = "cardStyle";
        cardDiv.onclick = (e) => {select(e)};

        var img = document.createElement("img");
        img.src = element.image;
        img.className = "courseThumb";
        img.alt = "Course Thumbnail";

        var imgDiv = document.createElement("div");
        imgDiv.appendChild(img);
        cardDiv.appendChild(imgDiv);

        var strong = document.createElement("strong");
        strong.innerHTML = element.name;

        var strongDiv = document.createElement("div");
        strongDiv.appendChild(strong);
        cardDiv.appendChild(strongDiv);

        document.getElementById("cssGrid").appendChild(cardDiv);
    }

    function select(event) {
        var id = event.currentTarget.id;
        
        var loadingDiv = document.createElement("div");
        loadingDiv.className = "loading";
        loadingDiv.id = "loading";
        loadingDiv.innerHTML = "Loading...";

        document.getElementsByClassName("createLearningJourneyPage")[0].insertBefore(loadingDiv,document.getElementById("cssGrid"));
        document.getElementById("cssGrid").innerHTML = "";

        var course = courseData.find(item => item.id === id);

        if (globalVariables.forceDifficulty != 0) {
            globalVariables.journeyList[globalVariables.forceDifficulty-1] = course;
            globalVariables.forceDifficulty = 0;
        } else globalVariables.journeyList[course.difficulty-1] = course;

        checkFinished();
    }

    function fillList() {
        document.getElementById("creationHeading").innerHTML = "";
        if (globalVariables.journeyList[0] == null) {
            if (globalVariables.journeyList[1] != null) {
                globalVariables.forceDifficulty = 1;
                generateOptions(globalVariables.journeyList[1].prereq,0);
                return;
            }
        }
        if (globalVariables.journeyList[1] == null) {
            globalVariables.forceDifficulty = 2;
            if (globalVariables.journeyList[0] != null) {
                generateOptions(globalVariables.journeyList[0].postreq,1);
            } else {
                generateOptions(globalVariables.journeyList[2].prereq,1);
            }
            return;
        }
        if (globalVariables.journeyList[2] == null) {
            if (globalVariables.journeyList[1] != null) {
                globalVariables.forceDifficulty = 3;
                console.log(globalVariables.journeyList[1].postreq);
                generateOptions(globalVariables.journeyList[1].postreq,2);
            }
        }
    }

    function generateOptions(idList,index) {
        var filteredList = idList.filter(id => !completed.includes(id) && id[0] != "0" && courseData.find(item => item.id === id).difficulty == index + 1);
        if (filteredList.length == 0) {
            filteredList = idList.filter(id => id[0] != "0" && courseData.find(item => item.id === id).difficulty == index + 1);
        }
        if (filteredList.length == 0) {
            filteredList = idList.filter(id => id[0] != "0");
            globalVariables.forceDifficulty = index + 1;
        }
        if (filteredList.length == 1) {
            globalVariables.journeyList[index] = courseData.find(item => item.id === filteredList[0]);
            checkFinished();
        } else if (filteredList.length == 0) {
            console.log("Filtered list is 0!\n" + idList + "\n" + index);
        } else {
            loadSpecificCourses(filteredList.map(id => courseData.find(item => item.id === id)));
        }
    }

    function checkFinished() {
        console.log(globalVariables.journeyList);
        if (globalVariables.journeyList.includes(null)) {
            fillList();
        } else {
            globalVariables.forceDifficulty = 0;
            displayJourney();
        }
    }

    async function displayJourney () {
        if (document.getElementById("loading") != null) document.getElementById("loading").remove();
        for (var i = 0; i < globalVariables.journeyList.length; i++) {
            globalVariables.journey += globalVariables.journeyList[i].id;
        }
        var returnList = await learningCanvas(globalVariables.journey);
        document.getElementsByClassName("createLearningJourneyPage")[0].insertBefore(returnList[0],document.getElementById("cssGrid"));
        document.getElementsByClassName("treeCourses")[0].style["margin-left"] = "-205px";
        document.getElementsByClassName("canvas")[0].style["padding-left"] = "285px";
        document.getElementsByClassName("canvas")[0].className = "canvas fade_animation";
        document.getElementById("creationHeading").innerHTML = "New Learning Journey Created!";
        document.getElementById("creationHeading").className = "fade_animation";

        for (var j = 0; j < document.getElementsByClassName("treeCardStyle").length; j++) {
            document.getElementsByClassName("treeCardStyle")[j].onclick = (e) => {showDetails(e)};
        }

        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "journeyCreationButtons fade_animation";

        var buttonDiv1 = document.createElement("div");
        buttonDiv1.className = "journeyCreationButton";
        buttonDiv1.style["background-color"] = "#53ad71";
        buttonDiv1.innerHTML = "Save";
        buttonDiv1.onclick = () => {createNameField()};

        var buttonDiv2 = document.createElement("div");
        buttonDiv2.className = "journeyCreationButton";
        buttonDiv2.style["background-color"] = "#bd6708";
        buttonDiv2.innerHTML = "Discard";
        buttonDiv2.onclick = () => {navigate("/LearningJourney")};

        buttonsDiv.appendChild(buttonDiv1);
        buttonsDiv.appendChild(buttonDiv2);

        document.getElementsByClassName("createLearningJourneyPage")[0].insertBefore(buttonsDiv,document.getElementById("cssGrid"));
    }

    function createNameField() {
        var groupDiv = document.createElement("div");
        groupDiv.className = "form__group field"

        var input = document.createElement("input");
        input.type = "input";
        input.className = "form__field";
        input.placeholder = "Enter a name for the Journey";
        input.name = "input";
        input.id = "journeyInput";
        input.maxLength = 30;

        var label = document.createElement("label");
        label.setAttribute("for","name");
        label.className = "form__label";
        label.innerHTML = "Enter a name for the Journey";

        groupDiv.appendChild(input);
        groupDiv.appendChild(label);

        document.getElementsByClassName("journeyCreationButtons")[0].after(groupDiv);
        document.getElementsByClassName("journeyCreationButtons")[0].remove();
        
        document.getElementsByClassName("form__group")[0].style["width"] = "40%";
        document.getElementsByClassName("form__group")[0].style["margin-left"] = "30%";
        document.getElementsByClassName("form__group")[0].style["margin-top"] = "-30px";

        document.getElementById('journeyInput').value = "";
    }

    async function postLearningJourney(courseIDs) {
        if (courseIDs.length < 10) {
            console.log("REJECTED LJ: " + courseIDs);
            return;
        } else if (isNaN(courseIDs.substring(0,9))) {
            console.log("REJECTED LJ: " + courseIDs);
            return;
        }
        await fetch("http://localhost:5000/addLearningJourney", {
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
            .then(setTimeout(() => {navigate('/LearningJourney')},200))
            .catch((error) => console.error(error));
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

    async function enterName (name) {
        globalVariables.journey += name;
        await postLearningJourney(globalVariables.journey);
    }

    document.addEventListener('keydown', (event) => {
        var name = event.key;
        if (document.getElementById('journeyInput') == null) return;
        document.getElementById('journeyInput').focus();
        if (name == "Enter" && document.getElementById('journeyInput').value != "" && !globalVariables.eventListened) {
            globalVariables.eventListened = true;
            enterName(document.getElementById('journeyInput').value);
        }
    },false);

  return (
    <div className = "createLearningJourneyPage">
      <Navigation />

      <div className="journeyInstruction"><strong id="creationHeading">Select a course which interests you:</strong></div>
      <div className="loading" id="loading">Loading...</div>
      <div className='wrapperStyle' id="cssGrid"></div>

      <Details />
    </div>
  );
}
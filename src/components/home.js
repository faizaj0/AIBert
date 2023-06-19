import Navigation from "./navigation";
import AIBert from "./chatbot.js";
import { createElement, useEffect, useState } from "react";
import { courseData } from "../courseData.js";
import globalVariables from "./globals/globalVariables";
import checkBookmark from "./globals/checkBookmark";
import fillDetails from "./globals/detailsFiller";
import GetAllCompleted from "./globals/returnComplete";
import fade from "./globals/elementFader";
import spit from "./globals/speechEditor";
import "./components.css";
import filledBookmark from "../Images/filledBookmark.png";
import emptyBookmark from "../Images/bookmark.png";

export default function Home() {
  //set up watson assistant session with external API
  useEffect(() => {
    try {
      fetch("http://localhost:5000/api/watson/session")
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          globalVariables.session = data.session_id;
        });
      } catch (error) {
        console.error("Failed to fetch session: ", error);
      }
      globalVariables.offered = [];
      if (!globalVariables.isLoggedIn) {
        document.getElementById("bookmark").remove();
      }
  }, []);

  //GENERAL WATSON FUNCTION
  async function postMessage(message) {
    var response;
    return fetch("http://localhost:5000/api/watson/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        session_id: `${globalVariables.session}`,
      },
      body: JSON.stringify({
        input: `${message}`,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.output.generic[0].response_type == "suggestion") {
          console.log(data.output.generic[0].suggestions[0].label);

          return fetch("http://localhost:5000/api/watson/message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              session_id: `${globalVariables.session}`,
            },
            body: JSON.stringify({
              input: `${data.output.generic[0].suggestions[0].label}`,
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              response = data.output.generic[0].text;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          response = data.output.generic[0].text;
        }
      })
      .then(() => {
        if (response) {
          return response;
        } else {
          console.log("Error contacting Watson Assistant");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //GET KEYWORDS FUNCTION
  async function getKeywords(message) {
    message = message.trim().toLowerCase();

    //Bulk up message
    if (message.length < 15) {
      message = "Tell me about: " + message;
    }

    //Map ai --> artificial intelligence
    var removeStr = `\\b${"ai"}\\b`;
    var regex = new RegExp(removeStr, "g");
    message = message.replace(regex, "artificial intelligence");

    //Map a.i --> artificial intelligence
    var removeStr = `\\b${"a.i"}\\b`;
    var regex = new RegExp(removeStr, "g");
    message = message.replace(regex, "artificial intelligence");

    return await fetch("http://localhost:5000/api/watson/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `${message}`,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("The Keywords from this input are...");
        console.log(data.keywords);
        return data.keywords;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }

  globalVariables.presenting = false;
  globalVariables.transitioning = false;
  globalVariables.home = true;

  function transitionComplete() {
    globalVariables.transitioning = false;
  }

  function chatbotVanish() {
    globalVariables.transitioning = true;
    globalVariables.presenting = true;
    var elem = document.getElementsByClassName("mascot").item(0).firstChild;
    var pos = "150px";
    elem.style.setProperty("margin-top", pos);
    var moveFunc = setInterval(function () {
      var elem = document.getElementsByClassName("mascot").item(0).firstChild;
      pos = String(parseInt(pos.slice(0, -2)) + 1) + "px";
      elem.style.setProperty("margin-top", pos);
    }, 30);
    elem.style.opacity = 1;
    var mascotFadeFunc = setInterval(function () {
      fade(elem, -0.1, [mascotFadeFunc, moveFunc], [miniAppear]);
    }, 30);
    document
      .getElementsByClassName("AI-Bert-speech")
      .item(0).firstChild.style.opacity = 1;
    var textFadeFunc = setInterval(function () {
      fade(
        document.getElementsByClassName("AI-Bert-speech").item(0).firstChild,
        -0.1,
        [textFadeFunc]
      );
    }, 30);
    moveInput(false);
  }

  function chatbotAppear() {
    var elem = document.getElementsByClassName("mascot").item(0).firstChild;
    var pos = "158px";
    elem.style.setProperty("margin-top", pos);
    var moveFunc = setInterval(function () {
        var elements = document.getElementsByClassName("mascot");
      if (elements.length == 0) return;
      var elem = elements.item(0).firstChild;
      pos = String(parseInt(pos.slice(0, -2)) - 1) + "px";
      elem.style.setProperty("margin-top", pos);
      if (parseInt(pos.slice(0, -2)) < 150) {
        elem.style.setProperty("margin-top", "150px");
        clearInterval(moveFunc);
        globalVariables.transitioning = false;
        return;
      }
    }, 30);
    elem.style.opacity = 0;
    var mascotFadeFunc = setInterval(function () {
      fade(elem, 0.1, [mascotFadeFunc], [transitionComplete]);
    }, 30);
    document
      .getElementsByClassName("AI-Bert-speech")
      .item(0).firstChild.style.opacity = 0;
    var textFadeFunc = setInterval(function () {
        var elements = document.getElementsByClassName("AI-Bert-speech");
        if (elements.length == 0) return;
      fade(
        elements.item(0).firstChild,
        0.1,
        [textFadeFunc]
      );
    }, 30);
  }

  function miniVanish() {
    globalVariables.transitioning = true;
    globalVariables.presenting = false;
    var elem = document.getElementsByClassName("miniMascot").item(0);
    var pos = "-85px";
    elem.style.setProperty("top", pos);
    var moveFunc = setInterval(function () {
      pos = String(parseInt(pos.slice(0, -2)) + 1) + "px";
      elem.style.setProperty("top", pos);
    }, 30);
    elem.style.opacity = 1;
    var mascotFadeFunc = setInterval(function () {
      fade(elem, -0.1, [mascotFadeFunc, moveFunc], [chatbotAppear]);
    }, 30);
    globalVariables.mini = false;
  }

  function miniAppear() {
    var elem = document.getElementsByClassName("miniMascot").item(0);
    var pos = "-78px";
    elem.style.setProperty("top", pos);
    var moveFunc = setInterval(function () {
      pos = String(parseInt(pos.slice(0, -2)) - 1) + "px";
      elem.style.setProperty("top", pos);
      if (parseInt(pos.slice(0, -2)) < -85) {
        elem.style.setProperty("top", "-85px");
        clearInterval(moveFunc);
        return;
      }
    }, 30);
    elem.style.opacity = 0;
    var mascotFadeFunc = setInterval(function () {
      fade(elem, 0.1, [mascotFadeFunc], [courseAppear]);
    }, 30);
    globalVariables.mini = true;
  }

  function courseVanish() {
    document
      .getElementsByClassName("AI-Bert-speech")
      .item(0).childNodes[1].style.opacity = 1;
    var textFadeFunc = setInterval(function () {
      fade(
        document.getElementsByClassName("AI-Bert-speech").item(0).childNodes[1],
        -0.1,
        [textFadeFunc]
      );
    }, 30);
    document.getElementsByClassName("courseDetails").item(0).style.opacity = 1;
    var courseFadeFunc = setInterval(function () {
      fade(document.getElementsByClassName("courseDetails").item(0), -0.1, [
        courseFadeFunc,
      ]);
    }, 30);
  }

  function courseAppear() {
    fillDetails(globalVariables.currentCourseID);
    document
      .getElementsByClassName("AI-Bert-speech")
      .item(0).childNodes[1].style.opacity = 0;
    var textFadeFunc = setInterval(function () {
      fade(
        document.getElementsByClassName("AI-Bert-speech").item(0).childNodes[1],
        0.1,
        [textFadeFunc],
        [buttonsAppear]
      );
    }, 30);
    document.getElementsByClassName("courseDetails").item(0).style.opacity = 0;
    var courseFadeFunc = setInterval(function () {
      fade(document.getElementsByClassName("courseDetails").item(0), 0.1, [
        courseFadeFunc,
      ]);
    }, 30);
  }

  function buttonsVanish() {
    buttonVanish(document.getElementById("openCourse"));
    buttonVanish(document.getElementById("notRelevant"));
    buttonVanish(document.getElementById("tooEasy"));
    buttonVanish(document.getElementById("tooHard"));
    if (document.getElementById('bookmark') != null) buttonVanish(document.getElementById("bookmark"));
  }

  async function addBookmark(courseID) {
    let isBookmarked = await checkBookmark();
    console.log(isBookmarked);
    if (isBookmarked) {
      console.log("IS DELETING" + courseID);
      fetch("http://localhost:5000/deletebookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.localStorage.getItem("token"),
          courseID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data.bookmarks);
          var bookmarkbutton = document.getElementById("bookmark").firstChild;
          bookmarkbutton.setAttribute("src", emptyBookmark);
        })
        .catch((error) => console.error(error));
    } else {
      console.log("IS ADDING" + courseID);
      console.log(courseID);
      fetch("http://localhost:5000/addBookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.localStorage.getItem("token"),
          courseID,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data.bookmarks);
          var bookmarkbutton = document.getElementById("bookmark").firstChild;
          bookmarkbutton.setAttribute("src", filledBookmark);
        })
        .catch((error) => console.error(error));
    }
  }

  async function buttonsAppear() {
    var buttons = document.getElementsByClassName("responseButton");
    for (let button of buttons) {
      switch (button.id) {
        case "bookmark":
          let isBookmarked2 = await checkBookmark();
          if (isBookmarked2){
            var bookmarkbutton = document.getElementById("bookmark").firstChild;
            bookmarkbutton.setAttribute("src", filledBookmark);
          }else{
            var bookmarkbutton = document.getElementById("bookmark").firstChild;
            bookmarkbutton.setAttribute("src", emptyBookmark);
          }
          button.addEventListener(
            "click",
            (event) => {
              if (button.style.opacity > 0 && !globalVariables.transitioning)
                addBookmark(globalVariables.currentCourseID);
            },
            false
          );
          break;
        default:
          button.addEventListener(
            "click",
            (event) => {
              if (button.style.opacity > 0 && !globalVariables.transitioning)
                inputHandling(button.innerHTML);
            },
            false
          );
          break;
      }
    }
    setTimeout(function() { buttonAppear(document.getElementById('openCourse')); }, 0);
    setTimeout(function() { buttonAppear(document.getElementById('notRelevant')); }, 200);
    setTimeout(function() { buttonAppear(document.getElementById('tooEasy')); }, 400);
    if (document.getElementById('bookmark') != null) {
        setTimeout(function() { buttonAppear(document.getElementById('tooHard')); }, 600);
        setTimeout(function() { buttonAppear(document.getElementById('bookmark'),true); }, 800);
    } else {
        setTimeout(function() { buttonAppear(document.getElementById('tooHard'),true); }, 600);
    }
}

  function buttonVanish(elem) {
    elem.style.cursor = "default";
    elem.style.opacity = 1;
    var fadeFunc = setInterval(function () {
      fade(elem, -0.1, [fadeFunc]);
    }, 30);
  }

  function buttonAppear(elem, complete = false) {
    elem.style.cursor = "pointer";
    elem.style.opacity = 0;
    var fadeFunc = setInterval(function () {
      fade(elem, 0.1, [fadeFunc]);
    }, 30);
    elem.style.top = "10px";
    var moveFunc = setInterval(function () {
      elem.style.top = String(parseInt(elem.style.top.slice(0, -2)) - 1) + "px";
      if (elem.style.top == "0px") {
        clearInterval(moveFunc);
        if (complete) transitionComplete();
      }
    }, 30);
  }

  function progToPosition(prog) {
    var start = [50, 0];
    var leftMove = -200;
    var topMove = 255;
    return [prog * topMove + start[0], prog * leftMove + start[1]];
  }

  function moveInput(ascending) {
    var elem = document.getElementsByClassName("form__group").item(0);
    var span = ascending ? 20 : 24;
    var count = ascending ? span : 0;
    var pos;
    var moveFunc = setInterval(function () {
      if (ascending) {
        count--;
      } else count++;
      pos = progToPosition((Math.tanh((count / span) * 5 - 2.5) + 1) / 2);
      elem.style.setProperty("margin-top", pos[0] + "px");
      elem.style.setProperty("margin-left", pos[1] + "px");
      if (count == span || count == 0) {
        clearInterval(moveFunc);
      }
    }, span);
  }

  async function search(input, difficulty = 1, disallow = []) {
    if (globalVariables.isLoggedIn) {
        //difficulty = await GetExperience();
    }
    if (difficulty > 3) difficulty = 3; //due to there being no courses of difficulty 4
    if (difficulty < 1) difficulty = 1;
    var rawData = await getKeywords(input).then((result) => result);
    if (rawData == undefined) {
      console.log("Undefined keyword return!");
      return [];
    } else if (rawData.length == 0) {
      console.log("Empty keyword list!");
      return [];
    }
    var keyTerms = {};
    var cleaned = {};
    var remove = [];
    for (var i = 0; i < rawData.length; i++) {
      keyTerms[rawData[i]["text"].toLowerCase()] = rawData[i]["relevance"];
    }

    //Data cleanup:
    for (var i = 0; i < Object.keys(keyTerms).length; i++) {
      for (var j = 0; j < globalVariables.baseTerms.length; j++) {
        if (isMatch(Object.keys(keyTerms)[i], globalVariables.baseTerms[j])) {
          cleaned[globalVariables.baseTerms[j]] =
            keyTerms[Object.keys(keyTerms)[i]];
          remove.push(Object.keys(keyTerms)[i]);
        }
      }
      for (var k = 0; k < globalVariables.synonyms.length; k++) {
        for (var l = 0; l < globalVariables.synonyms[k].length - 1; l++) {
          if (
            isMatch(Object.keys(keyTerms)[i], globalVariables.synonyms[k][l])
          ) {
            cleaned[
              globalVariables.synonyms[k][
                globalVariables.synonyms[k].length - 1
              ]
            ] = keyTerms[Object.keys(keyTerms)[i]];
            remove.push(Object.keys(keyTerms)[i]);
          }
        }
      }
    }

    for (var i = 0; i < remove.length; i++) {
      delete keyTerms[remove[i]];
    }

    //Synonym homogenising:
    for (var i = 0; i < globalVariables.synonyms.length; i++) {
      for (var j = 0; j < globalVariables.synonyms[i].length - 1; j++) {
        if (Object.keys(keyTerms).includes(globalVariables.synonyms[i][j])) {
          keyTerms[
            globalVariables.synonyms[i][globalVariables.synonyms[i].length - 1]
          ] = keyTerms[globalVariables.synonyms[i][j]];
          delete keyTerms[globalVariables.synonyms[i][j]];
        }
      }
    }

    Object.assign(keyTerms, cleaned);
    console.log(keyTerms);

    var completed;
    if (globalVariables.isLoggedIn) {
        completed = await GetAllCompleted().then((result) => result);
    } else {
        completed = [];
    }
    var score = {};
    courseData.forEach(function (course) {
      if (completed.includes(course["id"])) return;
      score[course["id"]] = grade(keyTerms, course["id"]);
      if (score[course["id"]] < 1) {
        delete score[course["id"]];
      }
    });
    var sorted = Object.keys(score).map((key) => {
      return [
        key,
        score[key],
        courseData.find((item) => item.id === key)["difficulty"],
      ];
    });
    var order;
    switch (difficulty) {
      case 2:
        order = [2, 1, 3];
        break;
      case 3:
        order = [3, 2, 1];
        break;
      default:
        order = [1, 2, 3];
        break;
    }
    sorted.sort((first, second) => {
      return order.indexOf(first[2]) - order.indexOf(second[2]);
    });
    sorted.sort((first, second) => {
      return second[1] - first[1];
    });
    sorted = sorted.filter((i) => !disallow.includes(i[2]));
    console.log(sorted);
    var matches = sorted.map((e) => {
      return e[0];
    });
    for (var i = 0; i < matches.length; i++) {
      if (globalVariables.offered.includes(matches[i])) {
        matches.splice(matches.indexOf(matches[i]), 1);
      }
    }
    return matches;
  }

  function grade(keyTerms, id) {
    var courseTerms = courseData.find((item) => item.id === id)["terms"];
    var score = 0;
    var termNum = courseTerms.length;
    for (var i = 0; i < termNum; i++) {
      if (Object.keys(keyTerms).includes(courseTerms[i].toLowerCase())) {
        score +=
          (1.5 - i / (termNum - 1)) *
          2 *
          keyTerms[courseTerms[i].toLowerCase()];
      }
    }
    var courseTitle = courseData.find((item) => item.id === id)["name"];
    for (var i = 0; i < Object.keys(keyTerms).length; i++) {
      if (
        isMatch(
          courseTitle.toLowerCase(),
          Object.keys(keyTerms)[i].toLowerCase()
        )
      ) {
        score += keyTerms[Object.keys(keyTerms)[i]];
      } else {
        for (var j = 0; j < globalVariables.synonyms.length; j++) {
          if (
            globalVariables.synonyms[j][
              globalVariables.synonyms[j].length - 1
            ] == Object.keys(keyTerms)[i]
          ) {
            for (var k = 0; k < globalVariables.synonyms[j].length - 1; k++) {
              if (isMatch(courseTitle, globalVariables.synonyms[j][k])) {
                score += 3 * keyTerms[Object.keys(keyTerms)[i]];
              }
              break;
            }
          }
        }
      }
    }
    score = Math.trunc(score * 1000) / 1000;
    return score;
  }

  function isMatch(searchOnString, searchText) {
    searchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    return (
      searchOnString.match(new RegExp("\\b" + searchText + "\\b", "i")) != null
    );
  }

  const inputHandling = async (input) => {
    if (input == "") return;
    globalVariables.lastInput = globalVariables.input;
    globalVariables.input = input; //so it can be accessed later, when a response button is pressed
    if (globalVariables.inputProcessing) return;
    globalVariables.inputProcessing = true;
    document.getElementById("input").value = "";
    document.getElementById("input").blur();
    var textRemoveFunc = setInterval(function () {
      spit(
        document.getElementsByClassName("AI-Bert-speech")[0].firstChild,
        textRemoveFunc
      );
    }, 5);
    var matches;
    if (input.toLowerCase() == "open course") input = "open";
    switch (input.toLowerCase()) {
      case "open":
        window.open(
          courseData.find(
            (item) => item.id === globalVariables.currentCourseID
          )["link"],
          "_blank"
        );
        globalVariables.inputProcessing = false;
        return;
      case "not relevant":
        //Course Search using previous input
        matches = globalVariables.results;
        matches.shift();
        globalVariables.results = matches;
        break;
      case "too easy":
        if (
          courseData.find(
            (item) => item.id === globalVariables.currentCourseID
          )["postreq"].length > 0
        ) {
          matches = courseData.find(
            (item) => item.id === globalVariables.currentCourseID
          )["postreq"];
          //order by relevance? <----------------
        } else if (
          courseData.find(
            (item) => item.id === globalVariables.currentCourseID
          )["difficulty"] < 3
        ) {
          var currentDiff = courseData.find(
            (item) => item.id === globalVariables.currentCourseID
          )["difficulty"];
          var disallow = [1, 2, 3].filter((i) => i <= currentDiff);
          matches = await search(
            globalVariables.input,
            currentDiff + 1,
            disallow
          ).then((result) => result);
        } else matches = [];
        globalVariables.results = matches;
        break;
      case "too hard":
        if (
          courseData.find(
            (item) => item.id === globalVariables.currentCourseID
          )["prereq"].length > 0
        ) {
          matches = courseData.find(
            (item) => item.id === globalVariables.currentCourseID
          )["prereq"];
        } else if (
          courseData.find(
            (item) => item.id === globalVariables.currentCourseID
          )["difficulty"] > 1
        ) {
          var currentDiff = courseData.find(
            (item) => item.id === globalVariables.currentCourseID
          )["difficulty"];
          var disallow = [1, 2, 3].filter((i) => i >= currentDiff);
          matches = await search(
            globalVariables.input,
            currentDiff - 1,
            disallow
          ).then((result) => result);
        } else matches = [];
        globalVariables.results = matches;
        break;
      default: //Also pass user_difficulty from database
        //Course Search from scratch
        var watsonReply = await postMessage(input).then((result) => result);
        if (
          isMatch(input.toLowerCase(), "course") ||
          isMatch(input.toLowerCase(), "courses") ||
          watsonReply ==
            "I'm afraid I don't understand. Please rephrase your question."
        ) {
          matches = await search(input).then((result) => result);
          if (
            matches.length == 0 &&
            (isMatch(input.toLowerCase(), "more") ||
              isMatch(input.toLowerCase(), "this") ||
              isMatch(input.toLowerCase(), "it"))
          ) {
            matches = await search(globalVariables.lastInput).then(
              (result) => result
            );
          }
          if (matches.length == 0) {
            matches = undefined;
          } else {
            globalVariables.results = matches;
            break;
          }
        }
        if (
          watsonReply != "[[COURSE ALGORITHM BEGINS]]" &&
          watsonReply != globalVariables.currentReply
        ) {
          break;
        }
        globalVariables.offered = [];
        matches = await search(input).then((result) => result);
        if (
          matches.length == 0 &&
          (isMatch(input.toLowerCase(), "more") ||
            isMatch(input.toLowerCase(), "this") ||
            isMatch(input.toLowerCase(), "it"))
        ) {
          matches = await search(globalVariables.lastInput).then(
            (result) => result
          );
        }
        globalVariables.results = matches;
        break;
    }

    globalVariables.inputProcessing = false;
    clearInterval(textRemoveFunc);
    globalVariables.dotting = false;
    globalVariables.dotDelay = 0;
    document.getElementsByClassName("AI-Bert-speech")[0].firstChild.innerHTML =
      "";
    globalVariables.currentReply = "";

    if (matches == undefined) {
      if (globalVariables.presenting) {
        miniVanish();
        moveInput(true);
        courseVanish();
        buttonsVanish();
        document.getElementsByClassName(
          "AI-Bert-speech"
        )[0].firstChild.innerHTML = watsonReply;
      } else
        var textAddFunc = setInterval(function () {
          spit(
            document.getElementsByClassName("AI-Bert-speech")[0].firstChild,
            textAddFunc,
            watsonReply
          );
        }, 5);
      globalVariables.currentReply = watsonReply;
      return;
    }

    if (matches.length > 0) {
      globalVariables.currentCourseID = matches[0];
      globalVariables.offered.push(matches[0]);
      globalVariables.transitioning = true;
      if (globalVariables.presenting) {
        buttonsVanish();
        courseVanish();
        setTimeout(courseAppear, 500);
      } else {
        chatbotVanish();
      }
      return;
    }

    if (globalVariables.presenting) {
      miniVanish();
      moveInput(true);
      courseVanish();
      buttonsVanish();
      document.getElementsByClassName(
        "AI-Bert-speech"
      )[0].firstChild.innerHTML =
        "I'm sorry, I couldn't find anything for that query!";
    } else {
      var textAddFunc = setInterval(function () {
        spit(
          document.getElementsByClassName("AI-Bert-speech")[0].firstChild,
          textAddFunc,
          "I'm sorry, I couldn't find anything for that query!"
        );
      }, 5);
    }
    globalVariables.offered = [];
    globalVariables.currentReply = "";
  };

  document.addEventListener(
    "keydown",
    (event) => {
      var name = event.key;
      document.getElementById("input").focus();
      if (name == "Enter" && !globalVariables.transitioning) {
        inputHandling(document.getElementById("input").value);
      }
    },
    false
  );

  if (globalVariables.mini) {
    setTimeout(miniVanish, 10);
  }

  return (
    <div>
      <Navigation />
      <AIBert />
    </div>
  );
}
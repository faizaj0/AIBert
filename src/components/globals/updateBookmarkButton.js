import globalVariables from "./globalVariables";
import bookmark from "../../Images/bookmark.png";

export default function checkLoggedIn() {
    globalVariables.isLoggedIn = window.localStorage.getItem("loggedIn");
    console.log(window.localStorage.getItem("loggedIn"));
    if (!globalVariables.isLoggedIn) {
        console.log("1");
        if (document.getElementById("bookmark") != null) {
            document.getElementById("bookmark").remove();
        }
    } else {
        console.log("2");
        if (document.getElementById("bookmark") == null) {
            var bookmarkDiv = document.createElement("div");
            bookmarkDiv.className = "responseButton";
            bookmarkDiv.id = "bookmark";
            var bookmarkImg = document.createElement("img");
            bookmarkImg.src = bookmark;
            bookmarkImg.alt = "Bookmark";
            bookmarkDiv.appendChild(bookmarkImg);
            document.getElementsByClassName("responseButtons")[0].appendChild(bookmarkDiv);
        }
    }
}
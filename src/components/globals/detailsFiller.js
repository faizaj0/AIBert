import { courseData } from "../../courseData.js";

export default function fillDetails(id) {
    var course = courseData.find(item => item.id === id);
    document.getElementsByClassName("courseTitle").item(0).innerHTML = course.name;
    console.log(course.name);
    document.getElementsByClassName("courseDescription").item(0).firstChild.innerHTML = course.description;
    console.log(course.description);
    if (course.duration == 1) {
        document.getElementsByClassName("courseDescription").item(0).childNodes[1].firstChild.innerHTML = "Length: 1 Hour";
    } else if (course.duration > 0) {
        document.getElementsByClassName("courseDescription").item(0).childNodes[1].firstChild.innerHTML = "Length: " + String(course.duration) + " hours";
    } else if (course.duration == -1) {
        document.getElementsByClassName("courseDescription").item(0).childNodes[1].firstChild.innerHTML = "Length: Collection";
    } else document.getElementsByClassName("courseDescription").item(0).childNodes[1].firstChild.innerHTML = "";
    if (document.getElementsByClassName("overlayCourseDetails").length != 0) {
        if (document.getElementsByClassName("courseDescription").item(0).childNodes[1].firstChild.innerHTML != "") {
            document.getElementsByClassName("courseDescription").item(0).childNodes[1].firstChild.innerHTML += "<br>Difficulty Rating: " + String(course.difficulty);
        } else document.getElementsByClassName("courseDescription").item(0).childNodes[1].firstChild.innerHTML += "Difficulty Rating: " + String(course.difficulty);
        document.getElementsByClassName("responseButtons").item(0).firstChild.setAttribute("href",course.link)
    }
    document.getElementsByClassName("courseImage").item(0).firstChild.setAttribute("src",course.image);
}
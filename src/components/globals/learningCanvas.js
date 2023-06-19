import GetAllCompleted from "./returnComplete";
import { courseData } from "../../courseData";

import CompletedSkillsbuild from '../../Images/completedSkillsbuild.png';
import CompletedMindspark from '../../Images/completedMindspark.png';
import CompletedDeveloper from '../../Images/completedDeveloper.png';

export default async function (journey) {
    var canvasDiv = document.createElement("div");
    canvasDiv.className = "canvas";

    var coursesDiv = document.createElement("div");
    coursesDiv.className = "treeCourses";

    var completed = [];
    var allCompleted = await GetAllCompleted();

    for (var i = 0; i < 9; i += 3) {

        completed.push(allCompleted.includes(journey.substring(i,i+3)));

        var courseDiv = document.createElement("div");
        courseDiv.id = journey.substring(i,i+3);
        courseDiv.className = "treeCardStyle";

        var course = courseData.find(item => item.id === journey.substring(i,i+3));

        var imgDiv = document.createElement("div");
        
        var img = document.createElement("img");
        if (completed[i/3]) {
            switch (journey[i]) {
                case "1":
                    img.setAttribute("src",CompletedSkillsbuild);
                    break;
                case "3":
                    img.setAttribute("src",CompletedMindspark);
                    break;
                case "4":
                    img.setAttribute("src",CompletedDeveloper);
                    break;
            }
        } else img.setAttribute("src",course.image);
        img.className = "courseThumb";
        img.alt = "Course thumbnail";
        imgDiv.appendChild(img);

        var titleDiv = document.createElement("div");

        var strong = document.createElement("strong");
        strong.innerHTML = course.name;
        titleDiv.appendChild(strong);

        courseDiv.appendChild(imgDiv);
        courseDiv.appendChild(titleDiv);

        coursesDiv.appendChild(courseDiv);
    }

    canvasDiv.appendChild(coursesDiv);

    var treeDiv = document.createElement("div");
    treeDiv.className = "tree";

    var trunkDiv = document.createElement("div");
    trunkDiv.className = "trunk";

    var leaves = [5,5,5,4,4,4,2,3];

    for (var i = 0; i < leaves.length; i++) {
        var branchDiv = document.createElement("div");
        branchDiv.className = "branch";
        for (var j = 0; j < leaves[i]; j++) {
            var leafDiv = document.createElement("div");
            leafDiv.className = "leaf";
            branchDiv.appendChild(leafDiv);
        }
        trunkDiv.appendChild(branchDiv);
    }

    treeDiv.appendChild(trunkDiv);
    canvasDiv.appendChild(treeDiv);

    return [canvasDiv, completed];
}
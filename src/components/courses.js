import ReactDOMServer from 'react-dom/server';
import { courseData } from "./../courseData.js";
import Navigation from './navigation';
import Details from "./overlayDetails.js";
import './components.css';
import fillDetails from './globals/detailsFiller';
import globalVariables from './globals/globalVariables.js';
import CheckBookmark from './globals/checkBookmark.js';
import CheckComplete from './globals/checkComplete';

import filledBookmark from '../Images/filledSmallBookmark.png'
import Bookmark from '../Images/smallBookmark.png'
import Checkbox from '../Images/checkbox.png';
import emptyCheckbox from '../Images/EmptyCheckbox.png';


// Split courseData into categories and courseList arrays
// Each element in the arrays are objects
// categories have an id property starting with a 0
// Init categories[] with a value s.t. all courses can show up once another filter has been applied
var categories = [{"name" : "All"}], courseList = [];
for (var i = 0; i < courseData.length; i++) {       //for element in courseData
    let element = courseData[i];
    ((element.id[0] === "0") ? (categories) : (courseList)).push(element)
}

// Render buttons for filter choices and course links 
// if filter button, isFilter = 1, else, isFilter = 0
function buttonRender (buttonText, isFilter, link = null) {
    // Executes when the user clicks on a filter button - Returns the category to filter 
    function isFilterBttn () {for (var i = 0; i < categories.length; i++) {if (categories[i].name === buttonText) {updateGrid(categories[i]);}}}
    // Executes when the user clicks on a course button - Opens the link to the course in a new window
    function notFilterBttn () {window.open(link, '_blank').focus();}
    return(<div className='pageButtons' onClick = {(isFilter) ? (isFilterBttn) : (notFilterBttn)}>{buttonText}</div>);
}

// Given a specific category object, will go through courseList[] to see which courses belong to it
// The argument is the category's object
// Returns the corresponding array of objects
function filterCategories (category) {
    var filteredList = [];
    for (var i = 0; i < courseList.length; i++) {
        //all courses matching to the category should be returned
        if (Number(category.id) === Number(courseList[i].id[0])) {filteredList.push(courseList[i]);}  
    }
    return filteredList;
}

async function showDetails (id) {
    globalVariables.currentCourseID = id;
    fillDetails(id);
    document.getElementsByClassName("overlayCourseSpan")[0].style.opacity = 1;
    document.getElementsByClassName("overlayCourseSpan")[0].style["pointer-events"] = "auto";

    let isBookmarked = await CheckBookmark()
    let bookmarkImage = document.getElementsByClassName("bookmarkImage")[0];
    if (isBookmarked == true){
        bookmarkImage.setAttribute("src", filledBookmark);
    }else{
        bookmarkImage.setAttribute("src", Bookmark);
    }
    let isComplete = await CheckComplete()
    let CheckmarkImage = document.getElementsByClassName("checkmarkImage")[0];
    if (isComplete == true){
        CheckmarkImage.setAttribute("src",  Checkbox);
    }else{
        CheckmarkImage.setAttribute("src", emptyCheckbox);
    }
    
    document.body.style["overflow"] = "hidden";
}

// coursesToShow <- Array of course objects to display in the grid
function renderGrid (coursesToShow) {

    return (
        <>
            {coursesToShow.map((data, key) => {
                return (
                    <div key={key} id={data.id} className='cardStyle' onClick={() => {showDetails(data.id)}}>
                        <div><img src={data.image} className='courseThumb' alt="Course pic" /></div>
                        <div><strong>{data.name}</strong></div>
                    </div>
                );
            })}
        </>
    );
}

function updateGrid (categoryToFilter) {

    const gridDiv = document.getElementById("cssGrid");
    const coursesToFilter = categoryToFilter.name === "All" ? (courseList) : (filterCategories(categoryToFilter));
    gridDiv.innerHTML = `${ReactDOMServer.renderToStaticMarkup(renderGrid(coursesToFilter))}`
    var cards = document.getElementsByClassName("cardStyle");
    for (var i = 0; i < cards.length; i++) applyEvent(cards[i],cards[i].id)
}

function applyEvent(target, id) {
    target.addEventListener('click', () => {
        console.log(`element with id ${id} was clicked`)
        showDetails(id)});
}

function updateOpacity() {
    document.getElementById("cssGrid").style.opacity = 1;
}

export default function Courses () {

    return(
        <div> 
            <Navigation /> 
            <div className = 'filterSection'>
                <div><strong>Filter:</strong></div>
                {categories.map((data, key) => {return (<div key={key} className='filterButtonDiv'>{buttonRender(data.name, 1)}</div>)})}
                <div><em></em></div>
            </div>
            <div className='wrapperStyle' id="cssGrid" style={{opacity:1}}>{renderGrid(courseList)}</div>
            <Details />
        </div>
    )
}
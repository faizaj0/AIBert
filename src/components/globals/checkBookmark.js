import globalVariables from "./globalVariables";

export default async function CheckBookmark() {
    const response = await fetch("http://localhost:5000/getbookmarks", {
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
    console.log(data.data);
    const currentCourseID = globalVariables.currentCourseID.toString();
    const isBookmarked= data.data.includes(currentCourseID);
    console.log(`isBookmarked: ${isBookmarked}`);
    return isBookmarked;
}


import globalVariables from "./globalVariables";

export default async function CheckComplete() {
    const response = await fetch("http://localhost:5000/getCompletedCourses", {
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
    const currentCourseID = globalVariables.currentCourseID.toString();
    const isCompleted = data.data.includes(currentCourseID);
    console.log(`isCompleted: ${isCompleted}`);
    return isCompleted;
}

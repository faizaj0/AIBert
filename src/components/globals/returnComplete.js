export default async function GetAllCompleted() {
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
    return data.data;
}
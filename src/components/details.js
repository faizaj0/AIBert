import skillsbuild from "../Images/skillsbuild.png";
import mindspark from "../Images/mindspark.png";
import developer from "../Images/developer.png";
import { useEffect } from 'react';
import './components.css';

export default function Details() {
    return (
        <div className="courseSpan">
            <div className="courseDetails">
                <div className="courseImage">
                    <img alt="Image"></img>
                </div>
                <div className="courseTitle">
                    Title
                </div>
                <div className="courseDescription">
                    <p>Description</p>
                    <p><i></i></p>
                </div>
            </div>
        </div>
  );
}



import React from 'react';
import config from '../../../../../config/config';
import ImageContainer from '../imageContainer';
import Timer from '../timer';
// import { FiPhoneOutgoing } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";

export default (props) => {
    const { activity, userData } = props
    var date = activity.time.slice(5, 7)
    var timetaken = activity.duration;
    // const minutes = ()
    return (
        <div className="activityContentWithDate">

            <div className="activityContent">
            <div className="callIconDiv">  <FiCopy  className="callIcon" /></div>
                <div>
                    <span className="dateNew Notify">{activity.time.slice(8, 10)}  {config.monthPicker[date]}, {activity.time.slice(0, 4)}</span>
                    <div style={{ textAlign: "left" }}>
                        <p>You were in call with <ImageContainer name={userData.userName} imgsrc={userData.profilePic} /> for the topic <a href={activity.link}><b>{activity.subject}</b></a> for <Timer time={timetaken} /> minutes</p>

                    </div>
                </div>
            </div>
        </div>
    )

}




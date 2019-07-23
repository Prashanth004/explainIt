

import React from 'react';
import config from '../../../../../config/config';
import ImageContainer from '../imageContainer';
import Timer from '../timer';
import { FiPhoneIncoming } from "react-icons/fi";

export default (props) => {
    const {activity, userData} = props
        var date = activity.time.slice(5, 7)
        var timetaken = activity.duration
        return (
            <div className="activityContentWithDate">
                {/* <div className="date">
                    <span>{activity.date.slice(8, 10)} {config.monthPicker[date]}</span>
                    <br />
                    <span className="year">{activity.date.slice(0, 4)}</span>
                </div> */}
                <div className="activityContent">
                    
                <div className="callIconDiv"> <FiPhoneIncoming className="callIcon" /></div>
                <div>
                <span className="dateNew Notify">{activity.time.slice(8, 10)}  {config.monthPicker[date]}, {activity.time.slice(0, 4)}</span>

                    <div style={{ textAlign: "left" }}>
                        <p>You were in call with <ImageContainer name={userData.userName} imgsrc={userData.profilePic}/>  for the topic  <a href={activity.link}><b>{activity.subject}</b></a> for <Timer time={timetaken}/> minutes</p>

                    </div>
                    </div>
                </div>

            </div>
       )

    }
    
    



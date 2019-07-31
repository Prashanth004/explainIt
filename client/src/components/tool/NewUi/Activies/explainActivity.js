

import React from 'react';
import config from '../../../../config/config'
import ImageContainer from './imageContainer';
import { FiCopy } from "react-icons/fi";

export default (props) => {
        const {activity, userData} = props
        var date = activity.time.slice(5, 7);
        const writing = props.direction === "to"?  <p><ImageContainer name={userData.userName} imgsrc={userData.profilePic}/> explained to you on the topic <a href={activity.link}><b>{activity.subject}</b></a></p>
        :<p>You explained to <ImageContainer name={userData.userName} imgsrc={userData.profilePic}/> on topic <a href={activity.link}><b>{activity.subject}</b></a></p>
        return (
            <div className="activityContentWithDate">
                <div className="activityContent">
                {/* <div className="callIconDiv">  <FiPhoneOutgoing  className="callIcon" /></div> */}
                <div className="callIconDiv"> <FiCopy   className="callIcon msg" /></div>
                <div>
                
                <span className="dateNew Notify">{activity.time.slice(8, 10)}  {config.monthPicker[date]}, {activity.time.slice(0, 4)}</span>

                    <div style={{ textAlign: "left" }}>
                      {writing}
                    </div>
                    </div>
                </div>
            </div>
         )
}
        
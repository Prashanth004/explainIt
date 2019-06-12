

import React from 'react';
import config from '../../../../../config/config'

export default (props) => {
    const {activity, userData} = props
        var date = activity.date.slice(5, 7)
        var timetaken = activity.duration;
        return (
            <div className="activityContentWithDate">
                <div className="date">
                    <span>{activity.date.slice(8, 10)} {config.monthPicker[date]}</span>
                    <br />
                    <span className="year">{activity.date.slice(0, 4)}</span>
                </div>
                <div className="activityContent">

                    <div>
                        <img className="activityImage" src={userData.profilePic} alt="Profilepic"></img>
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <p>You were in call with <b>@{userData.userName}</b> for the topic <b>{activity.subject}</b> for <b>{Math.floor(timetaken)} minutes and
             {Math.floor((timetaken - Math.floor(timetaken)) * 60)} seconds</b>. Call not saved</p>

                    </div>
                </div>

            </div>
  )
}
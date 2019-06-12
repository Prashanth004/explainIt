

import React from 'react';
import config from '../../../../../config/config'

export default (props) => {
        const {activity, userData} = props
        var date = activity.date.slice(5, 7)
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
                        <p>You have sent a recorded message to <b>@{userData.userName}</b> on the topic <b>{activity.subject}</b></p>
                        <span><a href={activity.link}>Click here acess the recordeing</a></span>
                    </div>
                </div>
            </div>
         )
}
        
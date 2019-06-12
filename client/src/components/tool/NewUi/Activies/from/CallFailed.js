

import React from 'react';
import config from '../../../../../config/config'

export default (props) => {
    const {userData, activity} = props
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
                    <p> You tried calling <b>@{userData.userName}</b>  for the topic <b>{activity.subject}</b></p>

                </div>
            </div>
        </div>
    )

}




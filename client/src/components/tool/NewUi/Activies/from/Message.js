

import React from 'react';
import config from '../../../../../config/config'
import ImageContainer from '../imageContainer'
export default (props) => {
        const {activity, userData} = props
        var date = activity.date.slice(5, 7)
        return (
            <div className="activityContentWithDate">
                {/* <div className="date">
                    <span>{activity.date.slice(8, 10)} {config.monthPicker[date]}</span>
                    <br />
                    <span className="year">{activity.date.slice(0, 4)}</span>
                </div> */}
                <div className="activityContent">
                <span className="dateNew Notify">{activity.date.slice(8, 10)}  {config.monthPicker[date]}, {activity.date.slice(0, 4)}</span>

                    <div style={{ textAlign: "left" }}>
                        <p>Sent a recorded message to <ImageContainer name={userData.userName} imgsrc={userData.profilePic}/>  on the topic <a href={activity.link}><b>{activity.subject}</b></a></p>
                    </div>
                </div>
            </div>
         )
}
        
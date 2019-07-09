import React from 'react';
import config from '../../../../../config/config';
import { FiMessageSquare } from "react-icons/fi";
export default (props) => {
        const {activity} = props
        var date = activity.time.slice(5, 7)
        return (
            <div className="activityContentWithDate">
                <div className="activityContent">
                <div className="callIconDiv"> <FiMessageSquare   className="callIcon msg" /></div>
                <div>
                <span className="dateNew Notify">{activity.time.slice(8, 10)}  {config.monthPicker[date]}, {activity.time.slice(0, 4)}</span>

                    <div style={{ textAlign: "left" }}>
                        <p>You saved a recording on the topic <a href={activity.link}><b>{activity.subject}</b></a></p>
                    </div>
                 </div>
                </div>
            </div>
         )
}
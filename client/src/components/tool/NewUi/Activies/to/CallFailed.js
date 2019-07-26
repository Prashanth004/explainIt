

import React from 'react';
import config from '../../../../../config/config';
import ImageContainer from '../imageContainer';
import { FiPhoneMissed } from "react-icons/fi";
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {dialFromMissed} from '../../../../../actions/dialActions'

const CallFail = (props) => {
    const { userData, activity } = props
    var date = activity.time.slice(5, 7)
    return (
        <div className="activityContentWithDate">
            {/* <div className="date">
                    <span>{activity.date.slice(8, 10)} {config.monthPicker[date]}</span>
                    <br />
                    <span className="year">{activity.date.slice(0, 4)}</span>
                </div> */}
            <div className="activityContent">
                <div className="callIconDiv" > 
                <span className="hint--top" aria-label={"dial "+userData.userName}>
                    <FiPhoneMissed className="callIcon missed" onClick={()=>props.dialFromMissed(userData.userName)}/>
                </span>
                </div>
                <div>

                    <span className="dateNew Notify">{activity.time.slice(8, 10)}  {config.monthPicker[date]}, {activity.time.slice(0, 4)}</span>

                    <div style={{ textAlign: "left" }}>
                        <p> <ImageContainer name={userData.userName} imgsrc={userData.profilePic} /> tried calling you for the topic <b>{activity.subject}</b></p>

                    </div>
                </div>
            </div>
        </div>
    )
}

CallFail.PropType = {
    dialFromMissed: PropType.func.isRequired,
    addNewUser:PropType.func.isRequired
};
const mapStateToProps = state => ({
    // userData : state.userStore.userData

})
export default connect(mapStateToProps, {dialFromMissed })(CallFail)








import React from 'react';
import config from '../../../../../config/config';
import ImageContainer from '../imageContainer';
import { FiPhoneMissed } from "react-icons/fi";
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { openHome} from '../../../../../actions/navAction'

import {dialFromFail} from '../../../../../actions/dialActions'
// import { fullStartedSharing } from '../../../../../actions/toolActions';

const CallFailDialed =  (props) => {
    const { userData, activity } = props
    var date = activity.time.slice(5, 7);
    const Redial = ()=>{
        props.dialFromFail(userData.userName,activity.subject);
        props.openHome();
    }
    
    return (
        <div className="activityContentWithDate">
            <div className="activityContent">
            <div className="callIconDiv" > 
                <span className="hint--top" aria-label={"dial "+userData.userName}>
                    <FiPhoneMissed className="callIcon missed" onClick={Redial}/>
                </span>
                </div>
                {/* <div className="callIconDiv"> <FiPhoneMissed className="callIcon missed" /></div> */}
                <div>
                <span className="dateNew Notify">{activity.time.slice(8, 10)}  {config.monthPicker[date]}, {activity.time.slice(0, 4)}</span>
                    <div style={{ textAlign: "left" }}>
                        <p> You tried calling <ImageContainer name={userData.userName} imgsrc={userData.profilePic} />  for the topic <b>{activity.subject}</b></p>


                    </div>
                </div>
            </div>
            {/* {screenShare} */}
        </div>
    )

}

CallFailDialed.PropType = {
    dialFromFail: PropType.func.isRequired,
   
};
const mapStateToProps = state => ({
    // userData : state.userStore.userData
    openHome: PropType.func.isRequired,
   
})
export default  connect(mapStateToProps, {dialFromFail,openHome })(CallFailDialed)





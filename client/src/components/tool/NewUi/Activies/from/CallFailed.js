

import config from '../../../../../config/config';
import ImageContainer from '../imageContainer';
import { FiPhoneMissed } from "react-icons/fi";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropType from 'prop-types';
import { openHome} from '../../../../../actions/navAction';
import React, { Component } from 'react'
import {dialFromFail} from '../../../../../actions/dialActions'

class CallFailDialed extends Component {
    constructor(props){
        super(props);
        this.state={
            oepnHemred : false
        }
        this.Redial = this.Redial.bind(this);
    }
    Redial = ()=>{
        const {userData,activity} = this.props;
        this.props.dialFromFail(userData.userName,activity.subject);
        this.setState({oepnHemred:true})
    }
  render() {
    const { userData, activity } = this.props
    var date = activity.time.slice(5, 7);

    return (!this.state.oepnHemred?(
        <div className="activityContentWithDate">
            <div className="activityContent">
            <div className="callIconDiv" > 
                <span className="hint--top" aria-label={"dial "+userData.userName}>
                    <FiPhoneMissed className="callIcon missed" onClick={this.Redial}/>
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
    ):((<Redirect push to={"../application"} />)))
  }
}
const mapStateToProps = state => ({
    // userData : state.userStore.userData
    openHome: PropType.func.isRequired,
   
})
export default  connect(mapStateToProps, {dialFromFail,openHome })(CallFailDialed)






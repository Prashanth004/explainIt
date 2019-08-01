import React, { Component } from 'react';
import { connect } from 'react-redux';
// import axios from 'axios';
// import config from '../../../../config/config'
// import PropType from 'prop-types';
import './contacts.css';
import { FiCopy,FiVideo} from "react-icons/fi";
import {addNewUser} from '../../../../actions/storeUserAction';
import {dialFromFail,recordFromFail} from '../../../../actions/dialActions'


class cntactCard extends Component {
    constructor(props){
        super(props)
        this.state={
            userName: ' ',
            profilePic: ' ',
        }
    }
  
  render() {
    console.log("this.props.contactData : ",this.props.contactData);
    const {profilepic,username,twitterhandle,goodat} = this.props.contactData;
    // switch(state) {
    //   default:
    //       return null;
    // }
    return (
      <div className="singleContact">
          <div className="contactImgContainer">
              <img src={profilepic} width="100%" height="100%"  className="contactImage" alt="profilePic"></img>
          </div>
          <div style={{textAlign:"left"}}>
          <span>{username} </span>
          {/* <span className="contactHandle">@{twitterhandle}</span>
          <br/> */}
          <p className="contactHandle"><b>Good at : </b>{goodat}</p>
          </div>
          <div>
          <span className="hint--left" aria-label="Share Screen">
            <FiCopy onClick={()=>this.props.dialFromFail(twitterhandle,"")}style={{fontSize:"18px"}}/>
          </span>
           <br/>
           <span className="hint--left" aria-label="Record screen and send">
            <FiVideo onClick={()=>this.props.recordFromFail(twitterhandle,"")}style={{fontSize:"18px"}}/>
            </span>
          </div>
      
      </div>
    )
  }
}

cntactCard.PropType = {
  
};
const mapStateToProps = state => ({
    userData : state.userStore.userData

})
export default connect(mapStateToProps, {addNewUser,recordFromFail,dialFromFail})(cntactCard)




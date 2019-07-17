import React, { Component } from 'react';
import { connect } from 'react-redux';
// import axios from 'axios';
// import config from '../../../../config/config'
// import PropType from 'prop-types';
// import './contacts.css'
import {addNewUser} from '../../../../actions/storeUserAction'


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
    const {profilepic,twitterhandle,username} = this.props.contactData;
   
    return (
      <div className="singleContact">
          <div className="contactImgContainer">
              <img src={profilepic} width="100%" height="100%"  className="contactImage" alt="profilePic"></img>
          </div>
          <div>
          <p>{username} </p>
          <span>@{twitterhandle}</span>
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
export default connect(mapStateToProps, {addNewUser})(cntactCard)




import React, { Component } from 'react';
import { connect } from 'react-redux';
import './contacts.css';
import config from '../../../../config/config'
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
    const {profilepic,username,twitterhandle,bio} = this.props.contactData;
    const emptyGoodAt = (<p className="contactHandle">Profile details incomplete</p>)
    const gootAtDiv = (bio!==null)?((bio.length!==0)?( <div className="goodAt"><b>Status : </b>{bio}</div>):(emptyGoodAt)):(emptyGoodAt)
    return (
      <div className="singleContact">
          <div className="contactImgContainer">
              <img src={profilepic} width="100%" height="100%"  className="contactImage" alt="profilePic"></img>
          </div>
          <div style={{textAlign:"left"}}>
            <a href={config.react_url+"/@"+twitterhandle}target="_blank"rel="noopener noreferrer" >
          <span>{username} </span></a>
          {gootAtDiv}
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




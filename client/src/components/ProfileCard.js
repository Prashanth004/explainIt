import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getProfileDetails } from '../actions/profileAction';
import './css/newlanding.css'

class ProfileCard extends Component {
  render() {
    return (
        <div className="Profilecard">
        <div className="blackwhite">
            <p><b>{this.props.userName}</b></p>
        </div>
        <div className="profileDetails">
            <div>
                <div className="profileImage">
                    <img  src={this.props.profilePic} className="profileImageElement" ></img>
                </div>
            </div>
            <div className="displayNumber">
            <p>Created</p>
            <p className="numberShow">{this.props.noCreated}</p>        

            </div >
            <div className="displayNumber">
            <p>Participated</p>
            <p className="numberShow">{this.props.noParticipated}</p>  

            </div>
        </div>
    </div>
    )
  }
}

ProfileCard.PropType = {
  
};
const mapStateToProps = state => ({
    userName:state.profile.userName,
    email:state.profile.email,
    profilePic:state.profile.profilePic,
   noCreated:state.profile.noCreated,
   noParticipated:state.profile.noParticipated
})

export default connect(mapStateToProps, {})(ProfileCard)


import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { getProfileDetails } from '../../../actions/profileAction';
import '../../css/newlanding.css'

class ProfileCard extends Component {
componentWillMount(){
   this.props.getProfileDetails(this.props.userId) 
}
 
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
            <div  onClick={this.props.toggleCreatedIssue} className="displayNumber">
            <p>Created</p>
            <p className="numberShow"><a href="#">{this.props.noCreated}</a></p>        

            </div >
            <div onClick={this.props.toggleParticipatedIssue}className="displayNumber">
            <p>Participated</p>
            <p className="numberShow"><a href="#">{this.props.noParticipated}</a></p>  

            </div>
        </div>
    </div>
    )
  }
}

ProfileCard.PropType = {
    toggleProjects :  PropType.func.isRequired,
    getProfileDetails: PropType.func.isRequired
};
const mapStateToProps = state => ({
    userName:state.profile.userName,
    email:state.profile.email,
    profilePic:state.profile.profilePic,
   noCreated:state.profile.noCreated,
   noParticipated:state.profile.noParticipated
})

export default connect(mapStateToProps, {getProfileDetails})(ProfileCard)


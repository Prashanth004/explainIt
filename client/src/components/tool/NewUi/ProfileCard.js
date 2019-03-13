import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { getProfileDetails } from '../../../actions/profileAction';
import '../../css/newlanding.css'

import { IoIosLink } from "react-icons/io";

class ProfileCard extends Component {
componentWillMount(){
    console.log("uswrID : ",this.props.userId)
   this.props.getProfileDetails(this.props.userId) 
     // this.props.stillAuthenicated();
        // const cryptr = new Cryptr(config.SECRET);
        // const decryptedTwitterHandle = cryptr.decrypt(this.props.match.params.encrTwitterHandle);
        // console("decryptedTwitterHandle : ",decryptedTwitterHandle)
        // this.setState({
        //     twitterHandle:decryptedTwitterHandle
        // })
   
}
 
  render() {
      if(this.props.isHome){
        var linkSymbol = (<IoIosLink onClick={this.props.toggleDisplayLink}/>)

      }
      else{
        var linkSymbol = null

      }
    // var sharabeLink = config.base_dir+"/"+this.props.twitterHandle
    return (
        <div className="Profilecard">
        <div className="blackwhite">
           {linkSymbol}
        </div>
        <div className="profileDetails">
            <div>
                <div className="profileImage">
                    <img  src={this.props.profilePic} className="profileImageElement" ></img>
                </div>
                <p className="profileName"><b>{this.props.userName}</b></p>
                
            </div>
            <div  onClick={this.props.toggleCreatedIssue} className="displayNumber">
            <h6>Created</h6>
            <p className="numberShow"><a href="#">{this.props.noCreated}</a></p>        

            </div >
            <div onClick={this.props.toggleParticipatedIssue}className="displayNumber">
            <h6>Participated</h6>
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


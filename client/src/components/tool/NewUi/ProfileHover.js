import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import config from '../../../config/config'
import {getProfileDetailsOnHover} from '../../../actions/ProfileHoverAction'
import '../../css/newlanding.css'
import '../../css/profielVisit.css'

class ProfileCard extends Component {
    componentWillMount() {
     
        if (this.props.userId === this.props.profileId)
            this.props.getProfileDetailsOnHover(this.props.userId, config.SELF)
        else
            this.props.getProfileDetailsOnHover(this.props.userId, config.VISIT_PROF)
    }

    render() {
      
        return (
            <div className="ProfilecardVisit" style={{width:"100%"}}>
                <div className="blackwhiteVisit">
                   
                </div>
                <div className="profileDetails">
                    <div className="nameImageDiv">
                        <div className="profileImageVisit">
                        <a href={"https://twitter.com/"+this.props.twitterHandle}>
                            <img alt="profile pic" src={this.props.profilePic} className="profileImageElementVisit" ></img>
                            </a>    
                        </div>
                        <div   className="profileNameVisit">
                        <a href={"https://twitter.com/"+this.props.twitterHandle}  rel="noopener noreferrer" target="_blank"
                       ><b>{this.props.userName}</b></a>
                      </div>

                    </div>
                    <div className="displayNumberVisit">
                        <p>Created</p>
                        <p className="numberShow"><span>{this.props.noCreated}</span></p>

                    </div >
                    <div className="displayNumberVisit">
                        <p>Participated</p>
                        <p className="numberShow"><span>{this.props.noParticipated}</span></p>

                    </div>
                </div>
            </div>
        )
    }
}

ProfileCard.PropType = {
    toggleProjects: PropType.func.isRequired,
    getProfileDetailsOnHover: PropType.func.isRequired
};
const mapStateToProps = state => ({
    userName: state.profileHover.userName,
    email: state.profileHover.email,
    profilePic: state.profileHover.profilePic,
    noCreated: state.profileHover.noCreated,
    noParticipated: state.profileHover.noParticipated,
    profileId: state.auth.id,
    twitterHandle: state.profile.twitterHandle,
})

export default connect(mapStateToProps, { getProfileDetailsOnHover })(ProfileCard)


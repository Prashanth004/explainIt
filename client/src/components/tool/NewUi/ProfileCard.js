import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import config from '../../../config/config'
import { getProfileDetails } from '../../../actions/profileAction';
import '../../css/newlanding.css'

import { IoIosLink } from "react-icons/io";

class ProfileCard extends Component {
    componentWillMount() {
        console.log("uswrID : ", this.props.userId)
        if (this.props.userId === this.props.profileId)
            this.props.getProfileDetails(this.props.userId, config.SELF)
        else
            this.props.getProfileDetails(this.props.userId, config.VISIT_PROF)


        // this.props.stillAuthenicated();
        // const cryptr = new Cryptr(config.SECRET);
        // const decryptedTwitterHandle = cryptr.decrypt(this.props.match.params.encrTwitterHandle);
        // console("decryptedTwitterHandle : ",decryptedTwitterHandle)
        // this.setState({
        //     twitterHandle:decryptedTwitterHandle
        // })

    }

    render() {
        if (this.props.isHome) {
            var linkSymbol = (
                <span className="hint--top" aria-label="Get profile link">
                    <IoIosLink onClick={this.props.toggleDisplayLink} />
                </span>
            )

        }
        else {
            var linkSymbol = null

        }
        // var sharabeLink = config.base_dir+"/"+this.props.twitterHandle
        return (
            <div className="Profilecard">
                <div className="blackwhite">
                    {linkSymbol}
                </div>
                <div className="profileDetails">
                    <div className="nameImageDiv">
                        <div className="profileImage">
                        <a href={"https://twitter.com/"+this.props.twitterHandle}>
                            <img src={this.props.profilePic} className="profileImageElement" ></img>
                            </a>    
                        </div>
                        <div   className="profileName">
                        <a href={"https://twitter.com/"+this.props.twitterHandle}
                       ><b>{this.props.userName}</b></a>
                      </div>

                    </div>
                    <div onClick={this.props.toggleCreatedIssue} className="displayNumber">
                        <p>Created</p>
                        <p className="numberShow"><a href="#">{this.props.noCreated}</a></p>

                    </div >
                    <div onClick={this.props.toggleParticipatedIssue} className="displayNumber">
                        <p>Participated</p>
                        <p className="numberShow"><a href="#">{this.props.noParticipated}</a></p>

                    </div>
                </div>
            </div>
        )
    }
}

ProfileCard.PropType = {
    toggleProjects: PropType.func.isRequired,
    getProfileDetails: PropType.func.isRequired
};
const mapStateToProps = state => ({
    userName: state.profile.userName,
    email: state.profile.email,
    profilePic: state.profile.profilePic,
    noCreated: state.profile.noCreated,
    noParticipated: state.profile.noParticipated,
    profileId: state.auth.id,
    twitterHandle: state.profile.twitterHandle,
})

export default connect(mapStateToProps, { getProfileDetails })(ProfileCard)


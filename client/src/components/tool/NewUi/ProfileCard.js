import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import Toggle from 'react-toggle';
import '../../css/toggle.css';
import { changeOnlinestatus } from '../../../actions/profileAction'
import { cancelSuccess } from '../../../actions/issueActions';
// import './Floater/floater.css';
import { FiLink2 } from "react-icons/fi";
import {resetCallAction} from '../../../actions/callAction'
import {resetIssueActions,resetProjectActions} from '../../../actions/projectActions'
import { JustRecord } from '../../../actions/messageAction'
import {getAllActivities} from '../../../actions/callAction'
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import config from '../../../config/config'
import { setIssueIdToNull } from '../../../actions/issueActions'
import { getProfileDetails } from '../../../actions/profileAction';
import '../../css/newlanding.css'
import { FiMail } from "react-icons/fi";
import { cancelAllMessageAction } from '../../../actions/messageAction'
import { restAllToolValue } from "../../../actions/toolActions";
import { resetValues } from '../../../actions/twitterApiAction'


class ProfileCard extends Component {
    constructor(props) {
        super(props)
        this.openProfile = this.openProfile.bind(this);
        this.startSharingScreen = this.startSharingScreen.bind(this);
        this.startRecordScreen = this.startRecordScreen.bind(this);
        this.startAction = this.startAction.bind(this)
    }
    componentWillMount() {
        if (this.props.userId === this.props.profileId)
            this.props.getProfileDetails(this.props.userId, config.SELF)
        else
            this.props.getProfileDetails(this.props.userId, config.VISIT_PROF)
        this.props.getAllActivities()
    }
    startAction(){
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.props.resetIssueActions();
    }
    startRecordScreen() {
        this.startAction()
        this.props.JustRecord();
        this.props.setIssueIdToNull();
        this.props.recordFullScreen();
        this.props.resetCallAction();
      
       
    }
    startSharingScreen() {
        this.startAction()
        this.props.shareFullScreenShare()
        this.props.resetCallAction();
        this.props.resetProjectActions();
    }


    openProfile() {
        window.open("https://twitter.com/" + this.props.twitterHandle, '_blank')
    }
    render() {
        const defaultToggle = (this.props.onlinestatus) ? true : false;
        const toolTipValue = !this.props.onlinestatus ? ('Offline - people can not send you share request')
            : ('Online - people can send you share request')
        var linkSymbol = null;
        var notifyBadge = null
        if (this.props.userId === this.props.profileId) {
            notifyBadge = (<NotificationBadge count={this.props.totalUnread} effect={Effect.ROTATE_Y} />
            )
        }
        if (this.props.isHome) {
            linkSymbol = (
                <span className="hint--top" aria-label="Get profile link">
                    <FiLink2 style={{
                        width: "15px",
                        height: "15px",
                        float: "right",
                        marginTop: "0px",
                        marginRight: "10px"
                    }} onClick={this.props.toggleDisplayLink} />
                </span>
            )
        }
        else {
            linkSymbol = null
        }
        return (this.props.donefetchingProfile) ? (
            (this.props.isHome) ? (
                <div>
                    <div className="labelContainer">

                        <div className="gridLay">
                            <div className="pImageContainer">
                                <span className="hint--top" aria-label="double tap for deatils">
                                    <img alt="profile pic" src={this.props.profilePic}
                                        onDoubleClick={this.props.openDtailsTab}
                                        className="labelProfilePic"></img>
                                </span>
                            </div>
                            <div className="screenShareBtnLabel">
                                <span className="hint--top" aria-label="Share screen!">
                                    <img alt="screen share" onClick={this.startSharingScreen} height="100%" width="100%" src={require('../../images/screensharing.png')} />
                                </span>
                            </div>
                            <div className="RecordBtnLabel">
                                <span className="hint--top" aria-label="Record screen!">
                                    <img alt="record screen" onClick={this.startRecordScreen} height="100%" width="100%" src={require('../../images/download.jpg')} />
                                </span>
                            </div>
                            <div className="drago">
                                <div >
                                    {notifyBadge}
                                    <span>
                                  
                                        <FiMail onClick={this.props.toggleInbox} className="dragoMail" />
                                        {/* <FiMail onClick={this.props.showInbox} className="dragoMail" /> */}

                                    </span>
                                </div>
                            </div>
                            <div className="topSymbol">
                                <span>
                                    {linkSymbol}
                                </span>
                                <span className="hint--top" aria-label={toolTipValue}>

                                    <Toggle
                                        defaultChecked={defaultToggle}
                                        className='custom-classname'
                                        icons={false}
                                        onChange={() => this.props.changeOnlinestatus((this.props.onlinestatus) ? (0) : (1))}
                                    />
                                </span>


                            </div>
                            <div>

                            </div>
                        </div>
                    </div>

                </div>

            ) : (
                    <div>

                        <div className="labelContainerView">
                            <div className="topSymbol">
                                <span>
                                    {linkSymbol}
                                </span>
                            </div>
                            <div className="gridLayViewPage">
                                <div className="pImageContainer">
                                    <span className="hint--top" aria-label={this.props.userName}>

                                        <img alt=" " src={this.props.profilePic} onDoubleClick={this.props.openDtailsTab} className="labelProfilePic"
                                        style={{marginTop:"5px", width:"65px", height:"65px"}}></img>

                                    </span>
                                </div>
                                <div className="drago">
                                    <div >
                                        {notifyBadge}
                                        <span>
                                            <FiMail onClick={this.props.toggleInbox}style={{marginTop:"10px"}} className="dragoMail" />
                                        </span>
                                    </div>

                                </div>
                                <div>

                                </div>
                            </div>
                        </div>

                    </div>

                )

        ) : (null)
    }
}

ProfileCard.PropType = {
    toggleProjects: PropType.func.isRequired,
    getProfileDetails: PropType.func.isRequired,
    changeOnlinestatus: PropType.func.isRequired,
    getAllActivities:PropType.func.isRequired,
    resetProjectActions:PropType.func.isRequired

};
const mapStateToProps = state => ({
    userName: state.profile.userName,
    donefetchingProfile: state.profile.donefetching,
    totalUnread: state.message.totalInboxNumber,
    email: state.profile.email,
    profilePic: state.profile.profilePic,
    noCreated: state.profile.noCreated,
    noParticipated: state.profile.noParticipated,
    profileId: state.auth.id,
    onlinestatus: state.profile.onlineStatus,
    twitterHandle: state.profile.twitterHandle,

})

export default connect(mapStateToProps, {
    JustRecord,
    resetCallAction,
    setIssueIdToNull, cancelSuccess, cancelAllMessageAction,
    resetValues, restAllToolValue,
    changeOnlinestatus,
    getAllActivities,
    resetProjectActions,
    resetIssueActions,
 getProfileDetails
})(ProfileCard)


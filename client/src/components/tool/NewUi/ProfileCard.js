import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
// import Toggle from 'react-toggle';
import '../../css/toggle.css';
import '../../css/profile.css';
import {  FULL_SCREEN_RECORD, FULL_SCREEN_SHARE } from '../../../actions/types';

import { changeOnlinestatus } from '../../../actions/profileAction'
import { cancelSuccess } from '../../../actions/issueActions';
import { FiVideo, FiMail, FiCopy,FiToggleRight, FiLink2,FiToggleLeft} from "react-icons/fi";
import { resetCallAction } from '../../../actions/callAction'
import { resetIssueActions, resetProjectActions } from '../../../actions/projectActions'
import { JustRecord } from '../../../actions/messageAction'
import { getAllActivities } from '../../../actions/callAction';
import { getAllReferral } from '../../../actions/referral'
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import config from '../../../config/config'
import { setIssueIdToNull } from '../../../actions/issueActions'
import { getProfileDetails } from '../../../actions/profileAction';
import '../../css/newlanding.css'
import { cancelAllMessageAction } from '../../../actions/messageAction'
import { restAllToolValue } from "../../../actions/toolActions";
import { resetValues } from '../../../actions/twitterApiAction';
import { IconContext } from "react-icons";




class ProfileCard extends Component {
    constructor(props) {
        super(props)
        this.openProfile = this.openProfile.bind(this);
        this.startSharingScreen = this.startSharingScreen.bind(this);
        this.startRecordScreen = this.startRecordScreen.bind(this);
        this.startAction = this.startAction.bind(this);
        this.toggleRecord =this.toggleRecord.bind(this);
    }
    componentWillMount() {
        this.startRecordScreen()
        const { userId, profileId, getProfileDetails, getAllActivities, getAllReferral } = this.props
        if (userId === profileId)
            getProfileDetails(userId, config.SELF)
        else
            this.props.getProfileDetails(userId, config.VISIT_PROF)
        getAllActivities();
        getAllReferral()
    }

    toggleRecord(){
        if(this.props.screenAction === FULL_SCREEN_SHARE){
            this.startRecordScreen();
            this.props.changeOnlinestatus(0);
        }
        else if(this.props.screenAction === FULL_SCREEN_RECORD){
            this.startSharingScreen();
            this.props.changeOnlinestatus(1);
        }
    }
    startAction() {
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.props.resetIssueActions();
        this.props.resetCallAction();
    }
    startRecordScreen() {
        this.startAction()
        this.props.JustRecord();
        this.props.setIssueIdToNull();
        this.props.recordFullScreen();

    }
    startSharingScreen() {
        this.startAction()
        this.props.shareFullScreenShare()
        this.props.resetProjectActions();
    }


    openProfile() {
        window.open("https://twitter.com/" + this.props.twitterHandle, '_blank')
    }
    render() {
        // const sustomAttr = { fontWeight: "normal" }
        // const defaultToggle = (this.props.onlinestatus) ? true : false;
        // const toolTipValue = !this.props.onlinestatus ? ('Offline - people can not send you share request')
        //     : ('Online - people can send you share request')
        var linkSymbol = null;
        var notifyBadge = null;
        // const onlineOffline = (this.props.isHome) ? (<span className="hint--top " aria-label={toolTipValue}>
        //     <Toggle
        //         defaultChecked={defaultToggle}
        //         className='custom-classname'
        //         icons={false}
        //         onChange={() => this.props.changeOnlinestatus((this.props.onlinestatus) ? (0) : (1))}
        //     />
        // </span>) : (null);
        // const toggleRecord =  <Toggle
        //         defaultChecked={defaultToggle}
        //         className='custom-classname'
        //         icons={false}
        //         onChange={() => this.props.changeOnlinestatus((this.props.onlinestatus) ? (0) : (1))}
        //     />
        const toggleRecord = this.props.screenAction === FULL_SCREEN_SHARE?
        (<FiToggleLeft style={{fontSize:"35px"}} onClick={this.toggleRecord} />):
        (<FiToggleRight style={{fontSize:"35px"}} onClick={this.toggleRecord} />)
        if (this.props.userId === this.props.profileId) {
            notifyBadge = (<NotificationBadge count={this.props.totalUnread} effect={Effect.ROTATE_Y} />
            )
        }
        if (this.props.isHome) {
            linkSymbol = (
                <span className="hint--top" aria-label="Get profile link">
                    <FiLink2 style={{
                        float: "right",
                        marginTop: "20px",
                        marginRight: "10px",
                        fontSize: "15px"
                    }} onClick={this.props.toggleDisplayLink} />
                </span>
            )
        }
        else {
            linkSymbol = null
        }
        return (this.props.donefetchingProfile) ? (<div>
            <div className="labelContainerMain">

                <div className="gridLay">
                    <div className="pImageContainer">
                        <span className="hint--top" aria-label="double tap for details">
                            <img alt="profile pic" src={this.props.profilePic}
                                onDoubleClick={this.props.openDtailsTab}
                                className="labelProfilePic"></img>
                        </span>
                    </div>
                    <div className="screenShareBtnLabel">
                        <span className="hint--top" aria-label="Share Screen">
                            <IconContext.Provider value={{ color: "#333", size: "15px" }}>
                                <div>
                                    < FiCopy style={{ marginTop: "1.5px" }}  />
                                </div>
                            </IconContext.Provider>
                        </span>

                      
                        {/* <span className="hint--top" aria-label="Share screen!">
                                    <img alt="screen share" onClick={this.startSharingScreen} style={{marginTop:"4px"}} height="28px" width="28px" src={require('../../images/scsh2.png')} />
                                </span> */}

                    </div>
                    <div>
                    {toggleRecord}
                    </div>
                    <div className="RecordBtnLabel">
                        <span className="hint--top" aria-label="Record Screen">
                            <IconContext.Provider value={{ color: "#333", size: "19px" }}>
                                <div>
                                    <FiVideo style={{ marginTop: "1.5px" }}/>
                                </div>
                            </IconContext.Provider>


                        </span>
                    </div>
                    <div className="drago">
                        <div >
                            <span className="hint--top" aria-label="Activities!">
                                {notifyBadge}
                                <IconContext.Provider value={{ color: "#333", size: "29px", }}>
                                    <div>
                                        <FiMail style={{ marginTop: "-1px", marginLeft: "-3px" }} onClick={this.props.toggleInbox} />
                                    </div>
                                </IconContext.Provider>

                            </span>
                        </div>
                    </div>
                    <div className="topSymbolMain">
                        {/* {onlineOffline} */}
                        <span>
                            {linkSymbol}
                        </span>
                    </div>
                    <div>

                    </div>
                </div>
            </div>

        </div>

        ) : (null);
    }
}

ProfileCard.PropType = {
    toggleProjects: PropType.func.isRequired,
    getProfileDetails: PropType.func.isRequired,
    changeOnlinestatus: PropType.func.isRequired,
    getAllActivities: PropType.func.isRequired,
    resetProjectActions: PropType.func.isRequired

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
    screenAction: state.tools.screenAction,

})

export default connect(mapStateToProps, {
    JustRecord,
    resetCallAction,
    setIssueIdToNull, cancelSuccess, cancelAllMessageAction,
    resetValues, restAllToolValue,
    changeOnlinestatus,
    getAllActivities,
    getAllReferral,
    resetProjectActions,
    resetIssueActions,
    getProfileDetails
})(ProfileCard)


import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import Toggle from 'react-toggle';
import BusyAction from './container/BusyAction';
import Profile from './Profile';
import { toggleHowWorksModal } from '../../../actions/modalAction'
import { displayFullScrenRecord, displayFullScreShare } from '../../../actions/toolActions'
import {  FULL_SCREEN_RECORD, FULL_SCREEN_SHARE } from '../../../actions/types';
import {showActivitynow,hideActivity,hideProfile,showProfileNow} from '../../../actions/ProfileCardAction';
import FullScreenShare from './enitreScreenShare'
import FullScreenRecord from './FullScreenRecord';
import { Button } from 'reactstrap';
import '../../css/toggle.css';

import { confirmAlert } from 'react-confirm-alert';
import { changeOnlinestatus } from '../../../actions/profileAction'
import { cancelSuccess } from '../../../actions/issueActions';
import { FiVideo, FiMail, FiCopy } from "react-icons/fi";
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
import {  openInbox } from "../../../actions/navAction";


class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state={reducedWidth : false,  reducedLittleWidth: false,redialed : false}
        this.openProfile = this.openProfile.bind(this);
        this.startSharingScreen = this.startSharingScreen.bind(this);
        this.startRecordScreen = this.startRecordScreen.bind(this);
        this.startAction = this.startAction.bind(this);
        this.reStoreDefault = this.reStoreDefault.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.toggleInbox = this.toggleInbox.bind(this);
        this.resize = this.resize.bind(this);
        this.redial = this.redial.bind(this);
    }

    redial(){
        this.setState({redialed:true})
        this.startSharingScreen();
    }
    handleCancel() {

    }
    reStoreDefault = () => {
        if (this.props.screenAction !== null && !this.props.isSharingCompleted && !this.props.isFullSharingCompleted) {
            confirmAlert({
                title: "Are you sure?",
                message: "You won't be able to revert this!",
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => this.handleConfirm()
                    },
                    {
                        label: 'No',
                        onClick: () => this.handleCancel()
                    }
                ]
            })
        }
        else {
            this.handleConfirm()
        }
    }
    componentDidMount(){
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        this.setState({redialed : false});
    }
    
    handleConfirm() {
        this.props.hideActivity();
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.props.resetCallAction();
       
    }
    resize() {
        this.setState({ reducedWidth: window.innerWidth <= 700 });
        this.setState({ reducedLittleWidth: window.innerWidth <= 1000 });
    }

    componentWillMount() {
        const { userId, profileId, getProfileDetails, getAllActivities, getAllReferral } = this.props
        if (userId === profileId)
            getProfileDetails(userId, config.SELF)
        else
            this.props.getProfileDetails(userId, config.VISIT_PROF)
        getAllActivities();
        getAllReferral()
    }

    startAction() {
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.props.resetIssueActions();
        this.props.resetCallAction();
        // this.props.toggleInbox();
    }
    
    toggleInbox() {
       
        this.handleConfirm()
        this.props.openInbox()
    }
    startRecordScreen() {
        this.startAction()
        this.props.JustRecord();
        this.props.setIssueIdToNull();
        this.props.displayFullScrenRecord()
        this.props.showActivitynow();

    }
    startSharingScreen() {
        this.startAction()
        this.props.showActivitynow();
        this.props.displayFullScreShare();
        this.props.resetProjectActions();
    }


    openProfile() {
        window.open("https://twitter.com/" + this.props.twitterHandle, '_blank')
    }
    render() {
          var percentage = "380px";
          if(this.props.redialInitiated && !this.state.redialed){
              this.redial();
            
          }
       
        if (this.props.screenAction === FULL_SCREEN_SHARE ||
            this.props.screenAction === FULL_SCREEN_RECORD) {

            if (this.props.showCanvas || this.props.isSecondScreenSharing) {
                percentage = "100%";
                
            }
           
        }
               

        const {showActivity,showProfile} = this.props;
        const defaultToggle = (this.props.onlinestatus) ? true : false;
        const toolTipValue = !this.props.onlinestatus ? ('Offline - people can not send you share request')
            : ('Online - people can send you share request')
        var notifyBadge = null;
        const onlineOffline = (this.props.isHome) ? (<span className="hint--top " aria-label={toolTipValue}>
            <Toggle
                defaultChecked={defaultToggle}
                className='custom-classname'
                icons={false}
                onChange={() => this.props.changeOnlinestatus((this.props.onlinestatus) ? (0) : (1))}
            />
        </span>) : (null);
        if (this.props.userId === this.props.profileId) {
            notifyBadge = (<NotificationBadge count={this.props.totalUnread} effect={Effect.ROTATE_Y} />
            )
        }

        var label =   (<div className="labelContainerMain">

        <div className="gridLay">
            <div className="pImageContainer">
                <span className="hint--top" aria-label="double tap for details">
                    <img alt="profile pic" src={this.props.profilePic}
                        onDoubleClick={this.props.showProfileNow}
                        className="labelProfilePic"></img>
                </span>
            </div>
            <div className="screenShareBtnLabel">
                <span className="hint--top" aria-label="Share Screen">
                    <IconContext.Provider value={{ color: "#333", size: "25px" }}>
                        <div>
                            < FiCopy style={{ marginTop: "1.5px" }} onClick={this.startSharingScreen} />
                        </div>
                    </IconContext.Provider>
                </span>
            </div>
            <div className="RecordBtnLabel">
                <span className="hint--top" aria-label="Record Screen">
                    <IconContext.Provider value={{ color: "#333", size: "29px" }}>
                        <div>
                            <FiVideo style={{ marginTop: "1.5px" }} onClick={this.startRecordScreen} />
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
                                <FiMail style={{ marginTop: "-1px", marginLeft: "-3px" }} onClick={this.toggleInbox} />
                            </div>
                        </IconContext.Provider>

                    </span>
                </div>
            </div>
            <div className="topSymbolMain">
                {onlineOffline}
              
            </div>
            <div>

            </div>
        </div>
    </div>)
     if(this.props.isSceenSharing ||
        this.props.callAction ||
        this.props.isFullScreenRecording ){
            label = null;
        }

        const shareRecord = showActivity?((this.props.currentAtionStatus === null)?
                    (this.props.screenAction === FULL_SCREEN_RECORD?(
                        (<FullScreenRecord
                            socket={this.props.socket}
                            closeImidiate={this.handleConfirm}
                            reStoreDefault={this.reStoreDefault}
                            savefile={this.props.saveVideoData}
                        />)
                    ):(this.props.screenAction === FULL_SCREEN_SHARE)?(<FullScreenShare
                        socket={this.props.socket}
                        closeImidiate={this.handleConfirm}
                        reStoreDefault={this.reStoreDefault}
                        savefile={this.props.saveVideoData}
                    />):(null)):
                    (<div className="LinkDisplay">
                    <div className="topBtnsActivity">
                        <Button close onClick={this.handleConfirm} />
                        </div>
                    <BusyAction action="share" closeImidiate={this.handleConfirm} currentAtionStatus={this.props.currentAtionStatus} />
                    </div>)):(null)
        
        const profile = (showProfile)?(<Profile
                sharabeLink={this.props.sharabeLink}
                isHome={this.props.isHome} />):(null)
    
         
          return (this.props.donefetchingProfile) ? (<div style={{width:percentage, margin:"auto"}}>
              {label}
            <div >
                {shareRecord}
            </div>
                   
                    <div>
                {profile}
            </div>
            </div >
          

                    //   {shareRecord}
        //                 <div>
        //                       {/* var howtWorksBtn = (<div className="HowTWorksDiv">
        //     <button className="buttonDark" onClick={this.props.toggleHowWorksModal}>How it works</button>
        // </div>) */}
        // </div>

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
    screenAction: state.tools.screenAction,
    donefetchingProfile: state.profile.donefetching,
    totalUnread: state.message.totalInboxNumber,
    email: state.profile.email,
    profilePic: state.profile.profilePic,
    noCreated: state.profile.noCreated,
    noParticipated: state.profile.noParticipated,
    profileId: state.auth.id,
    onlinestatus: state.profile.onlineStatus,
    twitterHandle: state.profile.twitterHandle,
    showActivity:state.profileCard.showActivity,
    showProfile : state.profileCard.showProfile,
    isSecondScreenSharing: state.secondScreenShare.isSecondScreenSharing,
    showCanvas: state.canvasActions.showCanvas,
    isSceenSharing: state.tools.isFullScreenSharing,
    callAction: state.call.callAction,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    redialInitiated : state.redial.redialInitiated


})

export default connect(mapStateToProps, {
    JustRecord,displayFullScrenRecord, displayFullScreShare,
    resetCallAction,hideActivity,hideProfile,showProfileNow,
    setIssueIdToNull, cancelSuccess, cancelAllMessageAction,
    resetValues, restAllToolValue,toggleHowWorksModal,openInbox,
    changeOnlinestatus,
    getAllActivities,
    getAllReferral,
    resetProjectActions,
    showActivitynow,
    resetIssueActions,
    getProfileDetails
})(ProfileCard)


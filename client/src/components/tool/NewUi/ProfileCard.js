import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import Toggle from 'react-toggle';
import BusyAction from './container/BusyAction';
import Profile from './Profile';
import { Redirect } from 'react-router-dom';
import { toggleHowWorksModal } from '../../../actions/modalAction'
import { displayFullScrenRecord, displayFullScreShare } from '../../../actions/toolActions'
import { FULL_SCREEN_RECORD, FULL_SCREEN_SHARE } from '../../../actions/types';
import { showActivitynow, hideContactAct, showContactsAct, hideActivity, hideProfile, showProfileNow } from '../../../actions/ProfileCardAction';
import FullScreenShare from './enitreScreenShare'
import FullScreenRecord from './FullScreenRecord';
import { Button } from 'reactstrap';
import '../../css/toggle.css';
import '../../css/profile.css';
import { registerEndToBrowser } from './container/miscFunction'
import { resetVisitTwitterAction } from '../../../actions/visitProfileAction'
import { confirmAlert } from 'react-confirm-alert';
import { changeOnlinestatus } from '../../../actions/profileAction'
import { cancelSuccess } from '../../../actions/issueActions';
import { FiVideo, FiMail, FiCopy } from "react-icons/fi";
import { MdPermContactCalendar } from "react-icons/md";
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
import ReactCardFlip from 'react-card-flip';
import { openInbox, openCreated } from "../../../actions/navAction";


class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openInboxRed: false, reducedWidth: false,
            rerecord: false, reducedLittleWidth: false,
            twoParts: false, twiHandle: null, redialed: false,
            isFlipped: false, fold: false
        };
        this.handleClick = this.handleClick.bind(this);
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
        this.rerecord = this.rerecord.bind(this);
        this.turnRedialWrong = this.turnRedialWrong.bind(this);
        this.turnReRecordWrong = this.turnReRecordWrong.bind(this);
        this.openInboxLoc = this.openInboxLoc.bind(this);
    }
    handleClick(e) {
        e.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }

    redial() {
        this.setState({ redialed: true })
        this.startSharingScreen();
    }
    rerecord() {
        this.setState({ rerecord: true });
        this.startRecordScreen();
    }
    handleCancel() {

    }
    openInboxLoc() {
        this.handleConfirm()
        this.setState({ openInboxRed: !this.state.openInboxRed })


    }
    reStoreDefault = () => {
        if (this.props.screenAction !== null && !this.props.isSharingCompleted && !this.props.isFullSharingCompleted) {

            confirmAlert({
                title: "Are you sure?",
                message: "You won't be able to revert this!",
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            this.handleConfirm();
                            registerEndToBrowser();
                        }
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
    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        this.setState({ redialed: false });
        this.startSharingScreen()
    }
    turnRedialWrong() {
        this.setState({ redialed: false });
    }
    turnReRecordWrong() {
        this.setState({ rerecord: false });
    }

    handleConfirm() {
        this.props.hideActivity();
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.props.resetCallAction();
        // this.props.showActivitynow();

        // this.props.startAction();
        // this.props.displayFullScreShare();
        // constructor()
        if (this.props.isHome) {
            this.props.resetVisitTwitterAction();
        }
        setTimeout(() => {
            this.startSharingScreen();
        }, 500)
    }
    resize() {
        this.setState({ reducedWidth: window.innerWidth <= 700 });
        this.setState({ reducedLittleWidth: window.innerWidth <= 1200 });
    }

    componentWillMount() {
        const { userId, profileId, getProfileDetails, getAllActivities, getAllReferral } = this.props;
        const path = (window.location.pathname).split('/');
        if (userId === profileId)
            getProfileDetails(userId, config.SELF)
        else {
            this.props.getProfileDetails(userId, config.VISIT_PROF);
        }
        if (path.length === 3) {
            this.setState({ twoParts: false })
        }
        else {
            this.setState({ twoParts: true, twiHandle: (path[1]) })
        }

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
    componentWillReceiveProps(nextProps) {
        if (nextProps.redialInitiated || nextProps.reRecordInitiated) {
            if (nextProps.redialInitiated && !this.state.redialed)
                this.redial();
            if (nextProps.reRecordInitiated && !this.state.rerecord)
                this.rerecord()
        }
    }
    toggleInbox() {

        this.props.openInbox()
        this.handleConfirm();

    }
    componentWillReceiveProps(nextProps) {
        // if(nextProps.screenAction){
        //     if(nextProps.screenAction===)
        // }
    }
    startRecordScreen() {
        if (!this.props.showActivity || (this.props.showActivity && this.props.screenAction === FULL_SCREEN_SHARE)) {
            this.startAction()
            this.props.JustRecord();
            this.props.setIssueIdToNull();
            this.props.displayFullScrenRecord()
            this.props.showActivitynow();
        }

    }
    startSharingScreen() {
        // if(!this.props.showActivity || (this.props.showActivity && this.props.screenAction === FULL_SCREEN_RECORD)){
        this.startAction()
        this.props.showActivitynow();
        this.props.displayFullScreShare();
        this.props.resetProjectActions();
        // }
    }


    openProfile() {
        window.open("https://twitter.com/" + this.props.twitterHandle, '_blank')
    }
    render() {
        var percentage = "380px";
        const folding = (this.props.isSceenSharing ||
            this.props.callAction ||
            this.props.isFullScreenRecording) ? (null) : ((!this.state.fold) ? (
                <div onClick={this.startRecordScreen}
                    onMouseOver={() => this.setState({ fold: true })}
                    style={{ position: "absolute", right: "-15px", width: "1em", height: "1em", backgroundColor: "white" }}>
                    <div
                        style={{
                            position: "absolute",
                            width: "0",
                            height: "0",
                            borderStyle: "solid",
                            borderWidth: "1em 1em 0 0 ",
                            borderColor: "transparent #43a8ac transparent  transparent "
                        }}>
                    </div></div>) : (this.props.screenAction !== FULL_SCREEN_RECORD ? <span>
                        <div onMouseLeave={() => this.setState({ fold: false })} onClick={this.startRecordScreen} className="fold">
                            <FiVideo style={{ fontSize: "10px", marginTop: "-43px", marginRight: "-35px" }} />
                        </div>
                    </span> : <span>
                            <div onMouseLeave={() => this.setState({ fold: false })} onClick={this.startSharingScreen} className="fold">
                                <FiCopy style={{ fontSize: "10px", marginTop: "-43px", marginRight: "-35px" }} />
                            </div>
                        </span>))
        const { showActivity, showProfile, showContacts, hideContactAct, showContactsAct } = this.props;

        const contactBtn = ({ margintop: "10px", marginRight: "5px" });


        if (this.props.showCanvas || this.props.isSecondScreenSharing)
            percentage = "80%";
        const condition = !this.props.isHome && !this.props.onlinestatus;
        const gridTwoIt = (condition) ? ({ gridTemplateColumns: "30% 27% 27% 16%" }) : ({});
        const shareIcon = (condition) ? (null) : (<div className="profileLabelBtn">
            <span className="hint--top" aria-label="Share Screen">
                <IconContext.Provider value={{ color: "#206f72", size: "24px" }}>
                    <div>
                        < FiCopy style={{ marginTop: "2.5px" }} onClick={this.startSharingScreen} />
                    </div>
                </IconContext.Provider>
            </span>
        </div>);
        const contactBtnDiv = (!this.props.showProfile || !this.props.isHome) ? (
            <div style={{marginTop:"-0px"}}onClick={!showContacts ? showContactsAct : hideContactAct} ><span className="hint--top" aria-label="Contacts!">
                <MdPermContactCalendar style={{ fontSize: "25px", color: "#206f72" }} />
            </span></div>) : (null);
        const defaultToggle = (this.props.onlinestatus) ? true : false;
        const toolTipValue = !this.props.onlinestatus ? ('Offline - people can not send you share request')
            : ('Online - people can send you share request')
        var notifyBadge = null;
        const onlineOffline = (this.props.isHome) ? (<span className="hint--left " aria-label={toolTipValue}>
            <Toggle
                defaultChecked={defaultToggle}
                className='custom-classname'
                icons={false}
                onChange={() => this.props.changeOnlinestatus((this.props.onlinestatus) ? (0) : (1))}
            />
        </span>) : (null);
        var label = this.props.isHome ? (<div>
            <div style={{ width: '100%', height: "35px", display: "grid", gridTemplateColumns: "25% 50% 25%" }}>
                <div style={{ textAlign: "left" }}>           <span className="hint--top" aria-label="Activities!">
                    {notifyBadge}
                    <IconContext.Provider value={{ color: "#206f72", size: "25px" }}>
                        <FiMail style={{ marginTop: "-1px", marginLeft: "-3px" }} onClick={this.openInboxLoc} />
                    </IconContext.Provider>
                </span>
                </div>
                <div></div>
                <div style={{ textAlign: "right" }}>
                    {onlineOffline}
                </div>
            </div>
            <div style={{ margin: "auto" }}>
                <span className="hint--top" aria-label="double tap for details">
                    <img alt="profile pic" width="82px" height="82px" src={this.props.profilePic}
                        onDoubleClick={this.props.showProfileNow} style={{ borderRadius: "50%" }}></img>
                    {/* className="labelProfilePic"></img> */}
                </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "25% 50% 25%", marginTop: "20px" }}>
                <div>
                    {/* {contactBtnDiv} */}
                </div>
                <div></div>
                <div>
                </div>
            </div>
            <div style={{ width: "100%", height: "1px", backgroundColor: "#43a8ac", marginTop: "30px" }}></div>
            <div style={{ height: "15px", textAlign: "right", width: "100%" }}>
                {contactBtnDiv}
            </div>
        </div>) : (<div><div style={{ margin: "auto", marginTop: "15px" }}>
            <span className="hint--top" aria-label="double tap for details">
                <img alt="profile pic" width="82px" height="82px" src={this.props.profilePic}
                    onDoubleClick={this.props.showProfileNow} style={{ borderRadius: "50%" }}></img>
                {/* className="labelProfilePic"></img> */}
            </span>
        </div>
            <div style={{ width: "30%", margin: "auto", display: "grid", gridTemplateColumns: "35% 30% 35%", marginTop: "20px" }}>
              
                
                <div style={{ textAlign: "left" }}>           <span className="hint--top" aria-label="Activities!">
                    {notifyBadge}
                    <IconContext.Provider value={{ color: "#206f72", size: "25px" }}>
                        <FiMail style={{ marginTop: "-1px", marginLeft: "-3px" }} onClick={this.openInboxLoc} />
                    </IconContext.Provider>
                </span>
                </div>
                <div></div>
                <div>
                    {contactBtnDiv}
                </div>


            </div></div>);
        if (this.props.isSceenSharing ||
            this.props.callAction ||
            this.props.isFullScreenRecording) {
            label = null;
        }

        if (this.props.userId === this.props.profileId) {
            notifyBadge = (<NotificationBadge count={this.props.totalUnread} effect={Effect.ROTATE_Y} />
            )
        }

        const profile = (showProfile) ? (<Profile
            sharabeLink={this.props.sharabeLink}
            isHome={this.props.isHome} />) : (null);
        const fineShareFront = ((this.props.screenAction === FULL_SCREEN_SHARE)?(<FullScreenShare
                turnRedialWrong={this.turnRedialWrong}
                closeImidiate={this.handleConfirm}
                reStoreDefault={this.reStoreDefault}
                savefile={this.props.saveVideoData}
            />):(null))
        const fineShareBack = (this.props.screenAction === FULL_SCREEN_RECORD) ?
            (<FullScreenRecord
                turnReRecordWrong={this.turnReRecordWrong}
                closeImidiate={this.handleConfirm}
                reStoreDefault={this.reStoreDefault}
                savefile={this.props.saveVideoData}
            />) :(null)
           


        const shareRecord = this.props.isHome?(showActivity ? ((this.props.currentAtionStatus === null) ? (
            this.props.isAauthenticated ?
                (<ReactCardFlip isFlipped={this.props.screenAction === FULL_SCREEN_RECORD} flipDirection="horizontal">
                    <div key="front" style={{ borderStyle: "none", borderWidth: "1px", borderColor: "#ddd" }}>
                        <h5 style={{ color: "transparent", height: "1px", fontSize: "1px" }}>ScreenSHare</h5>
                        <IconContext.Provider value={{ color: "#206f72", size: "23px" }}>
                            {fineShareFront}
                        </IconContext.Provider>
                        {folding}
                    </div>
                    <div key="back" style={{ borderStyle: "none", borderWidth: "1px", borderColor: "#ddd" }}>
                        <h5 style={{ color: "transparent", height: "1px", fontSize: "1px" }}>ScreenRecord</h5>
                        <IconContext.Provider value={{ color: "#206f72", size: "23px" }}>
                            {fineShareBack}
                        </IconContext.Provider>
                        {folding}

                    </div>
                </ReactCardFlip>) : ((<div className="LinkDisplay">
                    <div className="topBtnsActivity">
                    </div>
                    <p>You need to signin to proceed</p>
                </div>))
        ) : (<div className="LinkDisplay">
            <div className="topBtnsActivity">
            </div>
            <BusyAction action="share" closeImidiate={this.handleConfirm} currentAtionStatus={this.props.currentAtionStatus} />
        </div>)) : (null)):(null)




        var labelDiv = (<div className="labelContainerMain" style={{ minHeight: "200px" }}>
            <div style={{ testAlign: "center" }}>

                {label}
                {shareRecord}
                {profile}


            </div>
            <div className="topSymbolMain">

                <br />

                <div>

                </div>
            </div>
        </div>)
        if (this.props.isSceenSharing ||
            this.props.callAction ||
            this.props.isFullScreenRecording) {
            label = null;
        }




        return ((!this.state.openInboxRed) ? ((this.props.donefetchingProfile) ? (<div style={{ width: percentage, margin: "auto" }}>
            {labelDiv}
            <div >
                {/* {shareRecord} */}
            </div>
            {/* <div>
                {contactListDiv}   
            </div> */}

            <div>
                {/* {profile} */}
            </div>
        </div >) : (null)) : ((!this.state.twoParts ? (<Redirect push to={{ pathname: './activities' }} />) :
            (<Redirect push to={{ pathname: './' + this.state.twiHandle + '/activities' }} />))
            ));


        //   {shareRecord}
        //                 <div>
        //                       {/* var howtWorksBtn = (<div className="HowTWorksDiv">
        //     <button className="buttonDark" onClick={this.props.toggleHowWorksModal}>How it works</button>
        // </div>) */}
        // </div>


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
    isAauthenticated: state.auth.isAuthenticated,
    onlinestatus: state.profile.onlineStatus,
    twitterHandle: state.profile.twitterHandle,
    showActivity: state.profileCard.showActivity,
    showProfile: state.profileCard.showProfile,
    showContacts: state.profileCard.showContacts,
    isSecondScreenSharing: state.secondScreenShare.isSecondScreenSharing,
    showCanvas: state.canvasActions.showCanvas,
    isSceenSharing: state.tools.isFullScreenSharing,
    callAction: state.call.callAction,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    redialInitiated: state.redial.redialInitiated,
    reRecordInitiated: state.redial.reRecordInitiated,
    inbox: state.nav.openInbox

})

export default connect(mapStateToProps, {
    JustRecord, displayFullScrenRecord, displayFullScreShare,
    resetCallAction, hideActivity, hideProfile, showProfileNow,
    setIssueIdToNull, cancelSuccess, cancelAllMessageAction,
    resetValues, restAllToolValue, toggleHowWorksModal, openInbox,
    changeOnlinestatus, resetVisitTwitterAction, openCreated,
    getAllActivities, showContactsAct, hideContactAct,
    getAllReferral,
    resetProjectActions,
    showActivitynow,
    resetIssueActions,
    getProfileDetails
})(ProfileCard)


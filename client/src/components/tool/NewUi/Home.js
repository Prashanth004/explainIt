import React, { Component } from 'react'
import '../../css/newlanding.css'
import '../../css/NewSignin.css'
import Navbar from './Navbar';
import BusyAction from './container/BusyAction';
import ExplinerVideoModal from './container/explainerModal';
import ExtCloseBtn from './container/modalExtButton'
import EmailVarify from './emailvarify'
import { MdCallEnd, MdCall } from "react-icons/md";
import Activity from './Activies/indexActivity'
import DisplatCreated from './diaplyissues/DisplayCreated';
import { cancelSuccess } from '../../../actions/issueActions'
import Inboxfeed from './Inboxfeed';
import {initGA,loadPageView} from './container/ReactGa';
import Profile from './Profile'
import { getProfileDetails } from '../../../actions/profileAction';
import { displayFullScrenRecord, displayFullScreShare } from '../../../actions/toolActions'
import { getTotalUnread } from '../../../actions/messageAction'
import FullScreenShare from './enitreScreenShare'
import FullScreenRecord from './FullScreenRecord'
import socketIOClient from "socket.io-client";
import { Redirect } from 'react-router-dom';
import { creatAnsProject } from '../../../actions/projectActions'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css' 
import { Button, Modal, ModalBody } from 'reactstrap';
// import { Spinner } from 'reactstrap';
import IssueDetils from '../../issueModal'
import { connect } from 'react-redux';
import { SCREEN_SHARE, SCREEN_RECORD, FULL_SCREEN_RECORD, FULL_SCREEN_SHARE } from '../../../actions/types';
import CopyToClipboard from '../CopytoClipboard'
import { setIssueId } from '../../../actions/issueActions';
import { fetchProjectbyIssue, clearAnswers } from '../../../actions/projectActions';
import { stillAuthenicated } from '../../../actions/signinAction';
import PropType from 'prop-types';
import { FiGrid, FiList } from "react-icons/fi";
import { resetValues } from '../../../actions/twitterApiAction'
import Swal from 'sweetalert2'
import config from '../../../config/config';
import { resetCallAction, getAllActivities } from '../../../actions/callAction'
import ProfileCard from './ProfileCard'
import IssueDisplay from './diaplyissues/DisplayIssues'
import Content from './Content';
import {varifyEmail} from '../../../actions/emailAction'

import { saveExtensionDetails } from "../../../actions/extensionAction";
import { restAllToolValue } from "../../../actions/toolActions";
import { acceptCallDetails } from '../../../actions/callAction';
import { answerCall, missCall } from '../../../actions/callAction';
import { openParticipated, openInbox, openCreated } from "../../../actions/navAction";
import { cancelAllMessageAction } from '../../../actions/messageAction'


class NewHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalTool: false,
            showCreatedIssue: false,
            showParticipatedIssue: false,
            showProjects: false,
            displayLink: false,
            isHome: true,
            socket: null,
            showDetails: false,
            typeOfView: "list",
            displayDetails: false,
            reducedWidth: false,
            callerId: null,
            endedCallFromOtherPeer: false,
            newCall:true,
            reducedLittleWidth:false,
            currentAtionStatus:null,
            showExplainerVideo:false
        }
        this.togglemodal = this.togglemodal.bind(this)
        this.explainTool = this.explainTool.bind(this)
        this.toggleModalCreate = this.toggleModalCreate.bind(this)
        this.toodleExplain = this.toodleExplain.bind(this);
        this.toggleCreatedIssue = this.toggleCreatedIssue.bind(this);
        this.toggleParticipatedIssue = this.toggleParticipatedIssue.bind(this);
        this.closeParticipated = this.closeParticipated.bind(this);
        this.reStoreDefault = this.reStoreDefault.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.toggleDisplayLink = this.toggleDisplayLink.bind(this);
        this.answerCall = this.answerCall.bind(this);
        this.rejectCall = this.rejectCall.bind(this);
        this.openDtailsTab = this.openDtailsTab.bind(this);
        this.changeViewToList = this.changeViewToList.bind(this);
        this.changeViewToGrid = this.changeViewToGrid.bind(this);
        this.shareFullScreenShare = this.shareFullScreenShare.bind(this);
        this.recordFullScreen = this.recordFullScreen.bind(this);
        this.toggleInbox = this.toggleInbox.bind(this);
        this.saveVideoData = this.saveVideoData.bind(this);
        this.showInbox = this.showInbox.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.toggleExplainerVideo = this.toggleExplainerVideo.bind(this);
    
    }
    toggleDisplayLink() {
        this.setState({
            displayLink: !this.state.displayLink,
            showDetails: false,
            displayDetails: false
        })
    }
    resize() {
        this.setState({ reducedWidth: window.innerWidth <= 700 });
        this.setState({reducedLittleWidth : window.innerWidth <= 1000});
    }

    
    saveVideoData(videoData, audioData, isPublic, text, action) {
        var condition = this.props.issueId == null || this.props.issueId === undefined
        var issueId = (condition)?null:this.props.issueId;
        var imgData = "null";
        var items = {}
        const isquestion = (condition)?"true":"false"
        this.props.creatAnsProject(text, imgData, videoData, audioData, items, isquestion, issueId, isPublic, action)
    }
    reloadPage(event) {
        if (event.key === 'token') {
            window.location.reload();
        }
        if(event.key === 'currentAction'){
            const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
            this.setState({currentAtionStatus:currentAtionStatus})
        }
       
    }
    openDtailsTab() {
        this.setState({
            showDetails: !this.state.showDetails,
            displayDetails: false,
            displayLink: false
        })
    }

    closeParticipated() {
        this.setState({
            showProjects: false,
            showParticipatedIssue: false,
            showCreatedIssue: false,
        })
    }

  
    componentWillUnmount(){
        window.removeEventListener('storage',this.reloadPage)
        window.removeEventListener("resize", this.resize());
    }
    componentDidMount() {
        initGA();
        loadPageView();
        window.addEventListener('storage',this.reloadPage)
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        var self = this
        function postMessageHandler(event) {

            if (event.data === 'rtcmulticonnection-extension-loaded') {

                self.setState({
                    source: event.source,
                    origin: event.origin,
                    gotmessage: true
                })
                self.props.saveExtensionDetails(event.source, event.origin)
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }

        var socket = this.state.socket
        socket.on(config.UPDATE_BADGE, data => {
            if (data.userId === this.props.userId) {
                this.props.getTotalUnread()
            }
        })
        socket.on(config.END_WHILE_DIALING, data => {
            if (data.ToUserId === this.props.userId) {
                this.setState({ endedCallFromOtherPeer: true })
            }
        })
        socket.on(config.ENDING_RING, data => {
            if (data.ToUserId === this.props.userId) {

                socket.emit(config.ENDING_RING_ACK, {
                    "ToUserId": data.fromUserId
                })
            }
        })

        socket.on(config.SAVED_NEW_PROJECT, data => {
           
            if (data.userId === this.props.userId) {
               
                this.props.getProfileDetails(this.props.userId, config.SELF)
            }
        })
    
        socket.on(config.NEW_MESSAGE, data => {

            if (data.touser === (this.props.userId) || data.fromuser === (this.props.userId)) {
                this.props.getTotalUnread();
                this.props.getAllActivities()
            }
        })
        socket.on('connect_failed', function () {
            console.log("connection failed : ")
        })
        socket.on('error', function (err) {
            console.log("socket error : ",err)
        });
        socket.on('connect_timeout', function (err) {
            console.log("socket onnection_timeout : ",err)
        });
        socket.on("disconnect", () => {
            console.log("socket disconnected")
        })
        socket.io.on("connect_error", () => {
            console.log("connection_error")
        })


        socket.on(config.LINK_TO_CALL, data => {
            self.setState({endedCallFromOtherPeer:false})
            setTimeout(() => {
                this.props.missCall();
            }, 18000)
            localStorage.setItem("profilePic", data.fromProfilePic)
            if (String(data.ToUserId) === this.props.userId) {
                socket.emit(config.LINK_TO_CALL_ACK, {
                    "fromUserId": data.fromUserId,
                    "toUserId": data.toUserId
                })
                this.setState({
                    callerId: data.fromUserId
                })
                this.props.acceptCallDetails(
                    data.link,
                    data.fromEmail,
                    data.fromUserName,
                    data.fromUserId,
                    data.fromProfilePic
                )
            }
        });
    }
    componentWillMount() {
        const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
        this.setState({currentAtionStatus:currentAtionStatus})
        this.props.varifyEmail()
        this.props.stillAuthenicated()
        this.props.getTotalUnread();
        // io.connect(sURL, {transports:['websocket'], upgrade: false}, {'force new connection': true})
        const socket = socketIOClient(config.base_dir,{transports: ['websocket']},{origins:"*"});
        socket.on('reconnect_attempt', () => {
            socket.io.opts.transports = ['polling', 'websocket'];
          });
        this.setState({
            socket: socket
        })

    }
    toodleExplain() {
        localStorage.setItem("issueId", null)
        this.setState({
            openExplain: !this.state.openExplain,
            showCreatedIssue: false,
            showParticipatedIssue: false
        })
    }
    toggleInbox() {
        this.setState({
            showProjects: true,
            openExplain: false,
            showDetails: false
        })
        this.handleConfirm()
        this.props.openInbox()
    }
    toggleCreatedIssue() {
        this.setState({
            showDetails: false,
            displayDetails: false,

        })

        this.setState({
            showProjects: true,
            openExplain: false
        })
        this.props.openCreated()
    }
    toggleParticipatedIssue() {
        this.setState({
            showDetails: false,
            displayDetails: false,
        })
        this.setState({
            showProjects: true,
            openExplain: false
        })
        this.props.openParticipated()
    }
    recordFullScreen() {
        this.setState({
            showDetails: false,
            displayLink: false
        })
        if (!this.state.displayDetails) {
            this.setState({
                displayDetails: true
            })
            this.props.displayFullScrenRecord()
        }
        else {
            this.setState({
                displayDetails: false
            })
        }
    }
    toggleExplainerVideo(){
    this.setState({
        showExplainerVideo:!this.state.showExplainerVideo
    })
}
    showInbox() {
        this.setState({
            showDetails: false,
            displayLink: false
        })
        if (!this.state.displayDetails) {
            this.setState({
                displayDetails: true
            })
            this.props.displayInox()
        }
        else {
            this.setState({
                displayDetails: false
            })
        }
    }

    shareFullScreenShare() {
        this.setState({
            showDetails: false,
            displayLink: false
        })
        if (!this.state.displayDetails) {
            this.setState({
                displayDetails: true
            })
            localStorage.setItem('issueId', null)
            this.props.displayFullScreShare()
        }
        else {
            this.setState({
                displayDetails: false
            })
        }
    }


    toggleModalCreate = () => {
        if (this.props.isAauthenticated) {
            this.props.setIssueId(null)
            localStorage.setItem("issueId", null)
            window.open(config.react_url + '/explainIt', "_blank")
        }
        else {
            Swal.fire(
                'You should login'
            )
        }
    }
    togglemodal = (e) => {
        var idOfClicked = e.target.id;
        var classOfClicked = e.target.className


        if (classOfClicked !== "singleMember" && classOfClicked !== "sharableLink" && classOfClicked !== "linkElementSym" && classOfClicked !== "hint--top" && classOfClicked !== "explainAnswer" && classOfClicked !== "displayPeople" && classOfClicked !== "likes" && classOfClicked !== "numberOfPeople" && idOfClicked !== "explainIt" && idOfClicked !== "audio" && idOfClicked !== "tweet" && idOfClicked !== "shareScreen" && idOfClicked !== "imageOfPeople" && classOfClicked !== "buttonDark explainItBtn") {
            if (this.state.modal === false) {
                this.props.clearAnswers(e.target.id)
                this.props.fetchProjectbyIssue(e.target.id);
            }
            this.setState({
                modal: !this.state.modal
            });
        }
    }
    answerCall() {
        window.open(this.props.callActionLink);
        this.props.answerCall();
        var socket = this.state.socket;

        socket.emit(config.ACCEPT_SHARE_REQUEST, {
            'toUserId': this.state.callerId,
            'message': config.REPLY_TO_SHARE_REQ
        })
    }
    rejectCall() {
        var socket = this.state.socket
        socket.emit(config.REJECT_REPLY, {
            'toUserId': this.state.callerId,
            'message': config.REPLY_TO_SHARE_REQ
        })
        this.props.answerCall();
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
    screenShareWindow() {
        var href = config.react_url + "/sharescreen"
        var width = window.innerHeight * (3 / 4),
            height = window.innerHeight * (3 / 4),
            top = 10,
            left = 10,
            url = href,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;
        window.open(url, 'explain', opts);
    }

    handleConfirm() {
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.props.resetCallAction();
        this.setState({
            displayDetails: false
        })
    }
    explainTool = (e) => {
        if (this.props.isAauthenticated) {
            this.props.setIssueId(e.target.id)
            localStorage.setItem("issueId", e.target.id)
            window.open(config.react_url + '/explainIt', "_blank")
        }
        else {
            Swal.fire(
                'You should login'
            )
        }
    }
    changeViewToList() {
        this.setState({
            typeOfView: "list"
        })
    }
    changeViewToGrid() {
        this.setState({
            typeOfView: "grid"
        })
    }

    render() {
        var issuepercentage = "59%";
        var percentage = "45%";
        var displayLinkDiv = null;
        var profileCardElement = null;
        var listGrid= (window.innerWidth>=1000 )?(<div style={{ marginRight:"-80px",float: "right" }} >
        <span  className="hint--top" aria-label="List View">
            <FiList onClick={this.changeViewToList} className="listView" />
        </span>
        <span className="hint--top" aria-label="Grid View">
            <FiGrid onClick={this.changeViewToGrid} className="gridView" />
        </span>
    </div>):(null)
        if (this.state.reducedWidth) {
            issuepercentage = "100%"
        }
        if (this.props.screenAction === SCREEN_RECORD ||
            this.props.screenAction === SCREEN_SHARE) {
            percentage = "10%";
        }
        else {
            if (this.props.screenAction === FULL_SCREEN_SHARE ||
                this.props.screenAction === FULL_SCREEN_RECORD) {

                if (this.state.reducedWidth || this.props.showCanvas || this.props.startSecodScreenShare) {
                    percentage = "76%";
                    listGrid=null}
                else if(this.state.reducedLittleWidth){
                    percentage = "42%";
                    listGrid=null
                }
                else {
                    percentage = "30%";}
            }
            else {
                if (this.state.reducedWidth || this.props.showCanvas || this.props.startSecodScreenShare) {
                    percentage = "100%";
                }
                else {
                    percentage = "30%";
                }
            }
        }
        var howtWorksBtn = (<div className="HowTWorksDiv">
        <button className="buttonDark" onClick={this.toggleExplainerVideo}>How it works</button>
    </div>)

        var shareRecord = null
        if (!this.props.inbox && !this.props.created && !this.props.participated) {
            if (this.props.screenAction === FULL_SCREEN_RECORD) {
                howtWorksBtn = null
                shareRecord =  (this.state.currentAtionStatus === null)?(<FullScreenRecord
                    socket={this.state.socket}
                    closeImidiate={this.handleConfirm}
                    reStoreDefault={this.reStoreDefault}
                    savefile={this.saveVideoData}
                />):(<div className="LinkDisplay">
               <div className="topBtnsActivity"><Button close onClick={this.handleConfirm} /></div>
                <BusyAction  action="record"currentAtionStatus = {this.state.currentAtionStatus}/>
                </div>)
            }
            else if (this.props.screenAction === FULL_SCREEN_SHARE) {
                howtWorksBtn = null
                shareRecord = (this.state.currentAtionStatus === null)?(<FullScreenShare
                    toggleInbox={this.toggleInbox}
                    socket={this.state.socket}
                    closeImidiate={this.handleConfirm}
                    reStoreDefault={this.reStoreDefault}
                    savefile={this.saveVideoData}
                />):(<div className="LinkDisplay">
                <div className="topBtnsActivity"><Button close onClick={this.handleConfirm} /></div>
                <BusyAction  action="share"currentAtionStatus = {this.state.currentAtionStatus}/>
                </div>)
            }
            else {
                shareRecord = (<Inboxfeed />)
            }
        }
        const activityDiv = (this.state.displayDetails) ? (
            <div style={{ width: percentage, margin: "auto" }}>
                {shareRecord}
            </div>
        ) : (null)
        const details = (this.state.showDetails) ? (((this.props.inbox || this.props.created || this.props.participated) ? (
            null
        ) : (<Profile
            openDtailsTab={this.openDtailsTab}
            isHome={this.state.isHome} />))

        ) : (null)

        const externalCloseBtn = <ExtCloseBtn toggle={this.toggleExplainerVideo}/>;
        // var self = this
        var sharabeLink = config.react_url + "/" + this.props.twitterHandle
        var deatilsModal = null
        if (this.props.myissues !== null)
            var issuesCreated = (this.props.myissues)
        var feedDiv = null;

       

        const callNotificationDiv = (this.props.incommingCall && !this.state.endedCallFromOtherPeer) ? (
            <div className="callNotification">
                <div>
                    <div className="callerProfileImage">
                        <img alt="caller profile Pic" className="callerProfileImageElement" src={this.props.callerProfilePic} />
                    </div>
                    <audio style={{ display: "none" }} autoPlay loop src={require('../../audio/simple_beep.mp3')}></audio>
                    <p>{this.props.callerName}</p>
                    <div className="acceptRejectDiv">
                        <span className="hint--top" aria-label="Accept Request">
                            <div onClick={this.answerCall} className="acceptCall">
                                <MdCall />
                            </div>
                        </span>
                        <span className="hint--top" aria-label="Ask to send recording">
                            <div onClick={this.rejectCall} className="acceptCall reject">
                                <MdCallEnd />
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        ) : (null)

        deatilsModal = (<IssueDetils />)

        if (this.props.isAauthenticated) {
            if (!this.props.incommingCall && (this.props.participated || this.props.created)) {
                var participatedDiv = (this.state.typeOfView === "list") ? (
                    <div className="issueContainer" style={{ width: issuepercentage }} >
                        <div className="closeBtnHolder">
                        </div>
                        <IssueDisplay socket={this.state.socket}togglemodal={this.togglemodal} home={config.HOME} explainTool={this.explainTool} />
                    </div>
                ) : (<div className="issueContainer" style={{ width: "80%" }} >

                    <div className="closeBtnHolder">
                    </div>
                    <DisplatCreated socket={this.state.socket} home={config.HOME} issueArray={(this.props.participated) ? this.props.participatedIssues : issuesCreated} />
                </div>)
                feedDiv = (<div>
                   {listGrid}
                        {participatedDiv}
                    </div>)

            }
            else if (this.props.inbox) {
                feedDiv = (<Activity userId={this.props.userId} />)
            }
            else {

            }
        }


        if (this.props.isAauthenticated) {
            if (this.props.screenAction === SCREEN_RECORD ||
                this.props.screenAction === SCREEN_SHARE ||
                this.props.isSceenSharing ||
                this.props.callAction ||
                this.props.isFullScreenRecording ||
                this.props.participated ||
                this.props.inbox ||
                this.props.created) {
                profileCardElement = null;
                howtWorksBtn = null

            }
            else if (this.props.userId !== null) {
                if (this.state.displayLink &&
                    !this.props.incommingCall &&
                    !this.props.inbox &&
                    !this.props.created &&
                    !this.props.participated
                ) {
                    howtWorksBtn=null;
                    displayLinkDiv = (<div className="sharableLinkSection">
                        <div className="topBtnsActivity">
                        <Button close onClick={this.toggleDisplayLink} />
                        </div>
                        <br/>
                        <p style={{fontWeight:"500"}}>Your shareable Profile Link</p>
                        <CopyToClipboard sharablelink={sharabeLink} />
                    </div>)
                }
                else {
                    displayLinkDiv = null
                }


                profileCardElement = (
                    <div className="ProfileDiv">
                        <ProfileCard
                        isHome={this.state.isHome}
                        toggleInbox={this.toggleInbox}
                        sharabeLink={sharabeLink}
                        openDtailsTab={this.openDtailsTab}
                        userId={this.props.userId}
                        shareFullScreenShare={this.shareFullScreenShare}
                        showInbox={this.showInbox}
                        recordFullScreen={this.recordFullScreen}
                        toggleDisplayLink={this.toggleDisplayLink}
                        toggleCreatedIssue={this.toggleCreatedIssue}
                        toggleParticipatedIssue={this.toggleParticipatedIssue} />
                        {displayLinkDiv}

                    </div>
                )
            }
        }
        else {
            profileCardElement = (<Content />)
        }
       
        return (this.props.authAction && this.props.doneVarification) ? ((!this.props.isAauthenticated) ? (<Redirect to={"../"} />) : (
            (!this.props.isVarified)?(<EmailVarify /> ):(
            <div className="fullHome">
                <Navbar />

                <div className="containerHome">
                    {callNotificationDiv}
                    <div>
                        {profileCardElement}
                       
                    </div>
                    {activityDiv}
                    <div>
                        {feedDiv}
                    </div>
                    <div>
                        {details}
                    </div>
                    {howtWorksBtn}
                    
                </div>
                <Modal  size='lg' centered ={true} isOpen={this.state.showExplainerVideo} toggle={this.toggleExplainerVideo} external={externalCloseBtn}>
                        <ExplinerVideoModal />
                </Modal>
                <Modal isOpen={this.state.modal} toggle={this.togglemodal} className={this.props.className} external={externalCloseBtn}>
                    <ModalBody className="modalBody">
                        {deatilsModal}
                    </ModalBody>
                </Modal>
                {/* {iframe} */}
            </div>
        ))) : (null)


    }
}
NewHome.PropType = {
    issues: PropType.array.isRequired,
    fetchProjectbyIssue: PropType.func.isRequired,
    setIssueId: PropType.func.isRequired,
    saveExtensionDetails: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    acceptCallDetails: PropType.func.isRequired,
    answerCall: PropType.func.isRequired,
    missCall: PropType.func.isRequired,
    openParticipated: PropType.func.isRequired,
    openCreated: PropType.func.isRequired,
    cancelAllMessageAction: PropType.func.isRequired,
    resetValues: PropType.func.isRequired,
    creatAnsProject: PropType.func.isRequired,
    openInbox: PropType.func.isRequired,
   
    resetCallAction: PropType.func.isRequired,
    getProfileDetails: PropType.func.isRequired,
    getAllActivities: PropType.func.isRequired,
    varifyEmail:PropType.func.isRequired
};
const mapStateToProps = state => ({
    doneVarification : state.email.doneVarification,
    isVarified:state.email.isVarified,
    issues: state.issues.items,
    screenAction: state.tools.screenAction,
    isSharingCompleted: state.tools.isSharingCompleted,
    isFullSharingCompleted: state.tools.isFullSharingCompleted,
    newissueIem: state.issues.newissueIem,
    isAauthenticated: state.auth.isAuthenticated,
    profilePic: state.auth.profilePic,
    userName: state.auth.userName,
    myissues: state.profile.myIssues,
    participatedIssues: state.profile.participatedIssue,
    twitterHandle: state.profile.twitterHandle,
    email: state.auth.email,
    userId: state.auth.id,
    callerName: state.call.userName,
    callerId: state.call.id,
    callerProfilePic: state.call.profilePic,
    callActionLink: state.call.link,
    incommingCall: state.call.incommingCall,
    authAction: state.auth.authAction,
    participated: state.nav.openParticipated,
    created: state.nav.openCreated,
    inbox: state.nav.openInbox,
        isSceenSharing: state.tools.isFullScreenSharing,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    showCanvas: state.canvasActions.showCanvas,
    issueId: state.issues.currentIssueId,
    startSecodScreenShare: state.secondScreenShare.secondScreenShareStarted,
    callAction: state.call.callAction,
    



})

export default connect(mapStateToProps, {
    answerCall,
    openCreated,
 
    resetCallAction,
    getAllActivities,
    cancelAllMessageAction,
    openParticipated,
    missCall,
    restAllToolValue,
    acceptCallDetails,
    saveExtensionDetails,
    openInbox,
    getProfileDetails,
    fetchProjectbyIssue,
    setIssueId,
    varifyEmail,
    getTotalUnread,
    displayFullScrenRecord,
    displayFullScreShare,
    creatAnsProject,
    cancelSuccess,
    clearAnswers, stillAuthenicated,
    resetValues
})(NewHome)

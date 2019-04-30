import React, { Component } from 'react'
import '../../css/newlanding.css'
import Navbar from './Navbar'
import DisplatCreated from './DisplayCreated'
import Inbox from './Inbox';
import Profile from './Profile'
import { getProfileDetails } from '../../../actions/profileAction';
import {getAllMessages} from '../../../actions/messageAction'
import { displayFullScrenRecord, displayFullScreShare } from '../../../actions/toolActions'
import {getTotalUnread} from '../../../actions/messageAction'
import FullScreenShare from './enitreScreenShare'
import FullScreenRecord from './FullScreenRecord'
import socketIOClient from "socket.io-client";
import { Redirect } from 'react-router-dom';
import { creatAnsProject } from '../../../actions/projectActions'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { Button, Modal, ModalBody } from 'reactstrap';
import IssueDetils from '../../issueModal'
import { connect } from 'react-redux';
import { SCREEN_SHARE, SCREEN_RECORD, FULL_SCREEN_RECORD, FULL_SCREEN_SHARE } from '../../../actions/types';
import CopyToClipboard from '../CopytoClipboard'
import { setIssueId } from '../../../actions/issueActions';
import { fetchProjectbyIssue, clearAnswers } from '../../../actions/projectActions';
import { stillAuthenicated } from '../../../actions/signinAction';
import PropType from 'prop-types';
import { FiGrid,FiList } from "react-icons/fi";
import { resetValues } from '../../../actions/twitterApiAction'
import Swal from 'sweetalert2'
import config from '../../../config/config'
import ProfileCard from './ProfileCard'
import IssueDisplay from './DisplayIssues'
import Content from './Content'
import { saveExtensionDetails, saveSourceId } from "../../../actions/extensionAction";
import { restAllToolValue } from "../../../actions/toolActions";
import { acceptCallDetails } from '../../../actions/callAction';
import { answerCall, missCall } from '../../../actions/callAction';
import { openParticipated,openInbox, openCreated } from "../../../actions/navAction";
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
            displayDetails:false,
            reducedWidth:false,
            callerId:null
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
        this.toggleInbox =this.toggleInbox.bind(this);
        this.saveVideoData = this.saveVideoData.bind(this)
    }
    toggleDisplayLink() {
        this.setState({
            displayLink: !this.state.displayLink,
            showDetails:false,
            displayDetails:false
        })
    }
    resize(){
        this.setState({reducedWidth: window.innerWidth <= 700});
      }
    saveVideoData(data, isPublic, text) {
        var issueId = null
        var textExplain = text
        var imgData = "null"
        var items = {}
        var isquestion = " "
        if (this.props.issueId == null || this.props.issueId === undefined) {
            isquestion = "true"
        }
        else {
            isquestion = "false"
            issueId = this.props.issueId
        }
        this.props.creatAnsProject(textExplain, imgData, data, items, isquestion, issueId, isPublic)
    }
    reloadPage() {
        window.location.reload();
    }
    openDtailsTab() {
        this.setState({
            showDetails: !this.state.showDetails,
            displayDetails:false,
            displayLink:false
        })
    }

    closeParticipated() {
        this.setState({
            showProjects: false,
            showParticipatedIssue: false,
            showCreatedIssue: false,
        })
    }

    componentDidMount() {
    
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
        socket.on(config.UPDATE_BADGE,data=>{
            if(data.userId===this.props.userId){
            this.props.getTotalUnread()
        }
        })
        socket.on(config.ENDING_RING,data=>{
            if(data.ToUserId === this.props.userId){
               
                socket.emit(config.ENDING_RING_ACK,{
                    "ToUserId":data.fromUserId
                })
            }
        })
        socket.on(config.SAVED_NEW_PROJECT,data=>{
            if(data.userId === this.props.userId){
              
                this.props.getProfileDetails(this.props.userId, config.SELF)
            }
        })
        socket.on(config.NEW_MESSAGE,data=>{
           if(data.touser === (this.props.userId)){
               
                this.props.getTotalUnread();
                this.props.getAllMessages(this.props.userId)
            }
        })
        socket.on(config.LINK_TO_CALL, data => {
            setTimeout(() => {
                this.props.missCall();
            }, 18000)
            localStorage.setItem("profilePic", data.fromProfilePic)
            if (String(data.ToUserId) === this.props.userId) {
                socket.emit(config.LINK_TO_CALL_ACK,{
                    "fromUserId":data.fromUserId,
                    "toUserId":data.toUserId
                })
                this.setState({
                    callerId:data.fromUserId
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
        this.props.stillAuthenicated()
        this.props.getTotalUnread()
        const socket = socketIOClient(config.base_dir);
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
    toggleInbox(){
        
        this.setState({
            showProjects: true,
            openExplain: false,
            showDetails:false
        })
        this.props.openInbox()
    }
    toggleCreatedIssue() {
        this.setState({
            showDetails:false,
            displayDetails:false,
            showDetails:false
        })
        
        this.setState({
            showProjects: true,
            openExplain: false
        })
        this.props.openCreated()
    }
    toggleParticipatedIssue() {
        this.setState({
            showDetails:false,
            displayDetails:false,
            showDetails:false
        })
       
        this.setState({
            showProjects: true,
            openExplain: false
        })
        this.props.openParticipated()
    }
    recordFullScreen() {
        this.setState({
            showDetails:false,
            displayLink:false
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

    shareFullScreenShare() {
        this.setState({
            showDetails:false,
            displayLink:false
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
    }
    rejectCall() {
        var socket = this.state.socket
        socket.emit(config.REJECT_REPLY, {
            'toUserId':this.state.callerId,
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
        this.setState({
            displayDetails: false
        })
    }
    explainTool = (e) => {
        if (this.props.isAauthenticated) {
            // alert(e.target.id)
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
       var issuepercentage="65%";
        var percentage ="30%";
        var displayLinkDiv=null;
        var profileCardElement = null;
        if(this.state.reducedWidth){
            issuepercentage="100%"
        }
        if (this.props.screenAction === SCREEN_RECORD ||
            this.props.screenAction === SCREEN_SHARE) {
              percentage = "85%";
          }
          else {
            if (this.props.screenAction === FULL_SCREEN_SHARE ||
              this.props.screenAction === FULL_SCREEN_RECORD){
               
                if(this.state.reducedWidth || this.props.showCanvas || this.props.startSecodScreenShare){
                  percentage = "100%";
                  
                }
                else{
                  percentage = "30%";
                }
              
              }
              else{
                if(this.state.reducedWidth || this.props.showCanvas || this.props.startSecodScreenShare){
                 
                  percentage = "100%";
                  
                }
                else{
                  percentage = "30%";
                }
            }
        }
       
        var shareRecord = null
        if(!this.props.inbox &&!this.props.created && !this.props.participated){
        if (this.props.screenAction === FULL_SCREEN_RECORD) {
            shareRecord = (<FullScreenRecord
                socket={this.state.socket}
                closeImidiate={this.handleConfirm}
                reStoreDefault={this.reStoreDefault}
                savefile={this.saveVideoData}
            />)
        }
        else if (this.props.screenAction === FULL_SCREEN_SHARE) {
            shareRecord = (<FullScreenShare
            socket={this.state.socket}
                onRef={ref => (this.child = ref)}
                closeImidiate={this.handleConfirm}
                reStoreDefault={this.reStoreDefault}
                savefile={this.saveVideoData}
            />)
        }
        else {
            shareRecord = null
        }
    }
        const activityDiv =(this.state.displayDetails)?(
            <div style={{width:percentage, margin:"auto"}}>
            {shareRecord}
         </div>
        ):(null)
        const details = (this.state.showDetails) ? (((this.props.inbox || this.props.created || this.props.participated)?(
            null
        ):( <Profile 
        isHome ={this.state.isHome}/>))
           
        ) : (null)
      
        const externalCloseBtn = <button className="close modalClose" style={{ position: 'absolute', top: '25px', height: '45px', width: '45', right: '25px', color: 'white' }} onClick={this.toggle}>&times;</button>;
        var self = this
        var sharabeLink = config.react_url + "/" + this.props.twitterHandle
        var deatilsModal = null
        if(this.props.myissues!==null)
        var issuesCreated = (this.props.myissues)
        // if(this.props.participatedIssues!==null)
       
       
       
        var feedDiv = null;

        window.addEventListener('storage', function (event) {
            if (event.key === 'token') {
                self.reloadPage()
            }
        })

        const callNotificationDiv = (this.props.incommingCall) ? (
            <div className="callNotification">
                <div>
                    <div className="callerProfileImage">
                        <img alt="caller profile Pic"className="callerProfileImageElement" src={this.props.callerProfilePic} />
                    </div>
                    <audio style={{ display: "none" }} autoPlay  loop src={require('../../audio/simple_beep.mp3')}></audio>

                </div>
                <div>
                    <p>{this.props.callerName}</p>
                    <button className="buttonLight"onClick={this.answerCall}>Accept Share Request</button>
                    <br/>
                    <button className="buttonLight"onClick={this.rejectCall}>Ask to send recording</button>
                    {/* <p onClick={this.answerCall}><a href="#">Accept Screen-share Request</a></p>
                    <p onClick={this.rejectCall}><a href="#">Ask to send the recording</a></p> */}

                </div>
            </div>
        ) : (null)

        deatilsModal = (<IssueDetils />)
       
        if (this.props.isAauthenticated) {
            if (this.state.openExplain) {
            }
            if (!this.props.incommingCall && this.props.created && !this.props.participated) {
                // explainDiv = null
                var createdDiv = (this.state.typeOfView === "list") ? (
                    <div className="issueContainer" style={{width:issuepercentage}}>
                    <div className="closeBtnHolder">
                    </div>
                    <IssueDisplay togglemodal={this.togglemodal} home={config.HOME} explainTool={this.explainTool} issueArray={(issuesCreated)} />
                    {/* <DisplatCreated home={config.HOME} issueArray={(issuesCreated).reverse()} /> */}
                </div>
                ):(
                    <div className="issueContainerMore" >
                    <div className="closeBtnHolder">
                    </div>
                    {/* <IssueDisplay togglemodal={this.togglemodal} home={config.HOME} explainTool={this.explainTool} issueArray={(issuesCreated).reverse()} /> */}
                    <DisplatCreated home={config.HOME} issueArray={(issuesCreated)} />
                </div>
                )

                feedDiv = (
                    <div>
                        <div style={{ textAlign: "right" }}>
                            <span className="hint--top" aria-label="List View">
                            <FiList onClick={this.changeViewToList} className="listView"/>
                            </span>
                            <span className="hint--top" aria-label="Grid View">
                            <FiGrid onClick={this.changeViewToGrid} className="gridView"/>
                            </span>
                        </div>
                       {createdDiv}
                       </div>)
            }
            if (!this.props.incommingCall && this.props.participated && !this.props.created) {
                var participatedDiv = (this.state.typeOfView === "list") ? (
                    <div className="issueContainer" style={{ width: issuepercentage }} >
                        <div className="closeBtnHolder">
                        </div>
                        <IssueDisplay togglemodal={this.togglemodal} home={config.HOME} explainTool={this.explainTool} issueArray={this.props.participatedIssues} />
                    </div>
                ) : (<div className="issueContainer" style={{ width: "80%" }} >
        
                    <div className="closeBtnHolder">
                    </div>
                    <DisplatCreated home={config.HOME} issueArray={this.props.participatedIssues} />
                </div>)
                // explainDiv = null
                feedDiv = (
                    // <Animated animationIn="slideInRight" animationOut="zoomOut" isVisible={this.props.participated && !this.props.created}>
                       <div>
                       <div style={{ textAlign: "right" }}>
                            <span className="hint--top" aria-label="List View">
                            <FiList onClick={this.changeViewToList} className="listView"/>
                            </span>
                            <span className="hint--top" aria-label="Grid View">
                            <FiGrid onClick={this.changeViewToGrid} className="gridView"/>
                            </span>
                        </div>
                        
                        {participatedDiv}
                        </div>
                )
                    // </Animated>)

            }
            else if(this.props.inbox){
                // explainDiv = null
                feedDiv =(<Inbox userId={this.props.userId}/>)
            }
            else {
                
            }
        }


        if (this.props.isAauthenticated) {
            if (this.props.screenAction === SCREEN_RECORD ||
                this.props.screenAction === SCREEN_SHARE ||
                this.props.isSceenSharing ||
                this.props.isFullScreenRecording ||
                // this.props.screenAction === FULL_SCREEN_SHARE ||
                // this.props.screenAction === FULL_SCREEN_RECORD ||
                this.props.participated ||
                this.props.inbox ||
                this.props.created) {
                profileCardElement = null
            }
            else if (this.props.userId !== null) {
                if (this.state.displayLink &&
                    !this.props.incommingCall && 
                    !this.props.inbox &&
                    !this.props.created && 
                    !this.props.participated 
                    ){
                    displayLinkDiv = (<div className="sharableLinkSection">
                        <Button close onClick={this.toggleDisplayLink} />
                        <p>Your shareable Link</p>
                        <CopyToClipboard sharablelink={sharabeLink} />
                    </div>)
                }
                else {
                    displayLinkDiv = null
                }
              

                profileCardElement = (
                    <div className="ProfileDiv"><ProfileCard
                        isHome={this.state.isHome}
                        toggleInbox={this.toggleInbox}
                        sharabeLink={sharabeLink}
                        openDtailsTab={this.openDtailsTab}
                        userId={this.props.userId}
                        shareFullScreenShare={this.shareFullScreenShare}
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

        return (this.props.authAction) ? ((!this.props.isAauthenticated) ? (<Redirect to="/login" />) : (
            <div className="fullHome">
                <Navbar />

                <div className="containerHome">
                    {callNotificationDiv}
                    <div>
                        {profileCardElement}
                        {/* {explainItBt/n} */}
                    </div>
                   {activityDiv}
                    <div>
                        {feedDiv}
                    </div>
                    <div>
                        {details}
                    </div>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.togglemodal} className={this.props.className} external={externalCloseBtn}>
                    <ModalBody className="modalBody">
                        {deatilsModal}
                    </ModalBody>
                </Modal>
                {/* {iframe} */}
            </div>
        )) : (null)


    }
}
NewHome.PropType = {
    issues: PropType.array.isRequired,
    fetchProjectbyIssue: PropType.func.isRequired,
    setIssueId: PropType.func.isRequired,
    saveExtensionDetails: PropType.func.isRequired,
    saveSourceId: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    acceptCallDetails: PropType.func.isRequired,
    answerCall: PropType.func.isRequired,
    missCall: PropType.func.isRequired,
    openParticipated: PropType.func.isRequired,
    openCreated: PropType.func.isRequired,
    cancelAllMessageAction: PropType.func.isRequired,
    resetValues: PropType.func.isRequired,
    creatAnsProject:PropType.func.isRequired,
    openInbox:PropType.func.isRequired,
    getAllMessages:PropType.func.isRequired,
    getProfileDetails:PropType.func.isRequired
};
const mapStateToProps = state => ({
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
    callerProfilePic: state.call.profilePic,
    callActionLink: state.call.link,
    incommingCall: state.call.incommingCall,
    authAction: state.auth.authAction,
    participated: state.nav.openParticipated,
    created: state.nav.openCreated,
    inbox:state.nav.openInbox,
    isSceenSharing: state.tools.isFullScreenSharing,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    showCanvas:state.canvasActions.showCanvas,
    startSecodScreenShare: state.secondScreenShare.secondScreenShareStarted,
    



})

export default connect(mapStateToProps, {
    answerCall,
    openCreated,
    getAllMessages,
    cancelAllMessageAction,
    openParticipated,
    missCall,
    restAllToolValue,
    acceptCallDetails,
    saveExtensionDetails,
    saveSourceId,
    openInbox,
    getProfileDetails,
    fetchProjectbyIssue,
    setIssueId,
    getTotalUnread,
    displayFullScrenRecord,
     displayFullScreShare ,
    creatAnsProject,
    clearAnswers, stillAuthenicated,
    resetValues
})(NewHome)

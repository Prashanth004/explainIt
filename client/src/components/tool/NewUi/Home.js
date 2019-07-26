import React, { Component } from 'react'
import '../../css/newlanding.css'
import '../../css/NewSignin.css'
import Navbar from './Navbar';
// import { Helmet } from "react-helmet";
// import BusyAction from './container/BusyAction';
import { toggleHowWorksModal } from '../../../actions/modalAction'
import ExplinerVideoModal from './container/explainerModal';
import ExtCloseBtn from './container/modalExtButton'
import EmailVarify from './emailvarify'
import CallNotification from './container/CallNotification';
import Activity from './Activies/indexActivity'
import DisplatCreated from './diaplyissues/DisplayCreated';
import { cancelSuccess } from '../../../actions/issueActions'
import { initGA, loadPageView } from './container/ReactGa';
import { answerCall, missCall } from '../../../actions/callAction';
import { getProfileDetails } from '../../../actions/profileAction';
import { getTotalUnread } from '../../../actions/messageAction'
import socketIOClient from "socket.io-client";
import { Redirect } from 'react-router-dom';
import { creatAnsProject } from '../../../actions/projectActions';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { Button, Modal, ModalBody } from 'reactstrap';
import { getAllContacts } from '../../../actions/contactAction'
import IssueDetils from '../../issueModal'
import { connect } from 'react-redux';
import { SCREEN_SHARE, SCREEN_RECORD} from '../../../actions/types';
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
import { varifyEmail } from '../../../actions/emailAction'
import { saveExtensionDetails } from "../../../actions/extensionAction";
import { restAllToolValue } from "../../../actions/toolActions";
import { acceptCallDetails } from '../../../actions/callAction';

import { openHome,openParticipated, openInbox, openCreated } from "../../../actions/navAction";
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
            typeOfView: "list",
            displayDetails: false,
            reducedWidth: false,
            callerId: null,
            endedCallFromOtherPeer: false,
            newCall: true,
            reducedLittleWidth: false,
            currentAtionStatus: null,
            showExplainerVideo: false,
            isinformed: false
        }
        this.togglemodal = this.togglemodal.bind(this)
        this.explainTool = this.explainTool.bind(this)
        this.toggleModalCreate = this.toggleModalCreate.bind(this)
        this.toggleCreatedIssue = this.toggleCreatedIssue.bind(this);
        this.toggleParticipatedIssue = this.toggleParticipatedIssue.bind(this);
        this.changeViewToList = this.changeViewToList.bind(this);
        this.changeViewToGrid = this.changeViewToGrid.bind(this);
        this.saveVideoData = this.saveVideoData.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.toggleExplainerVideo = this.toggleExplainerVideo.bind(this);
        this.informExtension = this.informExtension.bind(this);

    }

    resize() {
        this.setState({ reducedWidth: window.innerWidth <= 700 });
        this.setState({ reducedLittleWidth: window.innerWidth <= 1200 });
    }


    saveVideoData(videoData, audioData, isPublic, text, action) {
        var condition = this.props.issueId == null || this.props.issueId === undefined
        var issueId = (condition) ? null : this.props.issueId;
        var imgData = "null";
        var items = {}
        const isquestion = (condition) ? "true" : "false"
        this.props.creatAnsProject(text, imgData, videoData, audioData, items, isquestion, issueId, isPublic, action)
    }
    reloadPage(event) {
        if (event.key === 'token') {
            window.location.reload();
        }
        if (event.key === 'currentAction') {
            const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
            this.setState({ currentAtionStatus: currentAtionStatus })
        }
    }
    componentWillUnmount() {
        window.removeEventListener('storage', this.reloadPage)
        window.removeEventListener("resize", this.resize());
    }
    informExtension() {
        this.setState({ isinformed: true })
        const userDetails = {
            'type': config.INFORM_EXTENSION_USERID,
            'userid': this.props.userId
        }
        window.postMessage(userDetails, "*");
    }
    componentDidMount() {
        initGA();
        loadPageView();
        this.props.getAllContacts();
        console.log("this.props.userId : ", this.props.userId);
        window.addEventListener('storage', this.reloadPage)
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
                self.props.saveExtensionDetails(event.source, event.origin);
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
        var socket = this.state.socket
        socket.on(config.UPDATE_BADGE, data => {
            if (data.userId === this.props.userId) 
                this.props.getTotalUnread()
            
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
            console.log("socket error : ", err)
        });
        socket.on('connect_timeout', function (err) {
            console.log("socket onnection_timeout : ", err)
        });
        socket.on("disconnect", () => {
            console.log("socket disconnected")
        })
        socket.io.on("connect_error", () => {
            console.log("connection_error")
        })


        socket.on(config.LINK_TO_CALL, data => {
            console.log("recieving the call")
            self.setState({ endedCallFromOtherPeer: false })
            setTimeout(() => {
                this.props.missCall();
            }, 18000)
            localStorage.setItem("profilePic", data.fromProfilePic)
            if (String(data.ToUserId) === this.props.userId) {
                socket.emit(config.LINK_TO_CALL_ACK, {
                    "fromUserId": data.fromUserId,
                    "toUserId": data.toUserId
                })
              
                this.props.acceptCallDetails(
                    data.link,
                    data.fromEmail,
                    data.fromUserName,
                    data.fromUserId,
                    data.fromProfilePic,
                    data.topicOfTheCall,
                    data.timeAloted

                )
            }
        });
    }
    componentWillMount() {
        const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
        this.setState({ currentAtionStatus: currentAtionStatus })
        this.props.varifyEmail()
        this.props.stillAuthenicated()
        console.log("mounting")
        this.props.getTotalUnread();
        const socket = socketIOClient(config.base_dir, { transports: ['websocket'] }, { origins: "*" });
        socket.on('reconnect_attempt', () => {
            socket.io.opts.transports = ['polling', 'websocket'];
        });
        this.setState({
            socket: socket
        })

    }

    toggleCreatedIssue() {
        this.setState({
            showDetails: false,
            showProjects: true,
            openExplain: false
        })
        this.props.openCreated()
    }
    toggleParticipatedIssue() {
        this.setState({
            showDetails: false,
            showProjects: true,
            openExplain: false
        })
        this.props.openParticipated()
    }
  
    toggleExplainerVideo() {
        this.setState({
            showExplainerVideo: !this.state.showExplainerVideo
        })
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
        var inboxColumn ="100%";
        var inBoxLabelPos = null
        var profileCardElement = null;
        var listGrid = (window.innerWidth >= 1000) ? (<div style={{ marginRight: "-80px", float: "right" }} >
            <span className="hint--top" aria-label="List View">
                <FiList onClick={this.changeViewToList} className="listView" />
            </span>
            <span className="hint--top" aria-label="Grid View">
                <FiGrid onClick={this.changeViewToGrid} className="gridView" />
            </span>
        </div>) : (null);
        if (!this.state.isinformed && this.props.userId !== null) {
            this.informExtension();
        }     
        var sharabeLink = config.react_url + "/" + this.props.twitterHandle
        const externalCloseBtn = <ExtCloseBtn toggle={this.toggleExplainerVideo} />;
        var deatilsModal = null
        if (this.props.myissues !== null)
            var issuesCreated = (this.props.myissues)
        var feedDiv = null;

        const callNotificationDiv = (<CallNotification
            endedCallFromOtherPeer={this.state.endedCallFromOtherPeer}
            socket={this.state.socket} />)

        deatilsModal = (<IssueDetils />)

        if (this.props.isAauthenticated) {
            if (!this.props.incommingCall && (this.props.participated || this.props.created )) {
                var participatedDiv = (this.state.typeOfView === "list") ? (
                    <div className="issueContainer" style={{ width: issuepercentage }} >
                        <div className="closeBtnHolder">
                        </div>
                        <IssueDisplay socket={this.state.socket} togglemodal={this.togglemodal} home={config.HOME} explainTool={this.explainTool} />
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
                feedDiv = (<div >
                     <div className="topBtnsActivity" style={{paddingRight:"20px"}} >
                        
                         <Button close onClick={this.props.openHome} />
                       
                   
                        </div>
                  
                    <Activity userId={this.props.userId} />


                </div>)
            }
            else {

            }
        }
        if((this.props.inbox)&& !(this.props.isSceenSharing ||this.props.callAction || this.props.isFullScreenRecording || this.state.reducedLittleWidth ||this.state.reducedWidth)){
            inboxColumn="30% 45% 20%";
            inBoxLabelPos="fixed";
        }
        if((this.props.isSceenSharing || this.props.isFullScreenRecording  ||this.props.callAction))
        feedDiv = null;


        if (this.props.isAauthenticated) {
            if (this.props.screenAction === SCREEN_RECORD ||
                this.props.screenAction === SCREEN_SHARE ||
                this.props.participated ||
                this.props.created) {
                profileCardElement = null;

            }
            else if (this.props.userId !== null) {
               profileCardElement = (
                        <ProfileCard
                            currentAtionStatus={this.state.currentAtionStatus}
                            isHome={this.state.isHome}
                            sharabeLink={sharabeLink}
                            socket={this.state.socket}
                            userId={this.props.userId}
                            saveVideoData={this.saveVideoData}
                            toggleCreatedIssue={this.toggleCreatedIssue}
                            toggleParticipatedIssue={this.toggleParticipatedIssue} />)
            }
        }
      
        return (this.props.authAction && this.props.doneVarification) ? ((!this.props.isAauthenticated) ? (<Redirect to={"../"} />) : (
            (!this.props.isVarified) ? (<EmailVarify />) : (
                <div className="fullHome">
                 <Navbar />
                    <div className="containerHome">
                        {callNotificationDiv}
                    <div style={{display:"grid",gridTemplateColumns:inboxColumn}}>
                        <div>
                        <div className="ProfileDiv" style={{position:inBoxLabelPos}}>
                            {profileCardElement}
                        </div>
                        </div>
                            {feedDiv}
                        </div>
                    </div>
                    <Modal size='lg' centered={true} isOpen={this.props.openHowItWorksModal} toggle={this.props.toggleHowWorksModal} external={externalCloseBtn}>
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
    toggleHowWorksModal: PropType.func.isRequired,
    resetCallAction: PropType.func.isRequired,
    getProfileDetails: PropType.func.isRequired,
    getAllActivities: PropType.func.isRequired,
    varifyEmail: PropType.func.isRequired
};
const mapStateToProps = state => ({
    doneVarification: state.email.doneVarification,
    isVarified: state.email.isVarified,
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
    callerId: state.call.id,
    
    authAction: state.auth.authAction,
    participated: state.nav.openParticipated,
    created: state.nav.openCreated,
    inbox: state.nav.openInbox,
    isSceenSharing: state.tools.isFullScreenSharing,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    showCanvas: state.canvasActions.showCanvas,
    issueId: state.issues.currentIssueId,
    callAction: state.call.callAction,
    openHowItWorksModal: state.modal.openHowItWorksModal,
})

export default connect(mapStateToProps, {
    answerCall,openHome,
    openCreated,
    toggleHowWorksModal,
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
    creatAnsProject,
    cancelSuccess,
    clearAnswers, stillAuthenicated,
    resetValues, getAllContacts
})(NewHome)

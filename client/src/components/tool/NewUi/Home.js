import React, { Component } from 'react'
import '../../css/newlanding.css'
import '../../css/NewSignin.css'
import Navbar from './Navbar';
import Cotactlist from './contactlist/contactsDisplay';
import Setting from './newNav/setting';
import { toggleHowWorksModal } from '../../../actions/modalAction'
import ExplinerVideoModal from './container/explainerModal';
import ExtCloseBtn from './container/modalExtButton'
import {showContactsAct} from '../../../actions/ProfileCardAction';

import EmailVarify from './emailvarify'
import CallNotification from './container/CallNotification';
import Activity from './Activies/indexActivity'
import DisplatCreated from './diaplyissues/DisplayCreated';
import { initGA, loadPageView } from './container/ReactGa';
import { missCall } from '../../../actions/callAction';
import { getProfileDetails } from '../../../actions/profileAction';
import { getTotalUnread } from '../../../actions/messageAction'
import socketIOClient from "socket.io-client";
import { Redirect } from 'react-router-dom';
import { creatAnsProject } from '../../../actions/projectActions';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { Modal } from 'reactstrap';
import { getAllContacts } from '../../../actions/contactAction'
import { connect } from 'react-redux';
import MobNav from './newNav/index'
import { setIssueId } from '../../../actions/issueActions';
import { stillAuthenicated } from '../../../actions/signinAction';
import { FiGrid, FiList } from "react-icons/fi";
import config from '../../../config/config';
import {  getAllActivities } from '../../../actions/callAction'
import ProfileCard from './ProfileCard'
import IssueDisplay from './diaplyissues/DisplayIssues'
import { varifyEmail } from '../../../actions/emailAction'
import { saveExtensionDetails } from "../../../actions/extensionAction";
import { acceptCallDetails } from '../../../actions/callAction';

class NewHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHome: true,
            socket: null,
            typeOfView: "list",
            reducedWidth: false,
            endedCallFromOtherPeer: false,
            reducedLittleWidth: false,
            currentAtionStatus: null,
            showExplainerVideo: false,
            isinformed: false
        }
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
        if(window.innerWidth <= 700){
            this.setState({issuepercentage:"100%"})
        }else{
            this.setState({issuepercentage:"59%"})
        }
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
  
    toggleExplainerVideo() {
        this.setState({
            showExplainerVideo: !this.state.showExplainerVideo
        })
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
        const {issuepercentage} =  this.state;
        const profileCardGrid = (!this.state.reducedLittleWidth)?("30% 40% 30%"):("100%")
        const contactList = this.props.showContacts?(<div style={{width:"380px",margin:"auto",}}><Cotactlist  /></div>):(null)
        var profileCardElement = null;
        var listGrid = (window.innerWidth >= 1000) ? (<div style={{position:"fixed",top:"90px",right:"30px"}} >
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
       
        if (this.props.myissues !== null)
            var issuesCreated = (this.props.myissues)
        var feedDiv = null;

        const callNotificationDiv = (<CallNotification
            endedCallFromOtherPeer={this.state.endedCallFromOtherPeer}
            socket={this.state.socket} />)
    
        if (this.props.isAauthenticated) {
            if (this.props.participated ||
                this.props.setting ||
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
                            saveVideoData={this.saveVideoData}/>)
            }
        }

        if (this.props.isAauthenticated) {
            if (!this.props.incommingCall && (this.props.participated || this.props.created )) {
                var participatedDiv = (this.state.typeOfView === "list") ? (
                    <div className="issueContainer" style={{ width: issuepercentage }} >
                        <IssueDisplay socket={this.state.socket}home={config.HOME}/>
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
                profileCardElement = null
                feedDiv = (<div >
                    <Activity userId={this.props.userId} />
                </div>)
            }
            else if(this.props.setting){
                feedDiv = (<Setting userId={this.props.userId} />)
            }
            else {

            }
        }

        if((this.props.isSceenSharing || this.props.isFullScreenRecording  ||this.props.callAction))
        feedDiv = null;
        const nav=(this.state.reducedWidth)?(<MobNav page={config.HOME_PAGE}/>):(<Navbar reducedLittleWidth={this.state.reducedLittleWidth} />)
        return (this.props.authAction && this.props.doneVarification) ? ((!this.props.isAauthenticated) ? (<Redirect to={"../"} />) : (
            (!this.props.isVarified) ? (<EmailVarify />) : (
                <div className="fullHome">
                 {nav}
                    <div className="containerHome">
                        {callNotificationDiv}
                    <div >
                        <div>
                        <div className="ProfileDiv" style={{display:"grid",gridTemplateColumns:profileCardGrid}}>
                           <div></div>
                            <div>{profileCardElement}</div>
                            <div>
                           <br/>
                            {contactList}</div>
                        </div>
                        </div>
                            {feedDiv}
                        </div>
                    </div>
                    <Modal size='lg' centered={true} isOpen={this.props.openHowItWorksModal} toggle={this.props.toggleHowWorksModal} external={externalCloseBtn}>
                        <ExplinerVideoModal />
                    </Modal>
                 
                </div>
            ))) : (null)
    }
}

const mapStateToProps = state => ({
    doneVarification: state.email.doneVarification,
    isVarified: state.email.isVarified,
    issues: state.issues.items,
    isAauthenticated: state.auth.isAuthenticated,
    profilePic: state.auth.profilePic,
    myissues: state.profile.myIssues,
    participatedIssues: state.profile.participatedIssue,
    twitterHandle: state.profile.twitterHandle,
    userId: state.auth.id,
    setting:state.nav.openSetting,
    authAction: state.auth.authAction,
    participated: state.nav.openParticipated,
    inbox: state.nav.openInbox,
    isSceenSharing: state.tools.isFullScreenSharing,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    issueId: state.issues.currentIssueId,
    callAction: state.call.callAction,
    openHowItWorksModal: state.modal.openHowItWorksModal,
    showContacts:state.profileCard.showContacts,
})

export default connect(mapStateToProps, {
    toggleHowWorksModal,getAllActivities,missCall,acceptCallDetails, saveExtensionDetails,showContactsAct,
    getProfileDetails,setIssueId,varifyEmail,getTotalUnread,creatAnsProject,stillAuthenicated, getAllContacts
})(NewHome)

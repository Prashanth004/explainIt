import React, { Component } from 'react'
import '../../css/newlanding.css'
import Navbar from './Navbar'
// import Iframe from 'react-iframe'
// import socketIOClient from "socket.io-client";
import { Redirect } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { Button, Modal, ModalBody } from 'reactstrap';
import IssueDetils from '../../issueModal'
import { connect } from 'react-redux';
import { SCREEN_SHARE, SCREEN_RECORD,FULL_SCREEN_RECORD,FULL_SCREEN_SHARE } from '../../../actions/types';
import CopyToClipboard from '../CopytoClipboard'
import Explain from './Explainit'
import { setIssueId } from '../../../actions/issueActions';
import { fetchProjectbyIssue, clearAnswers } from '../../../actions/projectActions';
import { stillAuthenicated } from '../../../actions/signinAction';
// import { getProfileDetails } from '../../../actions/profileAction'
import PropType from 'prop-types';
import { resetValues } from '../../../actions/twitterApiAction'

import Swal from 'sweetalert2'
import config from '../../../config/config'
import ProfileCard from './ProfileCard'
import IssueDisplay from './DisplayIssues'
import Content from './Content'
import { Animated } from "react-animated-css";
import { saveExtensionDetails, saveSourceId } from "../../../actions/extensionAction";
import { restAllToolValue } from "../../../actions/toolActions";
import { acceptCallDetails } from '../../../actions/callAction';
import { answerCall, missCall } from '../../../actions/callAction';
import { openParticipated, openCreated } from "../../../actions/navAction";
import { cancelAllMessageAction } from '../../../actions/messageAction'
import FullScreenRecord from './FullScreenRecord';



class NewHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalTool: false,
            openExplain: false,
            showCreatedIssue: false,
            showParticipatedIssue: false,
            showProjects: false,
            displayLink: false,
            isHome: true,
            socket: null

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
        this.rejectCall = this.rejectCall.bind(this)

    }
    toggleDisplayLink() {
        this.setState({
            displayLink: !this.state.displayLink
        })
    }
    reloadPage() {
        window.location.reload();
    }


    closeParticipated() {
        this.setState({
            showProjects: false,
            showParticipatedIssue: false,
            showCreatedIssue: false,

        })
    }

    componentDidMount() {
        var self = this
        function postMessageHandler(event) {
            console.log(" event :", event)
            // if (event.data.sourceId !== undefined) {
            //     console.log("We've got a message!");
            //     console.log("* Message:", event.data);
            //     console.log("* Origin:", event.origin);
            //     console.log("* Source:", event.source);
            //     console.log("*event.data.message__sourceId : ", event.data.sourceId)
            //     self.props.saveSourceId(event.data.sourceId)
            // }

            if (event.data === 'rtcmulticonnection-extension-loaded') {
                console.log(" event.source :", event.source)
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

        // var socket = this.state.socket
        // console.log("sockets : ", socket)
        // socket.on(config.LINK_TO_CALL, data => {
        //     console.log("data : ", data)
        //     setTimeout(() => {
        //         this.props.missCall();
        //     }, 18000)
        //     localStorage.setItem("profilePic", data.fromProfilePic)
        //     if (data.ToUserId === this.props.userId) {
        //         this.props.acceptCallDetails(
        //             data.link,
        //             data.fromEmail,
        //             data.fromUserName,
        //             data.fromUserId,
        //             data.fromProfilePic
        //         )
        //     }
        // });


    }
    componentWillMount() {
        this.props.stillAuthenicated()
        // const socket = socketIOClient(config.base_dir);
        // this.setState({
        //     socket: socket
        // })

    }
    toodleExplain() {
        localStorage.setItem("issueId", null)
        this.setState({
            openExplain: !this.state.openExplain,
            showCreatedIssue: false,
            showParticipatedIssue: false
        })
    }
    toggleCreatedIssue() {
        var self = this
        this.setState({
            showProjects: true,
            openExplain: false
        })
        this.props.openCreated()
    }
    toggleParticipatedIssue() {
        var self = this
        this.setState({
            showProjects: true,
            openExplain: false
        })
        this.props.openParticipated()
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
        console.log("e.target.id : ", e.target.id)
       

        if (classOfClicked !== "singleMember"  && classOfClicked !== "sharableLink"&&  classOfClicked !== "linkElementSym" && classOfClicked !== "hint--top"   && classOfClicked !== "explainAnswer" && classOfClicked !== "displayPeople" && classOfClicked !== "likes" && classOfClicked !== "numberOfPeople" && idOfClicked !== "explainIt" && idOfClicked !== "audio" && idOfClicked !== "tweet" && idOfClicked !== "shareScreen" && idOfClicked !== "imageOfPeople" && classOfClicked !== "buttonDark explainItBtn") {
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
        // var socket = this.state.socket
        // socket.emit(config.REJECT_REPLY, {
        //     'message': config.REPLY_TO_SHARE_REQ
        // })
        this.props.answerCall();
    }



    handleCancel() {

    }
    reStoreDefault = () => {
        if(this.props.screenAction!==null && !this.props.isSharingCompleted && !this.props.isFullSharingCompleted ){
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
        else{
            this.handleConfirm()
        }
    }
    screenShareWindow(){
       
        var href = config.react_url+"/sharescreen"
        var width = window.innerHeight*(3/4),
            height =  window.innerHeight*(3/4),
            top =10,
            left =10,
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
            openExplain: false
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

    render() {
        // var iframe = <Iframe url="https://explain.bookmane.in/sharescreen"
        // width="450px"
        // height="450px"
        // id="myId"
        // className="myClassname"
        // display="initial"
        // position="relative"

        // allowFullScreen/>
        const externalCloseBtn = <button className="close modalClose" style={{ position: 'absolute', top: '25px', height: '45px', width: '45', right: '25px', color: 'white' }} onClick={this.toggle}>&times;</button>;
        var self = this
        var sharabeLink = config.react_url + "/profile/" + this.props.twitterHandle
        var deatilsModal = null
        var issuesCreated = this.props.myissues;
        var self = this
        var explainDiv = null;
        var feedDiv = null;

        window.addEventListener('storage', function (event) {
            if (event.key == 'token') {
                self.reloadPage()
            }
        })

        const callNotificationDiv = (this.props.incommingCall) ? (
            <div className="callNotification">
                <div>
                    <div className="callerProfileImage">
                        <img className="callerProfileImageElement" src={this.props.callerProfilePic} />
                    </div>
                </div>
                <div>
                    <p>{this.props.callerName}</p>
                    <p onClick={this.answerCall}><a href="#">Accept Screen-share Request</a></p>
                    <p onClick={this.rejectCall}><a href="#">Ask to send the recording</a></p>

                </div>
            </div>
        ) : (null)

        deatilsModal = (<IssueDetils />)
        var explainDiv = (<Explain closeImidiate={this.handleConfirm} screenShareWindow={this.screenShareWindow} reStoreDefault={this.reStoreDefault} />)
        console.log("this.props.created : ",this.props.created)
        console.log("this.props.participated : ",this.props.participated)
        if (this.props.isAauthenticated) {
            if (this.state.openExplain) {
                explainDiv = (<Explain closeImidiate={this.handleConfirm} reStoreDefault={this.reStoreDefault} />)
            }
            if (this.props.created && !this.props.participated ) {
                explainDiv = null
                console.log("created excecuting")
                feedDiv = (
                   <Animated animationIn="slideInLeft" animationOut="zoomOut" isVisible={this.props.created && !this.props.participated}>
                        <div className="issueContainer" >
                            <div className="closeBtnHolder">
                            </div>
                            <IssueDisplay togglemodal={this.togglemodal} home={config.HOME} explainTool={this.explainTool} issueArray={issuesCreated} />
                        </div>
                   </Animated>)
            }
            else if (this.props.participated && !this.props.created) {
                console.log("participated excecuting")
                explainDiv = null
                feedDiv = (
                    <Animated animationIn="slideInRight" animationOut="zoomOut" isVisible={this.props.participated && !this.props.created}>

                        <div className="issueContainer" >

                            <div className="closeBtnHolder">
                            </div>
                            <IssueDisplay togglemodal={this.togglemodal} home={config.HOME} explainTool={this.explainTool} issueArray={this.props.participatedIssues} />
                        </div>
                    </Animated>)

            }
            else{
                console.log("nothing excecuting")
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
                this.props.created) {
                var profileCardElement = null
            }
            else if(this.props.userId!==null){
                if (this.state.displayLink) {
                    var displayLinkDiv = (<div className="sharableLinkSection">
                        <Button close onClick={this.toggleDisplayLink} />
                        <p>Your shareable Link</p>
                        <CopyToClipboard sharablelink={sharabeLink} />
                    </div>)
                }
                else {
                    var displayLinkDiv = null
                }
                // if (this.state.openExplain) {
                //     var explainItBtn = null
                // }
                // else {
                //     // var explainItBtn = (<button className="buttonDark explainBtn" onClick={this.toodleExplain}>Explain</button>)

                // }

                var profileCardElement = (
                    <div className="ProfileDiv"><ProfileCard
                        isHome={this.state.isHome}
                        sharabeLink={sharabeLink}
                        userId={this.props.userId}
                        toggleDisplayLink={this.toggleDisplayLink}
                        toggleCreatedIssue={this.toggleCreatedIssue}
                        toggleParticipatedIssue={this.toggleParticipatedIssue} />
                        {displayLinkDiv}
                       
                    </div>
                )
            }
        }
        else {
            var profileCardElement = (<Content />)
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
                    <div >
                        {explainDiv}
                    </div>
                    <div>
                        {feedDiv}
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
    // getProfileDetails: PropType.func.isRequired,
    saveExtensionDetails: PropType.func.issaveExtensionDetailsRequired,
    saveSourceId: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    acceptCallDetails: PropType.func.isRequired,
    answerCall: PropType.func.isRequired,
    missCall: PropType.func.isRequired,
    openParticipated: PropType.func.isRequired,
    openCreated: PropType.func.isRequired,
    cancelAllMessageAction: PropType.func.isRequired,
    resetValues:PropType.func.isRequired
};
const mapStateToProps = state => ({
    issues: state.issues.items,
    screenAction: state.tools.screenAction,
    isSharingCompleted : state.tools.isSharingCompleted,
    isFullSharingCompleted : state.tools.isFullSharingCompleted,
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
    isSceenSharing: state.tools.isFullScreenSharing,
    isFullScreenRecording :state.tools.isFullScreenRecording,


   

})

export default connect(mapStateToProps, {
    answerCall,
    openCreated,
    cancelAllMessageAction,
    openParticipated,
    missCall,
    restAllToolValue,
    acceptCallDetails,
    saveExtensionDetails,
    saveSourceId,
    fetchProjectbyIssue,
    setIssueId, 
    // getProfileDetails,
    clearAnswers, stillAuthenicated,
    fetchProjectbyIssue,
    setIssueId,
    resetValues
})(NewHome)

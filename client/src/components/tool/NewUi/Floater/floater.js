import React, { Component } from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import PropType from 'prop-types';
import { JustRecord } from '../../../../actions/messageAction'
import { MdFilterNone } from "react-icons/md";
import Countdown from 'react-countdown-now';
import { cancelAllMessageAction } from '../../../../actions/messageAction'
import { restAllToolValue } from "../../../../actions/toolActions";
import { resetValues } from '../../../../actions/twitterApiAction'
import { cancelSuccess } from '../../../../actions/issueActions'
import { MdCallEnd } from "react-icons/md";
import '../../../css/call.css'
import './floater.css';
import GetProfile from './GetProfile'
import { getProfileDetails } from '../../../../actions/profileAction'
import Profile from '../Profile'
import socketIOClient from "socket.io-client";
import { FULL_SCREEN_RECORD, FULL_SCREEN_SHARE } from '../../../../actions/types';
import { displayFullScrenRecord, displayFullScreShare } from '../../../../actions/toolActions'
import { creatAnsProject } from '../../../../actions/projectActions'
import FullScreenRecord from '../FullScreenRecord'
import FullScreenShare from './sharescreen'
import { saveExtensionDetails, saveSourceId } from "../../../../actions/extensionAction";
import { stillAuthenicated } from '../../../../actions/signinAction';
import { FiMail } from "react-icons/fi";
import config from '../../../../config/config';
import ProfileCard from '../ProfileHover'


class Floater extends Component {
    constructor(props) {
        super(props)
        this.state = {
            source: null,
            gotProfile: false,
            origin: null,
            socket: null,
            gotmessage: false,
            displayDetails: "none",
            showProfileDetails: false,
            isHome: true
        }
        this.recordFullScreen = this.recordFullScreen.bind(this);
        this.shareFullScreenShare = this.shareFullScreenShare.bind(this);
        this.saveVideoData = this.saveVideoData.bind(this);
        this.closeme = this.closeme.bind(this);
        this.endShareScreen = this.endShareScreen.bind(this);
        this.openIssueList = this.openIssueList.bind(this);
        this.getProfileDetails = this.getProfileDetails.bind(this);
        this.toggleProfileDetails = this.toggleProfileDetails.bind(this);
        this.endCall = this.endCall.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    componentWillMount() {
        this.props.stillAuthenicated();
        const socket = socketIOClient(config.base_dir);
        this.setState({
            socket: socket
        })
    }
    toggleProfileDetails() {
        this.setState({
            showProfileDetails: !this.state.showProfileDetails,
            displayDetails: "none",

        })
    }
    handleClose() {
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.setState({
            displayDetails: "none"
        })
    }
    recordFullScreen() {
        this.props.JustRecord();
        if (this.state.displayDetails === "none") {
            this.setState({
                displayDetails: "block",
                showProfileDetails: false
            })
            this.props.displayFullScrenRecord()
        }
        else {
            this.handleClose()
            this.setState({
                displayDetails: "none"
            })
        }
    }
    shareFullScreenShare() {
        if (this.state.displayDetails === "none") {
            this.setState({
                displayDetails: "block",
                showProfileDetails: false
            })
            localStorage.setItem('issueId', null)
            this.props.displayFullScreShare()
        }
        else {
            this.handleClose()
            this.setState({
                displayDetails: "none"
            })
        }
    }
    closeme() {

        var msg = {
            type: 'close',
            data: 'close'
        };

        // var source = this.props.extSource
        // var origin = this.props.extOrigin
        // if (this.props.extSource !== null) {
        //     source.postMessage('audio-plus-tab', origin);
        // }

        var source = this.props.extSource;
        var origin = this.props.extOrigin;
        if (this.props.extSource !== null) {
            source.postMessage(msg, origin);
        }
    }
    endCall(event) {
        this.child.endCall()
    }
    getProfileDetails() {
        this.setState({
            gotProfile: true
        })
        this.props.getProfileDetails()
    }
    openIssueList() {
        window.open(config.react_url + '/saveditems')
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
    endShareScreen() {
        this.shareChild.endCall()
    }
    componentDidMount() {

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
    }

    render() {

        const ProfileHover = (this.props.recieverUserId) ? (
            <ProfileCard
                userId={this.props.recieverUserId} />
        ) : (
                null
            )

        const profileDetails = (this.state.showProfileDetails) ? ((<Profile
            isHome={this.state.isHome} />)
        ) : (null)
        var profilePic = (<div>
            <img alt="profilePic" src={this.props.profilePic} onDoubleClick={this.toggleProfileDetails} className="profilePic"></img>
        </div>)
        var shareScreenImg = (<span className="hint--bottom" aria-label="Share screen!">
            <img alt="screenShare" onClick={this.shareFullScreenShare} height="100%" width="100%" src={require('../../../images/screensharing.png')} />
        </span>)
        var recorScreenImg = (<span className="hint--bottom" aria-label="Record screen!">
            <img alt="recordScreen" onClick={this.recordFullScreen} height="100%" width="100%" src={require('../../../images/download.jpg')} />
        </span>)
        var svaedStff = (<span>
            <FiMail onClick={this.openIssueList} className="dragoMail" />
        </span>)


        if ((this.props.screenAction === FULL_SCREEN_SHARE && this.props.isSceenSharing)) {

            profilePic = (<div>
                <span  >
                    <MdCallEnd
                        onClick={this.endCall}
                        className="img__overlay"
                        style={{
                            padding: "10px"
                        }} />
                </span>
                <img alt="profilePic"
                    src={this.props.profilePic}
                    className="callPage-recieverImage"></img>
            </div>)
            recorScreenImg = (<div className="timerRunning">   <Countdown
                    
                date={Date.now() + this.props.timeAloted * 60 * 1000}
                renderer={this.child.renderer}
            />
            </div>);
            shareScreenImg = (
                <div  style={{marginTop:"5px"}}className="callPage-recieverImageDiv endCall"><span className="hint--bottom" aria-label="ShareScreen">
                            <MdFilterNone onClick={this.child.shareMyScreen} className="endButton" />
                            </span>
                            </div>);
            svaedStff = (
                <div className="recieverProfilePic">
                    <span className="tooltiptext" >
                        <div>
                            {ProfileHover}
                        </div>
                    </span>
                    <img alt="profile" src={this.props.twirecieverPrfilePic} className="profilePic"></img>
                </div>
            )
        }
        const getProfileDiv = (this.props.userid !== null) ? (
            <GetProfile userid={this.props.userid} />
        ) : (null)


        var details = null
        if (this.props.screenAction === FULL_SCREEN_RECORD) {
            details = (<FullScreenRecord
                socket={this.state.socket}
                closeImidiate={this.handleClose}
                reStoreDefault={this.handleClose}
                savefile={this.saveVideoData}
            />)
        }
        else if (this.props.screenAction === FULL_SCREEN_SHARE) {
            details = (<FullScreenShare
                socket={this.state.socket}
                onRef={ref => (this.child = ref)}
                closeImidiate={this.handleClose}
                reStoreDefault={this.handleClose}
                savefile={this.saveVideoData}
            />)
        }
        else {
            details = null
        }
        return (
            <div>
                {getProfileDiv}
                <Draggable

                    scale={1}
                    defaultPosition={{ x: 0, y: 10 }}
                    handle=".floatcontainer">
                    <div>
                        <div className="floatcontainer">
                            <div>
                                {profilePic}
                            </div>

                            <div className="screenShareBtn">
                                {shareScreenImg}
                            </div>
                            <div className="RecordBtn">
                                {recorScreenImg}

                            </div>
                            <div className="drago">
                                {svaedStff}
                            </div>

                        </div>

                        <div className="detailsFloaterMove" style={{ display: this.state.displayDetails }}>
                            {details}
                        </div>
                        <div className="detailsFloaterMove" >
                            {profileDetails}
                        </div>
                    </div>
                </Draggable>
                {/* <button className="buttonDark" onClick={this.closeme}>close</button> */}


            </div>
        )
    }
}
Floater.PropType = {
    stillAuthenicated: PropType.func.isRequired,
    saveExtensionDetails: PropType.func.isRequired,
    saveSourceId: PropType.func.isRequired,
    displayFullScrenRecord: PropType.func.isRequired,
    displayFullScreShare: PropType.func.isRequired,
    creatAnsProject: PropType.func.isRequired,
    getProfileDetails: PropType.func.isRequired,
    resetValues: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    cancelSuccess: PropType.func.isRequired,
    JustRecord: PropType.func.isRequired
};
const mapStateToProps = state => ({
    profilePic: state.auth.profilePic,
    userName: state.auth.userName,
    userid: state.auth.id,
    extSource: state.extension.source,
    isSceenSharing: state.tools.isFullScreenSharing,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    screenAction: state.tools.screenAction,
    recieverProfileImage: state.call.recieverProfileImage,
    recieverUserName: state.call.recieverUserName,
    recieverUserId: state.call.recieverUserId,
    timeAloted:state.call.noOfMinutes,
    twirecieverPrfilePic: state.twitterApi.twitterProfilePic
})
export default connect(mapStateToProps, {
    stillAuthenicated,
    saveExtensionDetails,
    getProfileDetails,
    cancelAllMessageAction,
    restAllToolValue,
    resetValues,
    cancelSuccess,
    saveSourceId,
    displayFullScrenRecord,
    displayFullScreShare,
    JustRecord,
    creatAnsProject
})(Floater)

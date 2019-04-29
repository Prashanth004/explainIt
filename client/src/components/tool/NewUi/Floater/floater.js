import React, { Component } from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import PropType from 'prop-types';
import './floater.css';
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
            origin: null,
            socket: null,
            gotmessage: false,
            displayDetails: "none"
        }
        this.recordFullScreen = this.recordFullScreen.bind(this);
        this.shareFullScreenShare = this.shareFullScreenShare.bind(this);
        this.saveVideoData = this.saveVideoData.bind(this);
        this.endShareScreen = this.endShareScreen.bind(this);
        this.openIssueList = this.openIssueList.bind(this);
        this._handleDoubleClickItem = this._handleDoubleClickItem.bind(this)
    }
    componentWillMount() {
        this.props.stillAuthenicated();
        const socket = socketIOClient(config.base_dir);
        this.setState({
            socket: socket
        })
    }
    recordFullScreen() {
        if (this.state.displayDetails === "none") {
            this.setState({
                displayDetails: "block"
            })
            this.props.displayFullScrenRecord()
        }
        else {
            this.setState({
                displayDetails: "none"
            })
        }
    }
    shareFullScreenShare() {
        if (this.state.displayDetails === "none") {
            this.setState({
                displayDetails: "block"
            })
            localStorage.setItem('issueId', null)
            this.props.displayFullScreShare()
        }
        else {
            this.setState({
                displayDetails: "none"
            })
        }
    }
    _handleDoubleClickItem(event) {
        this.child.endCall()
    }
    openIssueList() {
        window.open(config.react_url + '/saveditems')
    }
    saveVideoData(data, isPublic, text) {
        console.log("the data whcih is gonna get saved : ", data)
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
            console.log(" event :", event)


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
    }
  
    render() {

        const ProfileHover=(this.props.recieverUserId)?(
            <ProfileCard
                userId={this.props.recieverUserId} />
        ):(
            null
        )
      

        var shareScreenImg = (<span className="hint--bottom" aria-label="Share screen!">
            <img onClick={this.shareFullScreenShare} height="100%" width="100%" src={require('../../../images/screensharing.png')} />
        </span>)
        var recorScreenImg = (<span className="hint--bottom" aria-label="Record screen!">
            <img onClick={this.recordFullScreen} height="100%" width="100%" src={require('../../../images/download.jpg')} />
        </span>)
        var svaedStff = (<span>
            <FiMail onClick={this.openIssueList} className="dragoMail" />
        </span>)


        if ((this.props.screenAction === FULL_SCREEN_SHARE && this.props.isSceenSharing)) {
            recorScreenImg = null;
            shareScreenImg = null;
            svaedStff = (
                <div className="recieverProfilePic">
                    <span className="tooltiptext" >
                        <div>
                            {ProfileHover}
                        </div>
                    </span>
                    <img  onDoubleClick={this._handleDoubleClickItem} src={this.props.recieverProfileImage} className="profilePic"></img>
                </div>
            )
        }



        var details = null
        if (this.props.screenAction === FULL_SCREEN_RECORD) {
            details = (<FullScreenRecord
                socket={this.state.socket}
                closeImidiate={this.props.closeImidiate}
                reStoreDefault={this.props.reStoreDefault}
                savefile={this.saveVideoData}
            />)
        }
        else if (this.props.screenAction === FULL_SCREEN_SHARE) {
            details = (<FullScreenShare
                socket={this.state.socket}
                onRef={ref => (this.child = ref)}
                closeImidiate={this.props.closeImidiate}
                reStoreDefault={this.props.reStoreDefault}
                savefile={this.saveVideoData}
            />)
        }
        else {
            details = null
        }
        return (
            <div>
                <Draggable
              
                 scale={1}
                defaultPosition={{x: 0, y: 10}}
                    handle=".floatcontainer">
                    <div>
                        <div className="floatcontainer">
                            <div>
                                <img src={this.props.profilePic} className="profilePic"></img>
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
                    </div>
                </Draggable>


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

};
const mapStateToProps = state => ({
    profilePic: state.auth.profilePic,
    userName: state.auth.userName,
    isSceenSharing: state.tools.isFullScreenSharing,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    screenAction: state.tools.screenAction,
    recieverProfileImage: state.call.recieverProfileImage,
    recieverUserName: state.call.recieverUserName,
    recieverUserId: state.call.recieverUserId
})
export default connect(mapStateToProps, {
    stillAuthenicated,
    saveExtensionDetails,
    saveSourceId,
    displayFullScrenRecord,
    displayFullScreShare,
    creatAnsProject
})(Floater)

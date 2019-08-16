import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import socketIOClient from "socket.io-client";
import './css/toggle.css';
import IssueCard from './tool/NewUi/diaplyissues/issueCard'
import config from '../config/config'
import { setIssueId } from '../actions/issueActions';
import './css/project.css';
import { getAllReferral } from '../actions/referral'

import { initGA, loadPageView } from './tool/NewUi/container/ReactGa';
// import { Helmet } from "react-helmet";
import {initiateSocket} from '../actions/homeAction';
import CallNotification from './tool/NewUi/container/CallNotification';
import MobNav from './tool/NewUi/newNav/index';
import Setting from './tool/NewUi/newNav/setting'
import './css/newlanding.css';
import Navbar from './tool/NewUi/Navbar';
import { explainAuthentication } from '../actions/signinAction';
import { explainIssue } from '../actions/messageAction'
import { clearAnswers, fetchProjectbyIssue } from '../actions/projectActions'
import { saveReplyEmailOption } from '../actions/emailAction'
import { cancelAllMessageAction } from '../actions/messageAction';
import { restAllToolValue } from "../actions/toolActions";
import { resetValues } from '../actions/twitterApiAction';
import { resetExplainAction } from '../actions/explainAction';
import { resetLandingAction } from '../actions/landingAction'
import { saveExtensionDetails } from "../actions/extensionAction";


class Project extends Component {
  constructor(props) {
    super(props)
    this.state = {
      issueId: null,
      showModalExplain: false,
      showModalTwitterLogin: false,
      newIssueId: null,
      reAtempte: false,
      reducedWidth:false,
      socketinitiated:false,
    }
    this.reAtemptToFetch = this.reAtemptToFetch.bind(this)
    // this.initiateSocketLoc = this.initiateSocketLoc.bind(this);
    }
    // initiateSocketLoc() {
    //     this.props.initiateSocket();
    //     console.log("initialting sockets")
    //     this.setState({ socketinitiated: true });
    // }
    resize() {
        this.setState({ reducedWidth: window.innerWidth <= 700 });
        
    }


  reAtemptToFetch = () => { }
  componentWillMount() {
    this.props.getAllReferral();
    this.props.explainAuthentication();
    if(this.props.socket===null){
      this.props.initiateSocket()
    }
   
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resize());
    clearTimeout(this.reAtemptToFetch);
  }
  componentWillReceiveProps(nextProps){
    const self = this;
    if(nextProps.socket){
        console.log("iinitialting sockets right way")
        nextProps.socket.on(config.SAVED_NEW_PROJECT, data => {
          if (data.userId === this.props.userId) {
            self.setState({ showModalExplain: false });
            self.setState({reAtempte: true })
            clearTimeout(self.reAtemptToFetch)
            this.props.fetchProjectbyIssue(this.props.match.params.projectid);
          }
        })
    }

}
  componentDidMount() {
    this.setState({ reducedWidth: window.innerWidth <= 700 });
    if( socket !==null){
      if(!socket.connected){
          const socketloc = socketIOClient(config.base_dir);
          console.log("socket : ",socketloc)
          this.props.initiateSocket(socketloc)
      }
  }else{
      const socketloc = socketIOClient(config.base_dir);
      console.log("socket : ",socketloc)
      this.props.initiateSocket(socketloc)
  }
    initGA();
    loadPageView();
    const self = this
    window.addEventListener("resize", this.resize.bind(this));
    var issueId = this.props.match.params.projectid;
    this.reAtemptToFetch = setTimeout(() => {
      if (!self.state.reAtempte && self.props.failedToGet) {
        self.props.fetchProjectbyIssue(issueId);
      }
    }, 25000)
    var newIssueIdtemp = (localStorage.getItem('newIssueId'))
    this.setState({ newIssueId: newIssueIdtemp })
    this.props.clearAnswers(issueId)
    this.props.fetchProjectbyIssue(issueId);
    var socket = this.props.socket;
    if(socket!==null){
      socket.on(config.SAVED_NEW_PROJECT, data => {
        if (data.userId === this.props.userId) {
          self.setState({ showModalExplain: false });
          self.setState({reAtempte: true })
          clearTimeout(self.reAtemptToFetch)
          this.props.fetchProjectbyIssue(this.props.match.params.projectid);
        }
      })
    }
   
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
    // if (this.props.socket === null && !this.state.socketinitiated)
    // this.initiateSocketLoc();
    const msgStyling = { margin: "auto", marginTop: "250px", width: "50%", textAlign: "center" };
    const nav=(this.state.reducedWidth)?(<MobNav page={config.PEOJECT_PAGE}/>):(<Navbar page={config.PEOJECT_PAGE}  />)
    const project = (!this.props.setting)?(    <div className="projectPageMainDiv">
    <div className="projectContainer">
      <br />
      <IssueCard
        socket={this.props.socket}
        itsHome={(this.props.home === config.HOME) ? true : false}
        issue={this.props.questionProject}
        explainTool={this.props.explainTool} />
        
    </div>

  </div>):(<Setting  />)
    return (this.props.authAction) ? (
      (this.props.isFetchDone) ? (
        (!this.props.failedToGet) ? (
          <div>
            {/* <Helmet
           meta={[
    {"property": "twitter:card", "content": "player"},
    {"property": "twitter:url", "content": this.props.questionProject.videoPath},
    {"property": "twitter:title", "content": "Explain explaination"},
    {"property": "twitter:description", "content": this.props.questionProject.textexplain},
    {"property": "twitter:player", "content":  this.props.questionProject.videoPath},
    {"property": "twitter:player:width", "content":  "300px"},
    {"property": "twitter:player:width", "content":  "220px"}
  ]}/> */}
      {nav}
      <CallNotification />
        {project}
          </div>) : ((this.props.match.params.projectid === this.state.newIssueId) ? (<div style={msgStyling}><h3>
            <b>
              Processing your video. Please wait or try after some time
                </b>
          </h3></div>) : (<div style={msgStyling}>
            <h3><b>
              Project not found !
                      </b></h3>
            <p>It could either have got deleted or some prolem occured with saving the recorded content.</p>
          </div>
            ))) : (null)) : (null)

  }
}
Project.PropType = {
  setIssueId: PropType.func.isRequired,
  fetchProjectbyIssue: PropType.func.isRequired,
  cancelAllMessageAction: PropType.func.isRequired,
  restAllToolValue: PropType.func.isRequired,
  resetValues: PropType.func.isRequired,
  saveExtensionDetails: PropType.func.isRequired,
  saveReplyEmailOption: PropType.func.isRequired

};
const mapStateToProps = state => ({
  questionProject: state.projects.questProject,
  isAauthenticated: state.auth.isAuthenticated,
  userId: state.auth.id,
  isFullScreenRecording: state.tools.isFullScreenRecording,
  failedToGet: state.projects.failedToGet,
  isFetchDone: state.projects.isFetchDone,
  authAction: state.auth.authAction,
  isAuthenticated: state.auth.isAuthenticated,
  setting:state.nav.openSetting,
  socket:state.home.socket
})

export default connect(mapStateToProps, {
  clearAnswers,getAllReferral,
  saveExtensionDetails,
  cancelAllMessageAction,
  resetExplainAction,
  resetLandingAction,
  explainIssue,
  restAllToolValue,
  resetValues,initiateSocket,
  explainAuthentication,
  saveReplyEmailOption,
  setIssueId, fetchProjectbyIssue
})(Project)

import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import socketIOClient from "socket.io-client";
import './css/toggle.css';
import IssueCard from './tool/NewUi/diaplyissues/issueCard'
import config from '../config/config'
import { setIssueId } from '../actions/issueActions';
import './css/project.css';
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
      reAtempte: false
    }
    this.reAtemptToFetch = this.reAtemptToFetch.bind(this)
  }


  reAtemptToFetch=()=>{}
  componentWillMount() {
    this.props.explainAuthentication()
    const socket = socketIOClient(config.base_dir);
    this.setState({
      socket: socket
    })

  }
  componentWillUnmount(){
    clearTimeout(this.reAtemptToFetch)
  }
  componentDidMount() {
    const self = this

    var issueId = this.props.match.params.projectid;
    this.reAtemptToFetch = setTimeout(()=>{
      if(!self.state.reAtempte && self.props.failedToGet){
        self.props.fetchProjectbyIssue(issueId);
      }
    },25000)
    var newIssueIdtemp = (localStorage.getItem('newIssueId'))
    this.setState({ newIssueId : newIssueIdtemp})
    this.props.clearAnswers(issueId)
    this.props.fetchProjectbyIssue(issueId);
    var socket = this.state.socket
    socket.on(config.SAVED_NEW_PROJECT, data => {
      if (data.userId === this.props.userId) {
        self.setState({ showModalExplain: false });
        self.setState({reAtempte: true })
        clearTimeout(self.reAtemptToFetch)
        this.props.fetchProjectbyIssue(this.props.match.params.projectid);
      }
    })
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
    const msgStyling = {margin:"auto",marginTop:"250px", width:"50%", textAlign:"center"}
    return(this.props.authAction)?(
     (this.props.isFetchDone) ? (
      (!this.props.failedToGet)?(
      <div>
      <Navbar
            page="project" />
     <div className="projectPageMainDiv">
      <div className="projectContainer">
      <IssueCard 
      socket={this.state.socket}
      itsHome={(this.props.home === config.HOME)?true:false}
      issue={this.props.questionProject}
      explainTool={this.props.explainTool}/>
      </div>
     
      </div>
      </div>):((this.props.match.params.projectid === this.state.newIssueId)?(<div style={msgStyling}><h3>
                <b>
                Processing your video. Please wait or try after some time
                </b>
                </h3></div>):(<div style={msgStyling}>
                    <h3><b>
                     Project not found !
                      </b></h3>
                      <p>It could either have got deleted or some prolem occured with saving the recorded content.</p>
                  </div>
                ))):(null)):(null)
                
  }
}
Project.PropType = {
  setIssueId: PropType.func.isRequired,
  fetchProjectbyIssue: PropType.func.isRequired,
  cancelAllMessageAction: PropType.func.isRequired,
  restAllToolValue: PropType.func.isRequired,
  resetValues: PropType.func.isRequired,
  saveExtensionDetails: PropType.func.isRequired,
  saveReplyEmailOption :PropType.func.isRequired

};
const mapStateToProps = state => ({
  questionProject: state.projects.questProject,
  isAauthenticated: state.auth.isAuthenticated,
  userId: state.auth.id,
  isFullScreenRecording: state.tools.isFullScreenRecording,
  failedToGet: state.projects.failedToGet,
  isFetchDone: state.projects.isFetchDone,
  authAction:state.auth.authAction,
  isAuthenticated: state.auth.isAuthenticated,

})

export default connect(mapStateToProps, {
  clearAnswers,
  saveExtensionDetails,
  cancelAllMessageAction,
  resetExplainAction,
  resetLandingAction,
  explainIssue,
  restAllToolValue,
  resetValues,
  explainAuthentication,
  saveReplyEmailOption,
  setIssueId, fetchProjectbyIssue
})(Project)

import React, { Component } from 'react'
import Issue from './issueModal'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import socketIOClient from "socket.io-client";
import './css/toggle.css';
import { Button } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import config from '../config/config'
import { setIssueId } from '../actions/issueActions';
import './css/project.css';
import ExplainPage from './tool/NewUi/Explain/ExplainPage';
import { explainIssue } from '../actions/messageAction'
import { clearAnswers, fetchProjectbyIssue } from '../actions/projectActions'
import Navbar from './tool/NewUi/Navbar';
import Swal from 'sweetalert2';
import { FiX } from "react-icons/fi";
import TwitterLogin from './tool/NewUi/TwitterLogin'
import ReactModal from 'react-modal';
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
    this.toggleModalCreate = this.toggleModalCreate.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.reStoreDefault = this.reStoreDefault.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.reAtemptToFetch = this.reAtemptToFetch.bind(this)
  }
  reStoreDefault = () => {
    if (this.props.isFullScreenRecording) {
      confirmAlert({
        title: "Are you sure?",
        message: "You won't be able to revert this!",
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.handleCloseModal()
          },
          {
            label: 'No',
            onClick: () => this.handleCancel()
          }
        ]
      })
    }
    else {
      this.handleCloseModal()
    }

  }
  handleCancel() {

  }
  handleOpenModal(e) {
    if (this.props.isAauthenticated) {
      this.props.explainIssue()
      this.props.setIssueId(this.props.match.params.projectid)
      localStorage.setItem("issueId", this.props.match.params.projectid)
      this.setState({ showModalExplain: true });
      this.props.saveReplyEmailOption(Number(this.state.issueId), this.props.userId)
    }
    else {
      this.setState({ showModalTwitterLogin: true });
    }
  }
  handleCloseModal() {
    this.setState({ showModalExplain: false });
    this.setState({ showModalTwitterLogin: false });
    this.props.cancelAllMessageAction();
    this.props.restAllToolValue();
    this.props.resetValues();
    this.props.resetLandingAction();
    this.props.resetExplainAction();
  }

  reAtemptToFetch=()=>{}
  componentWillMount() {
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
    this.setState({
      issueId: issueId
    })
    const socket = socketIOClient(config.base_dir);
    this.setState({
      socket: socket
    })

  }
  componentWillUnmount(){
    clearTimeout(this.reAtemptToFetch)
  }
  componentDidMount() {
    var socket = this.state.socket
    var self = this;
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
  toggleModalCreate = () => {
    if (this.props.isAauthenticated) {
      this.props.setIssueId(this.state.issueId)
      localStorage.setItem("issueId", this.state.issueId)
      // window.open(config.react_url+'/explainIt', "_blank")
    }
    else {
      Swal.fire(
        'You should login'
      )
    }
  }
  render() {
    const msgStyling = {margin:"auto",marginTop:"250px", width:"50%", textAlign:"center"}
    const explinDiv = (this.state.showModalExplain) ? (<div >
      <Button style={{ fontSize: "px", height: "35px", width: "35px" }} close onClick={this.reStoreDefault} />
      <ExplainPage
        questionProject={this.props.questionProject}
        handleCloseModal={this.handleCloseModal} />
    </div>) : (<button className="buttonDark explainBtn"
      style={{
        foat: "right",
        marginLeft: "80%"
      }}
    
      onClick={this.handleOpenModal}>Explain</button>)
    return (this.props.isFetchDone ? (
      (!this.props.failedToGet)?(<div className="mainContainer">
          <Navbar
            page="project" />
          <div className="projectContainer">
            <Issue />

            {explinDiv}
            <ReactModal
              isOpen={this.state.showModalTwitterLogin}
              contentLabel="Minimal Modal Example"
              className="ModalA"
              overlayClassName="OverlayA"
            >
              <div>

                <div onclick={this.handleCloseModal} className="closeModalBtn">
                  <span>
                    <FiX className="closeIcon" onClick={this.handleCloseModal} />
                  </span>
                </div>
                <TwitterLogin
                  handleCloseModal={this.handleCloseModal} />
              </div>

            </ReactModal>


          </div>
        </div>):(
          (this.props.match.params.projectid === this.state.newIssueId)?(<div style={msgStyling}><h3>
            <b>
            Processing your video. Please wait or try after some time
            </b>
            </h3></div>):(
              <div style={msgStyling}>
                <h3><b>
                  Invalid Url
                  </b></h3>
              </div>
            )
        )
        ) : (null))
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
  isFetchDone: state.projects.isFetchDone

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
  saveReplyEmailOption,
  setIssueId, fetchProjectbyIssue
})(Project)

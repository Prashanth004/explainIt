import React, { Component } from 'react'
import Issue from './issueModal'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import socketIOClient from "socket.io-client";
import './css/toggle.css';
import config from '../config/config'
import { setIssueId } from '../actions/issueActions';
import './css/project.css';
import ExplainPage from './tool/NewUi/ExplainPage';
import {explainIssue} from '../actions/messageAction'
import {clearAnswers, fetchProjectbyIssue} from '../actions/projectActions'
import Navbar from './tool/NewUi/Navbar';
import Swal from 'sweetalert2';
import { FiX } from "react-icons/fi";
import TwitterLogin from './tool/NewUi/TwitterLogin'
import ReactModal from 'react-modal';
import { cancelAllMessageAction } from '../actions/messageAction';
import { restAllToolValue } from "../actions/toolActions";
import { resetValues } from '../actions/twitterApiAction';
import { saveExtensionDetails, saveSourceId } from "../actions/extensionAction";

class Project extends Component {
  constructor(props){
    super(props)
    this.state={
      issueId: null,
      showModalExplain: false,
            showModalTwitterLogin: false,
    }
    this.toggleModalCreate = this.toggleModalCreate.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  handleOpenModal(e) {
    if (this.props.isAauthenticated) {
        this.props.explainIssue()
      this.props.setIssueId(this.props.match.params.projectid)
      localStorage.setItem("issueId",this.props.match.params.projectid)
      this.setState({ showModalExplain: true });
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
}
  componentWillMount(){
      var issueId=this.props.match.params.projectid;
      this.props.clearAnswers(issueId)
      this.props.fetchProjectbyIssue(issueId);
      this.setState({
        issueId:issueId
      })
      const socket = socketIOClient(config.base_dir);
      this.setState({
          socket: socket
      })

  }
  componentDidMount(){
    var socket = this.state.socket
    var self = this;
    socket.on(config.SAVED_NEW_PROJECT,data=>{
        if(data.userId === this.props.userId){
            this.props.fetchProjectbyIssue(this.props.match.params.projectid);
        }
    })
    function postMessageHandler(event) {
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
    return (
      <div className="mainContainer">
        <Navbar 
        page="project"/>
        <div className="projectContainer">
          <Issue />
          <button className="buttonDark explainBtn" 
          style={{foat:"right",
       marginLeft:"80%"}}
          onClick={this.handleOpenModal}>Explain</button>
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

                        <ReactModal
                            isOpen={this.state.showModalExplain}
                            contentLabel="Minimal Modal Example"
                            className="ModalA"
                            overlayClassName="OverlayA">
                            <div >
                                <div onclick={this.handleCloseModal} className="closeModalBtn">
                                    <span>
                                        <FiX className="closeIcon" onClick={this.handleCloseModal} />
                                    </span>
                                </div>
                                <ExplainPage
                                    handleCloseModal={this.handleCloseModal} />
                            </div>
                            {/* <button onClick={this.handleCloseModal}>Close Modal</button> */}
                        </ReactModal>

        </div>  
      </div>
    )
  }
}
Project.PropType = {
  setIssueId: PropType.func.isRequired,
  fetchProjectbyIssue: PropType.func.isRequired,
  cancelAllMessageAction:PropType.func.isRequired,
  restAllToolValue:PropType.func.isRequired,
  resetValues:PropType.func.isRequired,
  saveExtensionDetails:PropType.func.isRequired,
  
};
const mapStateToProps = state => ({
  isAauthenticated: state.auth.isAuthenticated,
  userId: state.auth.id,
})

export default connect(mapStateToProps, {clearAnswers,
  saveExtensionDetails, 
  cancelAllMessageAction,
  explainIssue,
  restAllToolValue,
  resetValues,
  setIssueId, fetchProjectbyIssue})(Project)

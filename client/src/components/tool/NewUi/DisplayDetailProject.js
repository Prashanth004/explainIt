import React, { Component } from 'react'
import '../../css/displayProjectDetail.css'
import config from '../../../config/config'
import axios from 'axios';
import Navbar from './Navbar';
import { Button } from 'reactstrap'
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import socketIOClient from "socket.io-client";
import { setIssueId } from '../../../actions/issueActions';
import TwitterLogin from './TwitterLogin'
import { FiX } from "react-icons/fi";
import ExplainPage from './Explain/ExplainPage';
import { cancelAllMessageAction } from '../../../actions/messageAction';
import { restAllToolValue } from "../../../actions/toolActions";
import { resetValues } from '../../../actions/twitterApiAction'
import { saveExtensionDetails } from "../../../actions/extensionAction";


class DisplayProjectDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      answerProjects: [],
      DetailsOfPeople: [],
      questionProject: [],
      showModalExplain: false,
      showModalTwitterLogin: false,
      selected:null
    }
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.changeValues = this.changeValues.bind(this)
  }
  handleOpenModal(e) {
    if (this.props.isAauthenticated) {
      this.props.setIssueId(e.target.id)
      localStorage.setItem("issueId", e.target.id)
      this.setState({ showModalExplain: true });
    }
    else {
      this.setState({ showModalTwitterLogin: true });
    }

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
  changeValues(e) {

    const clickedProject = (this.state.DetailsOfPeople).filter(projects =>
        projects.projectid === e.target.id)
    this.setState({
        selected: clickedProject[0].projectid
    })
    this.video.src = clickedProject[0].videofilepath
    this.explainTxt.innerText=clickedProject[0].textexplain
    this.profileiPic.src =clickedProject[0].profilepic
    this.name.src =clickedProject[0].username


}
  handleCloseModal() {

    this.setState({ showModalExplain: false });
    this.setState({ showModalTwitterLogin: false });
    this.props.cancelAllMessageAction();
    this.props.restAllToolValue();
    this.props.resetValues();
  }
  componentWillMount() {
    var self = this
    var token = JSON.parse(localStorage.getItem('token'));
    const socket = socketIOClient(config.base_dir);
    this.setState({
      socket: socket
    })
    axios({
      method: 'get',
      url: config.base_dir + '/api/project/issues/' + this.props.match.params.issueid,
      headers: {
        "Authorization": token,
      }
    }).then((response) => {
      if (response.status === 200 || response.status === 304) {
        var allProjects = response.data.data
        if (allProjects.length !== 0) {
          allProjects.forEach(function (projects, index) {
            axios({
              method: 'get',
            
              url: config.base_dir + '/api/users/id/' + projects.userid,
            }).then(response => {
              if (response.status === 200) {
                const newTestJson = JSON.parse(JSON.stringify(allProjects));
                newTestJson[index]['profilepic'] = response.data.data.profilepic;
                newTestJson[index]['username'] = response.data.data.username;
                newTestJson[index]['id'] = response.data.data.id
                newTestJson[index]['twitterhandle'] = response.data.data.twitterhandle
                allProjects = newTestJson
                var answerProject = allProjects.filter(project => project.isquestion !== "true")
                var questionProject = allProjects.filter(projects => projects.isquestion === 'true')
                self.setState({
                  answerProjects: answerProject,
                  DetailsOfPeople: answerProject,
                  questionProject: questionProject
                })
              }
            })
              .catch(err => {
                console.log("error : ", err)
              })
          })
        }
      }
    })
      .catch(err => {
        console.log("error while fetchinf projects : ", err)
      })
  }
  render() {
    console.log("this.state.questionProject :",this.state.questionProject)
    var video = null;
    var name = null;
    var profileImage = null;
    var explained = null;
    var ExplainItbutton = null;
    var explainText = null
    if ((this.state.questionProject).length > 0) {
      video = ((this.state.questionProject).length > 0) ? (
        <video controls    ref={a => this.video = a} className="detailVideoElement" src={this.state.questionProject[0].videofilepath}></video>
      ) : (null)
      name = (<span  ref={a => this.name = a} className="detailsProfileName"><b>{this.state.questionProject[0].username}</b></span>)
      profileImage = (<img alt="profleimage" src={this.state.questionProject[0].profilepic}
        ref={a => this.profileiPic = a} 
        className="detailsProfileImg"></img>)
      ExplainItbutton = (<button
        id={this.state.questionProject[0].issueid}
        className="buttonDark DetailsBtn"
        onClick={this.handleOpenModal}>ExplainIt</button>
      )
      explainText=(<p   ref={a => this.explainTxt = a}  >{this.state.questionProject[0].textexplain}</p>)
    }


    if ((this.state.answerProjects).length > 0) {
      explained = (this.state.answerProjects).map((issue, index) => (
        <div 
        id={issue.projectid} 
        onClick={this.changeValues}
        style={{
          backgroundColor: (this.state.selected === issue.projectid) ? "rgb(239, 225, 245)" : "white",
          borderStyle:(this.state.selected=== issue.projectid) ?"block":"none",
          boxShadow:(this.state.selected=== issue.projectid) ? "0px 0px 0px 0px":"0px 0px 5px 1px rgba(136, 135, 135, 0.151)" 
          
      }}
         key={issue.projectid}className="explainedPersonCard">
        {/* <div className="deatilsProfileImgContain"> */}
          <img 
          alt="explained person's profilepic"
           id={issue.projectid} src={issue.profilepic} style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            margin:"auto",
            marginTop:"-5px",
            marginLeft:"3px",
            boxShadow: "0px 0px 6px 2px rgba(136, 135, 135, 0.31)"

            
          }}></img>
          {/* </div> */}
          <p id={issue.projectid} className="detailsExplaination">{issue.textexplain}</p>
        </div>
      ))
    
    }
    else {
      explained = <p>No explainations yet. You can explain by clicking explainIt button</p>
    }
    const ExplainItDiv = (this.state.showModalExplain) ? (
      <div>
          <Button style={{ fontSize: "px", height: "35px", width: "35px" }} close onClick={this.reStoreDefault} />
          <div className="ExplainItDivBottom">
          <ExplainPage
                   socket={this.state.socket}
                 
                   // issue={this.props.issue.issueid}
                   questionProject={this.state.questionProject[0]}
                    handleCloseModal={this.handleCloseModal} />
          </div>
      </div>
  ) : (null)

    return (<div>
      <Navbar />
      <div className="detailProjectConatiner">
        <div className="detailVideoElementSection">
          <div className="deatilsVideoCard">
            <div className="nameSection">
              {profileImage}
              {name}
            </div>
            <div className="detailTextExplain">
            {explainText}
            </div>
            <div className="VideoSection">
              {video}
            </div>
            <div className="footerSection">
              {ExplainItbutton}
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

              {/* <ReactModal
                isOpen={this.state.showModalExplain}
                contentLabel="Minimal Modal Example"
                className="ModalA"
                overlayClassName="OverlayA"
              >
                <div >
                  <div onclick={this.handleCloseModal} className="closeModalBtn">
                    <span>
                      <FiX className="closeIcon" onClick={this.handleCloseModal} />
                    </span>
                  </div>
                  <ExplainPage
                   socket={this.state.socket}
                 
                   // issue={this.props.issue.issueid}
                   questionProject={this.state.questionProject[0]}
                    handleCloseModal={this.handleCloseModal} />
                </div>
                {/* <button onClick={this.handleCloseModal}>Close Modal</button> */}
              {/* </ReactModal>  */}
              {ExplainItDiv}
            </div>
          </div>
        </div>
        <div className="detailExplainedPeopleDiv">
        <div className="detailExplainedPeopleSection">
        <p>Explained</p>
          {explained}
          </div>

        </div>
      </div>
    </div>
    )
  }
}

DisplayProjectDetail.PropType = {
  setIssueId: PropType.func.isRequired,
  saveExtensionDetails: PropType.func.isRequired,
  cancelAllMessageAction:PropType.func.isRequired,
  restAllToolValue:PropType.func.isRequired,
  resetValues:PropType.func.isRequired


};
const mapStateToProps = state => ({
  isAauthenticated: state.auth.isAuthenticated,

})

export default connect(mapStateToProps, { 
  cancelAllMessageAction,
  restAllToolValue,
  resetValues,setIssueId, saveExtensionDetails })(DisplayProjectDetail)





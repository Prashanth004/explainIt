import React, { Component } from 'react'
import '../../css/newlanding.css'
import Navbar from './Navbar'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import IssueDetils from '../../issueModal'
import { connect } from 'react-redux';
import { SCREEN_SHARE, SCREEN_RECORD } from '../../../actions/types';
import CopyToClipboard from '../CopytoClipboard'
import Explain from './Explainit'
import Froms from '../Form';
import {  setIssueId } from '../../../actions/issueActions';
import { fetchProjectbyIssue, clearAnswers } from '../../../actions/projectActions';
import { stillAuthenicated } from '../../../actions/signinAction';
import { getProfileDetails } from '../../../actions/profileAction'
import PropType from 'prop-types';
import LoginMadal from '../../LoginModal';
import { Redirect } from 'react-router-dom';
// import ImagesOfExplainers from './DisplayExplained'
import Swal from 'sweetalert2'
import config from '../../../config/config'
import ProfileCard from './ProfileCard'
import IssueDisplay from './DisplayIssues'
import Content from './Content'
import { Animated } from "react-animated-css";
import { saveExtensionDetails, saveSourceId } from "../../../actions/extensionAction";
import {restAllToolValue} from "../../../actions/toolActions";
import {cancelSuccess,fetchIssues} from "../../../actions/issueActions";
import {getProfileByTwitterHandle } from "../../../actions/visitProfileAction";
import  Cryptr from 'cryptr'
import { openParticipated,openCreated } from "../../../actions/navAction";




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
            isHome : false
          
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

    }
    
    reloadPage() {
        window.location.reload();
    }
    
        // this.props.stillAuthenicated()


    closeParticipated() {

        this.setState({
            showProjects: false,
            showParticipatedIssue: false,
            showCreatedIssue: false,
            
        })
    }

    componentDidMount() {
        this.props.stillAuthenicated()
        var self = this
                function postMessageHandler(event) {
            if (event.data.sourceId !== undefined) {
                console.log("epxlain got a message!");
                console.log("* Message:", event.data);
                console.log("* Origin:", event.origin);
                console.log("* Source:", event.source);
                console.log("*event.data.message__sourceId : ", event.data.sourceId)
                self.props.saveSourceId(event.data.sourceId)
            }

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
    componentWillMount() {
        // this.props.stillAuthenicated();
        console.log("this.props.match.params.encrTwitterHandle :",this.props.match.params.encrTwitterHandle)
        this.props.getProfileByTwitterHandle(this.props.match.params.encrTwitterHandle)
        localStorage.setItem("peerId",JSON.stringify(this.props.match.params.encrTwitterHandle))
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

        if (classOfClicked !== "singleMember" && classOfClicked !== "explainAnswer" && classOfClicked !== "displayPeople" && classOfClicked !== "likes" && classOfClicked !== "numberOfPeople" && idOfClicked !== "explainIt" && idOfClicked !== "audio" && idOfClicked !== "tweet" && idOfClicked !== "shareScreen" && idOfClicked !== "imageOfPeople" && classOfClicked !== "buttonDark explainItBtn") {
            if (this.state.modal === false) {
                this.props.clearAnswers(e.target.id)
                this.props.fetchProjectbyIssue(e.target.id);
            }
            this.setState({
                modal: !this.state.modal
            });
        }
    }
  
    handleCancel(){
        
    }
    reStoreDefault = () => {
        if(this.props.screenAction!==null){
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

    handleConfirm(){
        this.props.restAllToolValue();
        this.props.cancelSuccess();
        this.setState({
            openExplain: false
        })
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

    render() {

        var open = this.state.openDialog
        var deatilsModal = null
        deatilsModal = (<IssueDetils />)
        var issuesCreated = this.props.myissues;
        var issuesParicipated = this.props.showProjects

        var self = this
        window.addEventListener('storage', function (event) {
            if (event.key == 'token') {
                self.reloadPage()
            }
        })
        var explainDiv = null;
        var feedDiv = null;
        var trueFalse = this.state.showParticipatedIssue;
        if (this.props.isAauthenticated) {
            if (this.state.openExplain) {
                explainDiv = (<Explain reStoreDefault={this.reStoreDefault} />)
            }
            if (this.props.created) {
                feedDiv = (
                    <Animated animationIn="slideInLeft" animationOut="zoomOut" isVisible={this.props.created}>
                        <div className="issueContainer" >
                            <div className="closeBtnHolder">
                            </div>
                            <IssueDisplay togglemodal={this.togglemodal} explainTool={this.explainTool} issueArray={issuesCreated} />
                        </div>
                    </Animated>)
            }
            if (this.props.participated) {
                feedDiv = (
                    <Animated animationIn="slideInRight" animationOut="zoomOut" isVisible={this.props.participated}>

                        <div className="issueContainer" >

                            <div className="closeBtnHolder">
                            </div>
                            <IssueDisplay togglemodal={this.togglemodal} explainTool={this.explainTool} issueArray={this.props.participatedIssues} />
                        </div>
                    </Animated>)

            }
        }
        if (this.props.isAauthenticated) {
            if (this.props.screenAction === SCREEN_RECORD ||
                this.props.screenAction === SCREEN_SHARE || 
                this.props.participated ||
                this.props.created) {
                var profileCardElement = null
            }
            else {
              
                if(this.state.openExplain){
                    var explainItBtn= null
                }
                else{
                    var explainItBtn=(<button className="buttonDark explainBtn" onClick={this.toodleExplain}>Explain</button>)
                }
                if(this.props.userId!=null){
                  var profileCardElement = (
                    <div className="ProfileDiv"><ProfileCard
                    isHome={this.state.isHome}
                        userId={this.props.userId}
                        toggleCreatedIssue={this.toggleCreatedIssue}
                        toggleParticipatedIssue={this.toggleParticipatedIssue} />
                       
                        {explainItBtn}
                    </div>
                    
                )
                }
              
            }
        }
        else {
            var profileCardElement = (<Content />)
        }


        var self = this

        return (this.props.authAction)?((!this.props.isAauthenticated) ? (<Redirect to={{ pathname: '/login' }} />):(
            <div className="fullHome">
                <Navbar />
                <div className="containerHome">
                    <div>
                        {profileCardElement}
                    </div>

                    <div >
                        {explainDiv}


                    </div>

                    <div>
                        {feedDiv}
                    </div>


                </div>
         


                <Modal isOpen={this.state.modal} toggle={this.togglemodal} className={this.props.className}>

                    <ModalBody className="modalBody">
                        {deatilsModal}
                    </ModalBody>

                </Modal>


                <Modal isOpen={this.state.modalTool} toggle={this.explainTool} className={this.props.className}>

                    <ModalBody className="modalBodyTool">
                        <LoginMadal />
                    </ModalBody>

                </Modal>

            </div>
               )):(null)
    }
}
NewHome.PropType = {
    fetchIssues: PropType.func.isRequired,
    issues: PropType.array.isRequired,

    fetchProjectbyIssue: PropType.func.isRequired,
    setIssueId: PropType.func.isRequired,
    getProfileDetails: PropType.func.isRequired,
    saveExtensionDetails: PropType.func.isRequired,
    saveSourceId: PropType.func.isRequired,
    restAllToolValue:PropType.func.isRequired,
    cancelSuccess:PropType.func.isRequired,
    getProfileByTwitterHandle:PropType.func.isRequired,
    openParticipated:PropType.func.isRequired,
    openCreated:PropType.func.isRequired
};
const mapStateToProps = state => ({
    issues: state.issues.items,
    screenAction: state.tools.screenAction,
    newissueIem: state.issues.newissueIem,
    isAauthenticated: state.auth.isAuthenticated,
    profilePic: state.auth.profilePic,
    userName: state.auth.userName,
    myissues: state.profile.myIssues,
    participatedIssues: state.profile.participatedIssue,
    twitterHandle :state.profile.twitterHandle,
    email: state.auth.email,
    userId: state.visitProfile.id,
    participated : state.nav.openParticipated,
    created : state.nav.openCreated,
    authAction:state.auth.authAction

})

export default connect(mapStateToProps, {restAllToolValue, openCreated, openParticipated, getProfileByTwitterHandle,fetchIssues, cancelSuccess, saveExtensionDetails, saveSourceId, fetchProjectbyIssue, setIssueId, getProfileDetails, clearAnswers, stillAuthenicated, fetchProjectbyIssue, setIssueId })(NewHome)

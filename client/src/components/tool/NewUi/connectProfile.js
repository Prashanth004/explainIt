import React, { Component } from 'react'
import '../../css/newlanding.css';
import { Redirect } from 'react-router-dom';
import PageNotFount from './NoMatch';
import DisplayCreated from './DisplayCreated'


import Navbar from './Navbar'
import '../../css/NewSignin.css'
import TwitterLogin from 'react-twitter-auth';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { Modal, ModalBody} from 'reactstrap';
import IssueDetils from '../../issueModal'
import { connect } from 'react-redux';
import { SCREEN_SHARE, SCREEN_RECORD } from '../../../actions/types';
import Explain from './Explainit'
import {  setIssueId } from '../../../actions/issueActions';
import { fetchProjectbyIssue, clearAnswers } from '../../../actions/projectActions';
import { stillAuthenicated,twitterAuthFailure,signInWithTwitter } from '../../../actions/signinAction';
import { getProfileDetails } from '../../../actions/profileAction'
import PropType from 'prop-types';
import LoginMadal from '../../LoginModal';
import Swal from 'sweetalert2'
import config from '../../../config/config'
import ProfileCard from './ProfileCard'
import IssueDisplay from './DisplayIssues'
import Content from './Content'
// import { openParticipated,openInbox, openCreated } from "../../../actions/navAction";

import { Animated } from "react-animated-css";
import { saveExtensionDetails, saveSourceId } from "../../../actions/extensionAction";
import {restAllToolValue} from "../../../actions/toolActions";
import {cancelSuccess,fetchIssues} from "../../../actions/issueActions";
import {getProfileByTwitterHandle } from "../../../actions/visitProfileAction";
import {getRecpientId} from '../../../actions/twitterApiAction'
import {openInbox, openParticipated,openCreated } from "../../../actions/navAction";
import { stat } from 'fs';
import ProfileNotOnExplain from './ProfileNotOnExplain'
import ProfileNotOnTwitter from './ProfileNotOnTwitter'

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
            isHome : false,
            isVisitProfile:true
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
        this.toggleInbox = this.toggleInbox.bind(this);
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
        if(!this.props.isPresentInExplain){
            // alert("dnvnvnfkn")
            const twiHand = this.props.match.params.encrTwitterHandle.replace("@","")
            this.props.getRecpientId(twiHand)
        }
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
        this.props.stillAuthenicated()
        if(this.props.match.params.encrTwitterHandle===null){
            alert("empty")
        }
        const twiHand = this.props.match.params.encrTwitterHandle.replace("@","")
        console.log("this.props.match.params.encrTwitterHandle :",twiHand)
        this.props.getProfileByTwitterHandle(twiHand)
        localStorage.setItem("peerId",JSON.stringify(twiHand))
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
    toggleInbox(){
        var self = this
        this.setState({
            showProjects: true,
            openExplain: false
        })
        this.props.openCreated()
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
       
        if(this.props.authTwitterHandle===this.props.match.params.encrTwitterHandle){
          
             this.props.history.push("/");
         }
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
        var loginButton = (this.props.isAauthenticated)?
        (null):((this.props.created || this.props.participated)? (null):(<TwitterLogin className="buttonDark twitterButton" loginUrl={config.base_dir+"/api/twitter/auth/twitter"}
        onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
        requestTokenUrl={config.base_dir+"/api/twitter/auth/twitter/reverse"} />))
          
        
        // if (this.props.isAauthenticated) {
            if (this.state.openExplain) {
                explainDiv = (<Explain reStoreDefault={this.reStoreDefault} />)
            }
            if (this.props.created) {
                feedDiv = (
                    <Animated animationIn="slideInLeft" animationOut="zoomOut" isVisible={this.props.created}>
                        <div className="issueContainer" >
                            <div className="closeBtnHolder">
                            </div>
                            <IssueDisplay togglemodal={this.togglemodal} home={config.NOT_HOME} explainTool={this.explainTool} issueArray={issuesCreated} />
                            {/* <DisplayCreated home={config.NOT_HOME} issueArray={(issuesCreated).reverse()} /> */}

                        </div>
                    </Animated>)
            }
            if (this.props.participated) {
                feedDiv = (
                    <Animated animationIn="slideInRight" animationOut="zoomOut" isVisible={this.props.participated}>

                        <div className="issueContainer" >

                            <div className="closeBtnHolder">
                            </div>
                            <IssueDisplay togglemodal={this.togglemodal} home={config.NOT_HOME} explainTool={this.explainTool} issueArray={this.props.participatedIssues} />
                        </div>
                    </Animated>)

            }
        // }
        // if (this.props.isAauthenticated) {
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
                    toggleInbox={this.toggleInbox}
                        userId={this.props.userId}
                        toggleCreatedIssue={this.toggleCreatedIssue}
                        toggleParticipatedIssue={this.toggleParticipatedIssue} />
                    </div>
                )
                }
            }
        // }
        // else {
        //     var profileCardElement = (<Content />)
        // }
        var self = this
        const twiHand = this.props.match.params.encrTwitterHandle.replace("@","")
        return (this.props.authAction)?(
            // (!(this.props.twitterHandle===this.props.match.params.encrTwitterHandle))?(
            (!!this.props.fetchProfile)?(
            (!!this.props.isPresentInExplain)?(
            <div className="fullHome">
                <Navbar
                page="profile"
                twitterHandle={twiHand} />
                <div className="containerHome">
                    <div>
                        {profileCardElement}
                    </div>
                    <div className="twitterBtnDiv">
                   {loginButton}
                    </div>
{/* {explainDiv} */}

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

            </div>):(
                (this.props.doneGettingId)?(
                    (this.props.profilePresentOnTwitter)?(
                    <ProfileNotOnExplain
                    isVisitProfile={this.state.isVisitProfile}
                    twitterhandle={this.props.match.params.encrTwitterHandle} />
             ):(
                 <PageNotFount />
             )
            ):(null)
               
            )
        ):(null)
    // ):(<Redirect to="/"/>)

               ):(null)
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
    openCreated:PropType.func.isRequired,
    getRecpientId :PropType.func.isRequired,
    twitterAuthFailure: PropType.func.isRequired,
    signInWithTwitter: PropType.func.isRequired,
    openInbox:PropType.func.isRequired
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
    authTwitterHandle:state.auth.twitterHandle,
    email: state.auth.email,
    userId: state.visitProfile.id,
    fetchProfile:state.visitProfile.fetchProfile,
    isPresentInExplain:state.visitProfile.isPresent,
    participated : state.nav.openParticipated,
    created : state.nav.openCreated,
    authAction:state.auth.authAction,
    doneGettingId : state.twitterApi.doneFetching,
    twitterId : state.twitterApi.twitterId,
    profilePresentOnTwitter:state.twitterApi.profilePresent

})

export default connect(mapStateToProps, {openInbox,twitterAuthFailure,signInWithTwitter, restAllToolValue,getRecpientId, openCreated, openParticipated, getProfileByTwitterHandle,fetchIssues, cancelSuccess, saveExtensionDetails, saveSourceId, fetchProjectbyIssue, setIssueId, getProfileDetails, clearAnswers, stillAuthenicated, fetchProjectbyIssue, setIssueId })(NewHome)

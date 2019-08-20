import React, { Component } from 'react'
import '../../../css/newlanding.css';
import Setting from '../newNav/setting';
import MobNav from '../newNav/index'
import Navbar from '../Navbar';
import Cotactlist from '../contactlist/contactsDisplay';
import { setVisitProfile } from "../../../../actions/visitProfileAction";
import HomeProjects from '../diaplyissues/displayVisitCards'
import CallNotification from '../container/CallNotification';
import AddtoContact from '../contactlist/addToContact'
import '../../../css/NewSignin.css';
import { displayFullScrenRecord, displayFullScreShare } from '../../../../actions/toolActions'
import { creatAnsProject } from '../../../../actions/projectActions'
import TwitterLogin from 'react-twitter-auth';
import { connect } from 'react-redux';
import { setIssueId } from '../../../../actions/issueActions';
import { fetchProjectbyIssue, clearAnswers } from '../../../../actions/projectActions';
import { twitterAuthFailure, signInWithTwitter } from '../../../../actions/signinAction';
import { getProfileDetails } from '../../../../actions/profileAction'
import PropType from 'prop-types';
import config from '../../../../config/config'
import ProfileCard from '../ProfileCard'
import { saveExtensionDetails, saveSourceId } from "../../../../actions/extensionAction";
import { restAllToolValue } from "../../../../actions/toolActions";
import { cancelSuccess, fetchIssues } from "../../../../actions/issueActions";

class NewHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHome: false,
            currentAtionStatus: null,
            reducedWidth: false,
        }
        this.saveVideoData = this.saveVideoData.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.resize = this.resize.bind(this);
    }
    resize() {
        this.setState({ reducedWidth: window.innerWidth <= 700 });
    }
    reloadPage(event) {
        if (event.key === 'token') {
            window.location.reload();
        }
        if (event.key === 'currentAction') {
            const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
            this.setState({ currentAtionStatus: currentAtionStatus })
        }
    }

    componentDidMount() {
        this.setState({ reducedWidth: window.innerWidth <= 700 });
        var self = this;
        window.addEventListener("resize", this.resize.bind(this));
        function postMessageHandler(event) {
            if (event.data.sourceId !== undefined) {
                self.props.saveSourceId(event.data.sourceId)
            }
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
    componentWillUnmount() {
        window.removeEventListener("resize", this.resize());
        window.removeEventListener('storage', this.reloadPage)
    }
    componentWillMount() {
        const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
        this.setState({ currentAtionStatus: currentAtionStatus });
        this.props.setVisitProfile(this.props.twiHand);
    }


    saveVideoData(videoData, audioData, isPublic, text, action) {
        var condition = this.props.issueId == null || this.props.issueId === undefined
        var issueId = (condition) ? null : this.props.issueId;
        var imgData = "null";
        var items = {}
        const isquestion = (condition) ? "true" : "false"
        this.props.creatAnsProject(text, imgData, videoData, audioData, items, isquestion, issueId, isPublic, action)
    }



    render() {
        var sharabeLink = config.react_url + "/" + this.props.authTwitterHandle;
        var homeProjects = null;
        const twiHand = this.props.twiHand;
        var issuepercentage = "100%";
        const nav = (this.state.reducedWidth) ? (<MobNav page={config.VISIT_PROFILE_PAGE} />) : (<Navbar page={config.VISIT_PROFILE_PAGE}
            twitterHandle={twiHand} />)

        var self = this
        window.addEventListener('storage', function (event) {
            if (event.key === 'token') {
                self.reloadPage()
            }
        })
        const setting = (this.props.settings) ? (<Setting />) : (null)
        var loginButton = (this.props.isAauthenticated) ?
            (null) : ((this.props.created || this.props.participated) ? (null) : (<TwitterLogin className="buttonDark twitterButton" loginUrl={config.base_dir + "/api/twitter/auth/twitter"}
                onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
                requestTokenUrl={config.base_dir + "/api/twitter/auth/twitter/reverse"} />))

        if (this.props.participated ||
            this.props.inbox ||
            this.props.settings ||
            this.props.created) {
            var profileCardElement = null;
            homeProjects = null;
        }
        else {
            if (this.props.userId !== null) {
                profileCardElement = (<ProfileCard
                    currentAtionStatus={this.state.currentAtionStatus}
                    isHome={this.state.isHome}
                    sharabeLink={sharabeLink}
                    userId={this.props.userId}
                    saveVideoData={this.saveVideoData} />);
                homeProjects = (<div className="issueContainer" style={{ width: issuepercentage }}>

                    <HomeProjects home={config.NOT_HOME} issueArray={this.props.myissues} />
                </div>)

            }
        }
        const addToContactDiv = (this.props.isAauthenticated) ? (<AddtoContact contactid={this.props.userId} />) : (null)
        const contactList = this.props.showContacts?(<div style={{width:"380px",margin:"auto",marginTop:"0px"}}><Cotactlist  /></div>):(null)

        return (<div className="fullHome">
            {nav}
            <CallNotification />
            <div className="containerHome" style={{ display: "grid", gridTemplateColumns: "33% 33% 33%" }}>
               <div></div>
               <div>
                <div>
                    {profileCardElement}
                </div>
                <div className="twitterBtnDiv">
                    {loginButton}
                </div>
                <div>
                    {setting}
                </div>
                <div>
                    {addToContactDiv}
                </div>
                {homeProjects}
                </div>
                <div>{contactList}</div>
            </div>
        </div>)
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
    restAllToolValue: PropType.func.isRequired,
    cancelSuccess: PropType.func.isRequired,
    openParticipated: PropType.func.isRequired,
    openCreated: PropType.func.isRequired,
    twitterAuthFailure: PropType.func.isRequired,
    signInWithTwitter: PropType.func.isRequired,
};
const mapStateToProps = state => ({
    issues: state.issues.items,
    showContacts:state.profileCard.showContacts,
    screenAction: state.tools.screenAction,
    newissueIem: state.issues.newissueIem,
    isAauthenticated: state.auth.isAuthenticated,
    profileid: state.auth.id,
    profilePic: state.auth.profilePic,
    userName: state.auth.userName,
    myissues: state.profile.myIssues,
    participatedIssues: state.profile.participatedIssue,
    twitterHandle: state.profile.twitterHandle,
    authTwitterHandle: state.auth.twitterHandle,
    email: state.auth.email,
    userId: state.home.id,
    participated: state.nav.openParticipated,
    created: state.nav.openCreated,
    inbox: state.nav.openInbox,
    settings: state.nav.openSetting,
    isSceenSharing: state.tools.isFullScreenSharing,
    isFullScreenRecording: state.tools.isFullScreenRecording,
})

export default connect(mapStateToProps, {
    creatAnsProject, setVisitProfile, twitterAuthFailure, displayFullScrenRecord, displayFullScreShare, signInWithTwitter, restAllToolValue, fetchIssues, cancelSuccess, saveExtensionDetails, saveSourceId, fetchProjectbyIssue, setIssueId, getProfileDetails, clearAnswers,
})(NewHome)

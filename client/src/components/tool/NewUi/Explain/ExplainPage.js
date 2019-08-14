import React, { Component } from 'react'
import { cancelAllMessageAction} from '../../../../actions/messageAction'
import { restAllToolValue } from "../../../../actions/toolActions";
import { resetValues } from '../../../../actions/twitterApiAction'
import {cancelSuccess} from '../../../../actions/issueActions'
import TwitterLogin from 'react-twitter-auth';
import ExplainOptions from './explainOptions'
import { connect } from 'react-redux';
import browser from 'browser-detect';
import {FiArrowLeft} from "react-icons/fi";
import { explainAuthentication } from '../../../../actions/signinAction';
import {resetIssueActions} from '../../../../actions/projectActions'
import config from '../../../../config/config'
import { twitterAuthFailure,signInWithTwitter } from '../../../../actions/signinAction';
import {resetExplainAction} from '../../../../actions/explainAction'
import '../../../css/ExplainpPage.css'
import PropType from 'prop-types';
import { creatAnsProject } from '../../../../actions/projectActions';
import { saveExtensionDetails} from "../../../../actions/extensionAction";
import {resetAllReferralAction} from '../../../../actions/referral';
class ExplainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            twitterHandle:null,
            currentAtionStatus:false,
            mobile:false
        }
        this.saveVideoData = this.saveVideoData.bind(this);
        this.reStoreDefault = this.reStoreDefault.bind(this);
    }

    componentWillMount(){
        const result = browser();
        if(result.mobile){
            this.setState({ mobile:true})
        }
        const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
        this.setState({ currentAtionStatus: currentAtionStatus });
        this.props.explainAuthentication();
        this.props.resetExplainAction();
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const refreshFloater = {type:config.REFRESH_EXPLAIN_FLOATER,
            data:{}}
        if (this.props.extSource !== null) source.postMessage(refreshFloater, origin);
        else window.postMessage(refreshFloater, "*")
        const twitterHandle = (window.location.href).split("/")[3]
        this.setState({twitterHandle:twitterHandle})
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.props.resetIssueActions();
        this.props.resetAllReferralAction();

    }
    // eslint-disable-next-line no-dupe-class-members

    componentWillUnmount(){
        
        this.props.resetExplainAction();
    }
   
  
    reStoreDefault(){
        this.props.handleCloseModal();
    }
    saveVideoData(videoData, audioData, isPublic, text, action) {
        var issueId = JSON.parse(localStorage.getItem("issueId"));
        var imgData = "null";
        var items = {}
        var isquestion = "false"
        this.props.creatAnsProject(text, imgData, videoData, audioData, items, isquestion, issueId, isPublic, action)
    }

    render() {
        var widthDiv = null;
        const {mobile} = this.state;
        if (this.props.showCanvas) {
            widthDiv = "95%";
        }
        else {
            widthDiv = "95%";
        }
       
        return (this.props.authAction)?((this.props.isAuthenticated)?
        (!mobile?(<div className="explainItBackgroung">
            <ExplainOptions
             socket={this.props.socket}
            widthDiv={widthDiv}
            currentAtionStatus={this.state.currentAtionStatus}
            questionProject={this.props.questionProject}
            questioProjectArray={this.props.questioProjectArray}
            reStoreDefault={this.reStoreDefault}
            savefile={this.saveVideoData} />
            </div>):(<div> <FiArrowLeft  onClick={this.reStoreDefault} />
            <p>Please use the desktop version to continue</p>
            </div>)):
            (<div>
                <FiArrowLeft  onClick={this.reStoreDefault} />
                <div className="requestLogin">
                <h3>You need to Login</h3>
                <TwitterLogin className="buttonDark twitterButton" loginUrl={config.base_dir+"/api/twitter/visit/auth/twitter"}
        onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
        requestTokenUrl={config.base_dir+"/api/twitter/visit/auth/twitter/reverse/"+this.state.twitterHandle} />
        </div>
        </div>
            )):(null)
        
    }
}

ExplainPage.PropType = {
    creatAnsProject: PropType.func.isRequired,
    saveExtensionDetails: PropType.func.isRequired,
    twitterAuthFailure:PropType.func.isRequired,
    signInWithTwitter:PropType.func.isRequired,
    resetExplainAction:PropType.func.isRequired,


};
const mapStateToProps = state => ({
    error: state.issues.error,
    issueId: state.issues.currentIssueId,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    success: state.issues.successCreation,
    showCanvas: state.canvasActions.showCanvas,
    isAuthenticated: state.auth.isAuthenticated,
    cancelAllMessageAction:PropType.func.isRequired,
    restAllToolValue:PropType.func.isRequired,
    extSource: state.extension.source,
    extOrigin: state.extension.origin,
    extSourceId: state.extension.sourceId,
    authAction: state.auth.authAction,


})

export default connect(mapStateToProps, { 
    saveExtensionDetails, 
    cancelAllMessageAction,
    restAllToolValue,resetAllReferralAction,
    explainAuthentication,
    resetExplainAction,
    resetValues,
    twitterAuthFailure,
    signInWithTwitter,
    cancelSuccess,
    resetIssueActions,
    creatAnsProject })(ExplainPage)



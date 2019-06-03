import React, { Component } from 'react'
import { Button } from 'reactstrap'; 
import { cancelAllMessageAction} from '../../../../actions/messageAction'
import { restAllToolValue } from "../../../../actions/toolActions";
import { resetValues } from '../../../../actions/twitterApiAction'
import {cancelSuccess} from '../../../../actions/issueActions'
import TwitterLogin from 'react-twitter-auth';
import ExplainOptions from './explainOptions'
import { connect } from 'react-redux';
import {resetIssueActions} from '../../../../actions/projectActions'

import {resetLandingAction } from '../../../../actions/landingAction'
import config from '../../../../config/config'
import { twitterAuthFailure,signInWithTwitter } from '../../../../actions/signinAction';
import {resetExplainAction} from '../../../../actions/explainAction'
import '../../../css/ExplainpPage.css'
import PropType from 'prop-types';
import { creatAnsProject } from '../../../../actions/projectActions';
import { saveExtensionDetails} from "../../../../actions/extensionAction";
class ExplainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            twitterHandle:null
        }
        this.saveVideoData = this.saveVideoData.bind(this);
        this.reStoreDefault = this.reStoreDefault.bind(this);
    }

    componentWillMount(){
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const refreshFloater = {type:config.REFRESH_EXPLAIN_FLOATER,
            data:{}}
        if (this.props.extSource !== null) source.postMessage(refreshFloater, origin);
        else window.postMessage(refreshFloater, "*")
        const twitterHandle = (window.location.href).split("/")[3]
        this.setState({twitterHandle:twitterHandle})
        this.props.resetExplainAction();
        this.props.cancelAllMessageAction();
        this.props.resetLandingAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.props.resetIssueActions();

    }
  
    reStoreDefault(){
        this.props.handleCloseModal();
    }
 
    saveVideoData(data,isPublic,text, action) {
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
        this.props.creatAnsProject(textExplain, imgData, data,null, items, isquestion, issueId,isPublic,action)
    }
    render() {
        var widthDiv = null;
        if (this.props.showCanvas) {
            widthDiv = "95%";
        }
        else {
            widthDiv = "95%";
        }
        return (this.props.isAuthenticated)?
        (<ExplainOptions
            widthDiv={widthDiv}
            questionProject={this.props.questionProject}
            handleCloseModal={this.props.handleCloseModal}
            reStoreDefault={this.reStoreDefault}
            savefile={this.saveVideoData} />):(
                <div>
                <Button close onClick={this.reStoreDefault} />
                <div className="requestLogin">
                <h3>You need to Login</h3>
                <TwitterLogin className="buttonDark twitterButton" loginUrl={config.base_dir+"/api/twitter/visit/auth/twitter"}
        onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
        requestTokenUrl={config.base_dir+"/api/twitter/visit/auth/twitter/reverse/"+this.state.twitterHandle} />
        </div>
        </div>
            )
        
    }
}

ExplainPage.PropType = {
    creatAnsProject: PropType.func.isRequired,
    saveExtensionDetails: PropType.func.isRequired,
    twitterAuthFailure:PropType.func.isRequired,
    signInWithTwitter:PropType.func.isRequired,
    resetExplainAction:PropType.func.isRequired,
    resetLandingAction:PropType.func.isRequired


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

})

export default connect(mapStateToProps, { 
    saveExtensionDetails, 
    cancelAllMessageAction,
    restAllToolValue,
    resetLandingAction,
    resetExplainAction,
    resetValues,
    twitterAuthFailure,
    signInWithTwitter,
    cancelSuccess,
    resetIssueActions,
    creatAnsProject })(ExplainPage)



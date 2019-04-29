import React, { Component } from 'react'
import { Button } from 'reactstrap'; 

import TwitterLogin from 'react-twitter-auth';
import Screenrecorder from './explainItRecorder';
import { connect } from 'react-redux';
import config from '../../../config/config'
import { twitterAuthFailure,signInWithTwitter } from '../../../actions/signinAction';
import { cancelAllMessageAction } from '../../../actions/messageAction'
import { restAllToolValue } from "../../../actions/toolActions";
import { confirmAlert } from 'react-confirm-alert'; // Import
import '../../css/ExplainpPage.css'
import PropType from 'prop-types';
import { creatAnsProject } from '../../../actions/projectActions';
import { saveExtensionDetails, saveSourceId } from "../../../actions/extensionAction";


import '../../css/ExplainpPage.css'
class ExplainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            twitterHandle:null
        }
        this.saveVideoData = this.saveVideoData.bind(this);
        this.closeFunction = this.closeFunction.bind(this)
    }

    componentWillMount(){
        const twitterHandle = (window.location.href).split("/")[3]
        this.setState({
            twitterHandle:twitterHandle
        })
    }
    componentDidMount() {
        var self = this
        
    }
    closeFunction(){
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.handleCloseModal();
    }
    reStoreDefault = () => {
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
    handleCancel = () => {

    }

    handleConfirm = () => {
        window.close()
    }
    saveVideoData(data,isPublic,text) {
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
        this.props.creatAnsProject(textExplain, imgData, data, items, isquestion, issueId,isPublic)
    }
    render() {
        var widthDiv = null;
        if (this.props.showCanvas) {
            widthDiv = "95%";
        }
        else {
            widthDiv = "95%";
        }
        return (this.props.isAuthenticated)?(
            <div className="explainMain">
                <div className="recorderConatainerPage" style={{ width: widthDiv }}>
                    <Screenrecorder
                        handleCloseModal={this.props.handleCloseModal}
                        reStoreDefault={this.reStoreDefault}
                        savefile={this.saveVideoData} />
                </div>


            </div>):(
                <div>
                <Button close onClick={this.closeFunction} />
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
    signInWithTwitter:PropType.func.isRequired


};
const mapStateToProps = state => ({
    error: state.issues.error,
    issueId: state.issues.currentIssueId,
    success: state.issues.successCreation,
    showCanvas: state.canvasActions.showCanvas,
    isAuthenticated: state.auth.isAuthenticated,
    cancelAllMessageAction:PropType.func.isRequired,
    restAllToolValue:PropType.func.isRequired

})

export default connect(mapStateToProps, { 
    saveExtensionDetails, 
    cancelAllMessageAction,
    restAllToolValue,
    twitterAuthFailure,
    signInWithTwitter,
    creatAnsProject })(ExplainPage)



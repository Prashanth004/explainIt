import React, { Component } from 'react'
import TwitterLogin from 'react-twitter-auth';
import { connect } from 'react-redux';
import config from '../../../config/config'
import { twitterAuthFailure,signInWithTwitter } from '../../../actions/signinAction';
import { cancelAllMessageAction } from '../../../actions/messageAction'
import { restAllToolValue } from "../../../actions/toolActions";
import '../../css/ExplainpPage.css'
import PropType from 'prop-types';
import { creatAnsProject } from '../../../actions/projectActions';
import { saveExtensionDetails } from "../../../actions/extensionAction";


import '../../css/ExplainpPage.css'
class ExplainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            twitterHandle:null
        }
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
    closeFunction(){
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.handleCloseModal();
    }

   
    render() {
        if(this.props.isAuthenticated){
            this.closeFunction()
        }
        // var widthDiv = null;
      
        return(
                <div>
                {/* <Button close onClick={this.closeFunction} /> */}
                <div className="requestLogin">
                <h3>You need to login to <b>Explain</b></h3><br/>
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



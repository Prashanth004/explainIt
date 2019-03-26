import React, { Component } from 'react'
import ShareScreen from './enitreScreenShare'
import FullScreenRecord from './FullScreenRecord'
import { SCREEN_SHARE, SCREEN_RECORD, FULL_SCREEN_SHARE, FULL_SCREEN_RECORD } from '../../../actions/types';

import '../../css/shareWindow.css'
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { creatAnsProject } from '../../../actions/projectActions';
import { saveExtensionDetails, saveSourceId } from "../../../actions/extensionAction";



class ShareWindow extends Component {
    constructor(props){
        super(props)
        this.state={

        }
        this.saveVideoData =this.saveVideoData.bind(this)
    }
    componentDidMount(){
        var self = this
        function postMessageHandler(event) {
            console.log(" event :", event)
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



    saveVideoData(data, isPublic) {
        console.log("the data whcih is gonna get saved : ", data)
        var issueId = JSON.parse(localStorage.getItem('issueId'))
        var textExplain = " "
        var imgData = "null"
        var items = {}
        var isquestion = " "
        if (issueId == null || issueId === undefined) {
          isquestion = "true"
          issueId = null
        }
        else {
          isquestion = "false"
        
        }
        console.log("type of is public : ",typeof(isPublic))
        this.props.creatAnsProject(textExplain, imgData, data, items, isquestion, issueId,isPublic)
      }
  render() {
    if (this.props.screenAction === FULL_SCREEN_RECORD) {
        var shareElement = (<div className="containerWindow">
          <FullScreenRecord
           
            savefile={this.saveVideoData}
          />
        </div>)
      }
      else{
        var shareElement = (<div className="containerWindow">
        <ShareScreen savefile={this.saveVideoData} />
      </div>)
      }
    return (
        <div className="sepWindow">
     {shareElement}
      </div>
    )
  }
}
ShareWindow.PropType = {
    creatAnsProject: PropType.func.isRequired,
    saveExtensionDetails: PropType.func.issaveExtensionDetailsRequired,
 
};
const mapStateToProps = state => ({
    error: state.issues.error,
    issueId: state.issues.currentIssueId,
    success: state.issues.successCreation, 
    showCanvas:state.canvasActions.showCanvas,
    screenAction: state.tools.screenAction,
   
})

export default connect(mapStateToProps, { saveExtensionDetails,
     creatAnsProject})(ShareWindow)




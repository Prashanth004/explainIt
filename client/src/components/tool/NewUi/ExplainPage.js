import React, { Component } from 'react'
import Navbar from './Navbar'
import Screenrecorder from './FullScreenRecord';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; // Import
import '../../css/ExplainpPage.css'
import PropType from 'prop-types';
import { creatAnsProject } from '../../../actions/projectActions';
import { saveExtensionDetails, saveSourceId } from "../../../actions/extensionAction";


import '../../css/ExplainpPage.css'
class ExplainPage extends Component {
    constructor(props){
        super(props)
        this.state={

        }
        this.saveVideoData =this.saveVideoData.bind(this)
    }


    componentDidMount(){
      var self = this
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
  handleCancel=()=>{

  }

      handleConfirm=()=>{
        window.close()
      }
    saveVideoData(data) {
        console.log("the data whcih is gonna get saved : ", data)
        var issueId = localStorage.getItem('issueId')
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
        this.props.creatAnsProject(textExplain, imgData, data, items, isquestion, issueId)
      }
  render() {
      var widthDiv = null;
      if(this.props.showCanvas){
        widthDiv="55%";
      }
      else{
        widthDiv="45%";
      }
    return (
      <div className="explainMain">
          <Navbar />
          <div className="recorderConatainerPage" style={{width:widthDiv}}>
          <Screenrecorder 
          reStoreDefault={this.reStoreDefault}
          savefile={this.saveVideoData} />
          </div>
        
        
      </div>
    )
  }
}

ExplainPage.PropType = {
    creatAnsProject: PropType.func.isRequired,
    saveExtensionDetails: PropType.func.issaveExtensionDetailsRequired,

};
const mapStateToProps = state => ({
    error: state.issues.error,
    issueId: state.issues.currentIssueId,
    success: state.issues.successCreation, 
    showCanvas:state.canvasActions.showCanvas
   
})

export default connect(mapStateToProps, { saveExtensionDetails, creatAnsProject})(ExplainPage)



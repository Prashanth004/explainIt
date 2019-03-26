import React, { Component } from 'react'
import Navbar from './Navbar'
import Screenrecorder from './FullScreenRecord';
import { connect } from 'react-redux';
import '../../css/ExplainpPage.css'
import PropType from 'prop-types';
import { creatAnsProject } from '../../../actions/projectActions'

import '../../css/ExplainpPage.css'
class ExplainPage extends Component {
    constructor(props){
        super(props)
        this.state={

        }
        this.saveVideoData =this.saveVideoData.bind(this)
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
          <Screenrecorder savefile={this.saveVideoData} />
          </div>
        
        
      </div>
    )
  }
}

ExplainPage.PropType = {
    creatAnsProject: PropType.func.isRequired,
 
};
const mapStateToProps = state => ({
    error: state.issues.error,
    issueId: state.issues.currentIssueId,
    success: state.issues.successCreation, 
    showCanvas:state.canvasActions.showCanvas
   
})

export default connect(mapStateToProps, { creatAnsProject})(ExplainPage)



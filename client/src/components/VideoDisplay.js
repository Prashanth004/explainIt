import React, { Component } from 'react';
import {  fetchProjectbyIssue } from '../actions/projectActions';
import { connect } from 'react-redux';


class VideoPlayer extends Component {
    componentDidMount(){
        var issueId = this.props.match.params.projectid;
        this.props.fetchProjectbyIssue(issueId);
    }
  render() {
      var videoDivStyle = {width:"100%",height:"100%"}
    return (
      <div style={videoDivStyle}>
        <video width="100%" height="100%" src={this.props.questionProject.videofilepath}></video>
      </div>
    )
  }
}



const mapStateToProps = state => ({
    questionProject: state.projects.questProject
  
  })
  
  export default connect(mapStateToProps, {
  fetchProjectbyIssue
  })(VideoPlayer)
  
import React, { Component } from 'react'
import Issue from './issueModal'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import './css/project.css'
import {clearAnswers, fetchProjectbyIssue} from '../actions/projectActions'
import Navbar from './Navbar';

class Project extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }
  componentWillMount(){
      var issueId=this.props.match.params.projectid;
      this.props.clearAnswers(issueId)
      this.props.fetchProjectbyIssue(issueId);

  }
  render() {
    return (
      <div className="mainContainer">
        <Navbar />
        <div className="projectContainer">
          <Issue />
        </div>  
      </div>
    )
  }
}
Project.PropType = {
  fetchProjectbyIssue: PropType.func.isRequired,
};
const mapStateToProps = state => ({
 
})

export default connect(mapStateToProps, {clearAnswers, fetchProjectbyIssue})(Project)

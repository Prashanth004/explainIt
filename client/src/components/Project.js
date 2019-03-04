import React, { Component } from 'react'
import Issue from './issueModal'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { setIssueId } from '../actions/issueActions';
import './css/project.css'
import {clearAnswers, fetchProjectbyIssue} from '../actions/projectActions'
import Navbar from './Navbar';
import Swal from 'sweetalert2';
import config from '../config/config'

class Project extends Component {
  constructor(props){
    super(props)
    this.state={
      issueId: null
    }
    this.toggleModalCreate = this.toggleModalCreate.bind(this)
  }
  componentWillMount(){
      var issueId=this.props.match.params.projectid;
      this.props.clearAnswers(issueId)
      this.props.fetchProjectbyIssue(issueId);
      this.setState({
        issueId:issueId
      })

  }
  toggleModalCreate = () => {
    if (this.props.isAauthenticated) {
      this.props.setIssueId(this.state.issueId)
      localStorage.setItem("issueId", this.state.issueId)
      window.open(config.react_url+'/explainIt', "_blank")
  }
  else {
      Swal.fire(
          'You should login'
        )
  }
}
  render() {
    return (
      <div className="mainContainer">
        <Navbar />
        <div className="projectContainer">
          <Issue />
          <button className="buttonDark explainBtn" onClick={this.toggleModalCreate}>Explain</button>

        </div>  
      </div>
    )
  }
}
Project.PropType = {
  setIssueId: PropType.func.isRequired,
  fetchProjectbyIssue: PropType.func.isRequired,
};
const mapStateToProps = state => ({
  isAauthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {clearAnswers,setIssueId, fetchProjectbyIssue})(Project)

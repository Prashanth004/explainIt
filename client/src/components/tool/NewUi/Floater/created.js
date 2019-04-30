import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { getProfileDetails } from '../../../../actions/profileAction';
import { openParticipated, openCreated } from "../../../../actions/navAction";
import IssueDisplay from '../DisplayIssues';
import './floater.css';
import config from '../../../../config/config';
import Navbar from '../Navbar';



class Created extends Component {
    componentWillMount(){
        this.props.getProfileDetails(this.props.userId, config.SELF);
        this.props.openCreated()
    }
    
  render() {
    var issuesCreated = (this.props.myissues)
    var feedDiv = null
    
    if(issuesCreated!==null){

    if (this.props.created && !this.props.participated ) {
       
        feedDiv = (
                <div className="issueContainer" >
                    <IssueDisplay home={config.HOME} explainTool={this.explainTool} issueArray={(issuesCreated).reverse()} />
                    {/* <DisplatCreated home={config.HOME} issueArray={(issuesCreated).reverse()} /> */}
                </div>)
    }
    else if (this.props.participated && !this.props.created) {
       
        feedDiv = (
                <div className="issueContainer" >
                    <IssueDisplay home={config.HOME} explainTool={this.explainTool} issueArray={this.props.participatedIssues} />
               {/* <DisplatCreated home={config.HOME} issueArray={this.props.participatedIssues}/> */}
                </div>)
    }
    else{
        feedDiv = (
            <div className="issueContainer" >
                <IssueDisplay home={config.HOME} explainTool={this.explainTool} issueArray={(issuesCreated).reverse()} />
                {/* <DisplatCreated home={config.HOME} issueArray={(issuesCreated).reverse()} /> */}
            </div>)
    }
}


    return (
      <div>
          <Navbar />
        {feedDiv}
      </div>
    )
  }
}
Created.PropType = {
    getProfileDetails:PropType.func.isRequired
};
const mapStateToProps = state => ({
    isAauthenticated: state.auth.isAuthenticated,
    participated: state.nav.openParticipated,
    created: state.nav.openCreated,
    myissues: state.profile.myIssues,
    participatedIssues: state.profile.participatedIssue,
})
export default connect(mapStateToProps, {
    getProfileDetails,
    openCreated,
    openParticipated
})(Created)


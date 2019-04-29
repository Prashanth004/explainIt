import React, { Component } from 'react';
import '../../css/Displaycreated.css';
import config from '../../../config/config'
import IssueCard from './issueCardNew';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { deleteProjects, checkPublicValue } from '../../../actions/projectActions';
import { confirmAlert } from 'react-confirm-alert';


class Displatcreaated extends Component {
  constructor(props){
    super(props)
    this.state={
      itsHome:false,
      issueArray:[]
    }
    this.deleteProjects = this.deleteProjects.bind(this);
    this.handlePublicPrives = this.handlePublicPrives.bind(this)
  }
  deleteProjects(e) {
    this.setState({
        deleteItemId: e.target.id
    })
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
handleCancel() {

}
componentDidMount(){
  this.setState({
      issueArray :this.props.issueArray
  })
}
handlePublicPrives(e) {
  this.props.checkPublicValue(e.target.id)
}
handleConfirm() {
    var id = this.state.deleteItemId
    this.props.deleteProjects(id);
    const newState = this.state;
    const index = newState.issueArray.findIndex(a => a.issueid === id);

    if (index === -1) return;
    newState.issueArray.splice(index, 1);

    this.setState(newState); // 

}
  componentWillMount(){
    if (this.props.home === config.HOME)
    this.setState({
        itsHome: true
    })
else
    this.setState({
        itsHome: false
    })
  }
  render() {
    var issueItems = null
    if(this.state.issueArray !== null){
      if ((this.state.issueArray).length === 0) {
          issueItems = (<div className="emptyIssues">
              <p>Not participated in any discussions</p>
          </div>)
      }
      else {
          issueItems =this.state.issueArray.map((issue, index) => (
            <div className="createdCard">
             <IssueCard 
             deleteProjects={this.deleteProjects}
             projectId={this.state.projectId}
             itsHome={this.state.itsHome}
             handlePublicPrives={this.handlePublicPrives}
             issue={issue}/>
             </div>
          ))
      }
    }
    return (
      <div className="CreatedContainer">
        {issueItems}
      
      </div>
    )
  }
}

Displatcreaated.PropType = {
  deleteProjects: PropType.func.isRequired,
  checkPublicValue: PropType.func.isRequired

};
const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {
  deleteProjects, checkPublicValue


})(Displatcreaated)

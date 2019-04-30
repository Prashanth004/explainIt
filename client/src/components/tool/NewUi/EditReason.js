import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {updatProjectReason} from '../../../actions/projectActions'


class EditTitle extends Component {
  constructor(props){
      super(props)
this.state={
    titleValue:"",
    submitClicked:false}
this.changeTitle = this.changeTitle.bind(this);
this.updateValue = this.updateValue.bind(this);
  }

  componentDidMount(){
    //   var reqProject=this.props.myissues.filter(project=>(project.issueid===this.props.editingModalId))
    var editTitle =  document.querySelector('#text_'+this.props.editingModalId);  
      this.setState({
        titleValue:editTitle.textContent
      })
  }
  updateValue(){
      this.setState({submitClicked:true})
      var editTitle =  document.querySelector('#text_'+this.props.editingModalId);  
      this.props.updatProjectReason(this.state.titleValue,this.props.editingModalId);
      editTitle.textContent = this.state.titleValue
  }

  changeTitle(e){
      this.setState({titleValue:e.target.value })
  }
 

  render() {
    return (this.state.submitClicked)?(
        <div>
            <p>Updating</p>
        </div>
    ):(
        <div style={{textAlign:"center"}}>
        <p><b>Enter the new Title/Hashtag</b></p>
        <textarea 
        rows="5"
        className="textEditArea"
        onChange={this.changeTitle}
        value={this.state.titleValue}></textarea>
        <br/>
        <button className="buttonDark" onClick={this.updateValue}>Submit</button>
      </div>     
    )
  }
}

EditTitle.PropType = {
    updatProjectReason:PropType.func.isRequired
   };

const mapStateToProps = state => ({
    isAauthenticated: state.auth.isAuthenticated,
    editingModalId:state.projects.editModalId,
    myissues: state.profile.myIssues,


})

export default connect(mapStateToProps, { 
    updatProjectReason,
    
})(EditTitle)





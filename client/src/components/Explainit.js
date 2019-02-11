import React, { Component } from 'react';
import Form from './tool/Form';
import Navbar from './Navbar';
import './css/explainit.css';
import {connect} from 'react-redux';
import PropType from  'prop-types'; 
import { setIssueId,cancelSuucessMessage, cancelValidationErrors } from '../actions/issueActions'



class Explainit extends Component {
  constructor(props){
    super(props)
    this.showErrorAlert = this.showErrorAlert.bind(this);
    this.showSuccessAlert = this.showSuccessAlert.bind(this);
  }
    componentWillMount(){
      this.props.setIssueId(JSON.parse(localStorage.getItem("issueId")))
       
    }
    showErrorAlert(){
      alert("Some error has occured. Please try after some time")
      this.props.cancelValidationErrors()
    
    }
    showSuccessAlert(){
      alert("Project Saved Successfully")
      this.props.cancelSuucessMessage()
  
     
    }
  render() {
    if(this.props.error){
      this.showErrorAlert()
    }
    if(this.props.success){
      this.showSuccessAlert()
    }
    return (
        <div>
            <Navbar />
      <div className="formContainer">
        <Form />
      </div>
      </div>
    )
  }
}
Explainit.PropType={
    setIssueId : PropType.func.isRequired,
    cancelValidationErrors : PropType.func.issRequired,
    cancelSuucessMessage : PropType.func
}; 
const mapStateToProps = state =>({
  error: state.issues.error,
  success:state.issues.successCreation 
})
export default connect(mapStateToProps, {setIssueId,cancelSuucessMessage,cancelValidationErrors})(Explainit)


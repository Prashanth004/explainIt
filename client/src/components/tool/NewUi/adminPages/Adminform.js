import React from 'react'
import PropType from 'prop-types';
import { connect } from 'react-redux';
import {changeAdminUserName,submitAdminDetails,changeAdminPassword} from '../../../../actions/adminAction'

const AdminForm=(props)=>{
    const authFailMessage = (props.authFail)?
    (<span className="errMessages">
            Authentication failed. Incorrect input
        </span>):(null)
    const emptyUserName =(props.emptyUserName)?
        (<span className="errMessages">
            User name can not be empty
        </span>):(null)
    const emptyPassword = (props.emptyPassword)?
        (<span className="errMessages">
            Incorrect Password
        </span>):(null)
  return (
    <div className="adminFormContainer">
    <div className="adminTitle">
        <h1>Admin Login</h1>
    </div>
    <label>User Name :</label>
      <input className="adminInput"type="text" value={props.adminUserName} onChange={props.changeAdminUserName}></input>
      {emptyUserName}
      <label>Password : </label>
      <input className="adminInput" type = "password"value={props.adminPassword} onChange={props.changeAdminPassword}></input>
      {emptyPassword}
      <br/>
      <br/>
      <button className="buttonDark" onClick={()=>props.submitAdminDetails(props.adminUserName,props.adminPassword)}>Submit</button>
      <br/>
      {authFailMessage}
    </div>
  )
}

AdminForm.PropType = {
    changeAdminPassword: PropType.func.isRequired,
    changeAdminUserName: PropType.func.isRequired,
    submitAdminDetails: PropType.func.isRequired,
}
const mapStateToProps = function(state) {
    return {
      adminUserName: state.admin.userName,
      adminPassword: state.admin.password,
      emptyUserName:state.admin.emptyUserName,
      emptyPassword:state.admin.emptyPassword,
      authFail : state.admin.authFail
    }
  }
  
  export default connect(mapStateToProps,{changeAdminUserName,
    changeAdminPassword,
    submitAdminDetails
})(AdminForm);

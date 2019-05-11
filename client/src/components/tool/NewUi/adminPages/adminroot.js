import React from 'react'
import AdminForm from './Adminform'
import AdminDashBoard from './adminDash';
import { connect } from 'react-redux';
import '../../../css/admin.css'


const adminRoot =(props) => {
 const dashDiv= (!props.login)?(<AdminForm />):(<AdminDashBoard details={props.usedetails}/>)
return(<div className="adminDiv">
  {dashDiv}
</div>)
}

const mapStateToProps = function(state) {
    return {
      login: state.admin.login,
      usedetails:state.admin.userDetails
    }
  }
  
  export default connect(mapStateToProps)(adminRoot);



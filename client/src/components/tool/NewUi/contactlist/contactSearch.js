import React from 'react';
import { connect } from 'react-redux';
import {updateContact,changeContactSearch} from '../../../../actions/contactAction'


const seachComponent =  (props) => {
    
    const {changeContactSearch,mycontacts} =props
  return (
    <div className="contactSearchBarDiv">
      <div style={{width:"100%",marginBottom:"10px"}}>
          <input className="contactSearch"onChange={(e)=>changeContactSearch(e.target.value,mycontacts)}type="text" placeholder="Search contacts"></input>
      </div >
     
    </div>
  )
}
const mapStateToProps = state => ({
    mycontacts:state.contact.mycontacts,
    
})
export default connect(mapStateToProps, {updateContact,changeContactSearch})(seachComponent)




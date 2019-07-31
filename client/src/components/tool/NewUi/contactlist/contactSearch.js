import React from 'react';
import { connect } from 'react-redux';
import {updateContact,changeContactSearch} from '../../../../actions/contactAction'


const seachComponent =  (props) => {
    
    const {changeContactSearch,mycontacts} =props
  return (
    <div className="contactSearchBarDiv">
      <div style={{width:"100%"}}>
          <input style={{width:"100%",padding:"3px",borderStyle:"solid", borderColor:"rgb(105, 105, 105)",borderWidth:"1px",borderRadius:"3px"}} onChange={(e)=>changeContactSearch(e.target.value,mycontacts)}type="text" placeholder="contacts"></input>
      </div >
      <div style={{width:"100%"}}>
          <button  className="buttonLight" style={{width:"95%",margin:"0px"}} >Search</button>
      </div>
    </div>
  )
}
const mapStateToProps = state => ({
    mycontacts:state.contact.mycontacts,
    
})
export default connect(mapStateToProps, {updateContact,changeContactSearch})(seachComponent)




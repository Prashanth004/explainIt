import React from 'react';
import { connect } from 'react-redux';
import {updateContact} from '../../../../actions/contactAction'


const seachComponent =  (props) => {

    const updateContactist = (e)=>{
        const typedValue = e.target.value.toUpperCase()
        console.log("props.mycontacts : ",props.mycontacts)
        console.log(e.target.value)
        var newcontactList = props.mycontacts.filter(contact=>
            (contact.username.toUpperCase().includes(typedValue))||
            (contact.twitterhandle.toUpperCase().includes(typedValue)));
        console.log("newcontactList : ",newcontactList )
        props.updateContact(newcontactList);
    }
    

  return (
    <div className="contactSearchBarDiv">
      <div style={{width:"100%"}}>
          <input  style={{width:"100%"}} onChange={updateContactist}type="text" placeholder="contacts"></input>
      </div >
      <div style={{width:"100%"}}>
          <button  style={{width:"100%"}} >Search</button>
      </div>
    </div>
  )
}
const mapStateToProps = state => ({
    mycontacts:state.contact.mycontacts
})
export default connect(mapStateToProps, {updateContact})(seachComponent)




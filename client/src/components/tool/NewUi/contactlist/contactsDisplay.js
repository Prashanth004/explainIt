import React, { Component } from 'react';
import {connect} from 'react-redux';
import SingleContact from './singleContact';
import ContactSearch from './contactSearch';
import { Button } from 'reactstrap'
import './contacts.css';
import {hideContactAct} from '../../../../actions/ProfileCardAction';
 class DisplayContacts extends Component {
    constructor(props){
        super(props)
        this.state={}
    }
  
  render() {
    const {searchedContacts,mycontacts,contactInputBaxValue,hideContactAct}= this.props;
      const contacts = (searchedContacts!==undefined)?
      (contactInputBaxValue.length!==0?(
        searchedContacts.length!==0?(
        searchedContacts.map(data=>(<SingleContact contactData={data}/>))):(<p>Not found</p>)):(
        mycontacts.map(data=>(<SingleContact contactData={data}/>)))):(<p>Not found</p>)
    return (mycontacts.length!==0?(<div className="contactContainer">
          <ContactSearch />
          {contacts}
        </div>):(<div className="contactContainer">
        <div className="topBtnsActivity"><Button close onClick={hideContactAct} /></div>
        <div className="noContacts">
        <p>No contacts to display.</p>
        <p>Visit profiles to add contacts</p></div></div>))
  }
}

const mapStateToProps = state => ({
  searchedContacts:state.contact.newContactList,
  mycontacts:state.contact.mycontacts,
  contactInputBaxValue:state.contact.contactInputBaxValue
})
export default connect(mapStateToProps,{hideContactAct})(DisplayContacts)


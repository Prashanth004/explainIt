import React, { Component } from 'react';
import {connect} from 'react-redux';
import SingleContact from './singleContact';
import ContactSearch from './contactSearch'
import './contacts.css';
import {  ADD_TO_LIST, CONTACT_LIST} from '../../../../actions/contactAction'
import { FiUserPlus } from "react-icons/fi";

 class DisplayContacts extends Component {
    constructor(props){
        super(props)
        this.state={}
    }
    
  render() {
    const {searchedContacts}= this.props;
      const contacts = (searchedContacts!==undefined)?(searchedContacts.map(data=>(<SingleContact contactData={data}/>))):(null)
    return (
      <div className="contactContainer">
        <ContactSearch />
        <button className="buttonDark addToContactBtn"><FiUserPlus style={{fontSize:"16px", marginTop:"-5px"}}/>  Create New Contact   </button>
        {contacts}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  searchedContacts:state.contact.searchedContacts
})
export default connect(mapStateToProps,{})(DisplayContacts)


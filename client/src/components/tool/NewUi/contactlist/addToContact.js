
import {connect} from 'react-redux';
import {addtoContact,getContactbyId,addNewContactActivity} from '../../../../actions/contactAction';
import Spinner  from '../container/lodingSmall';
import React, { Component } from 'react';
import { FiUserPlus } from "react-icons/fi";

class AddToConatct extends Component {
  constructor(props){
    super(props);
    this.addContact = this.addContact.bind(this);
  }
    componentWillMount(){
        this.props.getContactbyId(this.props.contactid);
    }
    addContact =()=>{
      alert("dvljfskj")
      const {contactid,addNewContactActivity,addtoContact} = this.props;
      addNewContactActivity(contactid);
      addtoContact(contactid);
    }
  render() {
    const {fetchedContactInfo,contactExist,startAdding,successAdded,doneAdding} = this.props
    return (fetchedContactInfo)?(!contactExist?((!startAdding)?(<button onClick={this.addContact} className="buttonDark"><FiUserPlus style={{fontSize:"16px", marginTop:"-5px"}}/> Add to Contact</button>)
    :(!doneAdding)?(<button onClick={this.addContact} className="buttonDark"><Spinner /></button>):
    (!successAdded)?(<span>Failed :( </span>):
    (<span >Added successFully!</span>)):null):null
  }
}

const mapStateToProps = state => ({
    startAdding:state.contact.startAdding,
    fetchedContactInfo:state.contact.fetchedContactInfo,
    doneAdding:state.contact.doneAdding,
    successAdded:state.contact.successAdded,
    contactExist:state.contact.contactExist
})
export default connect(mapStateToProps,{addtoContact,getContactbyId,addNewContactActivity})(AddToConatct)

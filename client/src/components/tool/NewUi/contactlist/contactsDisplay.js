import React, { Component } from 'react';
import {connect} from 'react-redux';
import SingleContact from './singleContact'

 class DisplayContacts extends Component {
    constructor(props){
        super(props)
        this.state={}
    }
    
  render() {
      console.log("this.props.mycontatcs : ", this.props.mycontacts);
      const contacts = (this.props.mycontacts!==undefined)?(this.props.mycontacts.map(data=>(<SingleContact contactId={data.contactid}/>))):(null)
    return (
      <div>
        {contacts}
      </div>
    )
  }
}

const mapStateToProps = state => ({
    mycontacts:state.contact.mycontacts
})
export default connect(mapStateToProps,{})(DisplayContacts)


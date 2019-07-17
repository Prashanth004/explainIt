
// import {connect} from 'react-redux';
// import {addtoContact,getContactbyId} from '../../../../actions/contactAction';
// import Spinner  from '../container/lodingSmall';
// import React, { Component } from 'react'

// class AddToConatct extends Component {
//     componentWillMount(){
//         this.props.getContactbyId(this.props.contactid)
//     }
//   render() {
//     const {addtoContact,fetchedContactInfo,contactExist, contactid,startAdding,successAdded,doneAdding} = this.props
//     return (fetchedContactInfo)?(!contactExist?((!startAdding)?(<button onClick={()=>addtoContact(contactid)} className="buttonLight">Add to Contact</button>)
//     :(!doneAdding)?(<button onClick={()=>addtoContact(contactid)} className="buttonLight"><Spinner /></button>):
//     (!successAdded)?(<span>Failed :( </span>):
//     (<span >Added successFully!</span>)):null):null
//   }
// }

// const mapStateToProps = state => ({
//     startAdding:state.contact.startAdding,
//     fetchedContactInfo:state.contact.fetchedContactInfo,
//     doneAdding:state.contact.doneAdding,
//     successAdded:state.contact.successAdded,
//     contactExist:state.contact.contactExist
// })
// export default connect(mapStateToProps,{addtoContact,getContactbyId})(AddToConatct)

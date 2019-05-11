import React from 'react'
import { connect } from 'react-redux';
import AtemptCallFailed from './AtemptCallFailed';
import RecieveCallFailed from './RecieveCallFailed'


const CallFailed= (props) => {
   
  return (props.activity.fromuser === props.userId)?
  (<AtemptCallFailed activity={props.activity} />):(<RecieveCallFailed activity={props.activity}/>)
}
const mapStateToProps = function(state) {
    return {
        userId: state.auth.id,
    }
  }
  
  export default connect(mapStateToProps)(CallFailed);


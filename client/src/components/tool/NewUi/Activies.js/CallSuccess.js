import React from 'react';
import { connect } from 'react-redux';
import AtemptCallSuccess from './AtemptCallSuccess';
import RecieveCallSuccess from './RecieveCallSuccess';
import AtemptCallSuccessNoLink from './AttemptCallSuccessNoLInk';
import RecieveCallSuccessNoLink from './RecieveCallSuccessNoLink';
const CallSuccess= (props) => {
  console.log(" props.activity.link : ", props.activity)
  return props.activity.link!==null?((props.activity.fromuser === props.userId)?
  (<AtemptCallSuccess activity={props.activity} />):(<RecieveCallSuccess activity={props.activity}/>))
  :((props.activity.fromuser === props.userId)?
  (<AtemptCallSuccessNoLink activity={props.activity} />):(<RecieveCallSuccessNoLink activity={props.activity}/>))
}

const mapStateToProps = function(state) {
    return {
        userId: state.auth.id,
    }
  }
  
  export default connect(mapStateToProps)(CallSuccess);


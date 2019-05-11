import React from 'react';
import { connect } from 'react-redux';
import AtemptCallSuccess from './AtemptCallSuccess';
import RecieveCallSuccess from './RecieveCallSuccess';

const CallSuccess= (props) => {
  return (props.activity.fromuser === props.userId)?
  (<AtemptCallSuccess activity={props.activity} />):(<RecieveCallSuccess activity={props.activity}/>)
}

const mapStateToProps = function(state) {
    return {
        userId: state.auth.id,
    }
  }
  
  export default connect(mapStateToProps)(CallSuccess);


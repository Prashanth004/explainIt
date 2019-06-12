import React from 'react';
import AtemptMessage from './AttemptMessage';
import RecieveMessage from './RecieveMessage';
import { connect } from 'react-redux';

const messageAction =  (props) => {
 
  return (props.activity.fromuser === props.userId)?
  (<AtemptMessage activity={props.activity} />):(<RecieveMessage activity={props.activity}/>)
}
const mapStateToProps = function(state) {
    return {
        userId: state.auth.id,
    }
  }
  
  export default connect(mapStateToProps)(messageAction);




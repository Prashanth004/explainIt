import React from 'react';
import { connect } from 'react-redux';
import RecieveCallSuccess from './RecieveCallSuccess';
import RecieveCallSuccessNoLink from './RecieveCallSuccessNoLink';
const CallSuccess = (props) => {
  return props.activity.link !== null ? (<RecieveCallSuccess
      userData={props.userData}
        activity={props.activity} />)
    : (<RecieveCallSuccessNoLink
        userData={props.userData}
          activity={props.activity} />)
}

const mapStateToProps = function (state) {
  return {
    userId: state.auth.id,
  }
}

export default connect(mapStateToProps)(CallSuccess);


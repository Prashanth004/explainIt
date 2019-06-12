import React from 'react';
import AtemptCallSuccess from './AtemptCallSuccess';
import AtemptCallSuccessNoLink from './AttemptCallSuccessNoLInk';
export default (props) => {
  return props.activity.link !== null ? (<AtemptCallSuccess
      userData={props.userData}
      activity={props.activity} />)
    : (<AtemptCallSuccessNoLink
        userData={props.userData}
        activity={props.activity} />)
}

import React from 'react';
import { connect } from 'react-redux';
import {clickAction,changeTwiiterHandle} from '../../../../actions/landingAction'




const landinForm = (props) => {

    const inValidMessage =props.checkVAlididyStarted?(
        !props.doneCkecking?
            (<span>Checking twitter handle validity</span>):
            (props.inValidTwitterHandle)?
                (<span>Invalid twitter-handle.Please check and try again</span>):
                (null)):
            (null)
  
    return (!props.clicked) ? (
        <div>

            <br />
            <h5>Enter your twitter handle</h5>
            <br />
            <span className="twiCom">twitter.com/</span>
            <input 
            onChange={(e)=>props.changeTwiiterHandle(e.target.value)}type="text" className="twiHandleInput"></input>
            <button onClick={()=>props.clickAction(props.twitterHandleValue)}className="buttonLight">Get Started</button>
            <br />
            {inValidMessage}
            <br />
            <br />
        </div>
    ) : (
            <div>
                <br />
                <h5>Thank you!!</h5>
                <br />
                <h5>We'l get back to you once we are ready ! </h5>
                <br />
                <br />
                <br />
            </div>
        )
}

const mapStateToProps = function(state) {
    return {
      clicked: state.landing.isClicked,
      twitterHandleValue:state.landing.twitterHandleValue,
      inValidTwitterHandle:state.landing.inValidTwitterHandle,
      doneCkecking:state.landing.doneCkecking,
      checkVAlididyStarted:state.landing.checkVAlididyStarted
    }
  }
  
  export default connect(mapStateToProps,{clickAction,changeTwiiterHandle})(landinForm);


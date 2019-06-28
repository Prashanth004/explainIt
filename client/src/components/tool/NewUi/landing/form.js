import React from 'react';
import { connect } from 'react-redux';
import { clickAction, changeTwiiterHandle } from '../../../../actions/landingAction';
import { getProfileByTwitterHandle } from '../../../../actions/visitProfileAction';
import { Redirect } from 'react-router-dom';
import TwitterInput from '../container/twitterInput'


const landinForm = (props) => {
    
    const clickFunction = () => {
        if (props.twitterHandleValue.includes("@")) {
            props.clickAction(props.twitterHandleValue.replace("@", ""), "")
            props.getProfileByTwitterHandle(props.twitterHandleValue.replace("@", ""))
        }
        else {
            props.clickAction(props.twitterHandleValue, "")
            props.getProfileByTwitterHandle(props.twitterHandleValue)
        }

    }
    const inValidMessage = props.checkVAlididyStarted ? (
        !props.doneCkecking ?
            (<span>Checking twitter handle validity</span>) :
            (props.inValidTwitterHandle) ?
                (<span>Invalid twitter-handle.Please check and try again</span>) :
                (null)) :
        (null)

    return (!props.clicked) ? (
        <div>
            <br />
            <h6>Enter your twitter handle</h6>
            <br />
            <span className="twiCom">twitter.com/</span>
            <TwitterInput
            changeValue = {props.changeTwiiterHandle}
            inputStyle="twiHandleInput"
            submitFunction={clickFunction}
             />
            <button onClick={clickFunction} className="buttonLight">Get Started</button>
            <br />
            {inValidMessage}
            <br />
            <br />
        </div>
    ) : (!props.isPresent ? (
        <div>
            <br />
            <h5>Thank you!!</h5>
            <br />
            <h5>We'l get back to you once we are ready ! </h5>
            <br />
            <br />
            <br />
        </div>
    ) : ((<Redirect to={(props.twitterHandleValue.includes("@")) ?
        ({ pathname: './signin/' + props.twitterHandleValue }) :
        ({ pathname: './signin/@' + props.twitterHandleValue })} />)))
}

const mapStateToProps = function (state) {
    return {
        clicked: state.landing.isClicked,
        twitterHandleValue: state.landing.twitterHandleValue,
        inValidTwitterHandle: state.landing.inValidTwitterHandle,
        doneCkecking: state.landing.doneCkecking,
        checkVAlididyStarted: state.landing.checkVAlididyStarted,
        isPresent: state.visitProfile.isPresent
    }
}

export default connect(mapStateToProps, {
    clickAction,
    getProfileByTwitterHandle,
    changeTwiiterHandle
})(landinForm);


import React from 'react';
import { connect } from 'react-redux';
import {clickAction,changeTwiiterHandle} from '../../../../actions/landingAction';
import {getProfileByTwitterHandle} from '../../../../actions/visitProfileAction';
import TweetToRefer from './tweetToRefer';
import '../../../css/explainit.css';
import TwitterInput from '../container/twitterInput'

 
const landinForm = (props) => {
  
    const clickFunction = ()=>{
        if(props.twitterHandleValue.includes("@"))
        {
            props.clickAction(props.twitterHandleValue.replace("@",""),"referr")
            props.getProfileByTwitterHandle(props.twitterHandleValue.replace("@",""))
        }
        else{
            props.clickAction(props.twitterHandleValue,"referr")
            props.getProfileByTwitterHandle(props.twitterHandleValue)
        }
       
    }
    const inValidMessage =props.checkVAlididyStarted?(
        !props.doneCkecking?
            (<span>Checking twitter handle validity</span>):
            (props.inValidTwitterHandle)?
                (<span>Invalid twitter-handle.Please check and try again</span>):
                (null)):
            (null)
  
    return (!props.clicked || props.inValidTwitterHandle) ? (
        <div className="formContainerExplain">
            <br />
            <h6>Enter your twitter handle</h6>
            <br />
            <span className="twiCom">twitter.com/</span>
            <TwitterInput
            changeValue = {props.changeTwiiterHandle}
            inputStyle="twiHandleInput"
            submitFunction={clickFunction}
             />
            <button onClick={()=>clickFunction()}className="buttonLight">Tweet</button>
            <br />
            {inValidMessage}
            <br />
            <br />
        </div>
    ) : (<TweetToRefer questionProject={props.questionProject}/>)
}

const mapStateToProps = function(state) {
    return {
      clicked: state.landing.isClicked,
      twitterHandleValue:state.landing.twitterHandleValue,
      inValidTwitterHandle:state.landing.inValidTwitterHandle,
      doneCkecking:state.landing.doneCkecking,
      checkVAlididyStarted:state.landing.checkVAlididyStarted,
      isPresent:state.visitProfile.isPresent
    }
  }
  
  export default connect(mapStateToProps,{clickAction,
    getProfileByTwitterHandle,
    changeTwiiterHandle})(landinForm);


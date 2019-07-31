// import React, { Component } from 'react'
// import TweetSuggest from '../../TweetSug';
// import { connect } from 'react-redux';
// import { FiArrowRight } from "react-icons/fi";
// // import Spinner  from '../../container/lodingSmall';
// import { getRecpientId, } from '../../../../../actions/twitterApiAction';
// import './twitterform.css'

// import { getProfileByTwitterHandle,shareToSelfAction,strtedTweetTest,
//     noInternetAction,updateTwitterHandle,emptyTwitterHandle } from "../../../../../actions/visitProfileAction";

// class twitterpichandle extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             isVisitProfile: false,
//             emptyUserName: false,
//             gotuserSuccessful:false
//         }
//         this.testHandle = this.testHandle.bind(this);
//         this.updateInfo = this.updateInfo.bind(this);
//     }
//     updateInfo(){
//         this.setState({
//             gotuserSuccessful:true
//         })
//     }
   

//   render() {
  
//     const {  doneTweeting, noInternet, gotuserSuccessful,selfShare} = this.state;
//     const { doneFetching,testedTweet,
//         fetchProfile, isPresentInExplain, twitterHandle,updateTwitterHandle} = this.props;

//     const goBtn = (twitterHandle.length>0)?(
//         // <div style={{textAlign:"center", marginTop:"10px"}}>
//         // <button  className="nextButton" onClick={this.testHandle}></button>
//         <FiArrowRight  onClick={this.testHandle} style={{fontSize:"18px", marginTop:"-3px"}}/>
//        ):null
//     // if (doneFetching && !doneTweeting && fetchProfile && !noInternet && !selfShare && !!isPresentInExplain &&!gotuserSuccessful)
//     // this.updateInfo();
//     const twiterPic =!testedTweet?
//     (<div className="twitterHandleInputBox">
     
//             {goBtn}
           
    
//   </div>):(gotuserSuccessful?(<img src={this.props.profilePic} width="75px" heiight="75px" className="twitterImage" alt="img"></img>
//   ):(<div className="loader"></div>))
// //     return (
// //         <div className="twitterPic">
// //   {twiterPic}
// //         </div> 
// //       )
//         return( )
//   }
// }


// const mapStateToProps = state => ({
//     doneFetching: state.twitterApi.doneFetching,
//     fetchProfile: state.visitProfile.fetchProfile,
//     userId: state.auth.id,
//     userName: state.visitProfile.userName,
//     twitterHandle:state.visitProfile.twitterHandle,
//     visitedTiwtterHandle: state.visitProfile.visitedTiwtterHandle,
//     profilePic:state.visitProfile.profilePic,
//     onlineStatus: state.visitProfile.onlineStatus,
//     busyStatus: state.visitProfile.busyStatus,
//     isPresentInExplain: state.visitProfile.isPresent,
//     explainBy: state.explain.explainBy,
//     sharehandle: state.explain.sharehandle,
//     OwnerTwitterHandle: state.auth.twitterHandle,
//     redialInitiated : state.redial.redialInitiated,
//     redialtwitterHandle : state.redial.twitterHandle,
//     redialSubject : state.redial.subject,
//     testedTweet:state.visitProfile.testedTweet
   

// })
// export default connect(mapStateToProps, {
//     getProfileByTwitterHandle,strtedTweetTest,
//     getRecpientId, emptyTwitterHandle,
//     shareToSelfAction,noInternetAction,updateTwitterHandle ,
    
// })(twitterpichandle)

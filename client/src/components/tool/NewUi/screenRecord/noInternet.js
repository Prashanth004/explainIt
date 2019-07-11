import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import ProfileNotOnExplain from "../ProfileNotOnTwitter/ProfileNotOnExplain"

export const NoInternet = (props) => {
  return (<div>
        <span style={{
           float: "left",
           fontSize: "15px",
           marginTop:"-35px"
       }}>
           <FiArrowLeft  onClick={props.changeTweetStateNeg} />
       </span>
    <p className="info">Please check the internet connectivity</p>
</div>)
}

export const InValidHandle = (props)=>{
    return(<div>
          <span style={{
           float: "left",
           fontSize: "15px",
           marginTop:"-35px"
       }}>
           <FiArrowLeft  onClick={props.changeTweetStateNeg} />
       </span>
        <p className="info">Incorrect twitter handle<br />
            Please check and try again</p>
    </div>)
}

export const SelfShareInfo = (props)=>{
    return(<div>
        <span style={{
           float: "left",
           fontSize: "15px",
           marginTop:"-35px"
       }}>
           <FiArrowLeft  onClick={props.changeTweetStateNeg} />
       </span>
       <div className="TwiValidInfo">
       <p style={{fontWeight:"500"}}>You have entered your own twitter handle</p>
       {/* <p className="info">You have entered your twitter hanlde</p> */}
       </div>
   </div>)
}

export const NotPresentOnExplain = (props) =>{
    return(<div>
        <span style={{
            float: "left",
            fontSize: "15px",
            marginTop:"-35px"
        }}>
            <FiArrowLeft onClick={props.changeTweetStateNeg} />
        </span>
        <div  className="TwiValidInfo" >
        <ProfileNotOnExplain
            isVisitProfile={props.isVisitProfile}
            twitterhandle={props.twitterhandle}
            source={props.source} />
        </div>
    </div>)
}
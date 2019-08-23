import React from 'react';

import { FiArrowLeft } from "react-icons/fi";
import ProfileNotOnExplain from "../../ProfileNotOnTwitter/ProfileNotOnExplain"
import CopyToClipboard from '../../../CopytoClipboard';
export const NoInternet = () => {
  return (<div>
    <p className="info">Please check the internet connectivity</p>
</div>)
}

export const InValidHandle = ()=>{
    return(<div>
        <p className="info">Incorrect twitter handle<br />
            Please check and try again</p>
    </div>)
}


export const SelfShareInfo = (props)=>{


    return(<div>
        <span style={{
           float: "left",
           fontSize: "15px",
           marginTop:"-15px"
       }}>
           <FiArrowLeft  onClick={props.closeImidiate} />
       </span>
       <div className="TwiValidInfo">
       <p style={{fontWeight:"500"}}>You have entered your own twitter handle</p>       
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
            <FiArrowLeft onClick={props.closeImidiate} />
        </span>
        <div  className="TwiValidInfo" >
        <ProfileNotOnExplain
            isVisitProfile={props.isVisitProfile}
            twitterhandle={props.twitterhandle}
            source={props.source} />

        <span style={{ fontSize: "14px" }}>
            You can manually share the link now to get connected
        </span>
        <CopyToClipboard sharablelink={props.sharablelink} />
        </div>
    </div>)
}



import React from 'react';
import config from '../../../../config/config';
import Boldpara from './boldp'

export default (props) => {
  // const  = (props.currentAtionStatus === config.FULL_SCREEN_SHARE)?('Screen share in progress'):('Screen record in progress');
  const busyStatus =  (props.action === "record")?(
    props.currentAtionStatus === config.FULL_SCREEN_SHARE?("Screen share in progress. Record can't happen"):
    ("Record already in progress")
  ):(props.currentAtionStatus === config.FULL_SCREEN_SHARE?("Screen share aready in progress"):
  ("Screen record in progress. You can not share your screen till it is ended"))

  return (<div style={{padding:"20px"}}>
 <Boldpara content={busyStatus}/>
  </div>)
}

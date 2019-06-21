import React from 'react';
import config from '../../../../config/config';
import Boldpara from './boldp'

export default (props) => {
  const busyStatus = (props.currentAtionStatus === config.FULL_SCREEN_SHARE)?('sharing you screen'):('recording your screen');
  return (
    <div style={{padding:"20px"}}>

      <Boldpara content={"You are currently "+busyStatus}/>
      <Boldpara content={"End the previous process to get started"}/>
    </div>
  )
}

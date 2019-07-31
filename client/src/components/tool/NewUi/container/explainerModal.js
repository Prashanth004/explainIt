import React from 'react';
import config from '../../../../config/config'

export default () => {
  return (
      <div style={{width:"100%",height:"450px"}}>
          <video controls width="100%" height="100%" src={config.explainerVideo}></video>
      </div>
  )
}

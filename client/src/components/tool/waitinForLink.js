
import React from 'react'

export default () => {
    var value = (<div><p>Preparing a link to access the call..</p>
    </div>)
    setTimeout(()=>{
        value =(<div><p>Could not generate Link right now.</p>
        <p>Please check your activities section, get the link of the session</p></div>)
    },10000)
  return (
    <div>
      {value}
    </div>
  )
}


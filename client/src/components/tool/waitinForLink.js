import React from 'react'

export default () => {
    var value = (<div><h5>
        <b>Call ended due to network issues</b>
    </h5>
        <p>Please wait.. Caller maight retry to call you </p>
    </div>)
    setTimeout(()=>{
        value =(<div><h5>
            <b>Call ended due to network issues</b>
            <p>Caller did not retry</p>
        </h5>
           
        </div>)
    },15000)
  return (
    <div>
      {value}
    </div>
  )
}

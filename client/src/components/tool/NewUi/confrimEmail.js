import React from 'react'

export default (props) => {
  return (
    <div>
      <p>Is this your email id?</p>
      <p>{props.email}</p>
      <button className="buttonLight" onClick={props.editEmail}>No</button>
      <button className="buttonLight" onClick={props.confirmedEmail}>Yes</button>
    </div>
  )
}

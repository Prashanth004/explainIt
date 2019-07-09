import React from 'react'

export default (props) => {
  return (
    <div>
    <button className="close modalClose" style={{ position: 'absolute', top: '25px', fontSize:"28px",right: '25px', color: 'white' }} onClick={props.toggle}>&times;</button>;
    </div>
  )
}

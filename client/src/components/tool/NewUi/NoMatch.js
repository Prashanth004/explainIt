import React from 'react'
import '../../css/noMatch.css'

export default () => {
  return (
    <div className ="noMatchcontainer">
    <div className="noMatchContent">
        <h1>SORRY</h1>
        <img src={require('../../images/saddog.gif')}></img>
        <h5>I couldn't find this page</h5>
        <h6>404 - Page Not Found</h6>
    </div>
      
    </div>
  )
}

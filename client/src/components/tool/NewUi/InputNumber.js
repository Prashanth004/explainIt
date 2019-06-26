import React from 'react'
import '../../css/InputBox.css'

export default (props) => {
   
  return (
    <div className="inputNumberDiv">
        <input className="inputNumber"
       onChange={props.changeInputValue} 
       value={props.textValue}
       type="text"></input>
        <span> minutes</span>
        <br/>

      </div>
  
  )
}

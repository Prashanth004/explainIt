import React from 'react'
import '../../css/InputBox.css'

export default (props) => {
   
  return (
        <input className="inputNumber"
       onChange={props.changeInputValue} 
       value={props.textValue}
       type="text"></input>
 
  )
}

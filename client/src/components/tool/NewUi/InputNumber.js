import React from 'react'
import '../../css/InputBox.css'

export default (props) => {
    const spanElement= ((props.limitExce)?(
        <span className="spanElement" >Can not be more than {props.limitOfChar}</span>
      ):(props.negNumber)?(
        <span className="spanElement" >Can not be negetive number or zero</span>
      ):(props.noText?(
        <span className="spanElement" >Only numbers</span>

      ):((props.empty)?(
        <span className="spanElement">Cant be empty</span>
      ):(null))))
  return (
    <div >
        <input className="inputNumber"
       onChange={props.changeInputValue} 
       value={props.textValue}
       type="text" pattern="[0-9]"></input>
        <sapn> minutes</sapn>
        <br/>
      {spanElement}
      </div>
  
  )
}

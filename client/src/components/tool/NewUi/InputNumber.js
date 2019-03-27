import React from 'react'
import '../../css/InputBox.css'

export default (props) => {
    const spanElement= (props.empty)?(
        <span className="spanElement">Cant be empty</span>
      ):((props.limitExce)?(
        <span className="spanElement" >Can not be more than {props.limitOfChar}</span>
      ):(props.negNumber)?(
        <span className="spanElement" >Can not be negetive number or zero</span>
      ):(null))
  return (
    <div >
    <div className="inputHolder">
      <input className="inputNumber"
       onChange={props.changeInputValue} 
       value={props.textValue}
       type="number"></input>
       <sapn> minutes</sapn>
    </div>
      {spanElement}
    </div>
  )
}

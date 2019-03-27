import React from 'react'
import '../../css/InputBox.css'


export default (props) => {
    const spanElement= (props.empty)?(
        <span className="spanElement">Cant be empty</span>
      ):((props.limitExce)?(
        <span className="spanElement" >Only {props.limitOfChar} Caharcters</span>
      ):(null))
  return (
    <div>
      <textarea type="textArea" row='4'
      onChange={props.changeInputValue}
      value={props.textValue}
      className="inputBox"
       placeholder="Title and hash tags to refer for the call later">
      </textarea>
      {spanElement}
    </div>
  )
}

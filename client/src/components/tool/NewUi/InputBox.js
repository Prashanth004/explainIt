// import React from 'react'
// import '../../css/InputBox.css'


// export default (props) => {
//    
//   return (
//     <div>
//       <input type="text"
//       onChange={props.changeInputValue}
//       value={props.textValue}
//       className="inputBox"
//        placeholder={props.placeHolder}>
//       </input>
//       {spanElement}
//     </div>
//   )
// }
import React, { Component } from 'react'

export default class componentName extends Component {
  constructor(props){
    super(props);
    this.state={}
    this.enterPress = this.enterPress.bind(this);
  }
  enterPress(event){
   
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        this.props.submit();
      }
    
  }
  componentDidMount(){
    var input = this.inputBox;
    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", this.enterPress);
  }
  componentWillUnmount(){
    var input = this.inputBox;
    input.removeEventListener("keyup", this.enterPress);
    
  }
  render() {
    const {changeInputValue,empty,limitExce,limitOfChar,textValue,placeHolder} = this.props
    const spanElement= (empty)?(
              <span className="spanElement">Topic can't be empty</span>
            ):((limitExce)?(
              <span className="spanElement" >Only {limitOfChar} caharcters</span>
            ):(null))
  
    return (
      <div>
         <div>
         <input type="text"
         ref={a => this.inputBox = a} 
          onChange={changeInputValue}
          value={textValue}
          className="inputBox"
          placeholder={placeHolder}>
          </input>
          <br/>
          {spanElement}
        </div>
      </div>
    )
  }
}


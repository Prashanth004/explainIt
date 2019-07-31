
import React, { Component } from 'react';
import TextArea from './container/textArea'

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

  render() {
    const {changeInputValue,empty,limitExce,limitOfChar,textValue,placeHolder} = this.props
    const spanElement= (empty)?(
              <span className="spanElement">Topic can't be empty</span>
            ):((limitExce)?(
              <span className="spanElement" >Only {limitOfChar} caharcters</span>
            ):(null))
  
    return (
      <div>
         <div style={{width:"100%", margin:"auto"}}>
         <TextArea
                        textvalue={textValue}
                        changeFunction={changeInputValue} 
                        inputClass="inputboxes fullView"
                        enterPress={this.enterPress}
                        textAlign="right"
                        placeholder={placeHolder} />
         {/* <input type="text"
        
          onChange={changeInputValue}
          value={textValue}
          className="inputBox"
          placeholder={placeHolder}>
          </input> */}
          <br/>
          {spanElement}
        </div>
      </div>
    )
  }
}


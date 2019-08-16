
import React, { Component } from 'react';
import TextArea from './container/textArea'

export default class componentName extends Component {
  constructor(props){
    super(props);
    this.state={}
    this.enterPress = this.enterPress.bind(this);
  }
  enterPress(event){
      if (event.keyCode === 13) {
        event.preventDefault();
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
                        limit={limitOfChar}
                        enterPress={this.enterPress}
                        textAlign="right"
                        placeholder={placeHolder} />
          <br/>
          {spanElement}
        </div>
      </div>
    )
  }
}


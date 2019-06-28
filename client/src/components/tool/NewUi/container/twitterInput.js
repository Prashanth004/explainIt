import React, { Component } from 'react';
import '../landing/landing.css'

export default class componentName extends Component {
    constructor(props){
        super(props);
        this.hnandleEnter = this.hnandleEnter.bind(this);
    }
    componentDidMount(){
        var input = this.inputBox;
        input.addEventListener("keyup", this.hnandleEnter);
    }
    hnandleEnter(event){
        if (event.keyCode === 13) {
        event.preventDefault();
        this.props.submitFunction();
        }
    }
    componentWillUnmount(){
        var input = this.inputBox;
        input.removeEventListener("keyup", this.enterPress);
    }
  render() {
    const {changeValue,inputStyle} = this.props;
    return (<input
        type="text"
        ref={a => this.inputBox = a} 
        onChange={(e)=>changeValue(e.target.value)}
        className={inputStyle}
    ></input>)
  }
}

// inputs: 

//inputStyle
//changeValue
//submitFunction


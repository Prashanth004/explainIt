import React, { Component } from 'react'
import './record.css';
import config from '../../../../config/config';

export default class componentName extends Component {
    constructor(props){
        super(props)
        this.state={
            info : ''
        }
    }
  componentDidMount(){
      const self =this;
    function postMessageHandler(event) {
        if (event.data.action === config.UPDATE_INFO) {
            self.setState({
                info:event.data.info
            })
        }
    }
    if (window.addEventListener) {
        window.addEventListener("message", postMessageHandler, false);
    } else {
        window.attachEvent("onmessage", postMessageHandler);
    }
  }
  render() {
    return (
      <div className="infoConatiner">
        <p>{this.state.info}</p>
      </div>
    )
  }
}

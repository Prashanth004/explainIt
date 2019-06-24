import { GoTriangleLeft,GoTriangleRight } from "react-icons/go";
import React, { Component } from 'react';
import config from '../../../../config/config';


export default class componentName extends Component {

    constructor(props){
        super(props);
        this.state={isClosed:false};
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
      this.setState({isClosed:!this.state.isClosed})
        var msg = {
            'type': config.TOGGLE_FLOATER,
        };
        window.parent.postMessage(msg, "*");
    }

    componentDidMount(){

    }
  render() {
    const toggleSymbol = (this.state.isClosed)?( <GoTriangleLeft onClick={this.toggle} />):( <GoTriangleRight onClick={this.toggle} />)
    return (
        <div className="infoConatiner" style={{minHeight:"0px", float:"left", padding:"0px",paddingTop:"2px",paddingLeft:"2px"}}>
          <span>
              {toggleSymbol}
              </span>
         </div>
    )
  }
}


import React, { Component } from 'react'
import '../css/copyToClipboard.css';
import { MdContentCopy } from "react-icons/md";

class copyToClipboard extends Component {
    constructor(props){
        super(props)
        this.state={
            copyStatus:"copy link",
            copyValue:""
        
        }
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.changeCopyDiv = this.changeCopyDiv.bind(this)
    }
    changeCopyDiv(e){
        this.setState({
            copyValue:e.target.value
        })
        
    }
    copyToClipboard(e){
        this.textArea.select();
        document.execCommand("copy");
        this.setState({
            copyStatus:"link copied"
        })
    }
  render() {
    return (
      <div className="copyToCipboardDiv">
         
      <input   ref={(textarea) => this.textArea = textarea} className="myInputClip" type="text"
      onChange={this.changeCopyDiv}
       value={this.props.sharablelink}/>
                <span className="hint--top" aria-label={this.state.copyStatus}>
                    {/* <button className="buttonDark" id="afterSave" onClick={this.copyToClipboard}>
                    Copy Link
                    </button> */}
                  
                    <MdContentCopy style={{fontSize:"17px"}} onClick={this.copyToClipboard}/>

            </span>
        
      </div>
    )
  }
}

export default copyToClipboard


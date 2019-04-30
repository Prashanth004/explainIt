import React, { Component } from 'react'
import '../css/copyToClipboard.css'

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
        var copyText = document.querySelector('#Link');
        copyText.select();
        document.execCommand("copy");
        this.setState({
            copyStatus:"link copied"
        })
    }
  render() {
    return (
      <div className="copyToCipboardDiv">
         
      <input id="Link" className="myInputClip" type="text"
      onChange={this.changeCopyDiv}
       value={this.props.sharablelink}/>
                <span className="hint--bottom" aria-label={this.state.copyStatus}>
                    {/* <button className="buttonDark" id="afterSave" onClick={this.copyToClipboard}>
                    Copy Link
                    </button> */}
                    <div className="cpyNewBtn">
                        <img alt="copy"src={require('../images/cpyNew.png')}
                        width="100%"
                        onClick={this.copyToClipboard}
                        margintop="5px"
                        height="100%"></img>
                    </div>
            </span>
        
      </div>
    )
  }
}

export default copyToClipboard

import React, { Component } from 'react'
import '../css/copyToClipboard.css'
import { stopedRcording } from '../../actions/toolActions';

class copyToClipboard extends Component {
    constructor(props){
        super(props)
        this.state={
            copyStatus:"copy link",
        
        }
        this.copyToClipboard = this.copyToClipboard.bind(this)
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
         
      <input id="Link" className="myInputClip" type="text" value={this.props.sharablelink}/>
                <span class="hint--bottom" aria-label={this.state.copyStatus}>
                    {/* <button className="buttonDark" id="afterSave" onClick={this.copyToClipboard}>
                    Copy Link
                    </button> */}
                    <div className="cpyNewBtn">
                        <img src={require('../images/cpyNew.png')}
                        width="100%"
                        onClick={this.copyToClipboard}
                        marginTop="5px"
                        height="100%"></img>
                    </div>
            </span>
        
      </div>
    )
  }
}

export default copyToClipboard

import React, { Component } from 'react'

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
      <div>
         
      <input style={{height:"20px", borderStyle:"none",borderBottomStyle:"solid",width:"90%",borderColor:"#195f61",borderWidth:"0.5px"}} ref={(textarea) => this.textArea = textarea}  type="text"
      onChange={this.changeCopyDiv}
       value={this.props.sharablelink}/>
                <span className="hint--top" aria-label={this.state.copyStatus}>
                   
                    <div style={{width:"20px",height:"20px",marginTop:"-12px"}}>
                        <img alt="copy"src={require('../../../images/cpyNew.png')}
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


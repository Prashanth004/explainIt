import React, { Component } from 'react'
import { FiCopy, FiMessageSquare, FiVideo } from "react-icons/fi";
import { CSSTransition } from 'react-transition-group';
import './anim.css';
import { Helmet } from "react-helmet";


export const ChatDiv = () => {
  return (<div style={{ width: "380px", margin: "auto", height: "480px", border: "solid", borderWidth: "1px", borderColor: "#7c2252", borderRadius: "5px", backgroundColor: "#eeb8d5" }}>
    <div style={{ width: "85px", height: "85px", margin: "auto", marginTop: "20px" }}>
      <img src="https://pbs.twimg.com/profile_images/1005667810305978368/wPS8H3VV.jpg" width="100%" height="100%" alt="profile pic" style={{ borderRadius: "50%" }}></img>
    </div>
    <div style={{ width: "100%", height: "1px", backgroundColor: "#7c2252", marginTop: "120px" }}></div>
    <div style={{ textAlign: "center" }}>
      <div style={{ width: "75%", margin: "auto", height: "30px", borderStyle: "solid", borderWidth: "1px", borderRadius: "10px", marginTop: "80px" }}>
        <span>Chat with</span>
      </div>
      <br />
      <span style={{ marginTop: "30px" }}>for</span><br />
      <input type="number" style={{ width: "30px", margin: "auto" }}></input>
      <br />
      <br />
      <FiMessageSquare style={{ fontSize: "22px" }} />
    </div></div>)
}

export const RecordDiv = () => {
  return (
    <div style={{ width: "380px", margin: "auto", height: "480px", border: "solid", borderWidth: "1px", borderColor: "#7a851b", borderRadius: "5px", backgroundColor: "#e9eeb8" }}>
      <div style={{ width: "85px", height: "85px", margin: "auto", marginTop: "20px" }}>
        <img src="https://pbs.twimg.com/profile_images/1005667810305978368/wPS8H3VV.jpg" width="100%" height="100%" alt="profile pic" style={{ borderRadius: "50%" }}></img>
      </div>
      <div style={{ width: "100%", height: "1px", backgroundColor: "#7a851b", marginTop: "120px" }}></div>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "75%", margin: "auto", height: "30px", borderStyle: "solid", borderWidth: "1px", borderRadius: "10px", marginTop: "80px" }}>
          <span>Record and send share with</span>
        </div>
        <br />
        <span style={{ marginTop: "30px" }}>for</span><br />
        <input type="number" style={{ width: "30px", margin: "auto" }}></input>
        <br />
        <br />
        <FiVideo style={{ fontSize: "22px" }} />
      </div>
    </div>)
}

export const ShareDiv = () => {
  return (
    <div style={{ width: "380px", margin: "auto", height: "480px", border: "solid", borderWidth: "1px", borderColor: "#43a8ac", borderRadius: "5px", backgroundColor: "#b8ecee" }}>
      <div style={{ width: "85px", height: "85px", margin: "auto", marginTop: "20px" }}>
        <img src="https://pbs.twimg.com/profile_images/1005667810305978368/wPS8H3VV.jpg" width="100%" height="100%" alt="profile pic" style={{ borderRadius: "50%" }}></img>
      </div>
      <div style={{ width: "100%", height: "1px", backgroundColor: "#43a8ac", marginTop: "120px" }}></div>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "75%", margin: "auto", height: "30px", borderStyle: "solid", borderWidth: "1px", borderRadius: "10px", marginTop: "80px" }}>
          <span>Screen share with</span>
        </div>
        <br />
        <span style={{ marginTop: "30px" }}>for</span><br />
        <input type="number" style={{ width: "30px", margin: "auto" }}></input>
        <br />
        <br />
        <FiCopy style={{ fontSize: "22px" }} />
      </div>
    </div>)
}



export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = { shareFromRecord:true,ShareFromChat:false,
      hoverLeftArrow: false, hoverRightArrow: false, displayRecord: false, displayChat: false, displayShare: true };
    this.displayRecordAct = this.displayRecordAct.bind(this);
    this.displayChatAct = this.displayChatAct.bind(this);
    this.displayShareActFromRec = this.displayShareActFromRec.bind(this);
    this.displayShareActFromChat = this.displayShareActFromChat.bind(this);

  }
  displayRecordAct() {
    this.setState({ displayRecord: true, displayChat: false, displayShare: false })
  }
  displayShareActFromRec() {
    this.setState({ displayRecord: false, displayChat: false, displayShare: true,
      shareFromRecord:true,ShareFromChat:false,})
  }
  displayShareActFromChat() {
    this.setState({ displayRecord: false, displayChat: false, displayShare: true,
      shareFromRecord:false,ShareFromChat:true, })
  }
  displayChatAct() {
    this.setState({ displayRecord: false, displayChat: true, displayShare: false })
  }
  render() {
    const rightArrow = (!this.state.displayChat)?( <div style={{ width: "180px", margin: "auto", textAlign: "center" }} onClick={!this.state.displayRecord ? this.displayChatAct : this.displayShareActFromRec}>
    <div >
      <div style={{ width: "50px", margin: "auto", height: "50px", borderTopStyle: "solid", borderLeftStyle: "solid", transform: "rotate(135deg)" }}></div>
    </div>
  </div>):(<div></div>)
  const leftArroe = (!this.state.displayRecord)?(<div style={{ width: "180px", margin: "auto", textAlign: "center" }} onClick={!this.state.displayChat ? this.displayRecordAct : this.displayShareActFromChat} >
  <div style={{ width: "50px", margin: "auto", height: "50px", borderTopStyle: "solid", borderLeftStyle: "solid", transform: "rotate(-45deg)" }}></div>
</div>):(<div></div>);
    const displayDiv = this.state.displayShare ? (
      this.state.shareFromRecord?(<div className="storyContainer animated slideInRight faster">
        <ShareDiv /></div>):(<div className="storyContainer animated slideInLeft faster">
        <ShareDiv /></div>)) : (this.state.displayRecord ? (
          <div className="storyContainer animated slideInLeft faster">
            <RecordDiv />
          </div>
        ) : (<div className="storyContainer animated slideInRight faster"><ChatDiv /></div>))
    return (
      <div style={{ width:"70%", margin:"auto",minHeight: "95vh", paddingTop: "50px", display: "grid", gridTemplateColumns: "25% 50% 25%" }}>
        <Helmet>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css" />
        </Helmet>
        {leftArroe}
        <div>
          {displayDiv}
        </div>
       {rightArrow}
      </div>
    )
  }
}


// style={{width:"150px",height:"150px",margin:"auto",marginTop:"-20px",borderRadius:"50%",backgroundColor:(this.state.hoverRightArrow)?"white":"red"}} onMouseOver={()=>{this.setState({hoverRightArrow:true})}} onMouseLeave={()=>{this.setState({hoverRightArrow:false})}}
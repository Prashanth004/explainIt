import React, { Component } from 'react';
import { render } from 'react-dom';
import Form from './tool/Form';
import Navbar from './Navbar';
import './css/explainit.css';
import {connect} from 'react-redux';
import PropType from  'prop-types'; 
import ScreenShare from './tool/ScreenShare'
import ScreenRecorder from './tool/ScreenRecorder'
import FullScreenShare from './tool/enitreScreenShare'
import FullScreenRecord from './tool/FullScreenRecord'
import {SCREEN_SHARE,SCREEN_RECORD,FULL_SCREEN_SHARE,FULL_SCREEN_RECORD} from '../actions/types';
import Swal from 'sweetalert2';
import { setIssueId, cancelValidationErrors } from '../actions/issueActions'
import config from '../config/config'



class Explainit extends Component {
  constructor(props){
    super(props)
    this.state={
      sourceId:null,
      origin:null,
      gotmessage:false
    }
    // this.child = React.createRef();
    this.showErrorAlert = this.showErrorAlert.bind(this);
    this.showSuccessAlert = this.showSuccessAlert.bind(this);
    this.drawRect = this.drawRect.bind(this);
    this.savefile = this.savefile.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this)
  }
  
    componentWillMount(){
      this.props.setIssueId(JSON.parse(localStorage.getItem("issueId")))
    //   window.chrome.runtime.sendMessage(config.EXTENSION_ID, 'version', response => {
    //     console.log('Extension version: ', response);
    //     if (!response) {
    //       console.log('No extension');
    //       alert(" no extension . Please install the extension")
    //       return;
    //     }
    //     console.log('Extension version: ', response);
       
    // })

      var img; 
      img = new Image(); 
      img.src = "chrome-extension://" + config.EXTENSION_ID + "/test.png"; 
      img.onload = function() { 
       alert("done")
      }; 
      img.onerror = function() { 
       alert("error")
      };
    }
  
 
      componentDidMount() {
        console.log("asnckjadbskbsjfihb")
        var self = this
        // window.postMessage("world", '*');
        function postMessageHandler(event) {

            if (event.data.sourceId !== undefined) {
                console.log("We've got a message!");
                console.log("* Message:", event.data);
                console.log("* Origin:", event.origin);
                console.log("* Source:", event.source);
                console.log("*event.data.message : ", event.data.sourceId)
                self.setState({
                    sourceId: event.data.sourceId
                })
            }

            if (event.data === 'rtcmulticonnection-extension-loaded') {
                self.setState({
                    source: event.source,
                    origin: event.origin,
                    gotmessage: true
                })
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
    }
    
    showErrorAlert(){
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
      this.props.cancelValidationErrors()
    
    }

    clearCanvas(){
      this.child.clearAll();
    }
   
    savefile(data){
      this.child.pushData(data);
    }
    drawRect =()=>{
      this.child.addReactFull();
    }
    showSuccessAlert(){
    
      Swal.fire({
        type: 'success',   
        title: 'Successfully saved!',
        timer: 1500,
        showConfirmButton: false,
       
      })

      // this.props.cancelSuucessMessage()
      // setTimeout(()=>{
      //   window.close()
  
      // },2000);
   
     
    }
  render() {
    if(this.props.error){
      this.showErrorAlert()
    }
    if(this.props.success){
      this.showSuccessAlert()
    }
    var shareElement = null;
    if(this.props.screenAction ===SCREEN_SHARE){
      shareElement = (
          <div className="shareControl">
      <ScreenShare  savefile={this.savefile} startDraw = {this.drawRect} />
      </div>)
  }
  else if (this.props.screenAction===SCREEN_RECORD){
      shareElement =  (
          <div className="shareControl">
      <ScreenRecorder clearCanvas={this.clearCanvas} savefile={this.savefile} startDraw = {this.drawRect} />
      </div>)
  }
  else if(this.props.screenAction ===FULL_SCREEN_SHARE){
    shareElement=(<div className="shareControl">
    <FullScreenShare  
    savefile={this.savefile} 
    startDraw = {this.drawRect}
    origin={this.state.origin}
    sourceId={this.state.sourceId}
    source={this.state.source}
    gotmessage={this.state.gotmessage} />
    </div>)

  }

  else if(this.props.screenAction ===FULL_SCREEN_RECORD){
    shareElement=(<div className="shareControl">
    <FullScreenRecord 
    savefile={this.savefile} 
    startDraw = {this.drawRect}
    origin={this.state.origin}
    sourceId={this.state.sourceId}
    source={this.state.source}
    gotmessage={this.state.gotmessage} />
      </div>)
  }
    return (
        <div>
            <Navbar />
      <div className="formContainer">
        <Form onRef={ref => (this.child = ref)}/>
        <div className="shareElement">
          {shareElement}
        </div>
      
      </div>
      </div>
    )
  }
}
Explainit.PropType={
    setIssueId : PropType.func.isRequired,
    cancelValidationErrors : PropType.func.issRequired,
}; 
const mapStateToProps = state =>({
  error: state.issues.error,
  success:state.issues.successCreation ,
  screenAction : state.tools.screenAction
})
export default connect(mapStateToProps, {setIssueId,cancelValidationErrors})(Explainit)


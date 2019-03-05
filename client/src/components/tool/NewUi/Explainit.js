import React, { Component } from 'react';
import { render } from 'react-dom';
import Form from '../Form';
import Navbar from './Navbar';
import '../../css/explainit.css';
import {connect} from 'react-redux';
import PropType from  'prop-types'; 
import ScreenShare from '../ScreenShare'
import ScreenRecorder from '../ScreenRecorder'
import FullScreenShare from './enitreScreenShare'
import FullScreenRecord from './FullScreenRecord'
import {SCREEN_SHARE,SCREEN_RECORD,FULL_SCREEN_SHARE,FULL_SCREEN_RECORD} from '../../../actions/types';
import Swal from 'sweetalert2';
import { setIssueId, cancelValidationErrors } from '../../../actions/issueActions'
import {creatAnsProject} from '../../../actions/projectActions'
import { displayFullScrenRecord, displayFullScreShare} from '../../../actions/toolActions'
import config from '../../../config/config';
import Home from './Home'



class Explainit extends Component {
  constructor(props){
    super(props)
    this.state={
      isInstalled:true
    }
    // this.child = React.createRef();
    this.showErrorAlert = this.showErrorAlert.bind(this);
    this.showSuccessAlert = this.showSuccessAlert.bind(this);
    this.drawRect = this.drawRect.bind(this);
    this.savefile = this.savefile.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.downloadExtension = this.downloadExtension.bind(this);
    this.shareFullScreenShare = this.shareFullScreenShare.bind(this);
    // this.displayFullScrenRecord = this.displayFullScrenRecord.bind(this);
    this.recordFullScreen = this.recordFullScreen.bind(this);
    this.saveVideoData = this.saveVideoData.bind(this)
  }
  downloadExtension(){
    window.open(config.EXTENSION_URL,"_self")
  
  }
   
    componentWillMount(){
      var self = this
      this.props.setIssueId(JSON.parse(localStorage.getItem("issueId")))
    var ua = window.detect.parse(navigator.userAgent);

    if(ua.browser.family === "Chrome"){

      var img; 
      img = new Image(); 
      img.src = "chrome-extension://" + config.EXTENSION_ID + "/icon.png"; 
      img.onload = function() { 
      
      }; 
      img.onerror = function() { 
        self.setState({
        isInstalled:false
      })
      };
    }
  }
  
 
      componentDidMount() {
        console.log("asnckjadbskbsjfihb")
        var self = this

    }
    
    showErrorAlert(){
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
      this.props.cancelValidationErrors()
    
    }
    recordFullScreen() {
      this.props.displayFullScrenRecord()
  }
  shareFullScreenShare() {
    this.props.displayFullScreShare()
}

    clearCanvas(){
      this.child.clearAll();
    }
   
    savefile(data){
      this.child.pushData(data);
    }
    saveVideoData(data){
      var issueId= null
      var textExplain = " "
      var imgData = "null"
      var items = {}
    var isquestion= " "
     if(this.props.issueId==null){
      isquestion = "true"
     }
     else{
      isquestion = "false"
      issueId = this.props.issueId
     }
      this.props.creatAnsProject(textExplain,imgData,data,items,isquestion,issueId)
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
    savefile={this.saveVideoData} 
 />
    </div>)

  }

  else if(this.props.screenAction ===FULL_SCREEN_RECORD){
    shareElement=(<div className="shareControl">
    <FullScreenRecord 
    savefile={this.saveVideoData} 
    />
      </div>)
  }
    return(this.state.isInstalled)?(
        <div >
           
      <div className="formContainer">
      <div>
        <button className="buttonLight" onClick={this.shareFullScreenShare}>Share Screen</button>
        <button className="buttonLight" onClick={this.recordFullScreen}>Record Screen</button>
      </div>
        <div className="shareElement">
          {shareElement}
        </div>
      
      </div>
      </div>
    ):(<div >
       {/* <Navbar /> */}
      <div className="messageToDownload">
      <h3>Please down the chrome extension to continue</h3>
        <button className="buttonDark"onClick={this.downloadExtension}>Download Extension</button>
    </div>
    </div>
    )
  }
}
Explainit.PropType={
    setIssueId : PropType.func.isRequired,
    cancelValidationErrors : PropType.func.isRequired,
    displayFullScrenRecord : PropType.func.isRequired,
    displayFullScreShare :PropType.func.isRequired,
    creatAnsProject: PropType.func.isRequired

}; 
const mapStateToProps = state =>({
  error: state.issues.error,
  issueId: state.issues.currentIssueId,
  success:state.issues.successCreation ,
  screenAction : state.tools.screenAction,
  isSignedIn: state.auth.isAuthenticated,
 
})
export default connect(mapStateToProps, { creatAnsProject, setIssueId,displayFullScreShare, displayFullScrenRecord, cancelValidationErrors})(Explainit)


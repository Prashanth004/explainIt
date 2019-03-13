import React, { Component } from 'react'
import config from '../../config/config'
import '../css/screenRecorder.css'
import '../css/shareScreen.css'
import {answerCall} from '../../actions/callAction'
import {connect} from 'react-redux';
import PropType from  'prop-types'; 
import Navbar from './NewUi/Navbar';
import CallImage from'./NewUi/CallImage';
import { stillAuthenicated } from '../../actions/signinAction';
import {getProfileByTwitterHandle } from "../../actions/visitProfileAction";



class DisplayShare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            peer: null,
            host: config.peerHost,
            port: config.peerPort,
            path: config.peerPath,
            stream: null,
            isConnPreasent: false,
            conn:null,
            clientPeerid:null,
            stream:null,
            call:null,
            closedHere:false,
            showDisconectMessage:false,
            connected:false,
            peerProfilePic:null
        }
        this.closeConnection = this.closeConnection.bind(this);
        this.endCall = this.endCall.bind(this);
    }
    componentWillMount() {
        this.props.stillAuthenicated();
        var profilePic = (localStorage.getItem("profilePic"))
        this.setState({
            peerProfilePic:profilePic
        })
        this.props.answerCall()
        var peer = new window.Peer()
        var self = this
        this.setState({
            peer: peer
        })
        peer.on('open', function (id) {
            self.setState({
                clientPeerid: id
            })
        });
       
        console.log(" this.props.match.params.callerid : ",this.props.match.params.callerid)
        var self = this;
        var startConnection = new Promise((resolve, reject)=>{
            var conn = peer.connect(self.props.match.params.callerid);
            resolve(conn)
        })
        startConnection.then((conn)=>{
            setTimeout(()=>{
                conn.send({
                    clientId:self.state.clientPeerid
                });
            },5000)
        })
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        peer.on('call', function (call) {
            console.log("connection : ",call) 
            getUserMedia({ audio: true}, function(audiostream) {
              
                call.answer(audiostream)
                call.on('stream', function(stream){
                    self.setState({
                        connected:true
                    })
                    console.log('Received', stream);
                    var divi = document.querySelector('.screenShareDiv')
                    divi.style.display="block"
                    var video = document.querySelector('#video');
                    video.srcObject  = stream
                    setTimeout(()=>{
                        video.play()
                    },1000)
        });
        call.on('close',function(){
            self.closeConnection()
           
        })
        self.setState({
            stream:audiostream,
            call:call
        })
    })
  })
  
   }
   endCall(){
       var call = this.state.call;
       this.setState({
        closedHere:true
    })
    setTimeout(()=>{
        console.log("excecuting call close")
        call.close();
    },400)
     
       
   }
   closeConnection(){
       if(!this.state.closedHere===true){
           this.setState({
            showDisconectMessage:true 
           })
       }
       var stream = this.state.stream
       stream.stop()
   }

    render() {
        var callAnim=(this.state.connected)?
        (<CallImage action="notWaiting" recieverImageUrl={this.state.peerProfilePic} callerImageUrl={this.props.profilePic}/>)
        :(<CallImage action="waiting" recieverImageUrl={this.state.peerProfilePic} callerImageUrl={this.props.profilePic}/>)

        if(this.state.showDisconectMessage){
            var ShareElement=(<h3>
                Disconnected from other peer
            </h3>)
        }
        else{
                var ShareElement=(
                    <div>
                        <video className="VideoElement" autoplay ={true}id="video" srcObject=" " ></video>
                        <div id="main-circle">
                            <div  onClick={this.endCall}id="inner-circle">END</div>
                        </div>
                      
                    </div>
                )
           
        }
        return (
            <div className="screenShareDiv">
          
               {ShareElement}
               <div className="callImageDiv">
               {callAnim}
               </div>
               
            </div>
        )
    }
}

DisplayShare.PropType={
    answerCall:PropType.func.isRequired,
    stillAuthenicated:PropType.func.isRequired,
    getProfileByTwitterHandle:PropType.isRequired
}

const mapStateToProps = state =>({
    profilePic:state.auth.profilePic,
    peerProfilePic:state.visitProfile.profilePic
    
}) 

export default connect(mapStateToProps,{answerCall, getProfileByTwitterHandle, stillAuthenicated})(DisplayShare)




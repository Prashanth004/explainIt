import React, { Component } from 'react';
// import '../../../css/call.css';
import './record.css'
import { MdCallEnd } from "react-icons/md";
import ScareenShare from './ScreenShareBtn'
import {MdVolumeOff, MdVolumeUp } from "react-icons/md";
import { FiX } from "react-icons/fi"
import config from '../../../../config/config';
import { updateCurrentTime } from '../../../../actions/callAction'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import RecordFloater from './screenRecordControl';
import { setTime, changeStateToMute, changeStateToUnmute, setDiplayOfFloater } from '../../../../actions/floaterAction';
import { HideScreenSharebutton } from '../../../../actions/extensionAction'
import { pauseRecording, resumeRecording } from '../../../../actions/recoderAction';
import Timer from './timer'


class ShareFloater extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otherPersonPic: "",
            callTabid: null,
            postedMessage: false,
            action: null,
            displayAddTimer: true,
            timer: config.RECORD_TIME,
            isClosed: false
        }
        this.shareMyscreen = this.shareMyscreen.bind(this);
        this.endCallFloater = this.endCallFloater.bind(this);
        this.renderer = this.renderer.bind(this);
        this.addExtraMinute = this.addExtraMinute.bind(this);
        this.ReducedMinute = this.ReducedMinute.bind(this);
        this.muteAudio = this.muteAudio.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.toggle = this.toggle.bind(this);
        this.updateRecordertime = this.updateRecordertime.bind(this);
    }
    updateRecordertime=()=>{ }

 
    updateTime() {
        this.updateRecordertime = setTimeout(()=>{
            var currentTime = JSON.parse(localStorage.getItem('curTime'));
        if (currentTime != null)
            var time = (currentTime.minutes + (currentTime.seconds / 60));
        this.setState({ timer: time })
        },1000)
        
    }
    componentWillUnmount(){
        clearTimeout(this.updateRecordertime);
    }
    componentWillMount() {
        var presentTime = null;
        var otherpersonProfilePic = null;
        var action = null;
        var muteOption = null;
        var pauseState = null;

        try {
            presentTime = JSON.parse(localStorage.getItem("timer"));
            otherpersonProfilePic = JSON.parse(localStorage.getItem("profilePic"));
            action = JSON.parse(localStorage.getItem("action"));
            muteOption = JSON.parse(localStorage.getItem('muteState'))
            pauseState = JSON.parse(localStorage.getItem('pauseState'))
        }
        catch (e) {
            // console.log("error : ", e)
        }
        if (pauseState === config.PAUSED_RECORDER)
            this.props.pauseRecording(null);
        else
            this.props.resumeRecording(null)
        if (muteOption === config.UN_MUTED)
            this.props.changeStateToUnmute()
        else
            this.props.changeStateToMute()

        if (action === config.FULL_SCREEN_SHARE) {
            this.setState({
                action: config.FULL_SCREEN_SHARE,
                otherPersonPic: otherpersonProfilePic,
                displayAddTimer: true
            })
            this.props.setTime(presentTime)
        }
        else if (action === config.FULL_SCREEN_RECORD) {
            this.setState({
                action: config.FULL_SCREEN_RECORD,
            })
            this.updateTime();

        }
        else if (action === config.RECIEVER_SCREEN_SHARE) {
            this.setState({
                action: config.RECIEVER_SCREEN_SHARE,
                otherPersonPic: otherpersonProfilePic,
                displayAddTimer: false
            })
            this.props.setTime(presentTime)
        }
        var displayOption = JSON.parse(localStorage.getItem('shareDisplay'));
        this.props.setDiplayOfFloater(displayOption)
    }

    endCallFloater() {
        const { action } = this.state;
        var msg = null
        if (action === config.FULL_SCREEN_SHARE) {
            msg = {
                'type': config.END_CALL_FROM_FLOATER,
                'data': {}
            };
        }
        else {
            msg = {
                'type': config.END_CALL_RECIEVER_FROM_FLOATER,
                'data': {}
            };
        }
        window.parent.postMessage(msg, "*");
    }
    addExtraMinute() {
        localStorage.setItem('infoDisplay', JSON.stringify(config.ADDED_EXTRA_MINTUE_INFO))
        var presentTime = JSON.parse(localStorage.getItem("timer"));
        var updateTime = presentTime;
        this.props.setTime(updateTime);
        var msg = {
            'type': config.ADD_EXTRA_MINUTE_FROM_FLOATER,
            'data': {
                'tabId': this.state.callTabid
            }
        };
        window.parent.postMessage(msg, "*");
    }
    ReducedMinute() {
        var msg ={};
        localStorage.setItem('infoDisplay', JSON.stringify(config.ADDED_EXTRA_MINTUE_INFO))
        var presentTime = JSON.parse(localStorage.getItem("timer"));
        if(presentTime>=2){
            var updateTime = presentTime;
            this.props.setTime(updateTime);
            msg = {
                'type': config.DECREASE_MIUTE_FROM_FLOATER,
                'data': {
                    'tabId': this.state.callTabid
                }
            };
            window.parent.postMessage(msg, "*");
        }
        else{
            msg = {
                'type': config.TIME_TWO_MIUTE_ERROR,
                'data': {
                    'tabId': this.state.callTabid
                }
            };
            window.parent.postMessage(msg, "*");
        }
       
    }

    shareMyscreen() {
        var presentTime = JSON.parse(localStorage.getItem("timer"));
        var updateTime = presentTime;
        this.props.setTime(updateTime)
        this.props.HideScreenSharebutton();
        localStorage.setItem('shareDisplay', JSON.stringify("none"))
        var msg = {
            'type': config.SHARE_MY_SCREEN_FROM_FLOATER,
            'data': {
                'tabId': this.state.callTabid
            }
        };
        window.parent.postMessage(msg, "*");
    }

    muteAudio() {
        var msg = {}
        var presentTime = JSON.parse(localStorage.getItem("timer"));
        var updateTime = presentTime;
        this.props.setTime(updateTime);

        if (this.props.muteState === config.UN_MUTED) {
            localStorage.setItem('muteState', JSON.stringify(config.MUTED))
            msg = {
                'type': config.MUTE_FROM_FLOATER,
                'data': {
                    'tabId': this.state.callTabid
                }
            };
            this.props.changeStateToMute()
        }
        else {
            localStorage.setItem('muteState', JSON.stringify(config.UN_MUTED))
            msg = {
                'type': config.UNMUTE_FROM_FLOATER,
                'data': {
                    'tabId': this.state.callTabid
                }
            };
            this.props.changeStateToUnmute()
        }
        window.parent.postMessage(msg, "*");
    }
    toggle() {
        this.setState({ isClosed: !this.state.isClosed })
        var msg = {
            'type': config.TOGGLE_FLOATER,
        };
        window.parent.postMessage(msg, "*");
    }
    componentDidMount() {
        var self = this;
        var presentTime = config.RECORD_TIME;
        var updateTime = null;
        var otherpersonProfilePic = null
        function postMessageHandler(event) {
            if (event.data.action === config.START_CALL) {
                self.props.changeStateToUnmute()
                otherpersonProfilePic = JSON.parse(localStorage.getItem("profilePic"));
                self.setState({
                    otherPersonPic: otherpersonProfilePic,
                    callTabid: event.data.data.tabid,
                    action: event.data.data.action
                })

                if (event.data.data.action === config.FULL_SCREEN_SHARE) {
                    self.setState({ displayAddTimer: true })
                    self.props.setDiplayOfFloater("none");
                    localStorage.setItem('shareDisplay', JSON.stringify("none"));
                    self.props.setTime(event.data.data.timer);
                }
                else if (event.data.data.action === config.RECIEVER_SCREEN_SHARE) {
                    self.setState({ displayAddTimer: false })
                    localStorage.setItem('shareDisplay', JSON.stringify("block"));
                    self.props.setDiplayOfFloater("block");
                    self.props.setTime(event.data.data.timer);
                }
                else {
                    self.props.resumeRecording(null)
                    self.updateTime();
                }


            }
            if (event.data.action === config.UNMUTE_TO_FLOATER) {
                self.props.changeStateToUnmute()
            }
            if (event.data.action === config.PAUSE_TO_FLOATER)
                self.props.pauseRecording();
            if (event.data.action === config.RESUME_TO_FLOATER) {
                self.updateTime();
                self.props.resumeRecording();
            }

            if (event.data.action === config.MUTE_TO_FLOATER) {
                self.props.changeStateToMute()
            }
            if (event.data.action === config.DISPLAY_SHARE_ICON_TO_FLOATER) {
                self.props.setDiplayOfFloater("block");
                presentTime = JSON.parse(localStorage.getItem("timer"));
                updateTime = presentTime;
                self.props.setTime(updateTime);
                localStorage.setItem('shareDisplay', JSON.stringify("block"));
            }
            if (event.data.action === config.HIDE_SHARE_ICON_TO_FLOATER) {
                self.props.setDiplayOfFloater("none");
                presentTime = JSON.parse(localStorage.getItem("timer"));
                updateTime = presentTime;
                self.props.setTime(updateTime);
                localStorage.setItem('shareDisplay', JSON.stringify("none"));

            }
            if (event.data.action === config.ADD_EXTRA_MIUTE_TO_FLOATER_RECIEVER) {
                presentTime = JSON.parse(localStorage.getItem("timer"));
                updateTime = presentTime;
                self.props.setTime(updateTime)
            }
            if (event.data.action === config.DECREASE_MINUTE_TO_FLOATER_RECIEVE) {
                presentTime = JSON.parse(localStorage.getItem("timer"));
                updateTime = presentTime;
                self.props.setTime(updateTime)
            }
            if (event.data.action === config.ADD_EXTRA_TIME_TO_FLOATER) {
                presentTime = JSON.parse(localStorage.getItem("timer"));
                updateTime = presentTime;
                self.props.setTime(updateTime)
            }
            if (event.data.action === config.DECREASE_MINUTE_TO_FLOATER) {
                presentTime = JSON.parse(localStorage.getItem("timer"));
                updateTime = presentTime;
                self.props.setTime(updateTime)

            }
            
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
    }

    renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return (null)
        } else {
            return <span>{hours}:{minutes}:{seconds}</span>;
        }
    };
    render() {

        const floateGridStyle = (this.props.floaterDisplay==='block')?{
            display: "grid",
            gridTemplateColumns: "19% 24% 44% 12%"
        }:{
            display: "grid",
            gridTemplateColumns: "19% 69% 12%"
        }


        const mutBtn = (this.props.muteState === config.UN_MUTED) ?
            (<div className="muteopt">
                <span className="hint--left" aria-label="Mute">
                    <MdVolumeOff className="muteIcons" onClick={this.muteAudio} />
                </span>
            </div>) :
            (<div>
                <span className="hint--left" aria-label="Un Mute">
                    <MdVolumeUp className="muteIcons" onClick={this.muteAudio} />
                </span>
            </div>)
        const { action } = this.state;
        return (!this.state.isClosed) ? ((action === config.FULL_SCREEN_SHARE || action === config.RECIEVER_SCREEN_SHARE) ? (
            <div className="floaterContainerTansFloat">
                <div className="closeCross">
                <span><FiX onClick={this.toggle} /></span>
                </div>
                <div className="callImageDivAnwserMainFloat" style={floateGridStyle} >

                    <div className="callPage-recieverImageDivFloat">
                        <span>
                            <MdCallEnd
                                onClick={this.endCallFloater}
                                className="img__overlayFloat imgShare"
                                style={{
                                    padding: "10px"
                                }} />
                        </span>
                        <span className="hint--top" aria-label={this.props.otherPersonName}>
                            <img alt="reciever profile pic" className="callPage-recieverImageFloat" src={this.state.otherPersonPic}></img>
                        </span>
                    </div>
                    <ScareenShare
                    shareMyscreen={this.shareMyscreen}
                    floaterDisplay = {this.props.floaterDisplay} />
                   
                    <Timer 
                    ReducedMinute = {this.ReducedMinute}
                    displayAddTimer = {this.state.displayAddTimer}
                    floaterTime = {this.props.floaterTime}
                    addExtraMinute = {this.addExtraMinute}
                    renderer ={this.renderer}/>
                    {/* fontSize="13px" style={{ color: "white", marginTop:"10px" }} */}
                   
                    <div>
                        <div className="muteBtnFloat" >
                            {mutBtn}
                        </div>
                    </div>
                </div>

            </div>
        ) : (<RecordFloater
            timer={this.state.timer}
            toggle={this.toggle}
            updateTime={this.updateTime}
            callTabid={this.state.callTabid}
            timeAloted={this.props.floaterTime} />)) :
            (<div className="logocontainerFloater" onClick={this.toggle}>
                <div className="logoFloater">
                    <img className="logoImg" alt="logo" src={require("../../../images/logo5.png")} />

                </div>
            </div>)
    }
}
ShareFloater.PropType = {
    updateCurrentTime: PropType.func.isRequired
}
const mapStateToProps = state => ({
    currentTimeLeft: state.call.currentTimeLeft,
    floaterTime: state.floater.floaterTime,
    floaterDisplay: state.floater.floaterDisplay,
    muteState: state.floater.muteState
})

export default connect(mapStateToProps, {
    updateCurrentTime, setTime, setDiplayOfFloater,
    pauseRecording, resumeRecording,
    changeStateToMute, changeStateToUnmute, HideScreenSharebutton
})(ShareFloater)



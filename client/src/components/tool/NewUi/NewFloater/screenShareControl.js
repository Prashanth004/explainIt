import React, { Component } from 'react';
import '../../../css/call.css';
import { MdCallEnd } from "react-icons/md";
import Countdown from 'react-countdown-now';
import { MdFilterNone, MdVolumeOff, MdVolumeUp } from "react-icons/md";
import config from '../../../../config/config';
import { updateCurrentTime } from '../../../../actions/callAction'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import ScreenRecorder from './screenRecordControl';
import { setTime,changeStateToMute,changeStateToUnmute, setDiplayOfFloater } from '../../../../actions/floaterAction';
import { HideScreenSharebutton } from '../../../../actions/extensionAction'


class ShareFloater extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otherPersonPic: "",
            callTabid: null,
            postedMessage: false,
            action: null,
            displayAddTimer:true
        }
        this.shareMyscreen = this.shareMyscreen.bind(this);
        this.endCallFloater = this.endCallFloater.bind(this);
        this.renderer = this.renderer.bind(this);
        this.addExtraMinute = this.addExtraMinute.bind(this);
        this.muteAudio = this.muteAudio.bind(this);
    }

    componentWillMount() {
        var presentTime = null;
        var otherpersonProfilePic = null;
        var action = null;
        var muteOption = null;

        try {
            presentTime = JSON.parse(localStorage.getItem("timer"));
            otherpersonProfilePic = JSON.parse(localStorage.getItem("profilePic"));
            action = JSON.parse(localStorage.getItem("action"));
            muteOption = JSON.parse(localStorage.getItem('muteState'))
        }
        catch (e) {
            console.log("error : ", e)
        }
        if(muteOption === config.UN_MUTED)
            this.props.changeStateToUnmute()
        else
            this.props.changeStateToMute()
        this.props.setTime(presentTime)
        if (action === config.FULL_SCREEN_SHARE) {
            this.setState({
                action: config.FULL_SCREEN_SHARE,
                otherPersonPic: otherpersonProfilePic,
            })
        }
        else if (action === config.FULL_SCREEN_RECORD) {
            this.setState({
                action: config.FULL_SCREEN_RECORD,
            })
        }
        else if (action === config.RECIEVER_SCREEN_SHARE) {
            this.setState({
                action: config.RECIEVER_SCREEN_SHARE,
                otherPersonPic: otherpersonProfilePic,
                displayAddTimer:false
            })
        }
        var displayOption = JSON.parse(localStorage.getItem('shareDisplay'));
        this.props.setDiplayOfFloater(displayOption)
    }

    endCallFloater() {
        const { action } = this.state;
        console.log("action : ", action)
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
        var msg ={}
        console.log("floate mute")
        var presentTime = JSON.parse(localStorage.getItem("timer"));
        var updateTime = presentTime;
        this.props.setTime(updateTime);
      
        if(this.props.muteState === config.UN_MUTED){
            console.log("def unmuted")
            localStorage.setItem('muteState',JSON.stringify(config.MUTED))
            msg = {
                'type': config.MUTE_FROM_FLOATER,
                'data': {
                    'tabId': this.state.callTabid
                }
            };
            this.props.changeStateToMute()
        }
        else{  
            console.log("def muted")
            localStorage.setItem('muteState',JSON.stringify(config.UN_MUTED))
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
    componentDidMount() {
        var self = this;
        var presentTime = 3;
        var updateTime = null;
        var otherpersonProfilePic = null
        function postMessageHandler(event) {
            if (event.data.action === config.START_CALL) {
                otherpersonProfilePic = JSON.parse(localStorage.getItem("profilePic"));
                self.setState({
                    otherPersonPic: otherpersonProfilePic,
                    callTabid: event.data.data.tabid,
                    action: event.data.data.action
                })
                if(event.data.data.action === config.UNMUTE_TO_FLOATER){
                    self.props.changeStateToUnmute()
                }
                if(event.data.data.action === config.MUTE_TO_FLOATER){
                    self.props.changeStateToMute()
                }
                if (event.data.data.action === config.FULL_SCREEN_SHARE) {
                    self.props.setDiplayOfFloater("none");
                    localStorage.setItem('shareDisplay', JSON.stringify("none"));
                }
                else if (event.data.data.action === config.RECIEVER_SCREEN_SHARE) {
                    self.setState({ displayAddTimer:false})
                    localStorage.setItem('shareDisplay', JSON.stringify("block"));
                    self.props.setDiplayOfFloater("block");
                }

                self.props.setTime(event.data.data.timer)
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
                // this.props.setTime
            }
            if (event.data.action === config.ADD_EXTRA_MIUTE_TO_FLOATER_RECIEVER) {
                console.log("i am being reached here")
                presentTime = JSON.parse(localStorage.getItem("timer"));
                updateTime = presentTime;
                self.props.setTime(updateTime)
            }
            if (event.data.action === config.ADD_EXTRA_TIME_TO_FLOATER) {
                console.log(JSON.parse(localStorage.getItem("timer")))
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
      const displatAddTime = (this.state.displayAddTimer)?"block":"none"
        const mutBtn = (this.props.muteState === config.UN_MUTED) ?
            (<div className="callPage-recieverImageDiv muteButton">
            <span className="hint--left" aria-label="Mute">
                <MdVolumeOff style={{marginTop:"3px"}} onClick={this.muteAudio} className="endButton" />
            </span>
        </div>) :
            (
                <div className="callPage-recieverImageDiv muteButton unmuteButton">
                <span className="hint--left" aria-label="Un Mute">
                    <MdVolumeUp  style={{marginTop:"3px"}}  onClick={this.muteAudio} className="endButton" />
                </span>
            </div>)
        const { action } = this.state;
        return (action === config.FULL_SCREEN_SHARE || action === config.RECIEVER_SCREEN_SHARE) ? (
            <div className="floaterContainerTans">
                <div className="callImageDivAnwserMain Share">

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
                   
                    <div>
                        <div style={{ display: this.props.floaterDisplay }} className="callPage-recieverImageDiv endCall Shareicon">
                            <span className="hint--bottom" aria-label="Share my screen">
                                <MdFilterNone onClick={this.shareMyscreen} className="endButton" />
                            </span>
                        </div>
                    </div>
                    <div>
                        <div  style={{ display: displatAddTime }}>
                        <button className="addMin" onClick={this.addExtraMinute}>Add 1 min</button>
                        </div>
                    </div>
                    <div fontSize="13px" style={{ color: "white", marginTop:"10px" }}>
                        <Countdown
                            date={Date.now() + this.props.floaterTime * 60 * 1000}
                            renderer={this.renderer}
                        />
                    </div>
                    <div>
                        <div>
                                {mutBtn}
                        </div>
                    </div>

                   

                </div>
            </div>
        ) : (<ScreenRecorder callTabid={this.state.callTabid}
            timeAloted={this.props.floaterTime} />)
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
    changeStateToMute,changeStateToUnmute, HideScreenSharebutton
})(ShareFloater)



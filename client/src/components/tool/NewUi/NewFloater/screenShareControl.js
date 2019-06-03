import React, { Component } from 'react';
import '../../../css/call.css';
import { MdCallEnd } from "react-icons/md";
import Countdown from 'react-countdown-now';
import { MdFilterNone } from "react-icons/md";
import config from '../../../../config/config';
import { updateCurrentTime } from '../../../../actions/callAction'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import ScreenRecorder from './screenRecordControl'

class ShareFloater extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shouldDisplay: true,
            timeAloted: 3,
            otherPersonPic: "",
            callTabid: null,
            postedMessage: false,
            action: null
        }
        this.shareMyscreen = this.shareMyscreen.bind(this);
        this.endCallFloater = this.endCallFloater.bind(this);
        this.renderer = this.renderer.bind(this);
    }
    componentWillMount() {
        this.setState({
            action: config.FULL_SCREEN_SHARE
        })
    }
    endCallFloater() {
        var msg = null
            msg = {
                'type': config.END_CALL_FROM_FLOATER,
                'data': {
                    'timeLeft': this.props.currentTimeLeft,
                    'tabId': this.state.callTabid
                }
            };
        window.parent.postMessage(msg, "*");
    }
    shareMyscreen() {
        var msg = {
            'type': config.SHARE_MY_SCREEN_FROM_FLOATER,
            'data': {
                'tabId': this.state.callTabid
            }
        };
        window.parent.postMessage(msg, "*");
    }
    componentDidMount() {
        var self = this;
        function postMessageHandler(event) {
            console.log("event: ",event)
            if (event.data.action === config.START_CALL) {
                console.log("opening floater")
                self.setState({
                    timeAloted: event.data.data.timer,
                    otherPersonPic: event.data.data.profilePic,
                    callTabid: event.data.data.tabid,
                })
                if (event.data.data.action === config.FULL_SCREEN_SHARE) {
                    self.setState({
                        action: config.FULL_SCREEN_SHARE
                    })
                }
                else {
                    self.setState({
                        action: config.FULL_SCREEN_RECORD
                    })
                }
            }
            if (event.data.action === config.ADD_EXTRA_TIME_TO_FLOATER) {
                console.log(JSON.parse(localStorage.getItem("timer")))
                var presentTime = JSON.parse(localStorage.getItem("timer"));
                var updateTime = presentTime;
                self.setState({
                    timeAloted: updateTime
                })
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
        return (this.state.action === config.FULL_SCREEN_SHARE)?(
            <div className="floaterContainerTans">
                <div className="callImageDivAnwserMain Share">

                    <div className="callPage-recieverImageDiv">
                        <span>
                            <MdCallEnd
                                onClick={this.endCallFloater}
                                className="img__overlay imgShare"
                                style={{
                                    padding: "10px"
                                }} />
                        </span>
                        <span className="hint--top" aria-label={this.props.otherPersonName}>
                            <img alt="reciever profile pic" className="callPage-recieverImageFloat" src={this.state.otherPersonPic}></img>
                        </span>
                    </div>
                    <div style={{ display: this.state.shouldDisplay }} className="callPage-recieverImageDiv endCall">
                        <span className="hint--bottom" aria-label="Share my screen">
                            <MdFilterNone onClick={this.shareMyscreen} className="endButton" />
                        </span>
                    </div>
                    <div fontSize="13px" style={{ color: "white" }}>
                        <Countdown
                            date={Date.now() + this.state.timeAloted * 60 * 1000}
                            renderer={this.renderer}
                        />
                    </div>

                </div>
            </div>
        ):(<ScreenRecorder callTabid={this.state.callTabid}
                            timeAloted={this.state.timeAloted}/>)
    }
}
ShareFloater.PropType = {
    updateCurrentTime: PropType.func.isRequired
}
const mapStateToProps = state => ({
    currentTimeLeft: state.call.currentTimeLeft
})

export default connect(mapStateToProps, {
    updateCurrentTime
})(ShareFloater)



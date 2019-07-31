import React from 'react';
import Countdown from 'react-countdown-now';
import TimerBar from '../TimerBar';
import RecordFormInput from './recordForm';


export default (props) => {
    const {permissonDenied,toggle,closeFunction,saveforSelf,recordTime,isFullScreenRecording,renderer} = props;
    const timer = (isFullScreenRecording) ? ((<Countdown
        date={Date.now() + recordTime * 60 * 1000}
        renderer={renderer}
    />)) : (null)

    const recordingEle = (!permissonDenied) ? (<RecordFormInput
        saveforSelf={saveforSelf}
        toggle = {toggle}/>) : (<div>
        <p>Permission denied to record the screen</p>
        <button className="buttonLight" onClick={closeFunction}>Close</button>
    </div>)
    return(!isFullScreenRecording)?(
        <div className="btDiv">
            {recordingEle}
        </div>
    ):(<div>
        <p>Recording screen</p>
        <TimerBar />
        {timer}
    </div>)
}


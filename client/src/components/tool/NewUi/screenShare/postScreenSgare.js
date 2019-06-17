import React from 'react';
import CopyToClipboard from '../../CopytoClipboard';
import { MdReplay } from "react-icons/md";
import { FiX, FiVideo } from "react-icons/fi";
import config from '../../../../config/config'

export default (props) => {
    var buttons = null;
    var noInternet = (props.noInternet)?("No Intenet conecticvity"):("No Intenet conecticvity")
    const videoAudio = (<div>
        <video id="videoPlyr"  onPlay={props.play_clicked} onPause={props.pause_clicked}className="videoPlayer2" src={props.downloadUrlVideo} controls={true}></video>
        <audio id="AudioPlyr" style={{ display: "none" }} className="videoPlayer2" src={props.downloadUrlAudio}></audio>
    </div>)
    const linkToAccess = props.linkToAccess !== null ? (<div>
        <CopyToClipboard sharablelink={props.linkToAccess} />
    </div>) : (null)


var videoTagWithAudio = (<div>
    <div>
        {videoAudio}
        <p>Link To access your recording.</p>
        {linkToAccess}
    </div>
</div>)


const savingProcessDiv = (!props.isSaved)?(
    <div> {videoAudio}
        <p>saving..</p></div>):(<div> {videoAudio}
        <p>saved successfully!</p></div>)



 


    var savingMsg = (props.explainBy === config.null)?
    ((!props.manualClose && !props.timerEnded)?
        ((props.linkToAccess !== null)?
            (videoTagWithAudio):
        (null)):(videoTagWithAudio)):(savingProcessDiv)
  
    var MessageDisconnected = null;

    if (props.timerEnded) {
        if (!props.saveinitiated && props.peerAudioBlob !== null && props.blob !== null) { props.savefilePrivate() }
        MessageDisconnected = (
            <div>
                <p><b>Call ended as the time alloted ended</b></p>
                {savingMsg}
            </div>)
    }
    else if (props.showDisconectMessage && !props.closedHere && props.manualClose) {
        if (!props.saveinitiated && props.peerAudioBlob !== null && props.blob !== null) { props.savefilePrivate() }
        MessageDisconnected = (<div>
            <p><b>Call ended from other peer</b></p>
            {savingMsg}

        </div>)
    }
    else if (!props.manualClose && !props.timerEnded && !props.retry && (props.retryLimit < 1)) {
        buttons = (!props.saveinitiated) ?
            (<div><span className="hint--bottom" aria-label="Retry">
                <MdReplay className="icons" onClick={props.retryCall} />
            </span>
                <span className="hint--bottom" aria-label="Record call and send">
                    <FiVideo className="icons" onClick={props.recordCall} />
                </span>
                <span className="hint--bottom" aria-label="End Call Session">
                    <FiX className="icons" onClick={props.savefilePrivate} />
                </span>
            </div>) : (null)
        MessageDisconnected = (
            <div>
                <p><b>Call disconnected due to network issues</b></p>
                {buttons}
                {savingMsg}
            </div>
        )
    }
    else if (props.retry && !props.retryTimeOut && !props.noInternet)
        MessageDisconnected = (
            <div>
                <p><b>Reconnecting..</b></p>

            </div>
        )
    else if (props.retry && (props.retryTimeOut || props.noInternet)) {
        buttons = (!props.saveinitiated) ? (
            <div>
                <span className="hint--bottom" aria-label="Record call and send">
                    <FiVideo className="icons" onClick={props.recordCall} />
                </span>
                <span className="hint--bottom" aria-label="End Call Session">
                    <FiX className="icons" onClick={props.savefilePrivate} />
                </span>
            </div>) : (null)
        MessageDisconnected = (
            <div>
                <p><b>Retry failed</b><br />{noInternet}</p>
                <p>You can reord the screen and send it</p>
                {buttons}
                {savingMsg}
            </div>
        )
    }
    else {
        if (!props.saveinitiated && props.peerAudioBlob !== null && props.blob !== null) { props.savefilePrivate() }
        MessageDisconnected = (<div>
            <p><b>Call ended</b></p>
            {savingMsg}

        </div>)
    }

  return (
    <div>
      <div className="DisconMessage">
                {MessageDisconnected}

            </div>
    </div>
  )
}

import React from 'react';
import CopyToClipboard from '../../CopytoClipboard';
import { MdReplay } from "react-icons/md";
import { FiX, FiVideo } from "react-icons/fi";
import config from '../../../../config/config'

export default (props) => {
    const recrdsend=!props.saveinitiated?(<p>You can record the screen and send it</p>):(null);
    // console.log(props.retry,!props.retryTimeOut,!props.noInternet)



    //  const MessageDisconnected = (props.timerEnded)?(<div>
    //     <p><b>Call ended as the time alloted ended</b></p>
    //     {savingMsg}
    // </div>):(null)
    var buttons = null;
    var noInternet = (props.noInternet)?("No Intenet conecticvity"):(null)
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
        (props.saveinitiated?(<p>The recording of the call could not be save due to network issue.</p>):null)):(videoTagWithAudio)):(savingProcessDiv)
  
    var MessageDisconnected = null;

    if (props.timerEnded) {
        console.log("checking saving action")
        if (!props.saveinitiated && props.peerAudioBlob !== null && props.blob !== null) { props.savefilePrivate() }
        MessageDisconnected = (
            <div>
                <p><b>Call ended as the time alloted ended</b></p>
                {savingMsg}
            </div>)
    }
    else if (props.showDisconectMessage && !props.closedHere && props.manualClose) {
        console.log("checking saving action")
        if (!props.saveinitiated && props.peerAudioBlob !== null && props.blob !== null) { props.savefilePrivate() }
        MessageDisconnected = (<div>
            <p><b>Call ended from other peer</b></p>
            {savingMsg}

        </div>)
    }
   
    else if (!props.manualClose && !props.timerEnded && !props.retry && (props.retryLimit < 1)) {
        buttons = (!props.saveinitiated) ?
            (<div><span className="hint--top" aria-label="Retry">
                <MdReplay className="icon" onClick={props.retryCall} />
            </span>
                <span className="hint--top" aria-label="Record call and send">
                    <FiVideo className="icon" onClick={props.recordCall} />
                </span>
                <span className="hint--top" aria-label="End Call Session">

                    <FiX className="icon" onClick={props.savefilePrivate} />
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
                <p><b>Trying to Reconnect...</b></p>

            </div>
        )
    else if (props.retry && (props.retryTimeOut || props.noInternet)) {
        buttons = (!props.saveinitiated) ? (
            <div>
                <span className="hint--top" aria-label="Record call and send">
                    <FiVideo className="icon" onClick={props.recordCall} />
                </span>
                <span className="hint--top" aria-label="End Call Session">
                    <FiX className="icon" onClick={props.savefilePrivate} />
                </span>
            </div>) : (null)
        MessageDisconnected = (
            <div>
                <p><b>Retry failed</b><br />{noInternet}</p>
                {recrdsend}
                {buttons}
                {savingMsg}
            </div>
        )
    }
    else {
        console.log("checking saving action")
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

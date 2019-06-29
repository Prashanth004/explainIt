import React, { Component } from 'react';
import Countdown from 'react-countdown-now';
import TimerBar from '../TimerBar';
import InputNumber from '../InputNumber';

export default class componentName extends Component {
    constructor(props){
        super(props)
        this.state={
            emptyNumber: false,
            emptyUserName: false,
            negNumber: false,
            noText: false,
            maxTimeForVideo: 20,
            numberValue:3,
            limitExce: false,

        
            // emptyUserName,maxTimeForVideo,numberValue,emptyNumber, empty,noText,negNumber,limitExce
        }
        this.changeImputNumber = this.changeImputNumber.bind(this);
        this.upateTimeStartRecord = this.upateTimeStartRecord.bind(this);
    }

    // this.convey.style.display = "none"
    upateTimeStartRecord(){
        const {noText,emptyNumber,limitExce,negNumber,numberValue} =  this.state;
        if(!noText && !emptyNumber && !limitExce && !negNumber){
            this.props.toggle(numberValue)
        }
    }
    changeImputNumber(e) {
        var noOfMinutestemp = e.target.value;
        if ( !Number.isInteger(Number(noOfMinutestemp))) {
            this.setState({noText: true})
        }
        else if (noOfMinutestemp.length === 0) {
            this.setState({ emptyNumber: true})
        }
        else if ( noOfMinutestemp !== null && noOfMinutestemp > this.state.maxTimeForVideo) {
            this.setState({ limitExce: true })
        }
        else if ( noOfMinutestemp.length > 0 && noOfMinutestemp < 1) {
            this.setState({ negNumber: true })
        }
        else {
            this.setState({
                limitExce: false,
                negNumber: false,
                noText: false,
                emptyNumber: false,
            })
        }
        this.setState({numberValue:noOfMinutestemp})
    }

  render() {
    const {emptyUserName,maxTimeForVideo,numberValue,emptyNumber, empty,noText,negNumber,limitExce}  = this.state;
    const {permissonDenied,closeFunction,recordTime,isFullScreenRecording,toggle,renderer} = this.props;

    const timer = (isFullScreenRecording) ? ((<Countdown
        date={Date.now() + recordTime * 60 * 1000}
        renderer={renderer}
    />)) : (null)
    const spanElement= ((limitExce)?(
        <span className="spanElement" >Maximum duration for the call is {maxTimeForVideo} minutes</span>
        ):(negNumber)?(
        <span className="spanElement" >Duration of the call can not be negetive number or zero</span>
        ):noText?(
        <span className="spanElement" >Duration of the call to be number of minutes only</span>
        ):emptyNumber?(
            <span className="spanElement" >Duration of the call to be number of minutes only</span>
        ):((empty)?(
        
        <span className="spanElement">Cant be empty</span>
        ):(emptyUserName?(
        <span className="spanElement">User name cant be empty</span>
        ):(null))))

    const recordingEle = (!permissonDenied) ? (<div >
        <p style={{ fontSize: "15px", fontWeight: "500" }}>Record the screen for <InputNumber
                    empty={emptyNumber}
                    emptyUserName={emptyUserName}
                    limitOfChar={maxTimeForVideo}
                    limitExce={limitExce}
                    changeInputValue={this.changeImputNumber}
                    textValue={numberValue}
                    negNumber={negNumber}
                    noText={noText} /> </p>
                    {spanElement}
                    <button className="buttonLight" ref={a => this.convey = a} onClick={this.upateTimeStartRecord}>Start</button>
    </div>) : (<div>
        <p>Permission enied to record the screen</p>

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
}

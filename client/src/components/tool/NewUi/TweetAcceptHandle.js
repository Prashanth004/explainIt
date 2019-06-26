import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import InputNumber from './InputNumber';
import AcceptTopic from './Saveproject';
import TweetSuggest from './TweetSug';
import config from '../../../config/config';
import { setNoOfMinutes, updateCurrentTime } from '../../../actions/callAction'
import { FiArrowLeft } from "react-icons/fi";
import CopyToClipboard from '../CopytoClipboard';
import { getProfileByTwitterHandle } from "../../../actions/visitProfileAction";
import ProfileNotOnExplain from "./ProfileNotOnTwitter/ProfileNotOnExplain"
import { getRecpientId, getTwitterHandles, resetValues } from '../../../actions/twitterApiAction'
// import { type } from 'os';

class tweetSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            twitterHandle: '',
            tweetTested: false,
            isVisitProfile: false,
            limitExce: false,
            emptyNumber: false,
            emptyUserName: false,
            negNumber: false,
            noText: false,
            maxTimeForVideo: null,
            tweetAction: false,
            timeInputDone: false,
            noInternet: false,
            selfShare: false,
            numberValue:3
            
        }
        this.testHandle = this.testHandle.bind(this);
        this.updateTwitterHandleBox = this.updateTwitterHandleBox.bind(this);
        this.tweetTheMessage = this.tweetTheMessage.bind(this);
        this.changeTweetStateNeg = this.changeTweetStateNeg.bind(this);
        this.changeImputNumber = this.changeImputNumber.bind(this)
    }
    componentWillMount() {
        const { resetValues, getTwitterHandles } = this.props
        if(this.props.visitedTiwtterHandle!==null)
            this.setState({ twitterHandle: this.props.visitedTiwtterHandle });
        
        if (this.props.explainBy === config.SHARE_SCREEN_EXPALIN)
            this.setState({ twitterHandle: this.props.sharehandle });
        
        resetValues();
        getTwitterHandles();
        this.setState({ maxTimeForVideo: config.MAX_VIDEO_TIME_LIMIT })
    }

    testHandle() {
        const { OwnerTwitterHandle, getProfileByTwitterHandle, getRecpientId } = this.props;
        const { twitterHandle } = this.state;
        const twitterHandleTemp = (twitterHandle.includes('@')) ?
            (twitterHandle.replace("@", "")) : (twitterHandle)
        
        if (twitterHandleTemp === OwnerTwitterHandle)
            this.setState({ selfShare: true })
        if (!window.navigator.onLine)
            this.setState({ noInternet: true })
        if ((twitterHandleTemp.length) === 0)
            this.setState({ emptyUserName: true })
        else
            if (!this.props.limitExce &&
                !this.props.negNumber &&
                !this.state.noText
                && !this.state.negNumber
                && !this.state.emptyNumber) {
                this.setState({ tweetTested: true })
                getProfileByTwitterHandle(twitterHandleTemp)
                getRecpientId(twitterHandleTemp, this.props.userId)
            }
    }

    updateTwitterHandleBox(e, value) {
        this.setState({
            twitterHandle: value,
            selfShare: false,
            tweetTested: false,
            emptyUserName: false,
            noInternet: false
        })
    }
    sendRecordding() {

    }

    changeTweetStateNeg() {
        this.setState({
            tweetTested: false
        })
    }
    changeImputNumber(e) {
        var noOfMinutestemp = e.target.value;
        console.log("noOfMinutestemp : ",noOfMinutestemp.length)

        if ( !Number.isInteger(Number(noOfMinutestemp))) {
            console.log('a',Number.isInteger(Number(noOfMinutestemp)))
            this.setState({
                noText: true
            })
        }
        else if (noOfMinutestemp.length !== 0 && noOfMinutestemp !== null && noOfMinutestemp > this.state.maxTimeForVideo) {
            this.setState({
                limitExce: true
            })
        }
        else if (noOfMinutestemp.length !== 0 && noOfMinutestemp.length > 0 && noOfMinutestemp < 1) {
            this.setState({
                negNumber: true
            })
        }
        else if (noOfMinutestemp.length === 0) {
            this.setState({
                emptyNumber: true
            })
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
        this.props.setNoOfMinutes(Number(e.target.value))
        this.props.updateCurrentTime(Number(e.target.value))

    }


    tweetTheMessage() {
        this.setState({
            tweetTested: false,
            doneTweeting: true
        })
        this.props.makeCallAction()

    }
    render() {
        const {emptyUserName, empty,noText,negNumber,limitExce}  = this.state;
       
        const { twitterHandle, tweetTested, doneTweeting, noInternet, selfShare,
            isVisitProfile, numberValue,emptyNumber,   maxTimeForVideo } = this.state;
        const {  doneFetching, twitterHandleValid,
            fetchProfile, isPresentInExplain } = this.props;
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
        var validatinginfo = null;
        var mainContainer = (<div className="startShare">
            <p style={{ fontSize: "13px", fontWeight: "500" }}>Screen share with  <TweetSuggest
                onChange={this.updateTwitterHandleBox}
                placeholder="@username"
                classOfInput="handleInput"
                tweetTextvalue={twitterHandle}
                classOfMenu="screeShareMenu"
            /> for<InputNumber
                    empty={emptyNumber}
                    emptyUserName={emptyUserName}
                    limitOfChar={maxTimeForVideo}
                    limitExce={limitExce}
                    changeInputValue={this.changeImputNumber}
                    textValue={numberValue}
                    negNumber={negNumber}
                    noText={noText} />
            </p>
            {spanElement}
            <br/>
            <button onClick={this.testHandle} style={{ marginTop: "5px" }} className="buttonLight" >Next</button>
        </div>)
        if (tweetTested && !doneTweeting) {
            if (doneFetching && fetchProfile) {
                if (!twitterHandleValid) {
                    if (noInternet)
                        validatinginfo = (<div>
                            <p className="info">Please check the internet connectivity</p>
                        </div>)
                   
                    else {
                        validatinginfo = (<div>
                            <p className="info">Incorrect twitter handle<br />
                                Please check and try again</p>
                        </div>
                        )
                    }

                }
                else if (selfShare){
                    validatinginfo = (<div>
                         <span style={{
                            float: "left",
                            fontSize: "15px",
                            marginTop:"-35px"
                        }}>
                            <FiArrowLeft  onClick={this.changeTweetStateNeg} />
                        </span>
                        <div className="TwiValidInfo">
                        <p style={{fontWeight:"500"}}>It is not a good idea to share screen with yourself</p>
                        <p className="info">You have entered your twitter hanlde</p>
                        </div>
                    </div>);
                     mainContainer = (null)
                }
               
                else if (!isPresentInExplain) {
                    validatinginfo = (<div>
                        <span style={{
                            float: "left",
                            fontSize: "15px",
                            marginTop:"-35px"
                        }}>
                            <FiArrowLeft onClick={this.changeTweetStateNeg} />
                        </span>
                        <div  className="TwiValidInfo" >
                        <ProfileNotOnExplain
                            isVisitProfile={isVisitProfile}
                            twitterhandle={twitterHandle}
                            source={config.SCREEN_SHARE_PAGE} />

                        <span style={{ fontSize: "14px" }}>
                            You can manually share the link now to get connected
                        </span>
                        <CopyToClipboard sharablelink={this.props.shareScreenLink} />
                        </div>
                    </div>
                    )
                    mainContainer = (null)

                }

                else {

                    validatinginfo = (<div  >
                        <span style={{
                            float: "left",
                            fontSize: "15px",
                            marginTop:"-35px"
                        }}>
                            <FiArrowLeft onClick={this.changeTweetStateNeg} />
                        </span>
                        <div className="TwiValidInfo">
                        <AcceptTopic tweetTheMessage={this.tweetTheMessage} />
                        </div>
                       
                    </div>)
                    mainContainer = (null)
                }
            }
            else {
                validatinginfo = (<p className="info">checking handle validity</p>)
            }
        }
        return (
            <div>
                {mainContainer}
                {validatinginfo}
            </div>
        )
    }
}

tweetSearch.PropType = {
    getRecpientId: PropType.func.isRequired,
    resetValues: PropType.func.isRequired,
    getTwitterHandles: PropType.func.isRequired,
    getProfileByTwitterHandle: PropType.func.isRequired
}
const mapStateToProps = state => ({
    twitterHandleValid: state.twitterApi.profilePresent,
    doneFetching: state.twitterApi.doneFetching,
    twiterHandleArray: state.twitterApi.twitterHandle,
    fetchProfile: state.visitProfile.fetchProfile,
    userId: state.auth.id,
    noOfMinutes: state.call.noOfMinutes,
    userName: state.visitProfile.userName,
    visitedTiwtterHandle:state.visitProfile.visitedTiwtterHandle,
    onlineStatus: state.visitProfile.onlineStatus,
    busyStatus: state.visitProfile.busyStatus,
    isPresentInExplain: state.visitProfile.isPresent,
    explainBy: state.explain.explainBy,
    sharehandle: state.explain.sharehandle,
    OwnerTwitterHandle: state.auth.twitterHandle,
    
})
export default connect(mapStateToProps, {
    getProfileByTwitterHandle, getTwitterHandles,
    setNoOfMinutes, updateCurrentTime,
    getRecpientId, resetValues
})(tweetSearch)


import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import InputNumber from '../../InputNumber';
import AcceptTopic from '../../Saveproject';
import {saveTopicOfTheCall} from '../../../../../actions/callAction'
import TweetSuggest from '../../TweetSug';
import {cancelDialedOption} from '../../../../../actions/dialActions'
import config from '../../../../../config/config';
import { setNoOfMinutes, updateCurrentTime } from '../../../../../actions/callAction'
import { NoInternet, InValidHandle, SelfShareInfo, NotPresentOnExplain } from './noInternet'
import { getProfileByTwitterHandle } from "../../../../../actions/visitProfileAction";
import { getRecpientId, getTwitterHandles, resetValues } from '../../../../../actions/twitterApiAction'
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
            numberValue: 3

        }
        this.testHandle = this.testHandle.bind(this);
        this.updateTwitterHandleBox = this.updateTwitterHandleBox.bind(this);
        this.changeTweetStateNeg = this.changeTweetStateNeg.bind(this);
        this.changeImputNumber = this.changeImputNumber.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
    }
    componentWillMount() {
        const { resetValues, getTwitterHandles } = this.props
        if (this.props.visitedTiwtterHandle !== null)
            this.setState({ twitterHandle: this.props.visitedTiwtterHandle });

        else if (this.props.explainBy === config.SHARE_SCREEN_EXPALIN)
            this.setState({ twitterHandle: this.props.sharehandle });
        else if( this.props.redialInitiated){
            this.setState({ twitterHandle : this.props.redialtwitterHandle});
            console.log("updating the subject of the call")
            this.props.saveTopicOfTheCall(this.props.redialSubject);
            this.props.cancelDialedOption();
            this.props.turnRedialWrong();
        }
        else{
            this.setState({ twitterHandle :''})
        }  

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
        console.log("noOfMinutestemp : ", noOfMinutestemp.length)

        if (!Number.isInteger(Number(noOfMinutestemp))) {
            console.log('a', Number.isInteger(Number(noOfMinutestemp)))
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
        this.setState({ numberValue: noOfMinutestemp })
        this.props.setNoOfMinutes(Number(e.target.value))
        this.props.updateCurrentTime(Number(e.target.value))
    }

    updateInfo() {
        this.setState({
            tweetTested: false,
            doneTweeting: true
        })
        this.props.makeCallAction()
    }
    render() {


        const { emptyUserName, empty, noText, negNumber, limitExce } = this.state;

        const { twitterHandle, tweetTested, doneTweeting, noInternet, selfShare,
            isVisitProfile, numberValue, emptyNumber, maxTimeForVideo } = this.state;
        const { doneFetching,
            fetchProfile, isPresentInExplain, twitterHandleValid } = this.props;
        if (doneFetching && !doneTweeting && fetchProfile && !noInternet && !selfShare && !!isPresentInExplain)
            this.updateInfo()
        const spanElement = ((limitExce) ? (
            <span className="spanElement" >Maximum duration for the call is {maxTimeForVideo} minutes</span>
        ) : (negNumber) ? (
            <span className="spanElement" >Duration of the call can not be negetive number or zero</span>
        ) : noText ? (
            <span className="spanElement" >Duration of the call to be number of minutes only</span>
        ) : emptyNumber ? (
            <span className="spanElement" >Duration of the call to be number of minutes only</span>
        ) : ((empty) ? (

            <span className="spanElement">Cant be empty</span>
        ) : (emptyUserName ? (
            <span className="spanElement">User name cant be empty</span>
        ) : (null))));

        const nameForReciever = (this.props.explainBy !== config.SHARE_SCREEN_EXPALIN && this.props.explainBy !== config.RECORD_SCREEEN_EXPLAIN) ? (<span>
           <TweetSuggest
                    onChange={this.updateTwitterHandleBox}
                    placeholder="@Twitter handle"
                    classOfInput="handleInput"
                    tweetTextvalue={twitterHandle}
                    classOfMenu="screeShareMenu"
                /></span>) : (<span>@{twitterHandle}</span>);


        const AcceptTopicDiv = (this.props.explainBy !== config.SHARE_SCREEN_EXPALIN && this.props.explainBy !== config.RECORD_SCREEEN_EXPLAIN)?(
            <div className="TwiValidInfo" style={{width:"90%", margin:"auto"}}>
                    <AcceptTopic 
                    action={config.FULL_SCREEN_SHARE}
                    tweetTheMessage={this.testHandle} />
                </div>):(<button className="buttonLight" onClick={this.testHandle}>Share Screen</button>);

        const validatinginfo = (tweetTested && !doneTweeting) ? (
            (doneFetching && fetchProfile) ?
                (noInternet ? (<NoInternet />) : ((!twitterHandleValid ? (<InValidHandle />) :
                    (selfShare ? (<SelfShareInfo changeTweetStateNeg={this.changeTweetStateNeg} />) :
                        (!isPresentInExplain ? (<NotPresentOnExplain
                            changeTweetStateNeg={this.changeTweetStateNeg}
                            isVisitProfile={isVisitProfile}
                            twitterhandle={twitterHandle}
                            source={config.SCREEN_SHARE_PAGE}
                            sharablelink={this.props.shareScreenLink}
                        />) : (null)))))) : (<p className="info">checking handle validity</p>)) : (null)
        // && !noInternet && !selfShare && isPresentInExplain
        const mainContainer = (tweetTested && !doneTweeting && doneFetching && fetchProfile && (!isPresentInExplain || selfShare ||noInternet )) ?(null):(<div>
            <div className="startShare">
                <p style={{ fontSize: "13px", fontWeight: "500" }}>Screen share with {nameForReciever} for<InputNumber
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
               
                {AcceptTopicDiv}
            </div>
           
        </div>);
        

        return (<div>{mainContainer }
         {validatinginfo}</div>)
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
    visitedTiwtterHandle: state.visitProfile.visitedTiwtterHandle,
    onlineStatus: state.visitProfile.onlineStatus,
    busyStatus: state.visitProfile.busyStatus,
    isPresentInExplain: state.visitProfile.isPresent,
    explainBy: state.explain.explainBy,
    sharehandle: state.explain.sharehandle,
    OwnerTwitterHandle: state.auth.twitterHandle,
    redialInitiated : state.redial.redialInitiated,
    redialtwitterHandle : state.redial.redialtwitterHandle,
    redialSubject : state.redial.subject

})
export default connect(mapStateToProps, {
    getProfileByTwitterHandle, getTwitterHandles,
    setNoOfMinutes, updateCurrentTime,cancelDialedOption,
    getRecpientId, resetValues,saveTopicOfTheCall
})(tweetSearch)

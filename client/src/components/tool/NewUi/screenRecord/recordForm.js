
import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import InputNumber from '../InputNumber';
import AcceptTopic from '../Saveproject';
import TweetSuggest from '../TweetSug';
import { saveTopicOfTheCall } from '../../../../actions/callAction'
import config from '../../../../config/config';
import { cancelReRecordOption } from '../../../../actions/dialActions'
import { setNoOfMinutes, updateCurrentTime } from '../../../../actions/callAction'
import { NoInternet, InValidHandle, NotPresentOnExplain } from './noInternet'
import { getProfileByTwitterHandle } from "../../../../actions/visitProfileAction";
import { getRecpientId, getTwitterHandles, resetValues } from '../../../../actions/twitterApiAction'

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
            numberValue: 3,
            doneTweeting: false,

        }
        this.testHandle = this.testHandle.bind(this);
        this.updateTwitterHandleBox = this.updateTwitterHandleBox.bind(this);
        this.changeTweetStateNeg = this.changeTweetStateNeg.bind(this);
        this.changeImputNumber = this.changeImputNumber.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.selfSave = this.selfSave.bind(this);
    }
    componentWillMount() {
        const { resetValues, getTwitterHandles } = this.props
        if (this.props.visitedTiwtterHandle !== null)
            this.setState({ twitterHandle: this.props.visitedTiwtterHandle });

        if (this.props.explainBy === config.SHARE_SCREEN_EXPALIN || this.props.explainBy === config.RECORD_SCREEEN_EXPLAIN)
            this.setState({ twitterHandle: this.props.sharehandle });
        else if (this.props.fromShareToRecord)
            this.setState({ twitterHandle: this.props.twitterHandle });
        else if (this.props.reRecordInitiated) {
            this.setState({ twitterHandle: this.props.redialtwitterHandle });
            this.props.cancelReRecordOption();
            this.props.turnReRecordWrong();
        }

        resetValues();
        getTwitterHandles();
        this.setState({ maxTimeForVideo: config.MAX_VIDEO_TIME_LIMIT, doneTweeting: false })
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

        if (!Number.isInteger(Number(noOfMinutestemp))) {
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
    }

    selfSave() {
        this.props.toggle(this.state.numberValue);
        this.props.saveforSelf();
    }
    updateInfo() {
        this.setState({
            tweetTested: false,
            doneTweeting: true
        })
        this.props.toggle(this.state.numberValue)
    }
    render() {


        const { emptyUserName, empty, noText, negNumber, limitExce } = this.state;

        const { twitterHandle, tweetTested, doneTweeting, noInternet,
            isVisitProfile, numberValue, emptyNumber, maxTimeForVideo } = this.state;
        const { doneFetching,
            fetchProfile, isPresentInExplain, twitterHandleValid } = this.props;

        if (doneFetching && tweetTested && !doneTweeting && fetchProfile && !noInternet && !!isPresentInExplain)
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
        ) : (null))))
        const nameForReciever = (this.props.explainBy !== config.SHARE_SCREEN_EXPALIN && this.props.explainBy !== config.RECORD_SCREEEN_EXPLAIN) ? (<span>
            send to <TweetSuggest
                onChange={this.updateTwitterHandleBox}
                placeholder="@Twitter handle"
                classOfInput="handleInput"
                tweetTextvalue={twitterHandle}
                classOfMenu="screeShareMenu"
            /></span>) : (<span>send to @{twitterHandle}</span>);
        const AcceptTopicDiv = (this.props.explainBy !== config.SHARE_SCREEN_EXPALIN && this.props.explainBy !== config.RECORD_SCREEEN_EXPLAIN) ? (
            <div className="TwiValidInfo" style={{ width: "80%", margin: "auto" }}>
                <AcceptTopic
                    action={config.FULL_SCREEN_RECORD}
                    selfSave={this.selfSave}
                    tweetTheMessage={this.testHandle} />
            </div>
        ) : (<button className="buttonLight" onClick={this.testHandle}>Record Screen</button>);
        const validatinginfo = (tweetTested && !doneTweeting) ? (
            (doneFetching && fetchProfile) ?
                (noInternet ? (<NoInternet changeTweetStateNeg={this.changeTweetStateNeg} />) :
                    ((!twitterHandleValid ? (<InValidHandle changeTweetStateNeg={this.changeTweetStateNeg} />) :

                        (!isPresentInExplain ? (<NotPresentOnExplain
                            changeTweetStateNeg={this.changeTweetStateNeg}
                            isVisitProfile={isVisitProfile}
                            twitterhandle={twitterHandle}
                            source={config.SCREEN_SHARE_PAGE}
                            sharablelink={this.props.shareScreenLink}
                        />) : (null))))) : (<p className="info">checking handle validity</p>)) : (null)
        const mainContainer = (tweetTested && !doneTweeting && doneFetching && fetchProfile && (!isPresentInExplain || noInternet)) ? (null) : (<div>
            <div className="startShare">
                <p style={{ fontSize: "13px", fontWeight: "500" }}>Record for <InputNumber
                    empty={emptyNumber}
                    emptyUserName={emptyUserName}
                    limitOfChar={maxTimeForVideo}
                    limitExce={limitExce}
                    changeInputValue={this.changeImputNumber}
                    textValue={numberValue}
                    negNumber={negNumber}
                    noText={noText} /> mins, {nameForReciever}
                </p>
                {spanElement}

                {AcceptTopicDiv}

            </div>

        </div>)
        const preRecording = (this.state.doneTweeting ? (<p>Preparing to record</p>) : (null))

        return (<div>{mainContainer}
            {validatinginfo}
            {preRecording}</div>)
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
    twitterHandle: state.twitterApi.twitterHandle,
    fromShareToRecord: state.message.fromShareToRecord,
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
    redialtwitterHandle: state.redial.redialtwitterHandle,
    reRecordInitiated: state.redial.reRecordInitiated,

})
export default connect(mapStateToProps, {
    getProfileByTwitterHandle, getTwitterHandles,
    setNoOfMinutes, updateCurrentTime, cancelReRecordOption,
    getRecpientId, resetValues, saveTopicOfTheCall
})(tweetSearch)





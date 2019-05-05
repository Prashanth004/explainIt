import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import InputNumber from '../InputNumber';
import './floaterScreenshare.css';
import {setNoOfMinutes} from '../../../actions/callAction'
import { FiX, FiVideo } from "react-icons/fi";
import config from '../../../../config/config';
import { FaArrowLeft } from "react-icons/fa";
import CopyToClipboard from '../../CopytoClipboard';
import { getProfileByTwitterHandle } from "../../../../actions/visitProfileAction";
import ProfileNotOnExplain from "../ProfileNotOnExplain";
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
            negNumber: false,
            noText: false,
            maxTimeForVideo: null,
            tweetAction: false,
            timeInputDone: false


        }
        this.testHandle = this.testHandle.bind(this);
        this.updateTwitterHandleBox = this.updateTwitterHandleBox.bind(this);
        this.tweetTheMessage = this.tweetTheMessage.bind(this);
        this.changeTweetStateNeg = this.changeTweetStateNeg.bind(this);
        this.changeImputNumber = this.changeImputNumber.bind(this)
    }
    componentWillMount() {
        this.props.resetValues();
        this.props.getTwitterHandles();
        this.setState({
            maxTimeForVideo: config.MAX_VIDEO_TIME_LIMIT
        })

    }
  
    testHandle() {
        // if () {
        if (!this.props.limitExce &&
            !this.props.negNumber &&
            !this.state.noText
            && !this.state.negNumber
            && !this.state.emptyNumber) {
            this.setState({
                tweetTested: true
            })
            this.props.getProfileByTwitterHandle(this.state.twitterHandle)
            this.props.getRecpientId(this.state.twitterHandle)
        }
    }
    updateTwitterHandleBox(e) {
        this.setState({
            twitterHandle: e.target.value,
            tweetTested: false
        })
        this.props.resetValues();
    }
    sendRecordding() {

    }

    changeTweetStateNeg(){
        this.setState({
            tweetTested:false
        })
    }
    changeImputNumber(e) {
        var noOfMinutestemp = e.target.value;
      
        if (noOfMinutestemp.length !== 0 && Number(noOfMinutestemp) !== 0 && !Number(noOfMinutestemp)) {
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
                emptyNumber: false
            })
        }
        this.props.setNoOfMinutes(e.target.value)


    }


    tweetTheMessage() {
        this.setState({
            tweetTested: false,
            doneTweeting: true
        })
        this.props.makeCallAction()

    }
    render() {
        var validatinginfo = null;
        var mainContainer = (<div className="startShare">
            <span style={{margin:"10px"}}>Initiate screen share with</span>
           
           <input 
           onChange={this.updateTwitterHandleBox}
           className="handleInput"
                placeholder="Username"
                value={this.state.twitterHandle} />
            {/* <TweetSuggest
                onChange={this.updateTwitterHandleBox}
                placeholder="Enter @twitter handle"
                classOfInput="myInput"
                tweetTextvalue={this.state.twitterHandle}
                array={this.props.twiterHandleArray}

            /> */}
           
            
            <span > for </span>
             <InputNumber
                        empty={this.state.emptyNumber}
                        limitOfChar={this.state.maxTimeForVideo}
                        limitExce={this.state.limitExce}
                        changeInputValue={this.changeImputNumber}
                        textValue={this.props.noOfMinutes}
                        negNumber={this.state.negNumber}
                        noText={this.state.noText} />
                        <br/>
                      
            <button className="buttonDark" style={{marginTop:"10px"}} onClick={this.testHandle}>Send request</button>
        </div>)
        if (this.state.tweetTested && !this.state.doneTweeting) {
            if (this.props.doneFetching && this.props.fetchProfile) {
                if (!this.props.twitterHandleValid) {
                    validatinginfo = (<div>
                        <p className="info">Incorrect twitter handle<br />
                            Please check and try again</p>
                    </div>
                    )
                }
                else if (!this.props.isPresentInExplain) {
                    validatinginfo = (<div>
                        <span style={{float:"left",
                    fontSize:"15px"}}>
                        <FaArrowLeft onClick={this.changeTweetStateNeg} />
                        </span> 
                        <ProfileNotOnExplain
                                isVisitProfile={this.state.isVisitProfile}
                                twitterhandle={this.state.twitterHandle} />
                        
                        <span style={{fontSize:"14px"}}>
                            You can manually share the link now to get connected
                        </span>
                        <CopyToClipboard sharablelink={this.props.shareScreenLink} />

                        </div>
                        )
                    mainContainer = (null)

                }
                else if(!this.props.onlineStatus){
                    validatinginfo = (<div>
                        <span style={{float:"left",
                    fontSize:"15px"}}>
                        <FaArrowLeft onClick={this.changeTweetStateNeg} />
                        </span> 
                        <br/>
                        <br/>
                        <span>{this.props.userName} is not ready accept screen share requests at the moment</span>
                        <br/>
                        <span>You can record the screen and send</span>
                        <br/>
                        <br/>
                        <span className="hint--bottom" aria-label="Record call and send">
                    <FiVideo className="icons" onClick={this.props.recordCallAfterShare} />
                </span>                <span className="hint--bottom" aria-label="Cancel">
                    <FiX className="icons" onClick={this.props.closeImidiate} />
                </span>
                        
                        </div>)
                        mainContainer = (null)
                }
                else {
                    this.tweetTheMessage()
                }
            }
            else {
                validatinginfo = (<p className="info">checking handle validity</p>)
            }


            // else if(

            // )

        }
        // else if()
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
    noOfMinutes:state.call.noOfMinutes,
    userName:state.visitProfile.userName,
    onlineStatus:state.visitProfile.onlineStatus,
    isPresentInExplain: state.visitProfile.isPresent,
})
export default connect(mapStateToProps, {
    getProfileByTwitterHandle,
    getTwitterHandles,
    setNoOfMinutes,
    getRecpientId,
    resetValues
})(tweetSearch)


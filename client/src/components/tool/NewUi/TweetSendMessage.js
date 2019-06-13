import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import TweetSuggest from './TweetSug';
import { FaArrowLeft } from "react-icons/fa";
import {showTextBoxAfterRecord} from '../../../actions/messageAction'
import { getProfileByTwitterHandle } from "../../../actions/visitProfileAction";
import ProfileNotOnExplain from "./ProfileNotOnTwitter/ProfileNotOnExplain"
import { getRecpientId, getTwitterHandles, resetValues } from '../../../actions/twitterApiAction'


class tweetSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            twitterHandle: '',
            tweetTested: false,
            isVisitProfile: false,
            doneWithAll:false,
            tweetedMessage:false

        }
        this.testHandle = this.testHandle.bind(this);
        this.updateTwitterHandleBox = this.updateTwitterHandleBox.bind(this);
        this.tweetTheMessage = this.tweetTheMessage.bind(this);
        this.changeTweetStateNeg = this.changeTweetStateNeg.bind(this)
    }
    componentWillMount() {
        this.props.resetValues();
        this.props.getTwitterHandles();

    }
    testHandle() {

        var twitterHandleTemp = (this.state.twitterHandle.includes('@'))?
        (this.state.twitterHandle.replace("@","")):(this.state.twitterHandle)
        if (!this.props.limitExce &&
            !this.props.negNumber) {
            this.setState({
                tweetTested: true
            })
            this.props.getProfileByTwitterHandle(twitterHandleTemp)
            this.props.getRecpientId(twitterHandleTemp, this.props.userId)
        }
    }
    updateTwitterHandleBox(e, value) {
        this.setState({
            twitterHandle: value,
            tweetTested: false
        })
        // this.props.resetValues();
    }
    sendRecordding() {

    }

    changeTweetStateNeg(){
        this.props.showTextBoxAfterRecord()
        this.setState({
            tweetTested:false
        })
    }
    chaneTweetState(){
        this.setState({
            tweetTested: false,
            doneTweeting: true,
            doneWithAll:true
        })
    }

    tweetTheMessage() {
        this.setState({
            tweetedMessage:true
        })
       
    this.props.sendRecording()
    
                

    }
    render() {
        if(this.props.successSent && !this.state.doneWithAll){
            this.chaneTweetState()
        }
        var validatinginfo = null;
        var mainContainer = (<div>
            <p>Enter the twitter handle to send a recording</p>
            <TweetSuggest
                onChange={this.updateTwitterHandleBox}
                placeholder="Enter @username"
                classOfInput={this.state.twitterHandle}
                tweetTextvalue={this.state.twitterHandle}
                classOfMenu = "menu"
                array={this.props.twiterHandleArray}
            />

            <button className="buttonDark" onClick={this.testHandle}>Send</button>
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

                                <span>save and sent the link manually</span>
                        
                        {/* <span style={{fontSize:"14px"}}>
                            You can manually share the link now to get connected
                        </span>
                        <CopyToClipboard sharablelink={this.props.shareScreenLink} />
*/}
                        </div> 
                        )
                    mainContainer = (null)

                }
                else if(!this.state.tweetedMessage) {
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
    getProfileByTwitterHandle: PropType.func.isRequired,
    showTextBoxAfterRecord:PropType.func.isRequired
}
const mapStateToProps = state => ({
    twitterHandleValid: state.twitterApi.profilePresent,
    doneFetching: state.twitterApi.doneFetching,
    userId: state.auth.id,
    // twiterHandleArray: state.twitterApi.twitterHandle,
    twiterHandleArray: state.twitterApi.twitterHandles,
    fetchProfile: state.visitProfile.fetchProfile,
    isPresentInExplain: state.visitProfile.isPresent,
})
export default connect(mapStateToProps, {
    getProfileByTwitterHandle,
    getTwitterHandles,
    getRecpientId,
    showTextBoxAfterRecord,
    resetValues
})(tweetSearch)


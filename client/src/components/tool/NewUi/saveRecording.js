import React, { Component } from 'react'
import config from '../../../config/config'
import InputBox from './InputBox';
import { FiSave, FiX, FiSend } from "react-icons/fi";
import { connect } from 'react-redux';
import PropType from 'prop-types';
import TweetSendMessage from './TweetSendMessage';
import { sendEmail } from '../../../actions/emailAction'
import { getTwitterHandles } from '../../../actions/twitterApiAction';
import { FiArrowLeft } from "react-icons/fi";


class SaveProjects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            limitExce: false,
            empty: false,
            limitOfChar: null,
            textValue: "",
            privatePublic: false,
            callRecText: "Call",
            sendMessageClicked: false,
            enteredSubjest: false,
            tweetStarted: false,
            successSent: false
        }
        this.changeInputValue = this.changeInputValue.bind(this);
        this.savefilePri = this.savefilePri.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.markTweetStarted = this.markTweetStarted.bind(this);
        this.chooseSave = this.chooseSave.bind(this);
        this.calcelChooseaction = this.calcelChooseaction.bind(this);
    }

    markTweetStarted() {
        this.setState({
            tweetStarted: true
        })
    }
    componentWillMount() {
      
        this.props.getTwitterHandles();
    }

    componentDidMount() {
        if (this.props.shareOrRec === config.RECORDING) {
            this.setState({
                callRecText: "recording"
            })
        }
        else {
            this.setState({
                callRecText: "Call"
            })
        }
        this.setState({
            limitOfChar: config.PROJECT_TEXT_LIMIT
        })
    }

    sendMessage() {

        this.props.sendButtonClick()
        this.setState({
            sendMessageClicked: true
        })
    }
    savefilePri() {
        if (this.props.fromShareToRecord) {
            this.setState({
                sendMessageClicked: true,
                privatePublic: true
            })
            this.props.sendButtonClick()
            this.props.savefilePrivate(this.props.topicOfTheCall);

        }
        else {
            if (this.state.textValue !== null) {
                if ((this.state.textValue).length > 0) {
                    if ((this.state.textValue).length < 201) {
                        this.setState({
                            privatePublic: true,
                            successSent: true
                        })
                        this.props.savefilePrivate(this.state.textValue);

                        if (this.props.replying) {
                            this.props.sendEmail(this.props.issueId, this.props.userid)
                        }

                    }
                    else {
                        this.setState({
                            limitExce: true
                        })
                        return;
                    }
                }
                else {
                    this.setState({
                        empty: true
                    })
                    return;
                }
            } else {
                this.setState({
                    empty: true
                })
            }
        }

    }
    calcelChooseaction() {
        this.props.cancelSaveBtn()
        this.setState({ sendMessageClicked: false })
    }
    chooseSave() {
        if (this.props.fromShareToRecord)
            this.savefilePri()
        else
            this.sendMessage()
    }

    changeInputValue(e) {
        var textValuetemp = this.state.textValue
        if (textValuetemp !== null && textValuetemp.length > this.state.limitOfChar) {
            this.setState({
                limitExce: true
            })
        }
        else {
            this.setState({
                limitExce: false
            })
        }

        this.setState({
            textValue: e.target.value,
            empty: false
        })

    }
    render() {
        const shareOption = (!this.props.explainIssue) ? (

            <span className="hint--top" aria-label="Send Recording">
                <FiSend className="icon screenRecordIcons"  onClick={this.chooseSave} />
            </span>) : null
        const saveOption = (this.props.twitterUserId !== null ||  this.props.visitedTiwtterHandle!==null)  ? (null) : (<span className="hint--top" aria-label="Save Recording">
        <FiSave className="icon screenRecordIcons" onClick={this.props.saveClicked} />
    </span>)
        const subjectInoutBox = ((this.props.showInputBox) ? (
        <InputBox
            limitExce={this.state.limitExce}
            empty={this.state.empty}
            limitOfChar={this.state.limitOfChar}
            changeInputValue={this.changeInputValue}
            textValue={this.state.textValue}
            submit = {()=>{}}
            placeHolder="Topic for the recording"
        />) : (null))

        const tweetSendMessage = (this.props.fromShareToRecord
        ) ? (<div style={{ textAlign: "center" }}>
            <button onClick={this.savefilePri} className="buttonDark">Send Recording</button>
        </div>) : (<TweetSendMessage
            successSent={this.state.successSent}
            sendRecording={this.savefilePri}
        />)
       

        return (!this.props.isSaveClicked && !this.state.sendMessageClicked) ?
            (<div className="ActivityBelow">
                {shareOption}
                {saveOption}
                <span className="hint--top" aria-label="Discard">
                    <FiX  className="icon screenRecordIcons"  onClick={this.props.closeImidiate} />
                </span>
            </div>) :((this.state.sendMessageClicked && !this.state.privatePublic)? 
                (<div>
                    <span style={{
                        float: "left",
                        fontSize: "15px",
                        marginTop:"-64px"
                    }}>
                        <FiArrowLeft className="icon" onClick={this.calcelChooseaction} />
                    </span>
                    {subjectInoutBox}
                    <br/>
                    {tweetSendMessage}
                </div>
                ) : ((this.state.privatePublic) ? (!this.props.failedToSave ? ((this.props.fromShareToRecord || this.state.sendMessageClicked) ? 
                    (<div><p>Sending the recording..</p></div>) :
                (<div><p>Saving the recording..</p></div>)) : (
                    <span>Problen occured while saving. This incident will be reported and fixed as soo as possible.</span>
                )) : (
                    <div>
                        <span style={{
                            float: "left",
                            fontSize: "15px",
                            marginTop:"-64px"
                        }}>
                            <FiArrowLeft className="icon"onClick={this.calcelChooseaction} />
                        </span>
                        <div style={{
                            width: "70%",
                            margin: "auto"
                        }}>
                            <InputBox
                                limitExce={this.state.limitExce}
                                empty={this.state.empty}
                                limitOfChar={this.state.limitOfChar}
                                changeInputValue={this.changeInputValue}
                                textValue={this.state.textValue}
                                submit = {this.savefilePri}
                                placeHolder="Topic for the recording"
                            />

                            <button className="buttonLight" onClick={this.savefilePri}
                                style={{ marginTop: "10px" }}>Save</button>
                        </div>
                    </div>))
            )
    }
}


SaveProjects.PropType = {
    sendEmail: PropType.func.isRequired
};
const mapStateToProps = state => ({
    isSaved: state.issues.successCreation,
    showInputBox: state.message.showTextAftRec,
    twitterUserId: state.twitterApi.twitterId,
    fromShareToRecord: state.message.fromShareToRecord,
    explainIssue: state.message.explainIssue,
    issueId: state.email.issueId,
    userid: state.email.userid,
    replying: state.email.replying,
    topicOfTheCall: state.call.topicOfTheCall,
    failedToSave: state.issues.failedToSave,
    visitedTiwtterHandle:state.visitProfile.visitedTiwtterHandle,

})

export default connect(mapStateToProps, {
    sendEmail, getTwitterHandles
})(SaveProjects)




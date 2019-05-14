import React, { Component } from 'react'
import config from '../../../config/config'
import InputBox from './InputBox';
import { FiSave, FiX, FiSend } from "react-icons/fi";
import { connect } from 'react-redux';
import PropType from 'prop-types';
import TweetSendMessage from './TweetSendMessage';
import { sendEmail } from '../../../actions/emailAction'



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
        this.savefilePu = this.savefilePu.bind(this);
        this.savefilePri = this.savefilePri.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.markTweetStarted = this.markTweetStarted.bind(this);
        this.chooseSave = this.chooseSave.bind(this);
    }

    markTweetStarted() {
        this.setState({
            tweetStarted: true
        })
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
    savefilePu() {

        if (this.state.textValue !== null) {
            if ((this.state.textValue).length > 0) {
                if ((this.state.textValue).length < 201) {

                    alert(this.props.replying)
                    if (this.props.replying) {
                        this.props.sendEmail(this.props.issueId, this.props.userid)
                    }
                }
                else {
                    this.setState({
                        limitExce: true
                    })
                }
            }
            else {
                this.setState({
                    empty: true
                })
            }
        } else {
            this.setState({
                empty: true
            })
        }
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
                <FiSend className="icons" onClick={this.chooseSave} />
            </span>) : null
        const saveOption = (this.props.twitterUserId === null) ? (
            <span className="hint--top" aria-label="Save Recording">
                <FiSave className="icons" onClick={this.props.saveClicked} />
            </span>
        ) : (null)
        const subjectInoutBox = ((this.props.showInputBox) ? (<InputBox
            limitExce={this.state.limitExce}
            empty={this.state.empty}
            limitOfChar={this.state.limitOfChar}
            changeInputValue={this.changeInputValue}
            textValue={this.state.textValue}
        />) : (null))

        const tweetSendMessage = (this.props.fromShareToRecord
        ) ? (<div style={{ textAlign: "center" }}>
            <button onClick={this.savefilePri} className="buttonDark">Send Recording</button>
        </div>) : (<TweetSendMessage
            successSent={this.state.successSent}
            sendRecording={this.savefilePri}
        />)
        // const tweetSendMessage2 =()

        return (!this.props.isSaveClicked && !this.state.sendMessageClicked) ?
            (<div>
                <br />

                {shareOption}
                {saveOption}
                <span className="hint--top" aria-label="Discard">
                    <FiX className="icons" onClick={this.props.closeImidiate} />
                </span>
            </div>) :
            ((this.state.sendMessageClicked && !this.state.privatePublic) ? (
                // this.state.enteredSubjest?(
                <div>
                    {subjectInoutBox}
                    {tweetSendMessage}
                    {/* <TweetSendMessage
             /> */}
                </div>

            ) :((this.state.privatePublic) ? (<div><p>saving..</p></div>) : (
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
                        />
                        {/* <h8>Your privacy is important to use</h8> */}
                        <button className="buttonDark" onClick={this.savefilePri}
                            style={{ marginTop: "30px" }}>Save</button>
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
    topicOfTheCall: state.call.topicOfTheCall

})

export default connect(mapStateToProps, {
    sendEmail
})(SaveProjects)




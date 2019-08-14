
import React, { Component } from 'react'
import { FiX, FiSend,FiSave } from "react-icons/fi";
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { sendEmail } from '../../../actions/emailAction'
import { getTwitterHandles } from '../../../actions/twitterApiAction';

class SaveProjects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            privatePublic: false,
            sendMessageClicked: false,
            successSent: false
        }
        this.savefilePri = this.savefilePri.bind(this);
        this.saveIconClick = this.saveIconClick.bind(this);
    }

    componentWillMount() {
        this.props.getTwitterHandles();
    }
    saveIconClick(){
        this.props.saveClicked()
        this.props.savefilePrivate(this.props.topicOfTheCall);
    }
    savefilePri() {
            this.setState({
                sendMessageClicked: true,
                privatePublic: true
            })
            this.props.sendButtonClick()
            this.props.savefilePrivate(this.props.topicOfTheCall);
    }
    render() {
        const shareOption = (!this.props.explainIssue && !this.props.selfSave) ? (
            <span className="hint--top" aria-label="Send Recording">
                <FiSend className="icon"  onClick={this.savefilePri} />
            </span>) :(<span className="hint--top" aria-label="Save Recording">
        <FiSave className="icon" onClick={this.saveIconClick} />
    </span>)
        return (!this.props.isSaveClicked && !this.state.sendMessageClicked) ?
            (<div className="ActivityBelow rcrdAct">
                {shareOption}
                <span className="hint--top" aria-label="Discard">
                    <FiX  className="icon"  onClick={this.props.closeImidiate} />
                </span>
            </div>) :((this.state.sendMessageClicked && !this.state.privatePublic)? 
                (<div>
                    <span style={{
                        float: "left",
                        fontSize: "15px",
                        marginTop:"-64px"
                    }}>
                    </span>
                </div>
                ) : (!this.props.failedToSave ? ((this.props.fromShareToRecord || this.state.sendMessageClicked) ? 
                    (<div><p>Sending the recording to <b>@{this.props.twitterHandle}</b></p></div>) :
                (<div><p>Saving the recording..</p></div>)) : (
                    <span>Problen occured while saving. This incident will be reported and fixed as soo as possible.</span>
                ))
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
    twitterHandle:state.twitterApi.twitterHandle,
    fromShareToRecord: state.message.fromShareToRecord,
    explainIssue: state.message.explainIssue,
    failedToSave: state.issues.failedToSave,
    topicOfTheCall:state.call.topicOfTheCall

})

export default connect(mapStateToProps, {
    sendEmail, getTwitterHandles
})(SaveProjects)



 

import React, { Component } from 'react';
import './feedback.css'
import 'react-input-range/lib/css/index.css';
import { connect } from 'react-redux';
import TextArea from '../container/textArea';
// import Spinner  from '../container/lodingSmall';
import StarRatings from 'react-star-ratings';
import { FiVideo } from "react-icons/fi";
import Recorder from '../newRecorder/recording';
import PropType from 'prop-types';
import { restAllToolValue } from '../../../../actions/toolActions';
import { resetRecorder } from '../../../../actions/recoderAction'
import {
    changeShareExperience, changeUability, nothingfilled,
    clickRecord, changeSuggestion, saveRecording, discardRecorded, resetFeedback, saveFeedback
} from '../../../../actions/feedbackAction'

class FeedBack extends Component {
    constructor(props) {
        super(props);
        this.state = { sliderValue: 50, rating: 0 };
        this.changeSlider = this.changeSlider.bind(this);
        this.changeRating = this.changeRating.bind(this);
        this.saveFile = this.saveFile.bind(this);
    }

    saveFile() {
        const { userId, experienceValue, nothingfilled, usabilityValue, sugValue, videoFilePath, saveFeedback } = this.props;

        console.log(experienceValue, usabilityValue, sugValue, videoFilePath);
        if (experienceValue === 0 &&
            usabilityValue === 0 &&
            sugValue === " " &&
            videoFilePath === null) {
            nothingfilled()
        }
        else {
            saveFeedback(userId, experienceValue, usabilityValue, sugValue, videoFilePath)
        }
    }
    componentWillMount() {
        // this.props.restAllToolValue();
        // this.props.resetRecorder();
        // this.props.resetFeedback();
    }
    changeSlider(e) {
        this.setState({ sliderValue: e.target.value })
    }
    enterPress() { }

    changeRating(newRating, name) {
        this.setState({
            rating: newRating
        });
    }
    render() {
        // const warning = 
        const { experienceValue, saveFeedBackInitiated, savedFeedBack, usabilityValue, noEntry, changeShareExperience, saveStaus, changeUability, userId, saveFeedback,
            changeSuggestion, sugValue, recordMode, discarded, saveRecording, discardRecorded, clickRecord } = this.props;
        // const warning = (noEntry)?(<span style={{color:"brown", fontSize:"11px"}}>No fields filled</span>):(null)
        const recordDiv = recordMode ? (<Recorder
            save={saveRecording}
            discard={discardRecorded}
            discarded={discarded}
            saved={saveStaus} />) : ((!saveStaus) ? (
                <span className="hint--top" aria-label="Record your isssue">
                    <FiVideo style={{ fontSize: "26px" }} onClick={clickRecord} />
                    {/* <button className="buttonDark" onClick={clickRecord}>Record screen and explain issue</button> */}
                </span>) :
                (<p>Recorded video attached !</p>));
        const SubmitButton = (!saveFeedBackInitiated && !recordMode) ? (
            <div>
                <button className="buttonLight"
                    onClick={this.saveFile} disabled={noEntry}>Submit</button>
                <button className="buttonDark" onClick={this.props.closeFeedback}>Not now</button></div>
        ) : (null)
        return (!savedFeedBack ? (
            <div className="feedbackDiv">
                <div className="rating">
                    <div>
                        <label>Call experience :</label>
                        <StarRatings
                            rating={experienceValue}
                            starRatedColor="blue"
                            changeRating={changeShareExperience}
                            numberOfStars={5}
                            starDimension="25px"
                            starSpacing="2px"
                            name='rating'
                        />
                    </div>
                    <div>
                        <label>Ease of use :</label>
                        <StarRatings
                            rating={usabilityValue}
                            starRatedColor="blue"
                            changeRating={changeUability}
                            numberOfStars={5}
                            starDimension="25px"
                            starSpacing="2px"
                            name='rating'
                        />
                    </div>
                </div>
                <br />
                <label>Help us improve. Your thoughts :</label>
                <div style={{ width: "60%", margin: "auto" }}>
                    <TextArea
                        placeholder=""
                        textvalue={sugValue}
                        changeFunction={(e) => changeSuggestion(e.target.value)}
                        enterPress={this.enterPress}
                        textAlign="left"
                        inputClass="inputboxes fullView" />
                </div>
                <br />
                {recordDiv}
                <br /> <br />
                {SubmitButton}
                <br />
                {/* {warning} */}

            </div>
        ) : (<div className="feedbackDiv">
            <br />
            <br />
            <br />

            <h4>Feedback Submited !</h4>
            <h5>Thank you !</h5>
            <br />
            <br />
            <br />

        </div>))
    }
}
FeedBack.PropType = {
    discardRecorded: PropType.func.isRequired,
    saveRecording: PropType.func.isRequired,
    changeSuggestion: PropType.func.isRequired,
    changeShareExperience: PropType.func.isRequired,
    changeUability: PropType.func.isRequired,
    clickRecord: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    resetRecorder: PropType.func.isRequired,
    resetFeedback: PropType.func.isRequired,
    saveFeedback: PropType.func.isRequired,
    nothingfilled: PropType.func.isRequired
};
const mapStateToProps = state => ({
    experienceValue: state.feedback.experienceValue,
    usabilityValue: state.feedback.usabilityValue,
    sugValue: state.feedback.sugValue,
    recordMode: state.feedback.recordMode,
    discarded: state.feedback.discarded,
    saveStaus: state.feedback.saveStaus,
    userId: state.auth.id,
    videoFilePath: state.feedback.videoFilePath,
    savedFeedBack: state.feedback.savedFeedBack,
    noEntry: state.feedback.noEntry
})
export default connect(mapStateToProps, {
    changeSuggestion, resetFeedback, resetRecorder,
    saveFeedback, nothingfilled,
    restAllToolValue, clickRecord, saveRecording, discardRecorded, changeShareExperience, changeUability
})(FeedBack)




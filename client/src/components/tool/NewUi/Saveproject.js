import React, { Component } from 'react'
import config from '../../../config/config'
import InputBox from './InputBox';
import {saveTopicOfTheCall} from '../../../actions/callAction'
// import { FiSave, FiX } from "react-icons/fi";
import { connect } from 'react-redux';
import PropType from 'prop-types';



class SaveProjects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            limitExce: false,
            empty: false,
            limitOfChar: null,
            textValue: "",
            privatePublic: false,
            callRecText: "Call"
        }
        this.changeInputValue = this.changeInputValue.bind(this);
        this.SaveTopic = this.SaveTopic.bind(this);
        this.SaveTopicSave = this.SaveTopicSave.bind(this);
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

    SaveTopic() {
        if (this.state.textValue !== null) {
            if ((this.state.textValue).length > 0) {
                if ((this.state.textValue).length < 201) {
                    this.props.saveTopicOfTheCall(this.state.textValue)
                    this.props.tweetTheMessage()
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
    SaveTopicSave() {
        if (this.state.textValue !== null) {
            if ((this.state.textValue).length > 0) {
                if ((this.state.textValue).length < 201) {
                    this.props.saveTopicOfTheCall(this.state.textValue)
                    this.props.selfSave()
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
        const recordDelf = (this.props.action === config.FULL_SCREEN_RECORD)?(<span style={{color:"rgba(141, 140, 140, 0.867)",fontSize:"12px"}} onClick={this.SaveTopicSave}>record and save</span>)
        :(null)

        return (
        <div className="ActivityBelow">
            <InputBox
                    limitExce={this.state.limitExce}
                    empty={this.state.empty}
                    limitOfChar={this.state.limitOfChar}
                    changeInputValue={this.changeInputValue}
                    textValue={this.state.textValue}
                    submit = {this.SaveTopic}
                    placeHolder={(this.props.explainBy === config.SHARE_SCREEN_EXPALIN || this.props.explainBy === config.RECORD_SCREEEN_EXPLAIN) ?"Description" : "Topic for screen share"}
                />
                <button style={{ marginTop: "15px" }} className="buttonLight" onClick={this.SaveTopic}>{this.props.action ===config.FULL_SCREEN_RECORD?"Start Recording":"Send Request"}</button>
                <br/>
                {recordDelf}
            </div>
             
         )
    }
}


SaveProjects.PropType = {
    saveTopicOfTheCall :PropType.func.isRequired,

};
const mapStateToProps = state => ({
    isSaved: state.issues.successCreation,
    explainBy: state.explain.explainBy,
})

export default connect(mapStateToProps, {saveTopicOfTheCall})(SaveProjects)




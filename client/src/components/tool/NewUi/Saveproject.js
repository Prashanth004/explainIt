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
        return (
        <div className="ActivityBelow">
            <p style={{fontWeight:"500"}}>Topic for the screen share.</p>
            <InputBox
                    limitExce={this.state.limitExce}
                    empty={this.state.empty}
                    limitOfChar={this.state.limitOfChar}
                    changeInputValue={this.changeInputValue}
                    textValue={this.state.textValue}
                />
                <button style={{ marginTop: "15px" }} className="buttonLight" onClick={this.SaveTopic}>Send Request</button>
            </div>
             
         )
    }
}


SaveProjects.PropType = {
    saveTopicOfTheCall :PropType.func.isRequired,

};
const mapStateToProps = state => ({
    isSaved: state.issues.successCreation,
})

export default connect(mapStateToProps, {saveTopicOfTheCall})(SaveProjects)




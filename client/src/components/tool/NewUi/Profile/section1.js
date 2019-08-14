import React from 'react';
import TextArea from '../container/textArea';
import './prfile.css';
import { FiSave } from "react-icons/fi";
import '../Profile/prfile.css';
import { connect } from 'react-redux';
import { FiVideo } from "react-icons/fi";
import Recorder from '../newRecorder/recording';
import {clickRecord,  discardRecorded} from '../../../../actions/feedbackAction';
import config from '../../../../config/config';
import {creatAnsProject} from '../../../../actions/profileAction'

const Section1 = (props) => {
    const {bioValue,changeBio,goodAtValue,changeGoodAt,uploadData,worksValue,discarded,discardRecorded,
        changeWorks,bioValueError,goodAtValueError,recordMode,saveStaus,clickRecord} =props;
    const saveRecording =(blob)=>{
        props.creatAnsProject(" ", "null", blob, null, {}, "true", null, 1, config.SERVER_RECORDING)
    }
    const recordDiv = recordMode ? (<Recorder
        save={saveRecording}
        discard={discardRecorded}
        discarded={discarded}
        saved={saveStaus} />) : ((!saveStaus) ? (<div atyle={{textAlign:"center"}}>
            <span>Record your portfolio.</span><br/>
            <span className="hint--top" aria-label="Record screen ">
                <FiVideo style={{ fontSize: "20px" }} onClick={clickRecord} />
            </span></div>) :
            (null));
    const bioErrorDiv = (bioValueError) ? (<div><span className="errorSpan">bio cant be more than 100 characters</span>
        <br/></div>) : (null);
    const goodAtErrorDiv = (goodAtValueError) ? (<div>
        <span className="errorSpan">Can not be more than 100 characters</span>
        <br/></div>) : (null);
    const enterPress = ()=>{}
  return (<div className="profileFormContainer" >
                    <span>What am I currently upto? (status)</span>
                    <br/>
                    <TextArea
                    placeholder="Your current status"
                        textvalue={bioValue}
                        changeFunction={changeBio} 
                        enterPress={enterPress}
                        limit={100}
                        textAlign="left"
                        inputClass="inputboxes fullView" />
                    {bioErrorDiv}
                       <span>What am I good at?</span>
                    <br/>
                    <TextArea
                     placeholder="Whats the best way you can help people"
                        textvalue={goodAtValue}
                        enterPress={enterPress}
                        limit={100}
                        changeFunction={changeGoodAt}
                        inputClass="inputboxes fullView" />
                    {goodAtErrorDiv}

                    <span>Portfolio</span>
                    <br/>
                    <TextArea
                         placeholder="Paste urls or record the screen to show case your work"
                        textvalue={worksValue}
                        limit={200}
                        changeFunction={changeWorks} inputClass="inputboxes fullView" />
                        <div style={{textAlign:"center",fontSize:"12px",color:"rgba(51, 51, 51, 0.589)"}}>
                            {recordDiv}
                        </div>
                        <div style={{textAlign:"center", marginTop:"10px"}}>
                    <button  className="nextButton" onClick={uploadData}><FiSave style={{fontSize:"18px", marginTop:"-3px"}}/></button>
                </div>
                </div>)
}
const mapStateToProps = state => ({
    recordMode: state.feedback.recordMode,
    discarded: state.feedback.discarded,
    saveStaus: state.feedback.saveStaus,
})
export default connect(mapStateToProps, {discardRecorded,clickRecord,creatAnsProject})(Section1)


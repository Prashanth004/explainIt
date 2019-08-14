import React from 'react'
import config from '../../../../config/config'
import { connect } from 'react-redux';
import FullScreenShare from '../enitreScreenShare';
import FullScreenRecord from '../FullScreenRecord';
import { explainByShare, explainByRecord, explainByRefer } from '../../../../actions/explainAction';
import Refer from './refer';
import BusyAction from '../container/BusyAction';
import '../../../css/explainit.css';
import { FiUsers, FiCopy,FiVideo } from "react-icons/fi";


const explainOption = (props) => {
    const { questionProject, myTwitterHandle } = props;
    const condition = (questionProject.twitterhandle !== myTwitterHandle &&  questionProject.active)
    const gridTwoIt = (condition)?({}):({gridTemplateColumns: "50% 50%"})
    const screeShare = (condition) ? (<div className="RecordBtnLabel" style={{ textAlign: "center", margin: "auto", backgroundColor: "transparent" }}>
    <span className="hint--top" aria-label="Get connnected, share screen and explain!">
        <FiCopy style={{ fontSize: "22px" }} onClick={() => props.explainByShare(questionProject.twitterhandle,questionProject.textexplain)} />
    </span> </div>) : (null);

    return (props.explainBy === config.null) ? (
        <div>

            <div className="optionBtnPlacement" style={gridTwoIt}>
                
                    {screeShare}
               
                <div className="RecordBtnLabel" style={{ textAlign: "center", margin: "auto", backgroundColor: "transparent" }}>
                    <span className="hint--top" aria-label="Record screen and explain!">
                        <FiVideo style={{ fontSize: "22px" }} onClick={() => props.explainByRecord(questionProject.twitterhandle, questionProject.id,questionProject.issueid,questionProject.textexplain)} />
                    </span>
                </div>

                <div className="RecordBtnLabel" style={{ margin: "auto", backgroundColor: "transparent" }}>
                    <span className="hint--top" aria-label="Refer to other!">
                        <FiUsers style={{ fontSize: "19px" }} onClick={() => props.explainByRefer()} />
                    </span>

                </div>
            </div>
        </div>
    ) : (props.explainBy === config.SHARE_SCREEN_EXPALIN ?
        ((props.currentAtionStatus === null)?(
            <div className="explainMain">
            <div className="recorderConatainerPage animated slideInUp fast" style={{ width: props.widthDiv }}><FullScreenShare
            socket={props.socket}
            closeImidiate={props.reStoreDefault}
            reStoreDefault={props.reStoreDefault}
            savefile={props.savefile}
        />
         </div>
            </div>):(<div className="LinkDisplay">
        <BusyAction action="share" currentAtionStatus={props.currentAtionStatus} />
    </div>)): (props.explainBy === config.RECORD_SCREEEN_EXPLAIN ? (
        (props.currentAtionStatus === null)?
        (
            <div className="explainMain">
                <div className="recorderConatainerPage animated slideInUp fast" style={{ width: props.widthDiv }}>
                    <FullScreenRecord
                        socket={props.socket}
                        closeImidiate={props.reStoreDefault}
                        reStoreDefault={props.reStoreDefault}
                        savefile={props.savefile}
                    />
                </div>
            </div>):(<div className="LinkDisplay">
        <BusyAction action="record" currentAtionStatus={props.currentAtionStatus} />
    </div>)
    ) : (            <div className="explainMain">
    <div className="recorderConatainerPage animated slideInUp fast" >
                <Refer questionProject={props.questionProject} 
                questioProjectArray={props.questioProjectArray}/>
                </div>
                </div>)))
}
const mapStateToProps = function (state) {
    return {
        explainBy: state.explain.explainBy,
        myTwitterHandle: state.auth.twitterHandle
    }
}

export default connect(mapStateToProps, {
    explainByShare, explainByRecord, explainByRefer
})(explainOption);


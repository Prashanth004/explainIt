import React from 'react'
import config from '../../../../config/config'
import { connect } from 'react-redux';
import FullScreenShare from '../enitreScreenShare';
import FullScreenRecord from '../FullScreenRecord';
import { IoIosBrowsers } from "react-icons/io";
import { explainByShare, explainByRecord, explainByRefer } from '../../../../actions/explainAction';
import Refer from './refer';
import BusyAction from '../container/BusyAction';
import '../../../css/explainit.css';
import { Button } from 'reactstrap';
import { FiUsers, FiVideo } from "react-icons/fi";


const explainOption = (props) => {

    const { questionProject, myTwitterHandle } = props;
    const condition = questionProject.twitterhandle !== myTwitterHandle
    const gridTwoIt = (condition)?({}):({gridTemplateColumns: "50% 50%"})
    const screeShare = (condition) ? (<div className="RecordBtnLabel" style={{ textAlign: "center", margin: "auto", backgroundColor: "transparent" }}>
    <span className="hint--top" aria-label="Get connnected, share screen and explain!">
        <IoIosBrowsers style={{ fontSize: "28px" }} onClick={() => props.explainByShare(questionProject.twitterhandle)} />
    </span> </div>) : (null);
    //     const referDiv = (condition)?(  <span className="hint--top" aria-label="Refer to other!">
    //     <FiUsers style={{ fontSize: "25px" }} onClick={() => props.explainByRefer()} />
    // </span>):(null);
    return (props.explainBy === config.null) ? (
        <div>

            <div className="optionBtnPlacement" style={gridTwoIt}>
                
                    {screeShare}
               
                <div className="RecordBtnLabel" style={{ textAlign: "center", margin: "auto", backgroundColor: "transparent" }}>
                    <span className="hint--top" aria-label="Record screen and explain!">
                        <FiVideo style={{ fontSize: "28px" }} onClick={() => props.explainByRecord(questionProject.twitterhandle)} />
                    </span>
                </div>

                <div className="RecordBtnLabel" style={{ margin: "auto", backgroundColor: "transparent" }}>
                    <span className="hint--top" aria-label="Refer to other!">
                        <FiUsers style={{ fontSize: "25px" }} onClick={() => props.explainByRefer()} />
                    </span>

                </div>
                {/* <button onClick={()=>props.explainByRefer()}>Refer to explain</button> */}
            </div>
        </div>
    ) : (props.explainBy === config.SHARE_SCREEN_EXPALIN ?
        ((props.currentAtionStatus === null)?(<FullScreenShare
            socket={props.socket}
            closeImidiate={props.reStoreDefault}
            reStoreDefault={props.reStoreDefault}
            savefile={props.savefile}
        />):(<div className="LinkDisplay">
        <div className="topBtnsActivity"><Button close onClick={props.reStoreDefault} /></div>
        <BusyAction action="share" currentAtionStatus={props.currentAtionStatus} />
    </div>)): (props.explainBy === config.RECORD_SCREEEN_EXPLAIN ? (
        (props.currentAtionStatus === null)?(
            <div className="explainMain">
                <div className="recorderConatainerPage" style={{ width: props.widthDiv }}>
                    <FullScreenRecord
                        socket={props.socket}
                        closeImidiate={props.reStoreDefault}
                        reStoreDefault={props.reStoreDefault}
                        savefile={props.savefile}
                    />
                </div>
            </div>):(<div className="LinkDisplay">
        <div className="topBtnsActivity"><Button close onClick={props.reStoreDefault} /></div>
        <BusyAction action="record" currentAtionStatus={props.currentAtionStatus} />
    </div>)) : (
                <Refer questionProject={props.questionProject} />)))
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


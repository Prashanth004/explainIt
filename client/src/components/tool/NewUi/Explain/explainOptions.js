import React from 'react'
import config from '../../../../config/config'
import Screenrecorder from './explainItRecorder'
import { connect } from 'react-redux';
import { explainByRecord, explainByRefer } from '../../../../actions/explainAction';
import Refer from './refer'
import '../../../css/explainit.css'


const explainOption = (props) => {
   
    return (props.explainBy === config.null) ? (
        <div>
            <div className="optionBtnPlacement">
            <div className="RecordBtnLabel" style={{textAlign:"center",margin:"auto",backgroundColor:"transparent"}}>
                                <span className="hint--top" aria-label="Record screen and explain!">
                                    <img alt="record screen"  onClick={()=>props.explainByRecord()} height="100%" width="100%" src={require('../../../images/record.png')} />
                                </span>
                            </div>
              
                <div className="RecordBtnLabel" style={{margin:"auto",backgroundColor:"transparent"}}>
                                <span className="hint--top" aria-label="Refer to other!">
                                    <img alt="record screen"  onClick={()=>props.explainByRefer()} height="100%" width="100%" src={require('../../../images/refer.png')} />
                                </span>
                            </div>
                {/* <button onClick={()=>props.explainByRefer()}>Refer to explain</button> */}
            </div>
        </div>
    ) : (props.explainBy === config.RECORD_SCREEEN_EXPLAIN &&
         props.explainBy !== config.REFER_EXPLAIN ? (
        <div className="explainMain">
            <div className="recorderConatainerPage" style={{ width: props.widthDiv }}>
                <Screenrecorder
                    handleCloseModal={props.handleCloseModal}
                    reStoreDefault={props.reStoreDefault}
                    savefile={props.savefile} />
            </div>
        </div>
    ) : (props.explainBy !== config.RECORD_SCREEEN_EXPLAIN &&
         props.explainBy === config.REFER_EXPLAIN)?(<Refer questionProject={props.questionProject} />):(null))
}

const mapStateToProps = function (state) {
    return {
        explainBy: state.explain.explainBy
    }
}

export default connect(mapStateToProps, { explainByRecord, explainByRefer })(explainOption);


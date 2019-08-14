import config from '../config/config';
import {TIMER_NO_TEXT,TIMER_LIMIT_EXCEDED,TIMER_UPDATE_TIME,
    TIMER_NEG_NUMBER,TIMER_EMPTY,TIMER_CLEAR_ERRORS,REST_VISIT_TWITTER_ACTION,
    SET_NUMBER_MINUTES,UPDATE_CURRENT_TIME} from './types';

export const changeTimer = (noOfMinutestemp)=>(dispatch)=>{
    // var noOfMinutestemp = e.target.value;

    if (!Number.isInteger(Number(noOfMinutestemp))) {
        dispatch({
            type : TIMER_NO_TEXT
        })
    }
    else if (noOfMinutestemp.length !== 0 && noOfMinutestemp !== null && noOfMinutestemp > config.MAX_VIDEO_TIME_LIMIT) {
        dispatch({
            type : TIMER_LIMIT_EXCEDED
        })
    }
    else if (noOfMinutestemp.length !== 0 && noOfMinutestemp.length > 0 && noOfMinutestemp < 1) {
       dispatch({
           type: TIMER_NEG_NUMBER
       })
    }
    else if (noOfMinutestemp.length === 0) {
        dispatch({
            type: TIMER_EMPTY
        })
    }
    else {
        dispatch({
            type: TIMER_CLEAR_ERRORS
        })
    }
    dispatch({
        type:TIMER_UPDATE_TIME,
        payload : noOfMinutestemp

    })
    dispatch({
        type:SET_NUMBER_MINUTES,
        payload:noOfMinutestemp
    })
    dispatch({
        type:REST_VISIT_TWITTER_ACTION
    })
    dispatch({
        type:UPDATE_CURRENT_TIME,
        payload:noOfMinutestemp
    })
}
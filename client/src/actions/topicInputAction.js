import {TOPIC_LIMIT_EXCEDED,TOPIC_CLEAR_CONTRAINTS,REST_VISIT_TWITTER_ACTION,
    SAVE_TOPIC_OF_THE_CALL,UPDATE_TOPIC} from './types';
import config from '../config/config'
export const changeTopic = (topic)=>(dispatch)=>{
    if (topic !== null && topic.length > config.PROJECT_TEXT_LIMIT) {
                dispatch({
                    type:TOPIC_LIMIT_EXCEDED
                })
    }
    else {
        dispatch({
            type:TOPIC_CLEAR_CONTRAINTS
        })
    }
    dispatch({
        type:UPDATE_TOPIC,
        payload:topic
    })
        dispatch({
            type:REST_VISIT_TWITTER_ACTION
        })
    dispatch({
        type:SAVE_TOPIC_OF_THE_CALL,
        payload:topic
    })
}
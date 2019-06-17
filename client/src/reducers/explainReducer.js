
import {EXPLIN_BY_RECORD,EXPLIN_BY_SHARE,RESET_EXPLAIN_ACTIONS, EXPLAIN_BY_REFER} from '../actions/types';
import config from '../config/config';

const initialState ={
    explainBy:config.null,
    sharehandle:null
}

export default function(state = initialState, action){
    switch(action.type){
        case EXPLIN_BY_RECORD:
            return{
                ...state,
                explainBy:config.RECORD_SCREEEN_EXPLAIN 
            }
        case EXPLAIN_BY_REFER:
            return{
                ...state,
                explainBy:config.REFER_EXPLAIN
            }
        case RESET_EXPLAIN_ACTIONS:
        return{
            ...state,
            explainBy:config.null
        }
        case EXPLIN_BY_SHARE:
            return{
                ...state,
                explainBy:config.SHARE_SCREEN_EXPALIN,
                sharehandle:action.payload
            }
        default :
        return{
                ...state
        }
        }
    }
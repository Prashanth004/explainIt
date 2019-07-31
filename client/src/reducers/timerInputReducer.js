
import {TIMER_NO_TEXT,TIMER_LIMIT_EXCEDED,TIMER_UPDATE_TIME,
    TIMER_NEG_NUMBER,TIMER_EMPTY,TIMER_CLEAR_ERRORS} from '../actions/types'
const initialState = {
  timeValue:3,
  noText : false,
  limitExceded : false,
  negNumber:false,
  empty:false,
}

export default function(state = initialState, action){
    switch(action.type){
        case TIMER_NO_TEXT:
            return{
                ...state,
                noText:true,
            }
        case TIMER_LIMIT_EXCEDED:
            return{
                ...state,
                limitExceded:true,
            }
        case TIMER_NEG_NUMBER:
            return{
                ...state,
                negNumber:true
            } 
        case TIMER_EMPTY:
            return{
                ...state,
                empty:true
            }
        case TIMER_CLEAR_ERRORS:
            return{
                ...state,
                noText : false,
                limitExceded : false,
                negNumber:false,
                empty:false,
            }
        case TIMER_UPDATE_TIME:
            return{
                ...state,
                timeValue : action.payload
            }
            default:
                return{
                    ...state
                }
        }
    }
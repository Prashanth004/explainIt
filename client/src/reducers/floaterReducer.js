import {SET_FLOATER_TIME,SET_FLOATER_DISPLAY,CHANGE_TO_MUTE_STATE,
    CHANGE_TO_UN_MUTE_STATE} from '../actions/types'
import config from '../config/config'
const initialState = {
    floaterTime : 3,
    floaterDisplay:"block",
  muteState : config.UN_MUTED

}


export default function(state = initialState, action){
    switch(action.type){
        case SET_FLOATER_TIME:
            return{
                ...state,
                floaterTime:action.payload
            }
        case SET_FLOATER_DISPLAY:
            return{
                ...state,
                floaterDisplay : action.payload
            }
            case CHANGE_TO_MUTE_STATE:
                    return{
                        ...state,
                        muteState:config.MUTED
        
                    }
                    case CHANGE_TO_UN_MUTE_STATE:
                            return{
                                ...state,
                                muteState:config.UN_MUTED
                
                            }
     
        default:
            return state;
    }
}
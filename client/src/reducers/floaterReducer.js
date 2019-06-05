import {SET_FLOATER_TIME,SET_FLOATER_DISPLAY} from '../actions/types'

const initialState = {
    floaterTime : 3,
    floaterDisplay:"block"
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
     
        default:
            return state;
    }
}
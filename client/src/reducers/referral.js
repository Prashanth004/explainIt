import {SAVE_REFERRAL} from '../actions/types'

const initialState = {
    saveSuccessFull:false
}

export default function(state = initialState, action){
    switch(action.type){
        case SAVE_REFERRAL:
            return{
                ...state,
            }
        default:
            return{
                ...state
            }
    }
}
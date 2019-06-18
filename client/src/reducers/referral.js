import {SAVE_REFERRAL,GOT_ALL_REFERRALS,FAILED_TO_GET_REFERRALS} from '../actions/types'

const initialState = {
    saveSuccessFull:false,
    fetchFailed:false,
    referrals:[]
}

export default function(state = initialState, action){
    switch(action.type){
        case SAVE_REFERRAL:
            return{
                ...state,
                saveSuccessFull:true
            }
        case FAILED_TO_GET_REFERRALS:
            return{
                ...state,
                fetchFailed:true
            }
        case GOT_ALL_REFERRALS:
            return{
                ...state,
                referrals:action.payload
            }
        default:
            return{
                ...state
            }
    }
}
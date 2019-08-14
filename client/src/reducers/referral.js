import {SAVE_REFERRAL,TOGGLE_CONTACT_DISPLAY,UPDATE_TWITTER_HANDLE_TEXT,RESET_ALL_REFERRAL_ACTION,
    SELF_REFERAL,ALREADY_EXPLAINED,ALREADY_REFERRED,START_TWITTER_ID_FETCH,
    GOT_ALL_REFERRALS,FAILED_TO_GET_REFERRALS} from '../actions/types'

const initialState = {
    saveSuccessFull:false,
    fetchFailed:false,
    referrals:[],
    showContactList : false,
    twitterHandleValue : "",
    alreadyEpxlained:false,
    alreadyReferred:false,
    selfRefer : false,
    startToFetchTwitterId:false

}

export default function(state = initialState, action){
    switch(action.type){
        case TOGGLE_CONTACT_DISPLAY:
            return{
                ...state,
                showContactList : !state.showContactList
            }
        case UPDATE_TWITTER_HANDLE_TEXT:
            return{
                ...state,
                twitterHandleValue : action.payload,
                alreadyEpxlained:false,
                alreadyReferred:false,
                selfRefer : false,
                startToFetchTwitterId:false

            }
        case SELF_REFERAL:
            return{
                ...state,
                selfRefer : true

            }
        case ALREADY_EXPLAINED:
            return{
                ...state,
                alreadyEpxlained:true,
            }
        case ALREADY_REFERRED : 
        return{
            ...state,
            alreadyReferred:true,
        }
        case SAVE_REFERRAL:
            return{
                ...state,
                saveSuccessFull:true
            }
        case START_TWITTER_ID_FETCH:
            return{
                ...state,
                startToFetchTwitterId:true
            }
        case RESET_ALL_REFERRAL_ACTION:
            return{
                ...state,
                saveSuccessFull:false,
                fetchFailed:false,
                showContactList : false,
                twitterHandleValue : "",
                alreadyEpxlained:false,
                alreadyReferred:false,
                selfRefer : false,
                startToFetchTwitterId:false
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
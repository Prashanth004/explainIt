import {SEND_OTP,
    ACTIVATED_PROFILE,
    SEND_OTP_FAILED,
    VARIFY_ACTIVATED,
    VARIFY_ACTIVATED_FAILED,
    RE_SEND_OTP,
    RE_SEND_OTP_FAILED} from '../actions/types'


const initialState ={
  isVarified:false,
  reSentOtp:false,
  reSendOtpFailed:false,
  sentOtp:false,
  failedOtp:false,
  varificationFailed:false,
  doneVarification:false,
  profileActivated:false
}  
export default function(state = initialState, action){
    switch(action.type){
        case ACTIVATED_PROFILE:
            return{
                ...state,
                profileActivated:true
            }
        case RE_SEND_OTP:
            return{
                ...state,
                reSentOtp:true
            }
        case RE_SEND_OTP_FAILED:
            return{
                ...state,
                reSendOtpFailed:true
            }
        case SEND_OTP:
            return{
                ...state,
                sentOtp:true
            }
        case SEND_OTP_FAILED : 
            return{
                ...state,
                failedOtp:false              
            }
        case VARIFY_ACTIVATED :
        return{
            ...state,
            doneVarification:true,
            isVarified:action.isvarified
        }
        case VARIFY_ACTIVATED_FAILED:
        return{
            ...state,
            doneVarification:true,
            varificationFailed:true
        }
        
        default:
            return state;
    }
}
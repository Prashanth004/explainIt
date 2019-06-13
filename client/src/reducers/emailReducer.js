import {SEND_OTP,
    ACTIVATED_PROFILE,
    SEND_OTP_FAILED,
    VARIFY_ACTIVATED,
    ACTIVATED_ACCOUNT,
    NOT_ACTIVATED_ACCOUNT,
    VARIFY_ACTIVATED_FAILED,
    REPLY_EMAIL_SENT,
    SAVE_REPLY_EMAIL_OPTION,
    CANCEL_EMAIL_OPTION,
    RE_SEND_OTP,
    RE_SEND_OTP_FAILED} from '../actions/types'


const initialState ={
  isVarified:false,
  isActivated:false,
  reSentOtp:false,
  reSendOtpFailed:false,
  sentOtp:false,
  failedOtp:false,
  varificationFailed:false,
  doneVarification:false,
  profileActivated:false,
  issueId:null,
  userid:null,
  replying:false,
  replyEmailSend:false
}  
export default function(state = initialState, action){
    switch(action.type){
        case SAVE_REPLY_EMAIL_OPTION:
            return{
                ...state,
                issueId:action.issueId,
                userid:action.userid,
                replying:true
            }
        case REPLY_EMAIL_SENT:
            return{
                ...state,
                replyEmailSend:true,
            }
        
        case ACTIVATED_ACCOUNT:
            return{
                ...state,
                isActivated:true
            }
        case NOT_ACTIVATED_ACCOUNT:
            return{
                ...state,
                isActivated:false
            }
        case CANCEL_EMAIL_OPTION:{
            return{
                ...state,
                replying:false,
                issueId:null,
                userid:null
            }
        }
        case ACTIVATED_PROFILE:
            return{
                ...state,
                // profileActivated:true,
                doneVarification:true,
                isVarified:true
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
            isVarified:action.isvarified,
            doneVarification:true
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
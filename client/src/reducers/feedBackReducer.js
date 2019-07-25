import { CHNAGE_SHARE_EXP,CHANGE_USABILITY,SAVED_RECORDING,
    RESET_FEEDBACK_ACTIONS,SAVED_FEEDBACK,NOTHING_FILLED,UPDATE_FEDDBACK_TEST,
    RECORD_CLICKED,DISCARD_RECORDING,CHANGE_SUGGESTION,SAVE_FEEDBACK_INITIATED } from '../actions/types';
const initialState = {
    experienceValue : 0,
    usabilityValue : 0,
    sugValue : null,
    recordMode:false,
    saveStaus:false,
    discarded:false,
    videoFilePath:null,
    saveFeedBackInitiated :false,
    savedFeedBack : false,
    noEntry:true,
    feedbackGiven:false,

   
}

export default function(state = initialState, action){
    switch(action.type){
        case CHNAGE_SHARE_EXP:
            return{
                ...state,
                noEntry:false,
                experienceValue:action.payload,
            }
   
        case CHANGE_USABILITY: 
            return{
                ...state,
                noEntry:false,
                usabilityValue:action.payload,
            }
        case CHANGE_SUGGESTION:
            return{
                ...state,
                noEntry:false,
                sugValue:action.payload
            }
        case RECORD_CLICKED:
            return{
                ...state,
                noEntry:false,
                recordMode:true,
                saveStaus:false
            }
        case  DISCARD_RECORDING:
            return{
                ...state,
                discarded:true,
                recordMode:false,
                saveStaus:false
            }
        case UPDATE_FEDDBACK_TEST:
            return{
                ...state,
                feedbackGiven:action.payload
            }
        case NOTHING_FILLED:
            return{
                ...state,
                noEntry:true
            }
        case RESET_FEEDBACK_ACTIONS:
            return{
                ...state,
                experienceValue : 0,
                usabilityValue : 0,
                sugValue : " ",
                recordMode:false,
                saveStaus:false,
                discarded:false,
                noEntry:false,
                saveFeedBackInitiated :false,
                savedFeedBack : false
            }
        case SAVED_RECORDING :
            return{
                ...state,
                saveStaus:true,
                videoFilePath:action.filepath,
                recordMode:false

            }
        case SAVE_FEEDBACK_INITIATED:
            return{
                ...state,
                saveFeedBackInitiated:true
            }
        case SAVED_FEEDBACK:
            return{
                ...state,
                savedFeedBack:true
            }
        default:
            return{
                ...state
            }
        }
    }
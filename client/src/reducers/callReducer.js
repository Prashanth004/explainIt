import {CALL_DETAILS_ACCEPT,
    SAVE_RECIEVER_DATA,
    SET_NUMBER_MINUTES,
    UPDATE_CURRENT_TIME,
    SET_PEER_ID,
    BASIC_INFO_OF_CALL,
    INITIATE_SEND,
    GET_ALL_ACTIVITES,
    GET_ALL_ACTIVITES_FAILED,
    INCREASE_CALL_BY_MINUTE,
    SAVE_TOPIC_OF_THE_CALL,
    RESET_CALL_ACTIONS,
    UPATE_CURRENT_TIME_TO_DISPLAY,
     ANSWER_CALL,MISS_CALL} from '../actions/types'

const initialState={
    link:null,
    userName:null,
    email:null,
    id:null,
    profilePic:null,
    incommingCall :false,
    recieverProfileImage:null,
    recieverUserName:null,
    recieverUserId:null,
    initialTime:3,
    noOfIncreaseInTime:0,
    currentTimeLeft : 3,
    noOfMinutes:3,
    topicOfTheCall:"",
    peerId:null,
    touser:null,
    gotAllActivities:false,
    activities:[],
    sendinitiated:false,
    buttonClassName:"buttonLight"
}

export default function(state= initialState, action){
    switch(action.type){
        case SET_NUMBER_MINUTES:
        return{
            ...state,
            noOfMinutes:action.payload,
            initialTime:action.payload
        }
        case GET_ALL_ACTIVITES:
        return{
            ...state,
            gotAllActivities:true,
            activities:action.payload
        }
        case INITIATE_SEND:
        return{
            ...state,
            sendinitiated:true
        }
        case RESET_CALL_ACTIONS:
        return{
            ...state,
            topicOfTheCall:"",
            peerId:null,
            touser:null,
            link:null,
            userName:null,
            email:null,
            id:null,
            sendinitiated:false,
            initialTime:3,
            noOfIncreaseInTime:0,
            currentTimeLeft : 3,
            noOfMinutes:3,
        }
        case GET_ALL_ACTIVITES_FAILED:
        return{
            ...state,
            gotAllActivities:true,
            errorGetAllActivities:action.payload
        }
        case BASIC_INFO_OF_CALL:
        return{
            ...state,
            touser:action.payload.touser
                }
        case SET_PEER_ID:
        return{
            ...state,
            peerId:action.payload
        }
        case SAVE_TOPIC_OF_THE_CALL:
        return{
            ...state,
            topicOfTheCall:action.payload
        }
        case INCREASE_CALL_BY_MINUTE:
        var btnclass
        if(state.buttonClassName === "buttonDark")
            btnclass="buttonLight"
        else
            btnclass="buttonDark"
        return{
            ...state,
            noOfMinutes:state.currentTimeLeft+1,
            buttonClassName:btnclass,
            noOfIncreaseInTime:state.noOfIncreaseInTime+1
        }
        case UPATE_CURRENT_TIME_TO_DISPLAY:
        return{
            ...state,
            noOfMinutes:action.payload
        }
        case UPDATE_CURRENT_TIME:
        return{
            ...state,
            currentTimeLeft:action.payload
        }
        case CALL_DETAILS_ACCEPT:
            return {
                ...state,
                incommingCall:true,
                link:action.payload.link,
                userName:action.payload.userName,
                email:action.payload.email,
                id: action.payload.id,
                profilePic:action.payload.profilePic                
            }
        case ANSWER_CALL:
            return {
                ...state,
                incommingCall:false
            }
        case MISS_CALL:
            return{
                ...state,
                incommingCall:false
            }
        case SAVE_RECIEVER_DATA:
        return{
            ...state,
            recieverProfileImage:action.profileImage,
            recieverUserName : action.profileName,
            recieverUserId :action.userId
        }
    default:
            return {
                ...state
            }

    }
   
        
    
}
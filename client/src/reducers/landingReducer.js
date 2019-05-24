
import {CLICKED_SUBMIT,CLICKED_SUBMIT_START, CHANGE_FORM_INPUT,INVALID_TWITTER_HANDLE} from '../actions/types'


const initialState ={
    isClicked:false,
    twitterHandleValue:"",
    inValidTwitterHandle:false,
    checkVAlididyStarted:false,
    doneCkecking:false,
}  

export default function(state = initialState, action){
    switch(action.type){
        case CLICKED_SUBMIT:
        return{
            ...state,
            doneCkecking:true,
            isClicked:true
        }
        case CLICKED_SUBMIT_START:
        return{
            ...state,
            checkVAlididyStarted:true
        };
        case CHANGE_FORM_INPUT:
        return{
            ...state,
            twitterHandleValue:action.payload,
            inValidTwitterHandle:false,
            checkVAlididyStarted:false,
            doneCkecking:false,
        }
        case INVALID_TWITTER_HANDLE:
        return{
            ...state,
            doneCkecking:true,
            inValidTwitterHandle:true
        }
        default:
        return state;
    }
}
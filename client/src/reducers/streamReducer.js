import {SET_STREAM , SET_STREAM_TO_NULL } from '../actions/types'

const initialState = {
    audioStream:null,
    screenStream:null,
    finalStream:null

}

export default function(state = initialState, action){
    switch(action.type){
        case SET_STREAM:
            return{
                ...state,
                audioStream:action.audioStream,
                screenStream:action.screenStream,
                finalStream:action.finalStream
            }
        case SET_STREAM_TO_NULL:
            return{
                ...state,
                audioStream:null,
                screenStream:null,
                finalStream:null
            }
        default:
            return{
                ...state
            }
    }
}
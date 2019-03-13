import {OPEN_HOME ,OPEN_CREATED,OPEN_PARTICIPATED} from '../actions/types'

const initialState={
    openHome:false,
    openCreated:false,
    openParticipated:false
}

export default function(state=initialState, action){
    switch(action.type){
        case OPEN_HOME:
            return{
                ...state,
                openHome:true,
                openCreated:false,
                openParticipated:false
            }
        case OPEN_CREATED:
            return{
                ...state,
                openHome:false,
                openCreated:true,
                openParticipated:false
            }
        case OPEN_PARTICIPATED:
            return{
                ...state,
                openHome:false,
                openCreated:false,
                openParticipated:true
            }
        default:
            return{
                ...state
            }
    }
}
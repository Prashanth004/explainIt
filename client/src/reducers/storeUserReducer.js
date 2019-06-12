

import {ADD_USER_TO_STORE}  from '../actions/types'

const initialState = {
    userData : []
}


export default function(state = initialState, action){
    switch(action.type){
        case ADD_USER_TO_STORE :
            return{
                ...state,
                userData:action.payload
            }
        default :
            return {
                ...state
            }
    }
        
 }
    
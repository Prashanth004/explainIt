

import {ADD_USER_TO_STORE}  from '../actions/types'

const initialState = {
    userData : []
}


export default function(state = initialState, action){
    switch(action.type){
        case ADD_USER_TO_STORE :
            var tempuser = state.userData;
           if((!state.userData.find((user=>user.key=== action.payload.key)))||(state.userData).length===0 ){
            tempuser.push(action.payload);
            return{
                ...state,
                userData:tempuser
            }
        }
           else{
            return{
                ...state,
                userData:tempuser
            }
           }
           
        default :
            return {
                ...state
            }
    }
 }
 
    
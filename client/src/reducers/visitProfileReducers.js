import {GET_PROFILE_BY_TWITTER_HANDLE} from '../actions/types'

const initalState = {
    userName:null,
    profilePic:null,
    email:null,
    id:null,
}


export default function(state = initalState, action){
    switch(action.type){
        case GET_PROFILE_BY_TWITTER_HANDLE:
            return{
                ...state,
                userName:action.userName,
                profilePic:action.profilePic,
                id:action.id,
                email:action.email
            }
        default :
            return state;
    }
}
import {GOT_NO_PROFILE,GET_PROFILE_ID , RESET_TWITTER_API_VALUES } from '../actions/types'

const initialState = {
    twitterId:null,
    profilePresent:false,
    doneFetching:false
}

export default (state=initialState, action)=>{
    switch(action.type){
        case GET_PROFILE_ID:{
            return{
                ...state,
                twitterId:action.payload,
                doneFetching:true,
                profilePresent:true,
            }
        }
        case GOT_NO_PROFILE:{
            return{
                ...state,
                twitterId:null,
                doneFetching:true,
                profilePresent:false,
            }
        }
        case RESET_TWITTER_API_VALUES:{
            return{
                ...state,
                twitterId:null,
                profilePresent:false,
                doneFetching:false
            }
        }
        default :
            return{
                ...state
            }
    }
}
import { CREATE_SOCKET, REDUCE_WIDTH, REDUCE_LITTLE_WIDTH,
    PROFLE_HANDLE_ON_EXPLAIN,
    PROFILE_NOT_PRESENT_ON_TWITTER, PROFILE_PRESENT_ON_TWITTER_NOT_EXPALIN } from '../actions/types';


const initialState = {
    socket: null,
    reducedWidth: false,
    reducedLittleWidth: false,
    presentOnExplain:false,
    presentOnTwitter:false,
    email: "",
    userName:"",
    profilePic: null,
    id:null,
    onlineStatus: 0,
    busyStatus:0,
    twitterHandle: "",
    donValidationHandle : false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SOCKET:
            return {
                ...state,
                socket: action.payload.socket
            }
        case REDUCE_WIDTH:
            return {
                ...state,
                reducedWidth:action.payload
            }
        case PROFLE_HANDLE_ON_EXPLAIN:
            return{
                ...state,
                donValidationHandle:true,
                presentOnExplain:true,
                presentOnTwitter:true,
                email: action.email,
                userName:action.userName,
                profilePic: action.profilePic,
                id:action.id,
                onlineStatus: action.onlineStatus,
                busyStatus:action.busyStatus,
                twitterHandle: action.twitterHandle,

            }
        
        case PROFILE_PRESENT_ON_TWITTER_NOT_EXPALIN:
            return{
                ...state,
                donValidationHandle:true,
                presentOnExplain:false,
                presentOnTwitter:true,
                email: action.email,
                userName:action.userName,
                profilePic: action.profilePic,
                id:action.id,
                onlineStatus: action.onlineStatus,
                busyStatus:action.busyStatus,
                twitterHandle: action.twitterHandle,
                
            }
        
        case PROFILE_NOT_PRESENT_ON_TWITTER:
            return{
                ...state,
                donValidationHandle:true,
                presentOnExplain:false,
                presentOnTwitter:false,
                
            }
        

        case REDUCE_LITTLE_WIDTH:
            return {
                ...state,
                reducedLittleWidth:action.payload
            }
        default:
            return {
                ...state
            }
    }

}

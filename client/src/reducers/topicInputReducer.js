import {TOPIC_LIMIT_EXCEDED,TOPIC_CLEAR_CONTRAINTS,UPDATE_TOPIC} from '../actions/types'
const initialState = {
  topicValue:"",
  limitExceded : false,
}

export default function(state = initialState, action){
    switch(action.type){
        case TOPIC_LIMIT_EXCEDED:
            return{
                ...state,
                limitExceded:true,
            }
        case TOPIC_CLEAR_CONTRAINTS:
            return{
                ...state,
                limitExceded:false,
            }
        case UPDATE_TOPIC:
            return{
                ...state,
                topicValue:action.payload,
            }
        default :
            return{
                ...state
            }
    }
}
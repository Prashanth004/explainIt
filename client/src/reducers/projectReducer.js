import {FETCH_PROJ_BY_ISSUE,CLEAR_ANSWER , UPDATE_ANSWER_WITH_IMAGE,FETCH_STARTED,CREATE_ANS_PROJECT} from '../actions/types'

const initialState = {
    questProject:{},
    answerProject:[],
    newprojectIem :{},
    isFetchDone:false,
}

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_PROJ_BY_ISSUE :
            return{
                ...state,
                questProject:action.questProject,
                answerProject: action.answerProject,
                isFetchDone:true
            }
        case CLEAR_ANSWER:
            return{
                ...state,
                questProject:[],
                answerProject : []
            }
       
        case FETCH_STARTED:
            return{
                ...state,
                isFetchDone:false
            }
            case UPDATE_ANSWER_WITH_IMAGE:
                return{
                    ...state,
                    answerProject:action.payload
                }
        default :
            return state;
    }
}
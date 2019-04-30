import {FETCH_PROJ_BY_ISSUE,CLEAR_ANSWER , 
    UPDATE_ANSWER_WITH_IMAGE,FETCH_STARTED,
    DELETE_SUCCESSFULL,
    OPEN_EDIT_TEXT_MODAL,
    UPDATE_TEXT_EXPLAIN,
    CLOSE_EDIT_TEXT_MODAL,
    DELETE_FAILED} from '../actions/types'

const initialState = {
    questProject:{},
    answerProject:[],
    newprojectIem :{},
    isFetchDone:false,
    deleteSuccess :false,
    openEditModal:false,
    doneUpdating:false,
    editModalId:null
}

export default function(state = initialState, action){
    switch(action.type){
        case OPEN_EDIT_TEXT_MODAL:
            return{
                ...state,
                openEditModal:true,
                editModalId:action.id
            }
        case UPDATE_TEXT_EXPLAIN:
            return{
                ...state,
                doneUpdating:true,
                openEditModal:false
            }
        case CLOSE_EDIT_TEXT_MODAL:
            return{
                ...state,
                openEditModal:false,
                editModalId:null
            }
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
        case DELETE_SUCCESSFULL:
                return{
                    ...state,
                    deleteSuccess:true

                }
        case DELETE_FAILED:
                return{
                    ...state,
                    deleteSuccess:false

                }
        default :
            return state;
    }
}
import {FETCH_PROJ_BY_ISSUE,
    GOT_NO_PROJECT,
    CLEAR_ANSWER , 
    UPDATE_ANSWER_WITH_IMAGE,FETCH_STARTED,
    CLEAR_SAVE_ACTIONS,
    DELETE_SUCCESSFULL,
    OPEN_EDIT_TEXT_MODAL,
    UPDATE_TEXT_EXPLAIN,
    CLOSE_EDIT_TEXT_MODAL,
    UPDATE_LINK,
    DELETE_FAILED} from '../actions/types';
import config from '../config/config' 

const initialState = {
    questProject:{},
    answerProject:[],
    newprojectIem :{},
    isFetchDone:false,
    deleteSuccess :false,
    openEditModal:false,
    doneUpdating:false,
    editModalId:null,
    largeFileSize:false,
    linkToAccess:null,
    failedToGet:false
   
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


        case GOT_NO_PROJECT:
            return{
                ...state,
                failedToGet:true,
                isFetchDone:true
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
                failedToGet:false,
                questProject:action.questProject,
                answerProject: action.answerProject,
                isFetchDone:true
            }
            case UPDATE_LINK:
            return{
                ...state,
                linkToAccess : config.react_url+'/project/'+action.payload
                }
        case CLEAR_ANSWER:
            return{
                ...state,
                questProject:[],
                answerProject : []
            }
        case CLEAR_SAVE_ACTIONS:
            return{
                isFetchDone:false,
                deleteSuccess :false,
                openEditModal:false,
                doneUpdating:false,
                editModalId:null,
                largeFileSize:false,
                failedToSave:false
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
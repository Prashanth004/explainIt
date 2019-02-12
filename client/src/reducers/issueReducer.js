import {FETCH_ISSUE} from '../actions/types';
import {SET_ISUUE_ID, 
    FETCH_DETAILS_OF_EXPLAINED,
    CANCEL_PROJ_CREATION_SUCCESS,
    CREATE_ISSUE_PROJECT,
    CANCEL_PROJ_CREATION_ERROR , 
    CREATE_ISSUE_PROJECT_FAILED} from '../actions/types'


const initialState ={
    items:[],
    newissueIem:{},
    currentIssueId:null,
    error:false,
    successCreation : false,
    detailsOfExplained:[]
}  

export default function(state = initialState, action){
    switch(action.type){
        case FETCH_ISSUE:
            return{
                ...state,
                items:action.payload
            }
            case CREATE_ISSUE_PROJECT : 
            return{
                ...state,
                newissueIem:action.payload,
                successCreation:true
            }
        case CREATE_ISSUE_PROJECT_FAILED :
            return{
                ...state,
                error:action.error
            }
        case SET_ISUUE_ID:
            return{
                ...state,
                currentIssueId:action.payload

            }
        case CANCEL_PROJ_CREATION_SUCCESS:
            return{
                ...state,
                successCreation:action.payload
            }
        case CANCEL_PROJ_CREATION_ERROR:
            return{
                ...state,
                error:action.payload
            }
        case FETCH_DETAILS_OF_EXPLAINED:
            return{
                ...state,
                detailsOfExplained: state.detailsOfExplained.push([action.payload])
            }

        default:
            return state;
    }
}

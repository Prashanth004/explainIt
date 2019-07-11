import {TOGGLE_HOW_IT_WORKS_MODAL} from '../actions/types'


const initialState = {
   openHowItWorksModal:false
}


export default function(state=initialState, action){
    switch(action.type){
        case TOGGLE_HOW_IT_WORKS_MODAL:
        return{
            ...state,
            openHowItWorksModal:!state.openHowItWorksModal
        }
        default:
            return{
                ...state
            }
    }
}
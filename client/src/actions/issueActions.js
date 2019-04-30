
import { FETCH_ISSUE,
 
     CANCEL_PROJ_CREATION_ERROR, 
     SET_ISUUE_ID, 
  
     CANCEL_SUCCESS} from './types'
import axios from 'axios'
import config from '../config/config'

export const fetchIssues = () => dispatch => {
    axios({
        method: 'get',
        url: config.base_dir + '/api/issues',
       
    }).then(response => {
        if (response.status === 200) {
            dispatch({
                type: FETCH_ISSUE,
                payload: (response.data.data).reverse()
                
            })
        }
        else{
        }
    }).catch(err=>{
        console.log("error : ",err)
    })
} 

export const cancelSuccess = () => dispatch =>{
    dispatch({
        type:CANCEL_SUCCESS
    })
}

export const setIssueId = id => dispatch =>{
    dispatch({
        type: SET_ISUUE_ID,
        payload: id
    })
}
export const cancelValidationErrors = () =>dispath=>{
    dispath({
        type:CANCEL_PROJ_CREATION_ERROR,
        payload:false
    })
}


export const getDetailsOfExplained =(issueId)=>(dispatch)=>{


}
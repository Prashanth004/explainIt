
import { FETCH_ISSUE,
    CANCEL_PROJ_CREATION_SUCCESS,
     CANCEL_PROJ_CREATION_ERROR, 
     SET_ISUUE_ID, 
     IS_ISSUE} from './types'
import axios from 'axios'
import config from '../config/config'

export const fetchIssues = () => dispatch => {
    var token = JSON.parse(localStorage.getItem('token'))
    console.log("this is token i am passing : ",token)
    axios({
        method: 'get',
        url: config.base_dir + '/issues',
       
    }).then(response => {
        if (response.status == 200) {
            dispatch({
                type: FETCH_ISSUE,
                payload: (response.data.data).reverse()
                
            })
        }
        else{
            console.log(response)
        }
    }).catch(err=>{
        console.log("error : ",err)
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

export const cancelSuucessMessage =() =>dispatch=>{
dispatch ({
    type:CANCEL_PROJ_CREATION_SUCCESS,
    payload:false
})
}

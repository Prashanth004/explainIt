



import { ADD_USER_TO_STORE } from './types';

export const addNewUser = (userData) => dispatch => {
    console.log("userData :",userData)
        const newItem = {
            'key': userData.id,
            'data': userData
        }
        dispatch({
            type: ADD_USER_TO_STORE,
            payload: newItem
        })
}
   

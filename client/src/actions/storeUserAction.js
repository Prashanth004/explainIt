



import { ADD_USER_TO_STORE } from './types';

export const addNewUser = (userData) => dispatch => {
        const newItem = {
            'key': userData.id,
            'data': userData
        }
        dispatch({
            type: ADD_USER_TO_STORE,
            payload: newItem
        })
}
   

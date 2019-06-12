

import { ADD_USER_TO_STORE } from './types';

export const addNewUser = (userData, userStore) => dispatch => {

  
    if(!userStore.find(user=>user.key === userData.id)){
        const newItem = {
            'key': userData.id,
            'data': userData
        }
        var tempUderStore = userStore;
        tempUderStore.push(newItem)
        dispatch({
            type: ADD_USER_TO_STORE,
            payload: tempUderStore
        })
    }
   

}
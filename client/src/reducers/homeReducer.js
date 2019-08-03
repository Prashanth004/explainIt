import { CREATE_SOCKET, REDUCE_WIDTH, REDUCE_LITTLE_WIDTH } from '../actions/types';


const initialState = {
    socket: null,
    reducedWidth: false,
    reducedLittleWidth: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SOCKET:
            return {
                ...state,
                socket: action.payload.socket
            }
        case REDUCE_WIDTH:
            return {
                ...state,
                reducedWidth:action.payload
            }
        case REDUCE_LITTLE_WIDTH:
            return {
                ...state,
                reducedLittleWidth:action.payload
            }
        default:
            return {
                ...state
            }
    }

}

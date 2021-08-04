import { createStore } from 'redux';

function reducer(state = { history : [], fetchedUser : null, token : null }, action){
    switch(action.type){
        case 'UPDATE_HISTORY':
            return { ...state, history : action.history }
        case 'UPDATE_FETCHED_USER':
            return { ...state, fetchedUser : action.fetchedUser }
        case 'UPDATE_TOKEN':
            return { ...state, token : action.token }
        default:
            return state
    }
}

export default createStore(reducer);
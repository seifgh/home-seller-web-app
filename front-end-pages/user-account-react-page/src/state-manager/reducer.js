import { getScreenTypes } from './../utils';

function appReducer( state, { payload, type } ){

	switch(type){

		case 'UPDATE_SCREEN_TYPES':
			return {...state, screen_types: getScreenTypes()}

		case 'SET_USER':
			return {...state, is_authenticated: payload.is_authenticated, user: payload.data }

		case 'SET_NOTIFY_SUBJECT':
			return {...state, notify_subject: payload.subject}

		case 'SET_SEARCH':
			return {
				...state,
				search: {...state.search, ...payload.updates}
			};

		case 'SET_EDIT_ACCOUNT':
			return {
				...state,
				edit_account: {...state.edit_account, ...payload.updates}
			}
		case 'SET_ACCOUNT_PASSWORD':
			return {
				...state,
				account_password: {...state.account_password, ...payload.updates}
			}
		case 'SET_ACCOUNT_ACTIONS':
			return {
				...state,
				account_actions: {...state.account_actions, ...payload.updates}
			}
		case 'SET_OFFLINE':
			return {...state, is_offline: payload.is_offline };

		default: return state;
	}
}

export default appReducer;

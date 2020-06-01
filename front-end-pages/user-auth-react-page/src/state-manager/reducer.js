import { getScreenTypes} from './../utils.js';

function appReducer( state, { payload, type } ){

	switch(type){
		case 'UPDATE_SCREEN_TYPES':
			return {...state, screen_types: getScreenTypes()}

		case 'SET_SIGN_IN':
			return {
				...state,
				sign_in: {...state.sign_in, ...payload.updates}
			};
		case 'SET_SIGN_UP':
			return {
				...state,
				sign_up: {...state.sign_up, ...payload.updates}
			};
		case 'SET_PASS_RESET':
			return {
				...state,
				password_reset: {...state.password_reset, ...payload.updates}
			};
			
		case 'SET_PASS_RESET_UPDATE':
			return {
				...state,
				password_reset_update: {...state.password_reset_update, ...payload.updates}
			};
		case 'SET_OFFILINE':
			return {...state, is_ofline: payload.is_offline };

		default: return state;
	}
}

export default appReducer;

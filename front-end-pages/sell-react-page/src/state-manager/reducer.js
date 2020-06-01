import {getScreenTypes} from './../utils';


function appReducer( state, { payload, type } ){

	switch(type){

		case 'UPDATE_SCREEN_TYPES':
			return {...state, screen_types: getScreenTypes()}

		case 'SET_USER':
			return {...state, is_authenticated: payload.is_authenticated, user: payload.data };

		case 'SET_LOCATION':
			return {
				...state,
				location: {...state.location, ...payload.updates}
			};
		case 'SET_TYPE':
			return {
				...state,
				type: {...state.type, ...payload.updates}
			};
		case 'SET_SPECIFICATIONS':
			return {
				...state,
				specifications: {...state.specifications, ...payload.updates}
			};
		case 'SET_IMAGES':
			return {
				...state,
				images: {...state.images, ...payload.updates}
			};
		case 'SET_OWNER':
			return {
				...state,
				owner: {...state.owner, ...payload.updates}
			};
		case 'SET_DONE':
			return {
				...state,
				done: {...state.done, ...payload.updates}
			};
		case 'SET_OFFLINE':
			return {...state, is_offline: payload.is_offline };

		default: return state;
	}
}

export default appReducer;

import { SORTS_BY, BED_BATH_ROOMS, PROPERTY_TYPE_OPTIONS, SHOULD_HAS_OPTIONS } from './../Settings';
import { changePushURL, generateURL, getScreenTypes } from './../utils';

import { getFiltersFromUrl } from './globalState';

function appReducer( state, { payload, type } ){

	let sort_by, price, square_feet, rooms, p_type, should_has, should_has_ids;
	switch(type){

		case 'UPDATE_SCREEN_TYPES':
			return {...state, screen_types: getScreenTypes()}

		case 'SET_USER':
			return {...state, is_authenticated: payload.is_authenticated, user: payload.data}

		case 'SET_NOTIFY_SUBJECT':
			return {...state, notify_subject: payload.subject};
		case 'SET_SEARCH':
			return {
				...state,
				search: {...state.search, ...payload.updates}
			};

		case 'SET_PROPERTIES':
			return {
				...state,
				properties: {...state.properties, ...payload.updates}
			};

		case 'SET_PROPERTY':
			return {
				...state,
				property: {...state.property, ...payload.updates}
			};

		case 'SET_USER_BOOKMARKS':
			return {
				...state,
				bookmarks: {...state.bookmarks, ...payload.updates}
			};

		case 'SET_FILTERS_FROM_URL':
			// set the new filters from url
			return { ...state, filters: getFiltersFromUrl(window.location.search) };

		case 'RESET_FILTERS':
			// set the new filters from url
			return { ...state, filters: getFiltersFromUrl("") };
		case 'SET_SORT_BY':
			sort_by = SORTS_BY.filter( sort => sort.id === payload.id )[0];
			// change and push url to history
			changePushURL(window.location.pathname + generateURL('', [{key: 'sortBy', value:sort_by.query_value}]));
			return { ...state, filters: { ...state.filters, sort_by },  sorts_click_counter: state.sorts_click_counter + 1 };

		case 'SET_PRICE_MAX':
			price = { ...state.filters.price, max: payload.value };
			changePushURL(window.location.pathname + generateURL('',[	{ key: 'price', value: `${price.min}-${price.max}` }]));
			return {...state, filters:{...state.filters, price }};
		case 'SET_PRICE_MIN':
			price = { ...state.filters.price, min: payload.value };
			changePushURL(window.location.pathname + generateURL('',[	{ key: 'price', value: `${price.min}-${price.max}` }]));
			return {...state, filters:{...state.filters, price }};

		case 'SET_SQUARE_FEET_MAX':
			square_feet = { ...state.filters.square_feet, max: payload.value };
			changePushURL(window.location.pathname + generateURL('',[{ key: 'squareFeet', value: `${square_feet.min}-${square_feet.max}` }]));
			return {...state, filters:{...state.filters, square_feet }};
		case 'SET_SQUARE_FEET_MIN':
			square_feet = { ...state.filters.square_feet, min: payload.value };
			changePushURL(window.location.pathname + generateURL('',[{ key: 'squareFeet', value: `${square_feet.min}-${square_feet.max}` }]));
			return {...state, filters:{...state.filters, square_feet }};

		case 'SET_BEDROOM':
			rooms = {...state.filters.rooms, bedroom: BED_BATH_ROOMS.filter( r => r.id === payload.id )[0] }
			changePushURL(window.location.pathname + generateURL('',[{ key: 'rooms', value: `${rooms.bedroom.query_value}-${rooms.bathroom.query_value}`}]));
			return { ...state, filters:{...state.filters, rooms }}
		case 'SET_BATHROOM':
			rooms = {...state.filters.rooms, bathroom: BED_BATH_ROOMS.filter( r => r.id === payload.id )[0] }
			changePushURL(window.location.pathname + generateURL('',[{ key: 'rooms', value: `${rooms.bedroom.query_value}-${rooms.bathroom.query_value}`}]));
			return { ...state, filters:{...state.filters, rooms }}

		case 'SET_TYPE':
			p_type = PROPERTY_TYPE_OPTIONS.filter( t => t.id === payload.id )[0];
			changePushURL(window.location.pathname + generateURL('',[{ key: 'type', value: `${p_type.query_value}`}]));
			return {...state, filters:{...state.filters, type: p_type}}

		case 'SET_SHOULD_HAS':
			should_has_ids = state.filters.should_has.map( op => op.id );
			should_has = SHOULD_HAS_OPTIONS.filter( op => ( (should_has_ids.includes(op.id) && op.id !== payload.id ) || ( payload.check_or_not && op.id === payload.id  ) ))
			changePushURL(window.location.pathname + generateURL('',[{ key: 'shouldHas', value: should_has.map( op => op.query_value ).toString() || 'any'}]));
			return {...state, filters:{ ...state.filters, should_has }};

		case 'SET_OFFLINE':
			return {...state, is_offline: payload.is_offline };

		default: return state;
	}
}

export default appReducer;

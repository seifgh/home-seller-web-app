import React, { createContext, useReducer } from 'react';
import axios from 'axios';

import {
	 WEB_API_URLS, SORTS_BY,
	 MAX_PRICE, MIN_PRICE,
	 MIN_SQUARE_FEET, MAX_SQUARE_FEET,
	 PROPERTY_TYPE_OPTIONS,
	 BED_BATH_ROOMS,
	 SHOULD_HAS_OPTIONS,
	 HOME_PAGE_URL
} from './../Settings';

import { AuthToken, getScreenTypes } from './../utils';

import appReducer from './reducer.js';

// get all filters from url query
export function getFiltersFromUrl(search=window.location.search){
	const searchParams = new URLSearchParams(search);
	let sort_by = searchParams.get('sortBy'),
	price = searchParams.get('price'),
	square_feet = searchParams.get('squareFeet'),
	rooms = searchParams.get('rooms'),
	type = searchParams.get('type'),
	should_has = searchParams.get('shouldHas');

	sort_by = SORTS_BY.filter( s => s.query_value === sort_by )[0] || SORTS_BY[0];
	price = (()=>{
			if ( price && (/^(\d{5,7})-(\d{5,7})$/).test(price) ){
				const splited = price.split('-').map( val => Number(val) );
				if ( splited[0] < splited[1] ){
					return { min: splited[0], max: splited[1] };
				}
			}
			return { min: MIN_PRICE, max: MAX_PRICE };
	})();
	square_feet = (()=>{
			if ( square_feet && (/^(\d{2,7})-(\d{2,7})$/).test(square_feet) ){
				const splited = square_feet.split('-').map( val => Number(val) );
				if ( splited[0] < splited[1] ){
					return { min: splited[0], max: splited[1] };
				}
			}
			return { min: MIN_SQUARE_FEET, max: MAX_SQUARE_FEET };
	})();
	rooms = (()=>{
		if ( rooms && (/^(([1,2,3,4,5])|(any))-(([1,2,3,4,5])|(any))$/).test(rooms) ){
			const splited = rooms.split('-');
			return {
				bedroom: BED_BATH_ROOMS.filter( op => op.query_value === splited[0] )[0],
				bathroom: BED_BATH_ROOMS.filter( op => op.query_value === splited[1] )[0]
			}
		}
		return { bedroom: BED_BATH_ROOMS[0], bathroom: BED_BATH_ROOMS[0] };
	})();
	type = PROPERTY_TYPE_OPTIONS.filter( op => op.query_value === type )[0] || PROPERTY_TYPE_OPTIONS[0];
	should_has = (()=>{
		if ( should_has ){
			const splited = should_has.split(',');
			return SHOULD_HAS_OPTIONS.filter( op => splited.includes(op.query_value) ) || [];
		}
		return [];
	})();
	return {
		sort_by,
		price,
		square_feet,
		rooms,
		type,
		should_has,
	}
}

const initialState = {
	is_authenticated: false,
	user: {
		full_name: '',
		email: '',
		is_loading: true
	},
	is_offline: false,
	notify_subject: null, // choices are bookmarks or offline
	filters: getFiltersFromUrl(),
	// filters looks like this:
		/*{
			sort_by: getSortByFromUrl(),
			price: {
				min: MIN_PRICE, max: MAX_PRICE
			},
			square_feet: {
				min: MIN_SQUARE_FEET, max: MAX_SQUARE_FEET
			},
			rooms: {
				bedroom: BED_BATH_ROOMS[0],
				bathroom: BED_BATH_ROOMS[0],
			},
			type: PROPERTY_TYPE_OPTIONS[0],
			should_has: [],
		 },*/
	// end filters

	property: {
		data: {},
		agent: {},
		suggestions: [],
		is_bookmarked: false,
		has_error: false,
		not_found: false,
		is_loading: true,
	},
	properties: {
		data: [],
		has_next: true,
		next_page: 1,
		has_error: false,
		is_loading: true,
	},

	bookmarks: {
		data: [],
		bookmarks_count: 0,
		next_page: 1,
		has_next: true,
		has_error: false,
		is_loading: true,
	},

	search: {
		key: (new URLSearchParams(window.location.search)).get('sq')  || '',
		options: []
	},

	// for responsive design
	screen_types: getScreenTypes(),

}

// Create context sub component
export const GlobalContext =  createContext( initialState );

// Create provider component
export function GlobalProvider( { children } ){

	const [ state, dispatch ] = useReducer( appReducer, initialState );

	// for responsive design
	function updateScreenTypes(){
		dispatch({
			type: 'UPDATE_SCREEN_TYPES'
		})
	}

	// user
	function setUser(data, is_authenticated){
		dispatch({
			type: 'SET_USER',
			payload: { data, is_authenticated }
		})
	}
	function signOut(){
		AuthToken.setToken('');
		window.location.href = HOME_PAGE_URL;
	}
	function setCheckUserAuthentication(){
			if ( ! AuthToken.getToken() ){
				return setUser({full_name: '', email: '', is_loading: false}, false);
			}
			setUser({...state.user, is_loading: true}, false);
			axios.get(WEB_API_URLS.authentication, {headers: AuthToken.getHeader()})
	    .then(({data})=>{
				AuthToken.setToken(data.token_key);
	      setUser({...data, is_loading: false}, true);
	    })
	    .catch((err)=>{
	      setUser({full_name: '', email: '', is_loading: false}, false);
	    })
	}
	// end user
	// Notify
	function setNotifySubject(subject, show_seconds=5){
		dispatch({
			type: 'SET_NOTIFY_SUBJECT',
			payload: {subject,}
		})
		setTimeout(() => dispatch({
			type: 'SET_NOTIFY_SUBJECT',
			payload: {subject: '',}
		}), 1000 * show_seconds);
	}
	// end Notify

	// properties
	function setProperties(updates){
		dispatch({
			type: 'SET_PROPERTIES',
			payload: {updates}
		})
	}
	function fetchSetProperties(refresh=false){
		const { properties } = state;
		
		// if filters changed then reload data from the start
		if (refresh){
			properties.has_next = true;
			properties.data = [];
			properties.next_page = 1;
		}
		// Generate url
		const {next_page} = properties;
		const params = new URLSearchParams(window.location.search.slice(1));
		params.set('page', next_page);
		const api_url = `${WEB_API_URLS.properties}?${params}`;


		if (properties.has_next){
			setProperties({is_loading: true});

			axios.get( api_url )
			.then(({data})=>{
				setProperties({
					data: properties.data.concat(data.data),
					has_next: data.has_next,
					next_page: next_page + 1,
					has_error: false,
					is_loading: false
				});
			})
			.catch((err)=>{
				setProperties({
					has_error: true,
					is_loading: false
				});
			})
		}
	}

	// Filters
	function setFiltersFromUrl(){
		dispatch({
			type: 'SET_FILTERS_FROM_URL',
		});
	}
	function resetFilters(){
		dispatch({
			type: 'RESET_FILTERS',
		});
	}
	function setSortBy(id){
		dispatch({
			type: 'SET_SORT_BY',
			payload: { id, }
		})
	}

	// price filters
	function setPriceMax(value){
		dispatch({
			type: 'SET_PRICE_MAX',
			payload: { value, }
		})
	}
	function setPriceMin(value){
		dispatch({
			type: 'SET_PRICE_MIN',
			payload: { value, }
		})
	}

	// square feet filters
	function setSquareFeetMax(value){
		dispatch({
			type: 'SET_SQUARE_FEET_MAX',
			payload: { value, }
		})
	}
	function setSquareFeetMin(value){
		dispatch({
			type: 'SET_SQUARE_FEET_MIN',
			payload: { value, }
		})
	}

	// rooms filter
	function setBathroom(id){
		dispatch({
			type: 'SET_BATHROOM',
			payload: { id, }
		})
	}
	function setBedroom(id){
		dispatch({
			type: 'SET_BEDROOM',
			payload: { id, }
		})
	}

	// type filter
	function setType(id){
		dispatch({
			type: 'SET_TYPE',
			payload: { id, }
		})
	}

	// should has filters
	function setShouldHas(id, check_or_not){
		dispatch({
			type: 'SET_SHOULD_HAS',
			payload: { id, check_or_not }
		})
	}

	// end properties

	// property details
	function setProperty(updates){
		dispatch({
			type: 'SET_PROPERTY',
			payload: {updates}
		});
	}
	function fetchSetProperty(id){
		setProperty({is_loading: true});
		axios.get(`${WEB_API_URLS.property}/${id}`, state.is_authenticated ? { headers:  AuthToken.getHeader() } : null )
		.then(({data})=>{
				setProperty({
					...data,
					is_loading: false,
					has_error: false,
					not_found: false
				});
		})
		.catch((err)=>{
				setProperty({
					has_error: true,
					not_found: Boolean(err.response && err.response.status === 404),
					is_loading: false,
				});
		})
	}
	// bookmarks
	function setUserBookmarks(updates){
		dispatch({
			type: 'SET_USER_BOOKMARKS',
			payload: {updates}
		})
	}
	function fetchSetUserBookmarks(refresh=false){
		const { bookmarks } = state;

		if ( refresh ){
			bookmarks.has_next = true;
			bookmarks.data = [];
			bookmarks.next_page = 1;
		}
		// Generate url
		const {next_page} = bookmarks;
		const params = new URLSearchParams(window.location.search.slice(1));
		params.set('page', next_page);
		const api_url = `${WEB_API_URLS.bookmarks}?${params}`;

		if ( bookmarks.has_next ){
			setUserBookmarks({is_loading: true});

			axios.get( api_url, {headers: AuthToken.getHeader()} )
			.then(({data})=>{
				setUserBookmarks({
					data: bookmarks.data.concat(data.data),
					bookmarks_count: data.bookmarks_count,
					has_next: data.has_next,
					next_page: next_page + 1,
					has_error: false,
					is_loading: false
				});
			})
			.catch((err)=>{
				setUserBookmarks({
					has_error: true,
					is_loading: false
				});
			})
		}
	}
	function removeFromBookmarks(id){
		const {bookmarks} = state;
		axios.delete(`${WEB_API_URLS.remove_from_bookmarks}/${id}`, { headers:  AuthToken.getHeader() })
		.then(()=>{
			const data = bookmarks.data.filter( ({property}) => property.id !== id );
			if (data.length >= 12 ){
				setUserBookmarks({data, bookmarks_count: bookmarks.bookmarks_count - 1 });
			}else{
				fetchSetUserBookmarks(true);
			}
		})
		.catch((err)=>{
			setUserBookmarks({has_error: true})
		});
	}

	function addPropertyToBookmarks(){
		const {data} = state.property;
		const {id} = data;
		const putData = new FormData();
		putData.append('property_id', id);
		axios.put(WEB_API_URLS.add_to_bookmarks, putData, { headers:  AuthToken.getHeader() })
		.then(()=>{
			setProperty({
				is_bookmarked: true,
				data: {...data, bookmarks_count: data.bookmarks_count + 1}
			});
			setUserBookmarks({data: []});
		})
		.catch((err)=>{
			setProperty({has_error: true});
		})
	}
	function removePropertyFromBookmarks(){
		const {data} = state.property;
		const {id} = data;
		axios.delete(`${WEB_API_URLS.remove_from_bookmarks}/${id}`, { headers:  AuthToken.getHeader() })
		.then(()=>{
			setProperty({
				is_bookmarked: false,
				data: {...data, bookmarks_count: data.bookmarks_count - 1}
			});
			setUserBookmarks({data: []});

		})
		.catch((err)=>{
			setProperty({has_error: true});
		})
	}

	// end bookmarks

	// Search
	function setSearch(updates){
		dispatch({
			type: 'SET_SEARCH',
			payload: {updates}
		});
	}
	function setSearchKey(value){
		setSearch({key: value});
	}

	function fetchSetOptions(){
		const { key } = state.search;
		axios.get(`${WEB_API_URLS.search}?sq=${key}`)
		.then(({data})=>{
			setSearch({options: data.options});
		})
		.catch((err)=>{
			console.log(err);
		})
	}
	// end search


	const providerValue = {
		...state,
		// functions
		signOut,
		setCheckUserAuthentication,
		setNotifySubject,
		setProperties,
		fetchSetProperties,
		setFiltersFromUrl,
		resetFilters,
		setSortBy,
		setPriceMax,
		setPriceMin,
		setSquareFeetMax,
		setSquareFeetMin,
		setBathroom,
		setBedroom,
		setType,
		setShouldHas,
		setProperty,
		fetchSetProperty,
		setUserBookmarks,
		fetchSetUserBookmarks,
		removeFromBookmarks,
		addPropertyToBookmarks,
		removePropertyFromBookmarks,
		setSearchKey,
		fetchSetOptions,
		updateScreenTypes
	}

	return (
		<GlobalContext.Provider value={ providerValue } >
			{ children }
		</GlobalContext.Provider>
	)
};

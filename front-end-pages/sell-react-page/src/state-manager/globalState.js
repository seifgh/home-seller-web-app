import React, { createContext, useReducer } from 'react';
import axios from 'axios';

import {
	 WEB_API_URLS,
	 PROPERTY_TYPE_OPTIONS,
	 PROPERTY_INCLUDES_OPTIONS,
	 MAX_SQUARE_FEET, MIN_SQUARE_FEET,
	 MAX_PRICE, MIN_PRICE,
	 MIN_BUILD_YEAR, MAX_BUILD_YEAR
} from './../settings';

import {AuthToken, Validator, getScreenTypes} from './../utils';

import appReducer from './reducer.js';


const initialState = {

	is_authenticated: false,

	user: {
		full_name: '',
		email: '',
		joined: '',
		is_loading: true
	},

	is_offline: false,

	// post house steps
	location: {
		countries: {
			options: [],
			errors: []
		},
		states: {
			options: [],
			errors: []
		},
		cities: {
			options: [],
			errors: []
		},
		street: {
			value: '',
			errors: []
		},
		additional: {
			value: '',
			errors: []
		},

		is_done: false
	},
	type: {
		options: PROPERTY_TYPE_OPTIONS,
		is_done: false,
	},
	specifications: {
			name: {
				value: '',
				errors: []
			},
			description: {
				value: '',
				errors: []
			},
			build_year: {
				value: 2000,
				errors: []
			},

			bedrooms_number:  {
				value: 3,
				errors: []
			},
			bathrooms_number:  {
				value: 1,
				errors: []
			},
			garages_number:  {
				value: 1,
				errors: []
			},
			parking_spaces_number:  {
				value: 1,
				errors: []
			},
			floor_space:  {
				value: 100,// sqft
				errors: []
			},
			price: {
				value: 250000,// country currency
				errors: []
			},
			includes: PROPERTY_INCLUDES_OPTIONS,

			is_done: false
	},
	images: {
		main_image: {
			file: null,
			errors: [],
		},
		details_images: {
			images: [
				{id: 1, file: null},
				{id: 2, file: null},
				{id: 3, file: null},
				{id: 4, file: null},
			],
			errors: [],
		},

		is_done: false
	},
	owner: {
		full_name: {
			value: '',
			errors:[]
		},
		phone: {
			value: '',
			errors:[]
		},
		email: {
			value: '',
			errors:[]
		},
		message: {
			value: '',
			errors:[]
		},
		is_done: false,
	},

	done: {
		is_loading: true,
		has_errors: false,
		is_done: false
	},

	// for responsive design
	screen_types: getScreenTypes(),

};

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

	function setOffline(bool){
		dispatch({
			type: 'SET_OFFLINE',
			payload: { is_offline: bool, },
		})
	}

	function setUser(data, is_authenticated){
		dispatch({
			type: 'SET_USER',
			payload: { data, is_authenticated }
		})
	}
	function setCheckUserAuthentication(){
			if ( ! AuthToken.getToken() ){
				return setUser({full_name: '', email: '', joined: '', is_loading: false}, false);
			}
			axios.get(WEB_API_URLS.authentication, {headers: AuthToken.getHeader()})
	    .then(({data})=>{
				AuthToken.setToken(data.token_key);
	      setUser({...data, is_loading: false}, true);
	    })
	    .catch((err)=>{
	      console.log(err);

	      setUser({full_name: '', email: '', joined: '', is_loading: false}, false);
	    })
	}
	// end user

	// sell house
	// location
	function setLocation(updates){
		dispatch({
			type: 'SET_LOCATION',
			payload: {updates}
		})
	}
	function setLocationStreet(value){
		setLocation({street: {errors: [], value}});
	}
	function setLocationAdditional(value){
		setLocation({additional: {errors: [], value}});
	}


	function setFetchCountries(){
		axios.get( WEB_API_URLS.countries )
		.then(({data})=>{
			const countries = {
				options: data.countries.map( c => ({...c, is_selected: false}) ),
				errors: []
			}
			setLocation( {countries, states: {options: [], errors: []} , cities: {options: [], errors: []} } )
		})
		.catch((err)=>{
			console.log(err);
		})
	}
	function setCountryAndFetchStates(country_id){
		axios.get( `${WEB_API_URLS.states}/${country_id}` )
		.then(({data})=>{
			const states = {
				options: data.states.map( s => ({...s, is_selected: false}) ),
				errors: []
			}

			const countries = {
				options: state.location.countries.options.map( c => c.id === country_id ? {...c, is_selected: true}:{...c, is_selected: false} ),
				errors: []
			}

			setLocation( {states, countries, cities: {options: [], errors: []} } )
		})
		.catch((err)=>{
			console.log(err);
		})
	}
	function setStateAndFetchCities(state_id){
		axios.get( `${WEB_API_URLS.cities}/${state_id}` )
		.then(({data})=>{
			const cities = {
				options: data.cities.map( s => ({...s, is_selected: false}) ),
				errors: []
			}
			const states = {
				options: state.location.states.options.map( s => s.id === state_id ? {...s, is_selected: true}:{...s, is_selected: false} ),
				errors: []
			}
			setLocation( {cities, states} )
		})
		.catch((err)=>{
			console.log(err);
		})
	}
	function setCity(city_id){
		const cities = {
			options: state.location.cities.options.map( c => c.id === city_id ? {...c, is_selected: true}:{...c, is_selected: false} ),
			errors: []
		}
		setLocation({cities});
	}

	function handleLocationSubmit(e){

		const { cities, states, countries, street } = state.location;
		cities.errors = Validator.select_option(cities.options);
		states.errors = Validator.select_option(states.options);
		countries.errors = Validator.select_option(countries.options);
		street.errors = Validator.minMaxLength(street.value, 1, 35);

		if ( cities.errors.length ||  states.errors.length || countries.errors.length || street.errors.length ){
			setLocation({cities, states, countries, street, is_done: false});
			// cancel going to the next step
			e.preventDefault();
		}else{
			setLocation({is_done: true});
		}
	}

	// type
	function setType(updates){
		dispatch({
			type: 'SET_TYPE',
			payload: {updates}
		})
	}
	function setSelectedType(id){
			setType({
				options: state.type.options.map(
					 op => op.id === id ? {...op, is_selected: true} : {...op, is_selected: false}
				 ),
			})
	}
	function handleTypeSubmit(){
		setType({is_done: true});
	}

	// specifications
	function setSpecifications(updates){
		dispatch({
			type: 'SET_SPECIFICATIONS',
			payload: {updates}
		})
	}

	function setSpecificationsFieldValue(key, value){
		const obj = {};
		obj[key] = {
			value: value,
			errors: []
		};
		setSpecifications(obj);
	}
	function setSpecificationsIncludes(id){
		const includes = state.specifications.includes.map(
			 op => op.id === id ?  {...op, is_selected: ! op.is_selected} : op
		);
		setSpecifications({includes});
	}
	function handleSpecificationsSubmit(e){
		const { name, description, price, floor_space, build_year } = state.specifications;
		name.errors = Validator.minMaxLength(name.value, 10, 50);
		description.errors = Validator.minMaxLength(description.value, 20, 500);
		build_year.errors = Validator.minMaxNumber(build_year.value, MIN_BUILD_YEAR, MAX_BUILD_YEAR);
		price.errors = Validator.minMaxNumber(price.value, MIN_PRICE, MAX_PRICE);
		floor_space.errors = Validator.minMaxNumber(floor_space.value, MIN_SQUARE_FEET, MAX_SQUARE_FEET);

		if ( name.errors.length || description.errors.length || price.errors.length || floor_space.errors.length  || build_year.errors.length ){
			e.preventDefault();
			setSpecifications({name, description, price, floor_space, build_year, is_done: false});
		}else{
			setSpecifications({is_done: true});
		}

	}

	// images
	function setImages(updates){
		dispatch({
			type: 'SET_IMAGES',
			payload: {updates}
		})
	}
	function setMainImage(file){
		setImages({main_image: {file, errors: []} });
	}
	function setDetailsImage(id, file){
		setImages({
			details_images: {
				images: state.images.details_images.images.map((obj) => obj.id === id ? {id: id, file: file} : obj),
				errors: [],
			}
		})
	}
	function handleImagesSubmit(e){
		const { main_image, details_images } = state.images;
		main_image.errors = main_image.file ? [] : ['The cover image is required.']
		details_images.errors =  details_images.images.filter( ({file}) => Boolean(file)).length >= 2 ?  [] : ['Please upload at least 2 images.']

		if ( main_image.errors.length || details_images.errors.length ){
			e.preventDefault();
			setImages({main_image, details_images, is_done: false});
		}else{
			setImages({is_done: true});
		}
	}
	// owner
	function setOwner(updates){
		dispatch({
			type: 'SET_OWNER',
			payload: {updates}
		})
	}

	function setOwnerField(key, value){
		const obj = {};
		obj[key] = {
			value,
			errors: []
		};
		setOwner(obj);
	}
	function handleOwnerSubmit(e){
		const { full_name, phone, email } = state.owner;
		// validate data
		full_name.errors = Validator.minMaxLength(full_name.value, 2, 50);
		phone.errors = Validator.minMaxLength(phone.value, 9, 15);
		email.errors = Validator.email(email.value);

		if ( email.errors.length || phone.errors.length || full_name.errors.length ){
			setOwner({full_name, phone, email, is_done: false});
			e.preventDefault();
		}else{
			setOwner({is_done: true});
			postProperty();
		}
	}
	// post property
	function setDone(updates){
		dispatch({
			type: 'SET_DONE',
			payload: {updates}
		})
	}
	function postProperty(){
		const { location, type, specifications, images, owner } = state;

		setDone({is_loading: true});
		const data = new FormData();
		data.append('city_id', location.cities.options.filter(({is_selected})=>is_selected)[0].id);
		data.append('street_name', location.street.value);
		data.append('location_name', location.additional.value);

		data.append('property_type', type.options.filter(({is_selected})=>is_selected)[0].code);
		data.append('name', specifications.name.value);
		data.append('description', specifications.description.value);
		data.append('build_year', specifications.build_year.value);
		data.append('bedrooms_number', specifications.bedrooms_number.value);
		data.append('bathrooms_number', specifications.bathrooms_number.value);
		data.append('garages_number', specifications.garages_number.value);
		data.append('parking_spaces_number', specifications.parking_spaces_number.value);
		data.append('floor_space', specifications.floor_space.value);
		data.append('price', specifications.price.value);
		specifications.includes.forEach( ({is_selected, code}) =>{
			 if ( is_selected ){
				 data.append(code, 1)
			 }
		 });
		data.append('main_image', images.main_image.file);
		images.details_images.images.forEach( ({file}) =>{
		 	if (Boolean(file)){
				data.append('details_images', file);
			}
	  });
		data.append('full_name', owner.full_name.value);
		data.append('phone', owner.phone.value);
		data.append('email', owner.email.value);
		data.append('message', owner.message.value);

		axios.post(WEB_API_URLS.post_property, data)
		.then(({data})=>{
			setDone({is_loading: false, has_errors: false, is_done: true});
		})
		.catch((err)=>{
			setDone({is_loading: false, has_errors: true});
		})
	}
	// end sell house


	const providerValue = {
		...state,
		// functions

		// user authentication
		setCheckUserAuthentication,
		setUser,

		// post house
		// Location
		setLocation,
		setLocationStreet,
		setFetchCountries,
		setCountryAndFetchStates,
		setStateAndFetchCities,
		setCity,
		handleLocationSubmit,
		setLocationAdditional,
		// Type
		setType,
		setSelectedType,
		handleTypeSubmit,
		// specifications
		setSpecifications,
		setSpecificationsFieldValue,
		setSpecificationsIncludes,
		handleSpecificationsSubmit,
		// Images
		setImages,
		setMainImage,
		setDetailsImage,
		handleImagesSubmit,
		// owner
		setOwner,
		setOwnerField,
		handleOwnerSubmit,
		// post property
		postProperty,
		updateScreenTypes,
		setOffline
	}

	return (
		<GlobalContext.Provider value={ providerValue } >
			{ children }
		</GlobalContext.Provider>
	)
};

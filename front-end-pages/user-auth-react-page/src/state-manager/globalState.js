import React, { createContext, useReducer } from 'react';
import {AuthToken, Validator, getScreenTypes} from './../utils.js';
import {WEB_API_URLS, HOME_PAGE_URL} from  './../settings.js';
import appReducer from './reducer.js';
import axios from 'axios';

export const initialState = {
	is_offline: false,
	is_authenticated: false,

	sign_in: {
		email:{ value: '', errors: [] },
		password:{ value: '', errors: [] },
		is_loading: false
	},
	sign_up: {
		email: { value: '', errors: [] },
		full_name: { value: '', errors: [] },
		password: { value: '', errors: [] },
		password_confirmation: { value: '', errors: [] },
		is_loading: false,
		is_done: false
	},
	password_reset: {
		email: { value: '', errors: [] },
		is_loading: false,
		is_done: false
	},
	password_reset_update: {
		password: { value: '', errors: [] },
		password_confirmation: { value: '', errors: [] },
		is_loading: false,
		is_done: false
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

	// sign in
	function setSignIn(updates){
		dispatch({
			type: 'SET_SIGN_IN',
			payload: { updates }
		})
	}
	function setSignInField(label, value){
		const obj = {};
		obj[label] = {value, errors: []};
		setSignIn(obj);
	}
	function signIn(redirect_url){
		const {email, password} = state.sign_in;
		email.errors = Validator.email(email.value);
		password.errors = Validator.password(password.value);


		if (email.errors.length || password.errors.length){
			setSignIn({email, password});
		}else{
			setSignIn({is_loading: true});
			const data = new FormData();
			data.append('email', email.value);
			data.append('password', password.value);
			axios.post(WEB_API_URLS.signin, data)
			.then((res)=>{
				const {data} = res;
				AuthToken.setToken(data.token);
				document.location.href = redirect_url || HOME_PAGE_URL;
			})
			.catch((err)=>{
				if ( err.response && err.response.data.errors ){
					const { errors } = err.response.data;
					if (errors.password){
						password.errors = [errors.password];
					}
					if (errors.email){
						email.errors = [errors.email];
					}
				}
				setSignIn({email, password, is_loading: false});
			})
		}
	}

	// sign up
	function setSignUp(updates){
		dispatch({
			type: 'SET_SIGN_UP',
			payload: { updates }
		})
	}
	function setSignUpField(label, value){
		const obj = {};
		obj[label] = {value, errors: []};
		setSignUp(obj);
	}
	function signUp(){
		const {full_name, email, password, password_confirmation} = state.sign_up;
		email.errors = Validator.email(email.value);
		password.errors = Validator.password(password.value);
		password_confirmation.errors = Validator.password_confirmation(password_confirmation.value ,password.value);
		full_name.errors = Validator.minMaxLength(full_name.value, 2, 50);


		if (email.errors.length || password.errors.length || password.errors.length || password_confirmation.errors.length){
			setSignUp({email, password, password_confirmation, full_name});
		}else{
			setSignUp({is_loading: true});
			const data = new FormData();
			data.append('email', email.value);
			data.append('password', password.value);
			data.append('full_name', full_name.value);

			axios.post(WEB_API_URLS.signup, data)
			.then((res)=>{
				setSignUp({is_done: true});
				// clear the data after 2 seconds cause is_done will  redirect sing up to sign in
				setTimeout(()=>setSignUp(initialState.sign_up), 2000);
			})
			.catch((err)=>{
				if ( err.response && err.response.data.errors ){
					const { errors } = err.response.data;
					if ( errors.email ){
						email.errors = [errors.email];
					}
				}
				setSignUp({email, is_loading: false});
			})
		}
	}

	// password reset
	function setPasswordReset(updates){
		dispatch({
			type: 'SET_PASS_RESET',
			payload: { updates }
		})
	}
	function setPasswordResetField(label, value){
		const obj = {};
		obj[label] = {value, errors: []};
		setPasswordReset(obj);
	}
	function sendVerificationKey(){
		const {email} = state.password_reset;
		email.errors = Validator.email(email.value);
		if (email.errors.length){
			setPasswordReset({email});
		}else{
			setPasswordReset({is_loading: true});
			const data = new FormData();
			data.append('email', email.value);
			axios.post(WEB_API_URLS.reset, data)
			.then(()=>{
				setPasswordReset({is_done: true})
				setTimeout(()=>setPasswordReset(initialState.password_reset), 2000);
			})
			.catch((err)=>{
				if ( err.response && err.response.data.errors ){
					const { errors } = err.response.data;
					if ( errors.email ){
						email.errors = [errors.email];
					}
				}
				setPasswordReset({email, is_loading: false});
			})
		}
	}

	// password reset update
	function setPasswordResetUpdate(updates){
		dispatch({
			type: 'SET_PASS_RESET_UPDATE',
			payload: { updates }
		})
	}
	function setPasswordResetUpdateField(label, value){
		const obj = {};
		obj[label] = {value, errors: []};
		setPasswordResetUpdate(obj);
	}
	function updatePassword(KEY){
		const { password, password_confirmation } = state.password_reset_update;

		password.errors = Validator.password(password.value);
		password_confirmation.errors = Validator.password_confirmation(password_confirmation.value ,password.value);

		if (password.errors.length || password_confirmation.errors.length){
			setPasswordResetUpdate({password, password_confirmation});
		}else{
			setPasswordResetUpdate({is_loading: true});

			const data = new FormData();
			data.append('password', password.value);
			data.append('key', KEY);
			axios.put(WEB_API_URLS.reset, data)
			.then(()=>{
				setPasswordResetUpdate({is_done: true});
				setTimeout(()=>setPasswordResetUpdate(initialState.password_reset_update), 2000);
			})
			.catch((err)=>{
				if ( err.response && err.response.status === 404 ){
					password_confirmation.errors = ['Your link expires. Please, repeat the process to send you another link.']
				}
				setPasswordResetUpdate({password_confirmation, is_loading: false});
			})
		}
	}

	const providerValue = {
		...state,

		// functions
		setSignInField,
		signIn,
		setSignUpField,
		signUp,
		setPasswordResetField,
		sendVerificationKey,
		setPasswordResetUpdateField,
		updatePassword,
		updateScreenTypes,
	}

	return (
		<GlobalContext.Provider value={ providerValue } >
			{ children }
		</GlobalContext.Provider>
	)
};

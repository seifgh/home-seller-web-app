import React, { createContext, useReducer } from 'react';
import axios from 'axios';

import {
	 WEB_API_URLS,
	 HOME_PAGE_URL
} from './../Settings';

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
	notify_subject: null,

	search: {
		key: '',
		options: []
	},

	edit_account: {
    full_name: {
      value: '',
      errors: []
    },
    password: {
      value: '',
      errors: []
    },
    is_loading: false
  },

	account_password: {
    password_confirmation: {
      value: '',
      errors: []
    },
    password: {
      value: '',
      errors: []
    },
    current_password: {
      value: '',
      errors: []
    },
    sign_out: true,
    is_loading: false,
    is_done: false
  },

	account_actions: {
    selected_id: 1,
    password: {
      value: '',
      errors: []
    },
    is_loading: false,
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
				window.location.href = HOME_PAGE_URL;
			}
			axios.get(WEB_API_URLS.authentication, {headers: AuthToken.getHeader()})
	    .then(({data})=>{
				AuthToken.setToken(data.token_key);
	      setUser({...data, is_loading: false}, true);
	    })
	    .catch((err)=>{
				window.location.href = HOME_PAGE_URL;
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

	function setOffline(bool){
		dispatch({
			type: 'SET_OFFILINE',
			payload: { is_offline: bool, },
		})
	}

	// Search
	function setSearch(updates){
		dispatch({
			type: 'SET_SEARCH',
			payload: { updates }
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

	// Account
	// Edit
	function setEditAccount(updates){
		dispatch({
			type: 'SET_EDIT_ACCOUNT',
			payload: { updates }
		});
	}
	function setEditAccountField(label, value){
		const obj = {};
		obj[label] = {
			value,
			errors: []
		};
		setEditAccount(obj);
	}
	function editAccount(){
		const { edit_account, user } = state;
		const { password, full_name } = edit_account;
    password.errors = Validator.password(password.value);
		full_name.errors = Validator.minMaxLength(full_name.value, 2, 50);

    if (password.errors.length || full_name.errors.length){
			setEditAccount({password, full_name});
		}else{
      setEditAccount({is_loading: true});
      const data = new FormData();
      data.append('full_name', full_name.value);
      data.append('password', password.value);

      axios.put(WEB_API_URLS.account_settings, data, {headers: AuthToken.getHeader()})
      .then(()=>{
        // empty andupdate values
        password.value = '';
        setEditAccount({is_loading: false, password});
        setUser({...user, full_name: full_name.value}, true);
        setNotifySubject('full-name-change');
      })
      .catch((err)=>{
        if ( err.response && err.response.data && err.response.data.errors ){
          const {errors} = err.response.data;
          if ( errors.password ){
            password.errors = ["Wrong password. Please, try again."];
          }
        }
        setEditAccount({password, is_loading: false});
      })
    }
  }

	// change password
	function setAccountPassword(updates){
		dispatch({
			type: 'SET_ACCOUNT_PASSWORD',
			payload: { updates }
		})
	}
	function setAccountPasswordField(label, value){
		const obj = {};
		obj[label] = label === 'sign_out' ? value : {value, errors: []};
		setAccountPassword(obj);
	}
	function changeAccountPassword(){
		const { account_password } = state;
		const { password, password_confirmation, current_password, sign_out } = account_password;

		password.errors = Validator.password(password.value);
		password_confirmation.errors = Validator.password_confirmation(password_confirmation.value ,password.value);
		current_password.errors = Validator.password(current_password.value);

		if ( password.errors.length || password_confirmation.errors.length || current_password.errors.length){
			setAccountPassword({password, password_confirmation, current_password});
		}else{
			setAccountPassword({...account_password, is_loading: true});
			const data = new FormData();
			data.append('new_password', password.value);
			data.append('password', current_password.value);
			if ( sign_out ){
				data.append('sign_out', '');
			}

			axios.put(WEB_API_URLS.account_settings, data, {headers: AuthToken.getHeader()})
			.then(({data})=>{
				// empty values and update newToken if neccessary
				password.value = '';
				password_confirmation.value = '';
				current_password.value = '';
				if ( sign_out ){
					AuthToken.setToken(data.new_token);
				}
				setAccountPassword({is_loading: false, password, password_confirmation, current_password});
				setNotifySubject('password-change');
			})
			.catch((err)=>{
				if ( err.response && err.response.data && err.response.data.errors ){
					const {errors} = err.response.data;
					if ( errors.password ){
						current_password.errors = ["Wrong password. Please, try again."];
					}
				}
				setAccountPassword({current_password, is_loading: false});
			})

		}
	}

	// account Actions
	function setAccountActions(updates){
		dispatch({
			type: 'SET_ACCOUNT_ACTIONS',
			payload: { updates }
		})
	}
	function setAccountActionsField(label, value){
		const obj = {};
		obj[label] = label === 'selected_id' ? value : {value, errors: []};
		setAccountActions(obj);
	}
	function applyAccountActions(){
		const { account_actions } = state;
		const { password, selected_id } = account_actions;
    password.errors = Validator.password(password.value);

    if (password.errors.length){
			setAccountActions({password});
		}else{
      setAccountActions({is_loading: true});

      const data = new FormData();
      data.append('password', password.value);
      // get the action
      const action = selected_id === 1 ? 'sign_out':'delete';

      axios.post(`${WEB_API_URLS.account_settings}/${action}`, data, {headers: AuthToken.getHeader()})
      .then(({data})=>{
        if (selected_id === 1){
					// update token
          AuthToken.setToken(data.new_token);
          setNotifySubject('sign-out-all-devices');
					password.value = '';
		      setAccountActions({is_loading: false, password});
        }else{
					signOut();
				}

      })
      .catch((err)=>{
        if ( err.response && err.response.data && err.response.data.errors ){
          const {errors} = err.response.data;
          if ( errors.password ){
            password.errors = ["Wrong password. Please, try again."];
          }
        }
        setAccountActions({password, is_loading: false});
      })

    }
  }

	// End account
	const providerValue = {
		...state,
		// functions

		// user authentication
		setCheckUserAuthentication,
		signOut,
		setUser,

		// notifications
		setNotifySubject,

		// search
		setSearchKey,
		fetchSetOptions,

		// account
		setEditAccountField,
		editAccount,
		setAccountPasswordField,
		changeAccountPassword,
		setAccountActionsField,
		applyAccountActions,
		updateScreenTypes,
		setOffline
	}

	return (
		<GlobalContext.Provider value={ providerValue } >
			{ children }
		</GlobalContext.Provider>
	)
};

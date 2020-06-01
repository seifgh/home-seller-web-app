import React , { useState, useContext } from 'react';
import { GlobalContext } from './../../../state-manager/globalState';
import axios from 'axios';
import { Validator } from './../../../utils.js';
import OrderConfirmed from './../../../images/order_confirmed.svg';
import Request_Lost_IMG from './../../../images/request_lost.svg';

import { WEB_API_URLS } from './../../../Settings.js';
import {TextInput, TextAreaInput} from './../../forms/text-input';



function ContactForm({closeForm, agent_id, property_id, user}){

	const [ state, setState ] = useState({
		full_name: {
			value:  user.full_name || '',
			errors:[]
		},
		phone: {
			value: '',
			errors:[]
		},
		email: {
			value: user.email || '',
			errors:[]
		},
		message: {
			value: '',
			errors:[]
		},
		client_id: null,
		is_loading: false,
		has_error: false
	});

	function handleChange( key, value ){
		const obj = {};
		obj[key] ={
			 value,
			 errors: []
		};
		setState({...state, ...obj});
	}

	function handleSubmit(e){
		e.preventDefault();
		const { full_name, phone, email, message } = state;
		// validate data
		full_name.errors = Validator.minMaxLength(full_name.value, 2, 50);
		phone.errors = Validator.minMaxLength(phone.value, 9, 15);
		email.errors = Validator.email(email.value);
		// if there is no errors send data to the server
		if ( full_name.errors.length + phone.errors.length + email.errors.length === 0 ){
			const data = new FormData();
			data.append('full_name', full_name.value);
			data.append('phone', phone.value);
			data.append('email', email.value);
			data.append('message', message.value);
			data.append('property_id', property_id);
			data.append('agent_id', agent_id);

			setState({...state, is_loading: true});
			axios.post(WEB_API_URLS.contact, data)
			.then((res)=>{
				// get the client_id from response ( will use it in the next form )
				const data = res.data;
				setState({...state, is_done: true, is_loading: false, client_id: data.client_id})
			})
			.catch((err)=>{
				setState({...state, has_error: true, is_loading: false})
			})
		}else{
			setState({...state, full_name, phone, email, message});
		}
	}

	const { full_name, phone, email, message, is_done, is_loading, has_error } = state;

	// Rendering
	if (is_done){
		return(
			<div className="card-5">
	      <h3>Thanks, the contact was successful.</h3>
	      <small>Our agent will contact you as soon as possible.</small>
	      <div className="image max">
	        <img alt="successful" src={OrderConfirmed} />
	      </div>
	    </div>
		)
	}
	if (has_error){
		return(
			<div className="card-5">
	      <h3>Sorry, something went wrong.</h3>
	      <small>We couldn't connect to the server, please check your connection or refresh.</small>
	      <div className="image max">
	        <img alt="request lost" src={Request_Lost_IMG} />
	      </div>
	    </div>
		)
	}
	return(
		<form onSubmit={(e) => handleSubmit(e)} method="post" >

			<div className="field">
				<TextInput  errors={full_name.errors} label="Full name" value={full_name.value} onChange={ (v) => handleChange( 'full_name', v ) } />
			</div>

			<div className="field">
				<TextInput errors={phone.errors}  label="Phone" value={phone.value} onChange={ (v) => handleChange( 'phone', v ) } />
			</div>

			<div className="field">
				<TextInput errors={email.errors}  label="Email" value={email.value} onChange={ (v) => handleChange( 'email', v ) } />
			</div>

			<div className="field">
				<TextAreaInput className="message"  label="Message (optional)" value={message.value} onChange={ (value) => handleChange( 'message', value ) } />
			</div>

			<div className="btns">
				<button type="button" onClick={ () => closeForm() } className="btn-outline-primary">Cancel</button>
				<button className={`btn-primary${is_loading ? ' loading':''}`}> {is_loading ? 'Loading ...':'Contact'}</button>
			</div>

		</form>
	)
}


function ContactAgent({display, setDisplay}){

	const {user, property} = useContext(GlobalContext);
	const {agent} = property, { id } = property.data;

	function closeModal(e){
		if ( e.target.className.includes('modal-1') ){
			setDisplay(false);
		}
	}
	return (
		<div onClick={ (e) => closeModal(e) } className={`modal-1${ display ? '':' hide'}`}>
			<div className="modal-container">
				<div className="top-bar">
					<i onClick={ () => setDisplay(false) } className="fa fa-arrow-left"></i>
					Contact agent
				</div>
				<div className="card-2">
					<div className="image">
						<img alt="agent" src={agent.image.src} />
					</div>
					<div className="details">
						<h4 className="name ellipsis" >{agent.full_name}</h4>
						<small>{agent.phone}</small>
						<small>{agent.email}</small>
					</div>
				</div>

				<ContactForm  closeForm={ () => setDisplay(false) } agent_id={agent.id} user={user} property_id={id} />
			</div>
		</div>
	)
}

export default ContactAgent;

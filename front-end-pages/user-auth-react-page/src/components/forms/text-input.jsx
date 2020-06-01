import React , { Component } from 'react';

import './text-input-styles.css';

import Errors from './errors';



export  class TextInput extends Component {

	constructor(props){
		super(props);
		this.state = {
			focus : false,
		}
	}

	setFocus( bool ){
		this.setState({ focus : bool })
	}

	render(){
		const { label, value, errors=[], className='' , onChange, max='', min='' } = this.props;
		const { focus } = this.state;
		const clearIconStyles = {
			display:  value ? 'block':'none',
		}
		const has_errors = errors.length

		return(
			<>
				<div className={ `text-field${ focus || value ? ' focus':'' }${ has_errors  ? ' errors focus':'' }${ className ? ` ${className}`:'' }` } >
					<label>{ label }</label>
					<input type="text" value = { value }
						   maxLength={max} minLength={min}
						   onChange = { ( e ) => onChange( e.target.value )  }
						   onFocus  = { () => this.setFocus( true )  }
						   onBlur = { () => this.setFocus( false ) }
					/>

					<i style={ clearIconStyles }
					   title="clear"
					   onClick = { ( e ) => onChange( '' )  }
					   className="clear fas fa-times"  />
				</div>
				<Errors errors={errors} />
			</>

		)
	}
}

export  class TextInputDisabled extends Component {

	setFocus( bool ){
		this.setState({ focus : bool })
	}

	render(){
		const { label, value, className='' } = this.props;
		return(

			<div className={ `text-field disabled focus${ className ? ` ${className}`:'' }` } >
				<label>{ label }</label>
				<input onChange={() => null} type="text" value={ value }/>
			</div>

		)
	}
}

export  class TextAreaInput extends Component {

	constructor(props){
		super(props);
		this.state = {
			focus : false,
		}
	}
	setFocus( bool ){
		this.setState({ focus : bool })
	}

	render(){
		const { label, value, errors=[], className = '' , onChange, max='', min='' } = this.props;
		const { focus } = this.state;
		const clearIconStyles = {
			display :  value ? 'block':'none',
		}
		const has_errors = errors.length;

		return(
			<>
				<div className={ `text-field text-area${ focus || value ? ' focus':'' }${ has_errors  ? ' errors focus':'' }${ className ? ` ${className}`:'' }` } >
					<label>{ label }</label>
					<textarea type="text" value={value}
						   maxLength={max} minLength={min}
						   onChange = { ( e ) => onChange( e.target.value )  }
						   onFocus  = { () => this.setFocus( true )  }
						   onBlur = { () => this.setFocus( false ) }
					></textarea>

					<i style={ clearIconStyles }
					   title="clear"
					   onClick = { ( e ) => onChange( '' )  }
					   className="clear fas fa-times"  />
				</div>
				<Errors errors={errors} />
			</>
		)
	}
}

export  class TextPasswordInput extends Component {

	constructor(props){
		super(props);
		this.state = {
			focus : false,
			show_password : false,
		}
	}

	toggleShowPassword(){
		this.setState({
		    show_password : !this.state.show_password,
		})
	}



	setFocus( bool ){
		this.setState({ focus : bool })
	}

	render(){
		const { label, value, errors=[], className = '' , onChange, max='', min='' } = this.props;
		const { focus, show_password } = this.state;
		const has_errors = errors.length;

		return(
			<>
				<div className={ `text-field${ focus || value ? ' focus':'' }${ has_errors  ? ' errors focus':'' }${ className ? ` ${className}`:'' }` } >
					<label>{ label }</label>
					<input type={show_password ? 'text':'password'} value = { value }
						   maxLength = {max} minLength = {min}
						   onChange = { ( e ) => onChange( e.target.value )  }
						   onFocus  = { () => this.setFocus( true )  }
						   onBlur = { () => this.setFocus( false ) }
					/>

					<i
					   title="clear"
					   onClick = { () => this.toggleShowPassword()  }
					   className={`clear fas fa-${show_password ? 'eye':'eye-slash'}`}  />
				</div>
				<Errors errors={errors} />
			</>

		)
	}
}


export  class NumberInput extends Component {

	constructor(props){
		super(props);
		this.state = {
			focus: false,
		}
	}

	setFocus( bool ){
		this.setState({ focus : bool })
	}

	onChange(v){
		const { max, min } = this.props;
			if ( v !== 0  && ! isNaN(v)  ){
				if ( max && min ){
					if ( v <= max && v >= min  ){
						this.props.onChange(v);
					}
				}else{
					this.props.onChange(v);
				}
		}else if ( ! isNaN(v) ){
			this.props.onChange(v);
		}
	}

	render(){
		const { label, value, errors=[], className='' , max='', min='' } = this.props;
		const has_errors = errors.length;
		return(
			<>
				<div className={ `text-field focus${ has_errors  ? ' errors focus':'' }${ className ? ` ${className}`:'' }` } >
					<label>{ label }</label>
					<input type="text" value = { value }
						   max={max} min={min}
						   onChange = { ( e ) => this.onChange( Number(e.target.value) )  }
						   onFocus  = { () => this.setFocus( true )  }
						   onBlur = { () => this.setFocus( false ) }
					/>

					<i
					   title="Increment"
					   onClick = { ( e ) => this.onChange( Number(value + 1) )  }
					   className="clear fa fa-plus-square"  />
				 <i
					   title="Decrement"
					   onClick = { ( e ) => this.onChange( Number(value - 1) )  }
					   className="clear fa fa-minus-square"  />
				</div>
				<Errors errors={errors} />
			</>

		)
	}
}

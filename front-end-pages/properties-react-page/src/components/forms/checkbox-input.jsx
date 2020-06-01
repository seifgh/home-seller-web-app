import React , { Component } from 'react';

import './checkbox-input-styles.css';



export  class CheckboxInput extends Component {


	toggleCheck(){
		this.props.onChange( ! this.props.is_checked );
	}

	render(){
		const { text, is_checked } = this.props;
		return(
			<div className={`checkbox${ is_checked ? ' checked':''}`}>
				<i onClick={ () => this.toggleCheck() } className={`fas fa-${ is_checked ? 'check-square':'square'}`}/>
				<div className="text">{text}</div>
			</div>
		)
	}
}

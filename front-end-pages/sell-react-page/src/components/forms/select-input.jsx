import React , { Component } from 'react';

import './select-input-styles.css';

import Errors from './errors';


export  class SelectInput extends Component {

	constructor(props){
		super(props);
		this.state = {
			show_options : false,
		}
	}

	showOptions(){
		this.setState({
			show_options : ! this.state.show_options
		})
	}

	selectOption( id ){
		this.setState({
			show_options : false
		});
		this.props.onChange( id );
	}
	handleDocumentClick(e){
		if (this.state.show_options && !e.target.classList.contains('_op_')){
			this.setState({
				show_options: false
			})
		}

	}
	componentDidMount(){
		document.addEventListener(
			'click',
			this.handleDocumentClick.bind(this)
		)
	}



	render(){
		const { label, options, errors=[]  } = this.props;
		const { show_options } = this.state;
		const selected = options.filter( op => op.is_selected === true  );
		const is_selected = selected.length > 0;
		const has_errors = errors.length;
		return(
			<>
				<div onClick={ () => this.showOptions() } className={`select-field _op_ ${is_selected  ? ' selected':''}${ show_options ? ' focus':''}${ has_errors ? ' errors':'' } `}>
					<label className="_op_" >{label}</label>
					<div className="selected _op_">{ is_selected ? selected[0].value:'' } </div>
					<div  className={`options _op_${ show_options ? '':' hide'}`}>
						{options.map( op => (
							<div className={ op.is_selected ? 'selected _op_':'_op_' }  key={op.id} onClick={ () => this.selectOption( op.id ) } > {op.value} </div>
						))}
					</div>
					<i title="clear"
					   className={`icon fas fa-caret-down _op_`}  />
				</div>

				<Errors errors={errors} />
			</>
		)
	}
}

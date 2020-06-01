import React, {Component} from 'react';

import './image-styles.css';

class Image extends Component{

	state = {
		loaded : false,
		error: false
	}

	handleLoad(){
		this.setState({ loaded: true })
	}
	handleError(){
		this.setState({  error: true })
	}

	componentDidMount(){
	}

	Loading( loaded ){
		return loaded ?
			null:
			<div className="anim-container" ></div>
	}

	render(){
		const { error,  loaded } = this.state;
		if ( error ){
			return null
		}
		return(
			<div style={{ height: '100%', width: '100%' }} >
				{ this.Loading( loaded ) }
				<img style={{ opacity: loaded ? 1:0 }} alt={this.props.alt || ''} src={this.props.src} onLoad={ () => this.handleLoad() }  onError={ () => this.handleError() } />
			</div>
		)

	}

}
export default Image

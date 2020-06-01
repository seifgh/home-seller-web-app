import React , { useState, useContext } from 'react';
import { GlobalContext } from './../../../state-manager/globalState';
import ContactAgent from './ContactAgent';


function PropertyInfoContact(){


	const {
		property, is_authenticated,
		addPropertyToBookmarks, removePropertyFromBookmarks,
		setNotifySubject } = useContext(GlobalContext),
	{data, is_bookmarked} = property,
	[ show_form, setShowForm ] = useState(false);

	function handleBookmarkClick(){
		if ( ! is_authenticated ){
			return setNotifySubject('bookmarks')
		}
		if ( is_bookmarked ){
			removePropertyFromBookmarks();
		}else{
			addPropertyToBookmarks();
		}

	}


	const {
		 name, price, bookmarks_count, bedrooms_number,
		 bathrooms_number, is_furnished,
		 location, description
	} = data;
	// Rendering
	return(
		<div className="part-2">
				<h2 className="title">{name}</h2>
				<p className="description" >{description}</p>

				<h3 className="price" > {price} </h3>
				<span className="icon-text ellipsis" > <i className="fas fa-map-marker-alt"></i> {location.full_city} </span>
				{
					is_furnished ? (<span className="icon-text"  ><i className="fas fa-couch"></i> furnished</span>):(null)
				}
				<span className="icon-text" > <i className="fas fa-bed"></i> {bedrooms_number} </span>
				<span className="icon-text" > <i className="fas fa-bath"></i> {bathrooms_number} </span>

				<span className="icon-text" > <i className={`${ bookmarks_count > 0 ? 'fas':'far' } fa-bookmark`}></i> {bookmarks_count} </span>

				<div className="btns">
					<button onClick={() => handleBookmarkClick()} className="btn-outline-primary icon-only hg" > <i className={`${ is_bookmarked ? 'fas':'far' } fa-bookmark`}></i> </button>

					<button onClick={ () => setShowForm(true) }  className="btn-primary btn-full hg" >Contact agent<i className="fa fa-arrow-right right"></i> </button>
				</div>

				<ContactAgent
					display={show_form}
					setDisplay={setShowForm} />

		</div>
	)

}

export default PropertyInfoContact;

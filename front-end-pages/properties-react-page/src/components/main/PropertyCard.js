import React from 'react';
import {
  Link,
} from "react-router-dom";
import { REACT_ROUTERS_URLS } from './../../Settings';
//components
import Image from './../utils/Image';

function RemoveBtn({onRemove, display}){

  if ( display ){
    function handleRmove(e){
      e.preventDefault();
      onRemove();
    }
    return (
      <button title="Remove" onClick={(e) => handleRmove(e)} className="remove-btn">
			   <i className="fas fa-times"></i>
			</button>
    )
  }
  return null;
}

function PropertyCard({
  prevLinkPathOnly,
  id, name, price, image, property_type,
  bedrooms_number, bathrooms_number,
  is_furnished, location,
  with_remove_btn = false,
  onRemove
}){

	// Rendering
	return(
		<Link to={`${REACT_ROUTERS_URLS.property}/${id}`} className="card-1" >
			<div className="image">
				<Image src={image.src} />
			</div>
			<div className="details">
        <h3 className="name ellipsis" > {name} </h3>
				<h3 className="price" >{price}</h3>
				<span className="ellipsis" > <i className="fas fa-map-marker-alt"></i> {location} </span>
				{
					is_furnished ? (<span><i className="fas fa-couch"></i>Furnished</span>):(null)
				}
				<span> <i className="fas fa-bed"></i> {bedrooms_number} </span>
				<span> <i className="fas fa-bath"></i> {bathrooms_number} </span>

        <RemoveBtn onRemove={onRemove} display={with_remove_btn} />
			</div>
		</Link>
	)

}
export default PropertyCard;
// <a className="location"><i className="fas fa-location-arrow"></i></a>

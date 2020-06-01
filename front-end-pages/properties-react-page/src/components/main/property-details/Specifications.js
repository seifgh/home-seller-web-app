import React  from 'react';




function Specifications( {className="infos", data} ){

	// Rendering
	const {
		price, bedrooms_number, bathrooms_number, is_furnished,
		location, property_type, build_year,
		has_heating_and_colling, floor_space
	} = data;

	return(
			<div className={className}>
				<div className="table-2">
					<div className="line">
						<span> <small>Price</small> </span>
						<span> <small>{price}</small> </span>
					</div>
					<div className="line">
						<span> <small> Location </small> </span>
						<span> <small> {location.full_location} </small> </span>
					</div>
					<div className="line">
						<span> <small>Floor space</small> </span>
						<span> <small>{floor_space} sqft</small> </span>
					</div>
					<div className="line">
						<span> <small>furnished</small> </span>
						<span> <small>{ is_furnished ? 'Furniture included':'Furniture not included' }</small> </span>
					</div>
					<div className="line">
						<span> <small>Bedrooms</small> </span>
						<span> <small>{ bedrooms_number }</small>  </span>
					</div>
					<div className="line">
						<span> <small>Bathrooms</small> </span>
						<span> <small>{ bathrooms_number }</small>  </span>
					</div>
					<div className="line">
						<span> <small>Type</small> </span>
						<span> <small>{ property_type }</small> </span>
					</div>
					<div className="line">
						<span> <small>Heating/Cooling</small> </span>
						<span> <small>{ has_heating_and_colling ? 'Heating/Cooling included':'Heating/Cooling not included' }</small> </span>
					</div>

					<div className="line">
						<span> <small>Build year</small> </span>
						<span> <small>{ build_year }</small> </span>
					</div>
				</div>
			</div>

	)
}

export default Specifications;

import React , { useEffect, useContext } from 'react';
import {
	useParams,
} from "react-router-dom";


import { GlobalContext } from './../../state-manager/globalState';

// Components
import NoDataFound from './../errors/NoDataFound';
import RequestLost from './../errors/RequestLost';
import PropertyCard from './PropertyCard';
import PropertyAllInfo from './property-details/PropertyAllInfo';
import PropertyInfoContact from './property-details/PropertyInfoContact';


function PropertyDetails(props) {

	const { fetchSetProperty, property } = useContext(GlobalContext);
	const  {ID} = useParams();

	useEffect(()=>{
		if (Number(ID) !== property.data.id || property.has_error ){
			fetchSetProperty(ID);
		}
		window.scrollTo(0,0);
	},[ID])

	const { suggestions, has_error,  is_loading, not_found } = property;
	// Rendering
	if (is_loading){
		return(
			<section className="section-3" >
				<div className="card-3 loading">
					<span className="part-1-ld" ></span>
					<span className="part-2-ld" >
						<span className="line-ld md" ></span>
						<span className="line-ld hg" ></span>
						<span className="lines-container-ld" >
							<span className="line-ld rd sm" ></span>
							<span className="line-ld rd sm" ></span>
							<span className="line-ld rd sm" ></span>
							<span className="line-ld rd sm" ></span>
							<span className="line-ld rd sm" ></span>
						</span>
						<span className="lines-container-ld" >
							<span className="line-ld sm md" ></span>
							<span className="line-ld md" ></span>
						</span>
					</span>
				</div>
			</section>
		)
	}
	if ( has_error ){
		return not_found ? <NoDataFound message="Property not found." /> : <RequestLost />
	}


	return(
		<div>
			<section className="section-3" >

				<div className="card-3">
					<PropertyAllInfo />
					<PropertyInfoContact />
				</div>
			</section>
			<section className="section-2" >
				<h1 className="sec-title" >{`${suggestions.length === 0 ? 'No ':'' }Related suggestions`}</h1>
				<div className="container">
					{suggestions.map( property =>(
						<PropertyCard  key={property.id} {...property} />
					))}
				</div>
			</section>
		</div>
	)


}

export default PropertyDetails;

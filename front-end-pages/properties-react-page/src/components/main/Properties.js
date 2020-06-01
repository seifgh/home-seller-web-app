import React , { useEffect, useContext, useRef } from 'react';
import { GlobalContext } from './../../state-manager/globalState';
import NoDataFound from './../errors/NoDataFound';
import RequestLost from './../errors/RequestLost';
import PropertyCard from './PropertyCard';

function Properties(){

	const {
		properties, fetchSetProperties, filters,
		setFiltersFromUrl
	} = useContext(GlobalContext);
	const { data, has_error, has_next, is_loading } = properties;
	const is_first_call = useRef(true);


	useEffect(() => {
		if ( is_first_call.current ){
			if (!data.length){
				// set filters from url if it is the first call
				setFiltersFromUrl();
			}
			is_first_call.current = false;
		}else{
			window.scrollTo(0,0);
			fetchSetProperties(true);
		}
	}, [filters]);

	useEffect(() => {
		// for filters back
		window.addEventListener('popstate', setFiltersFromUrl);
		return () => {
			window.removeEventListener('popstate', setFiltersFromUrl);
		}
	}, [])

	// rendering
	if (has_error){
		return <RequestLost />
	}

	if (data && data.length === 0 && ! is_loading){
		return <NoDataFound message="Edit or remove these filters to get better result." />
	}

	return(
		<section className="section-2" >
			<div className="container">
				{data.map( property =>(
					<PropertyCard key={property.id} {...property} />
				))}
			</div>
			<div className="container">
				<button
					disabled={is_loading}
					onClick={() => fetchSetProperties()}
					className={`btn-primary${has_next ? '' : ' hide'}${is_loading ? ' loading' : ''}`}
				>
					{ is_loading ? 'Loading ...' : 'Load more' }
				</button>
			</div>
		</section>
	)

}
export default Properties;

import React from 'react';
// import GoogleMapReact from 'google-map-react';


function GoogleMap({ className="", map }){
	const { latitude, longitude } = map;
	return(
		<iframe title="Property location" className={className} src={`https://maps.google.com/maps?q=${latitude}, ${longitude}&output=embed`}  frameBorder="0" allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>
	)
}

export default GoogleMap;

import React from 'react';
// import GoogleMapReact from 'google-map-react';


function GoogleMap({ className="", address }){

	return(
		<iframe title={address} className={className} src={`https://maps.google.com/maps?q=${address}&output=embed`}  frameBorder="0" allowFullScreen="" ariaHidden="false" tabIndex="0" />
	)
}

export default GoogleMap;

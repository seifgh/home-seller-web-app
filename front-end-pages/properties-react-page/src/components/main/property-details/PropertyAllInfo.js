import React , { useContext } from 'react';
import { GlobalContext } from './../../../state-manager/globalState';
import NavTabs from './../../utils/NavTabs';
import Image from './../../utils/Image';
import Swiper from './../../utils/Swiper';
import GoogleMap from './../../utils/GoogleMap';

import Specifications from './Specifications';





function PropertyAllInfo() {

  const { data } = useContext(GlobalContext).property;

	// NavTabs component settings
	const navTabsSettings = {
		links: [
			<button className="btn" key={1} ><i className="fa fa-image"/>Photos</button>,
			<button className="btn" key={2} ><i className="fa fa-map-marked-alt"/>Map</button>,
			<button className="btn" key={3} ><i className="fa fa-info"/>Specifications</button>
		],
	}
	const { images, location} = data;
  // Rendering
	return(
		<NavTabs className="nav-tabs-1 part-1" {...navTabsSettings}>
			<Swiper className="image-swiper" key={1} >
				{images.map( ({id, src}) =>(
					<div key={id} className="image">
						<Image src={src} />
					</div>
				))}
			</Swiper>
			<GoogleMap className="map" key={2} map={location} />
			<Specifications className="infos" key={3} data={data} />

		</NavTabs>
	)
}

export default PropertyAllInfo;

export const PRODUCTION = true;

export const BACKEND_SERVER = PRODUCTION ? '' : 'http://127.0.0.1:8000';
export const HOME_PAGE_URL = `${BACKEND_SERVER}/`;

// Backend urls
export const WEB_API_URLS = {

	countries: `${BACKEND_SERVER}/sell/api/countries`,
	states: `${BACKEND_SERVER}/sell/api/states`,
	cities: `${BACKEND_SERVER}/sell/api/cities`,

	post_property: `${BACKEND_SERVER}/sell/api/post-property`,
	authentication: `${BACKEND_SERVER}/user/api/auth`,

}

// Frontend urls
export const REACT_ROUTERS_URLS = {
	sell_property: '/sell/property',
}

export const MIN_PRICE = 50000;
export const MAX_PRICE = 2000000;

export const MIN_SQUARE_FEET = 50;
export const MAX_SQUARE_FEET = 2000;

export const MIN_BUILD_YEAR = 1900;
export const MAX_BUILD_YEAR = (new Date()).getFullYear();

export const ALLOWED_IMG_EXTENTIONS = ["image/jpeg", "image/png"];

export const PROPERTY_TYPE_OPTIONS = [
		{id: 1, value: 'Houses', icon_class_name: 'fa fa-hotel', code: 'hs', is_selected: true},
		{id: 2, value: 'Manufactured', icon_class_name: 'fa fa-industry', code: 'ma', is_selected: false},
		{id: 3, value: 'Multi-family', icon_class_name: 'fa fa-home', code: 'mf', is_selected: false},
		{id: 4, value: 'Apartment', icon_class_name: 'fa fa-building', code: 'ap', is_selected: false},
		{id: 5, value: 'Lots/Land', icon_class_name: 'fa fa-map', code: 'll', is_selected: false},
		{id: 6, value: 'Townhomes', icon_class_name: 'fa fa-city', code: 'th', is_selected: false}
];

export const PROPERTY_INCLUDES_OPTIONS = [
		{id: 1, value: 'Furnisher', icon_class_name: 'fa fa-couch', code: 'is_furnished', is_selected: false},
		{id: 2, value: 'Heating/Cooling', icon_class_name: 'fa fa-snowflake', code: 'has_heating_and_colling', is_selected: false},
		{id: 3, value: 'Swimming pool', icon_class_name: 'fa fa-swimming-pool', code: 'has_swimming_pool', is_selected: false},

];

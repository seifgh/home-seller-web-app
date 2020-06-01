export const PRODUCTION = true;

export const BACKEND_SERVER = PRODUCTION ? '' : 'http://127.0.0.1:8000';
export const HOME_PAGE_URL = `${BACKEND_SERVER}/`;

// Backend routers
export const WEB_API_URLS = {
	properties:  `${BACKEND_SERVER}/properties/api/properties`,
	property: `${BACKEND_SERVER}/properties/api/property`,
	search: `${BACKEND_SERVER}/properties/api/search/locations`,
	contact: `${BACKEND_SERVER}/properties/api/contact/property`,
	add_to_bookmarks: `${BACKEND_SERVER}/properties/api/bookmarks/add`,
	remove_from_bookmarks: `${BACKEND_SERVER}/properties/api/bookmarks/remove`,
	bookmarks: `${BACKEND_SERVER}/properties/api/bookmarks`,

	authentication: `${BACKEND_SERVER}/user/api/auth`,

}

export const REACT_ROUTERS_URLS = {
	properties: `/properties`,
	property: '/properties/property',
	search: '/properties/search',
	bookmarks: '/properties/bookmarks',
	account_edit: '/user/account/edit',
	sell_property: '/sell/property/1',
	sign_in: '/user/signin',
	sign_up: '/user/signup',

}


// Components constants
export const SORTS_BY = [
		{id: 1, value: 'price ( Low to High )', query_value: 'pa'},
		{id: 2, value: 'price ( High to Low )', query_value: 'pd'},
		{id: 3, value: 'Newest', query_value: 'nw'},
		{id: 4, value: 'Bedrooms', query_value: 'bd'},
		{id: 5, value: 'Bathrooms', query_value: 'bt'},
		{id: 6, value: 'Square Feet', query_value: 'sf'}
];

export const MIN_PRICE = 50000;
export const MAX_PRICE = 2000000;

export const MIN_SQUARE_FEET = 50;
export const MAX_SQUARE_FEET = 2000;

export const PROPERTY_TYPE_OPTIONS = [
		{id: 1, value: 'Any', query_value: 'any'},
		{id: 2, value: 'Houses', query_value: 'hs'},
		{id: 3, value: 'Manufactured', query_value: 'ma'},
		{id: 4, value: 'Multi-family', query_value: 'mf'},
		{id: 5, value: 'Apartment', query_value: 'ap'},
		{id: 6, value: 'Lots/Land', query_value: 'll'},
		{id: 7, value: 'Townhomes', query_value: 'th'}
];

export const BED_BATH_ROOMS = [
	{ id: 1, value: 'Any', query_value: 'any'},
	{ id: 2, value: '1 room & up', query_value: '1'},
	{ id: 3, value: '2 rooms & up', query_value: '2'},
	{ id: 4, value: '3 rooms & up', query_value: '3'},
	{ id: 5, value: '4 rooms & up', query_value: '4'},
	{ id: 6, value: '5 rooms & up', query_value: '5'}
]

export const SHOULD_HAS_OPTIONS = [
	{ id: 1, value: 'Swimming pool', query_value: 'sp'},
	{ id: 2, value: 'Furniture', query_value: 'fu'},
	{ id: 3, value: 'Heating / Cooling', query_value: 'hc'},
	{ id: 4, value: 'Garage', query_value: 'ga'}
]

export const ACCOUNT_ACTIONS = [
	{id: 1, value: 'Sign out from other devices', query_value: 'sign_out'},
	{id: 2, value: 'Delete your account', query_value: 'delete'},
]

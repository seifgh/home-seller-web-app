export const PRODUCTION = true;

export const BACKEND_SERVER = PRODUCTION ? '' : 'http://127.0.0.1:8000';
export const HOME_PAGE_URL = `${BACKEND_SERVER}/`;

// Backend urls
export const WEB_API_URLS = {
	search: `${BACKEND_SERVER}/properties/api/search/locations`,
	authentication: `${BACKEND_SERVER}/user/api/auth`,
	account_settings: `${BACKEND_SERVER}/user/api/settings`,
}

// Frontend urls
export const REACT_ROUTERS_URLS = {
	properties: `/properties`,
	search: '/properties/search',
	bookmarks: '/properties/bookmarks',

	account: '/user/account',
	account_edit: '/user/account/edit',
	account_actions: '/user/account/actions',
	account_password: '/user/account/password',

	sell_property: '/sell/property/1',
	sign_in: '/user/sign_in',
	sign_up: '/user/sign_up',
}


// Components constants
export const ACCOUNT_ACTIONS = [
	{id: 1, value: 'Sign out from other devices', query_value: 'sign_out'},
	{id: 2, value: 'Delete your account', query_value: 'delete'},
]

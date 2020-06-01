export const PRODUCTION = true;

export const BACKEND_SERVER = PRODUCTION ? '' : 'http://127.0.0.1:8000';
export const HOME_PAGE_URL = `${BACKEND_SERVER}/`;

export const BACKEND_USER_API =  `${BACKEND_SERVER}/user/api`;

// Backend routers
export const WEB_API_URLS = {
	authentication:  `${BACKEND_USER_API}/auth`,
	signin:  `${BACKEND_USER_API}/auth/signin`,
  signup: `${BACKEND_USER_API}/signup`,
  activate: `${BACKEND_USER_API}/activate`,
	reset: `${BACKEND_USER_API}/reset`
}

export const REACT_ROUTERS_URLS = {
	sign_in: `/user/signin`,
	sign_up: '/user/signup',
	password:{
    reset: '/user/reset',
    update: '/user/reset/update'
  },
}

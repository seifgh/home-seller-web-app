export const PRODUCTION = true;

export const BACKEND_SERVER = PRODUCTION ? '' : 'http://127.0.0.1:8000';

export const WEB_API_URLS = {
  search: `${BACKEND_SERVER}/properties/api/search/locations`,
  authentication: `${BACKEND_SERVER}/user/api/auth`,
}
export const REACT_ROUTERS_URLS = {
  properties: `/properties`,
  property: '/property',
  search: '/search',
}

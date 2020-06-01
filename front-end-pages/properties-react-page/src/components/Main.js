import React , { useContext, useEffect } from 'react';
import { GlobalContext } from './../state-manager/globalState';

import {
  Route,
  Switch,
} from "react-router-dom";
import { REACT_ROUTERS_URLS } from './../Settings';
import Filters from './main/Filters';
import Properties from './main/Properties';
import PropertyDetails from './main/PropertyDetails';
import Bookmarks from './main/Bookmarks';
import Search from './main/Search';
import Notify from './main/Notify';
import Loading from './Loading';


function Main() {
  const {user, notify_subject, setCheckUserAuthentication} = useContext(GlobalContext);
  useEffect(() => setCheckUserAuthentication(), []);
  // just for waiting until checking the user authentication
  if ( user.is_loading ){
    return <main> <Loading messages={['Welcome to ws-houses', 'Please wait this process takes time.']} /> </main>;
  }
	return(
		<main>

      <Route exact={true} path={`${REACT_ROUTERS_URLS.property}/:ID`}>
        <PropertyDetails />
      </Route>
			<Route exact={true} path={REACT_ROUTERS_URLS.properties} >
				<Filters />
				<Properties />
			</Route>
      <Route exact={true} path={REACT_ROUTERS_URLS.search} >
        <Search />
      </Route>
      <Route exact={true} path={REACT_ROUTERS_URLS.bookmarks}>
        <Bookmarks />
      </Route>

      <Notify subject={notify_subject} />

		</main>
	)
}

export default Main;

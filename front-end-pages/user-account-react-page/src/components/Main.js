import React , { useContext } from 'react';
import { GlobalContext } from './../state-manager/globalState';
import {
  Route,
} from "react-router-dom";
import { REACT_ROUTERS_URLS } from './../Settings';
import Account from './main/Account';
import Search from './main/Search';
import Notify from './main/Notify';
import Loading from './Loading';


function Main(){
  const {user, notify_subject} = useContext(GlobalContext);

  // just for waiting until checking the user authentication
  if (user.is_loading){
    return <main> <Loading messages={['Welcome to ws-houses', 'Please wait this process takes time.']} /> </main>;
  }
	return(
		<main>
      <Route exact={true} path={ REACT_ROUTERS_URLS.search } >
        <Search />
      </Route>
      <Route path={ `${REACT_ROUTERS_URLS.account}` }>
        <Account />
      </Route>
      <Notify subject={notify_subject} />
		</main>
	)
}

export default Main;

import React, {useContext, useEffect} from 'react';
import { Route } from 'react-router-dom';
import { GlobalContext } from './../state-manager/globalState';
import { REACT_ROUTERS_URLS } from './../settings';
import PostProperty from './PostProperty';
import Loading from './Loading';


function Main(){

  const { setCheckUserAuthentication, user } = useContext(GlobalContext);
  useEffect(() => setCheckUserAuthentication(), []);

  if (user.is_loading){
    return  <Loading messages={['Welcome to ws-houses', 'Please wait this process takes time.']} />
  }
  return(
    <main className="App">
      <Route path={`${REACT_ROUTERS_URLS.sell_property}/:STEP_ID`} >
        <PostProperty />
      </Route>
    </main>
  )
}
export default Main;

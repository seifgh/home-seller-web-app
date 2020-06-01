import React, {useContext, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import './styles/App.scss';
import { GlobalProvider as Provider, GlobalContext } from './state-manager/globalState';
import { REACT_ROUTERS_URLS } from './settings';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PasswordReset from './components/PasswordReset';
import PasswordResetUpdate from './components/PasswordResetUpdate';

function ResponsiveApp(){
  const {updateScreenTypes} = useContext(GlobalContext);
  useEffect(()=>{
    window.addEventListener("resize", updateScreenTypes);
    return () => window.removeEventListener("resize", updateScreenTypes);
  }, []);

  return (
    <div className="App">
      <Route path={REACT_ROUTERS_URLS.sign_in}>
        <SignIn />
      </Route>
      <Route path={REACT_ROUTERS_URLS.sign_up}>
        <SignUp />
      </Route>
      <Route exact path={REACT_ROUTERS_URLS.password.reset}>
        <PasswordReset />
      </Route>
      <Route exact path={`${REACT_ROUTERS_URLS.password.update}/:KEY`}>
        <PasswordResetUpdate />
      </Route>
    </div>
  )
}

function App() {
  return (
    <Provider>
    	<Router>
  	    <ResponsiveApp />
  	  </Router>
    </Provider>
  );
}

export default App;

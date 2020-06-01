import React, {useContext, useEffect} from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import './styles/App.scss';
import { GlobalProvider as Provider, GlobalContext } from './state-manager/globalState';
import Main from './components/Main';


function ResponsiveApp(){
  const {updateScreenTypes} = useContext(GlobalContext);
  useEffect(()=>{
    window.addEventListener("resize", updateScreenTypes);
    return () => window.removeEventListener("resize", updateScreenTypes);
  }, []);

  return <Main />
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

import React, {useContext, useEffect} from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import './styles/App.scss';
import { GlobalProvider as Provider, GlobalContext } from './state-manager/globalState';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';


function ResponsiveApp(){
  const {updateScreenTypes} = useContext(GlobalContext);
  useEffect(()=>{
    window.addEventListener("resize", updateScreenTypes);
    return () => window.removeEventListener("resize", updateScreenTypes);
  }, []);

  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
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

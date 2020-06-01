import React, {useContext, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from './../../state-manager/globalState';

import { REACT_ROUTERS_URLS } from './../../Settings';

function Search(){

  const { search, setSearchKey, fetchSetOptions,
    setFiltersFromUrl, fetchSetProperties
  } = useContext(GlobalContext);
  const timeout = useRef(null);
  const linkBtn = useRef(null);

  function handleKeyUp(){
    // Detect if user stop typing halph second to fetch options
    if ( timeout.current ){
      // clear timeout if user still typing
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => fetchSetOptions(), 500);
  }

  function handleKeyPress(e){
    const code = e.keyCode || e.which;
    // check if user pressed enter or not
    if ( code === 13 ){
      if ( linkBtn.current ){
        linkBtn.current.click();
      }
    }
  }

  function reloadProperties(){
		setFiltersFromUrl();
		fetchSetProperties(true);
	}

  function handleSelectOption(value){
    setSearchKey(value);
    reloadProperties();
  }

  useEffect(()=>{
    window.scrollTo(0,0);
  }, []);


  const { key, options } = search;
  // rendering
  return (
    <div className="search">
        <h1 className="sec-title" >Find the nearest home to you </h1>
        <form onSubmit={(e) => e.preventDefault()} className="form">
          <input onKeyPress={(e) => handleKeyPress(e) } autoFocus={true} onKeyUp={() => handleKeyUp() } onChange={(e)=> setSearchKey( e.target.value )} type="text" value={key} placeholder="Enter an address, neighborhood, city or ZIP code"/>
          <Link onClick={() => reloadProperties()} ref={(btn) => linkBtn.current = btn}  to={`${REACT_ROUTERS_URLS.properties}?sq=${key}`} className="btn icon-only active"><i className="fa fa-search" /></Link>
        </form>
        {
          options &&  options.length ?
          <div className="options">
            {

              options.map( ({id, value}) => (
                <Link onClick={() => handleSelectOption(value)} key={id} to={`${REACT_ROUTERS_URLS.properties}?sq=${value}`}>{value}</Link>
              ))

            }
          </div>
          :null
      }
    </div>
  )
}

export default Search;

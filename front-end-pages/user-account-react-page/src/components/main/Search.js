import React, {useContext, useRef, useEffect} from 'react';
import { GlobalContext } from './../../state-manager/globalState';
import { REACT_ROUTERS_URLS } from './../../Settings';

function Search(){
  const { search, setSearchKey, fetchSetOptions } = useContext(GlobalContext);
  const timeout = useRef(null);
  const linkBtn = useRef(null);

  function handleKeyUp(){
    // Detect if user stop typing half second to fetch options
    if ( timeout.current ){
      // Clear timeout if user still typing
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => fetchSetOptions(), 500);
  }

  function handleKeyPress(e){
    const code = e.keyCode || e.which;
    // check if he press enter or not
    if ( code === 13 ){
      if ( linkBtn.current ){
        linkBtn.current.click();
      }
    }
  }

  useEffect(()=>{
    window.scrollTo(0,0);
  }, []);

  // rendering
  const { key, options } = search;
  return (
    <div className="search">
        <h1 className="sec-title" >Find the nearest home to you </h1>
        <form onSubmit={(e) => e.preventDefault()} className="form">
          <input onKeyPress={(e) => handleKeyPress(e) } autoFocus={true} onKeyUp={() => handleKeyUp() } onChange={(e)=> setSearchKey( e.target.value )} type="text" value={key} placeholder="Enter an address, neighborhood, city or ZIP code"/>
          <a ref={(btn) => linkBtn.current = btn}  href={`${REACT_ROUTERS_URLS.properties}?sq=${key}`} className="btn icon-only active"><i className="fa fa-search" /></a>
        </form>
        {
          options &&  options.length ?
          <div className="options">
            {
              options.map( ({id, value}) => (
                <a onClick={() => setSearchKey(value)} key={id} href={`${REACT_ROUTERS_URLS.properties}?sq=${value}`}>{value}</a>
              ))
            }
          </div>
          :null
      }
    </div>
  )
}

export default Search;

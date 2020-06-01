import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from './../../state-manager/globalState';
import { REACT_ROUTERS_URLS } from './../../Settings';


function HeaderSearch({onClick=()=>null}){
  const { key } = useContext(GlobalContext).search;

  // Rendering
  return (
    <Link onClick={onClick} to={REACT_ROUTERS_URLS.search} className="nav-search">
      <i className="fa fa-search" />
      <small className="ellipsis" >{key || 'Search location'}</small>
    </Link>
  )

}

export default HeaderSearch;

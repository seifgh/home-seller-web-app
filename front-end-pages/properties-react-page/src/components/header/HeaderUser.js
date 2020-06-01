import React , {  useContext } from 'react';
import { GlobalContext } from './../../state-manager/globalState';
import { NavLink } from 'react-router-dom';


import { REACT_ROUTERS_URLS } from './../../Settings';

import USER_IMG from './../../images/user.png';

function HeaderUser(){
  const {is_authenticated, user, signOut, screen_types} = useContext(GlobalContext);
  // check user authentication
  const {is_desktop, is_laptop} = screen_types;
  const { is_loading } = user;

  if ( is_loading ){
    return <div className="right-links" />;
  }
  if ( is_authenticated ){
    return(
      <>
        <div className="dropdown user">
          <div className="drop-show card-user" href="/" >
            <div className="image">
              <img alt="user" src={USER_IMG} />
            </div>
          </div>
          <div className="options vert">
            <a href={REACT_ROUTERS_URLS.account_edit} ><i className="fa fa-user"></i>My account</a>
            <NavLink activeClassName="active" to={REACT_ROUTERS_URLS.bookmarks} ><i className="fa fa-bookmark"></i>Bookmarks</NavLink>
            <a onClick={()=>signOut()} href="#logout" ><i className="fa fa-arrow-left"></i>Sign out</a>
          </div>
        </div>
      </>
    )
  }
  return(
    <div className="right-links">
        <a href={REACT_ROUTERS_URLS.sign_in} className="btn-light">Sign in</a>
        { is_desktop || is_laptop ?
          <a href={REACT_ROUTERS_URLS.sign_up} className="btn-primary">Sign up</a>
          : null
        }
    </div>
  )
}

export default HeaderUser;

import React , { useContext } from 'react';
import { GlobalContext } from './../../state-manager/globalState';
import {
  NavLink,
  Route,
} from "react-router-dom";
import { REACT_ROUTERS_URLS } from './../../Settings';
import USER_IMG from './../../images/user.png';
import Edit from './account/Edit';
import Password from './account/Password';
import Actions from './account/Actions';

function Account(){
  const { user } = useContext(GlobalContext);
  const { full_name, email, joined } = user;
  return(
    <section className="section-1">
        <div className="card-user hg">

          <div className="image">
            <img alt="user" src={USER_IMG} />
          </div>
          <div className="details">
            <h2 className="name ellipsis" >{full_name}</h2>
            <small className="ellipsis" >{email}</small>
            <small>Joined in {joined}</small>
          </div>

        </div>
        <div className="nav-tabs-1">
          <div className="links">
            <NavLink activeClassName="active" className="btn" to={`${REACT_ROUTERS_URLS.account_edit}`} ><i className="fa fa-pen"/>Edit</NavLink>
            <NavLink activeClassName="active" className="btn" to={`${REACT_ROUTERS_URLS.account_password}`} ><i className="fa fa-key"/>Password</NavLink>
            <NavLink activeClassName="active" className="btn" to={`${REACT_ROUTERS_URLS.account_actions}`} ><i className="fa fa-user-circle"/>Account</NavLink>
          </div>
          <div className="elements">

            <Route exact={true} path={REACT_ROUTERS_URLS.account_edit}>
              <Edit />
            </Route>
            <Route path={REACT_ROUTERS_URLS.account_password}>
              <Password />
            </Route>
            <Route path={REACT_ROUTERS_URLS.account_actions}>
              <Actions />
            </Route>

          </div>
        </div>

    </section>
  )
}

export default Account;

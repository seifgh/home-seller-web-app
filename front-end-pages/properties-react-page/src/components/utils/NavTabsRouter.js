import React , { useEffect, useRef } from 'react';
import {
  NavLink
  Route,
} from "react-router-dom";

function NavTabs({links, children, className=""}){

	return (
		<div className={className} >
			<div className="links">
				{
          links.map(({to , icon, name, className=''}, i)=>{
              return icon ?
              <NavLink key={i} activeClassName="active"  className={className}><i className={icon}  />{name}</NavLink>
              :<NavLink key={i} activeClassName="active"  className={className}>{name}</NavLink>
          })
        }
			</div>
			<div className="elements">
				{
          children.map((Child, i) =>(
            <Route key={i} path={links[i].to} >
              <Child />
            </Route>
          ))
        }
			</div>
		</div>
	)
}

export default NavTabs;

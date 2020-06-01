import React, {useContext, useState} from 'react';
import HeaderSearch from './header/HeaderSearch';
import HeaderUser from './header/HeaderUser';
import logo from './../images/logo.png';
import { GlobalContext } from './../state-manager/globalState';
import {REACT_ROUTERS_URLS, HOME_PAGE_URL} from './../Settings';

function Header() {
	const { is_desktop, is_laptop} = useContext(GlobalContext).screen_types;
	const [ show_menu, setShowMenu ] = useState(false);

	if ( is_desktop || is_laptop){
		return(
			<header>
				<nav className="active" >
					<a href="/" className="logo" >
						<img alt="logo" src={logo} />
					</a>
					<div className="links">
						<a className="link" href="/">Home</a>
						<a className="link" href={REACT_ROUTERS_URLS.properties}  >Properties</a>
						<a className="link" href={REACT_ROUTERS_URLS.sell_property}  >Sell your home</a>
					</div>
					<div className="right-links">
						<HeaderSearch />
						<HeaderUser />
					</div>
				</nav>
			</header>
		)
	}
	return(
		<header>
			<nav className="active" >
				<button onClick={ () => setShowMenu(!show_menu) } className={`menu${ show_menu ? ' active' : ''}`} ><i className="fa fa-bars"/></button>
				<a href="/" className="logo" >
					<img alt="logo" src={logo} />
				</a>
				<HeaderUser />
			</nav>
			<div className={`links${show_menu ? ' show' : ''}`}>
				<HeaderSearch onClick={() => setShowMenu(false)} />
				<a className="link"  href="/">Home</a>
				<a onClick={() => setShowMenu(false)} className="link" href={REACT_ROUTERS_URLS.properties}>Properties</a>
				<a  className="link" href={REACT_ROUTERS_URLS.sell_property}>Sell your home</a>
				<a  className="link" href={REACT_ROUTERS_URLS.sign_up}>Sign up</a>
			</div>
		</header>
	)

}

export default Header;

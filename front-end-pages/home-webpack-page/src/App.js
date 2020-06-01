import '@babel/polyfill';

import axios from 'axios';
import './styles/App.scss';


import {
	BACKEND_SERVER,
	WEB_API_URLS,
	REACT_ROUTERS_URLS,
} from './settings';

import {AuthToken, animateElementsWhileScrolling} from './utils';


function checkUserAuthentication(){
  const user = document.getElementById("user");
  const auth_links = document.getElementById("auth-links");
	const menuLinks = document.getElementById("menu-links");
  // show user data and links in html if user is authenticted
  function showUserHeader(){
    user.classList.remove('hide');
    menuLinks.querySelector('.sign-up').remove();
    auth_links.remove();
  }
  // show authentiction links if user is not authenticted
  function showAuthLinksHeader(){
    auth_links.classList.remove('hide');
    if ( window.innerWidth <= 768 ){
      auth_links.querySelector('.sign-up').remove();
    }
    user.remove();
  }

  if (! AuthToken.getToken()){
    return showAuthLinksHeader();
  }

  axios.get(WEB_API_URLS.authentication, {headers: AuthToken.getHeader()})
  .then(({data})=>{
		AuthToken.setToken(data.token_key);
    showUserHeader(data);
  })
  .catch((err)=>{
    showAuthLinksHeader();
  })

}

function header(){
  const menuBtn = document.getElementById('menu-btn');
  const menuLinks = document.getElementById('menu-links');
  menuBtn.addEventListener('click', function(){
    menuBtn.classList.toggle('active');
    menuLinks.classList.toggle('show');
  })
  const signOut = document.getElementById('sign-out');
  if (signOut){
    signOut.addEventListener('click', function(){
      AuthToken.setToken('');
      document.location.reload();
    })
  }
}

function swipers(){
  const swipers = document.querySelectorAll("[swiper]");

  swipers.forEach( ( swiper ) => {

    const el = swiper.querySelector("[scroll]");
    const leftBtn = swiper.querySelector("[left]");
    const rightBtn = swiper.querySelector("[right]");

    //handle right click
    rightBtn.onclick = () => {
      rightBtn.disabled = true
      el.scrollTo({
        left: el.scrollLeft +  el.clientWidth,
        behavior: 'smooth'
      });
      setTimeout( () => rightBtn.disabled = false, 500);
    }
    //handle left click
    leftBtn.onclick = () => {
      leftBtn.disabled = true;
      el.scrollTo({
        left: el.scrollLeft -  el.clientWidth,
        behavior: 'smooth'
      });
      setTimeout( () => leftBtn.disabled = false, 500);
    }
  })
}

function searchProperties(){
  const search_input = document.querySelector("#search input");
  const search_options = document.querySelector('#search .options');

  function setSearchOptions(options){
    // remove all children
    while( search_options.hasChildNodes() ){
      search_options.removeChild(search_options.firstChild);
    }
    // add new children
    options.forEach( op => {
      const link = document.createElement('a');
      const text = document.createTextNode(op.value);
      link.appendChild(text);
      link.setAttribute('href', `${REACT_ROUTERS_URLS.properties}?sq=${op.value}`);
      search_options.appendChild(link);
    });
    // hide or show options
    search_options.className = search_options.hasChildNodes() ? 'options':'options hide';
  }

  function fetchSetOptions(key){
    if ( key ){
  		axios.get(`${WEB_API_URLS.search}?sq=${key}`)
  		.then((res)=>{
  			const data = res.data;
  			setSearchOptions(data.options);
  		})
  		.catch((err)=>{
  			console.log(err);
  		})
    }else{
      setSearchOptions([]);
    }
	}
  let timeout = null;
  function handleKeyUp(e){
    // Detect if user stop typing halph second to fetch options
    if ( timeout ){
      // clear timeout if user still typing
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => fetchSetOptions(e.target.value), 500);
  }
  search_input.addEventListener('keyup',  handleKeyUp );

}

function main(){
  checkUserAuthentication();
  header();
  searchProperties();
	swipers();
	animateElementsWhileScrolling();
};

window.addEventListener('DOMContentLoaded', main);

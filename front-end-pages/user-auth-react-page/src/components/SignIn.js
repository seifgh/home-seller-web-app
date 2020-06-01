import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlobalContext } from './../state-manager/globalState';
import { HOME_PAGE_URL, REACT_ROUTERS_URLS } from './../settings';
import SINGIN_IMG from './../images/signin.svg';
import LOGO_IMG from './../images/logo.png';
import { TextInput, TextPasswordInput } from './forms/text-input';
import Info from './Info';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SignIn(){
  const { sign_in, setSignInField, signIn, screen_types } = useContext(GlobalContext);

  const query = useQuery();


  function handleSubmit(e){
    e.preventDefault();
    const to = query.get('to');
    if ( to ){
      signIn(to);
    }else{
      signIn();
    }
  }

  useEffect(()=>{
    document.title="Home seller | sign in"
  }, [])


  const { email, password, is_loading } = sign_in;
  const from = query.get('from');
  const { is_desktop, is_laptop } = screen_types;
  // rendering
  return (
    <section className="section-1">
      { is_desktop || is_laptop  ?
        <div className="part-1">
          <div className="image">
            <img alt="WShouses" src={SINGIN_IMG} />
          </div>
          <h1 className="title" >Welcome back</h1>

        </div>
        : null
      }
      <div className="part-2">
        <a href={HOME_PAGE_URL} className="logo" >
          <img alt="logo" src={LOGO_IMG} />
        </a>
        <h1 className="title" >Connect to your account</h1>

        <form onSubmit={(e) => handleSubmit(e) } className="form-1" >

          <Info from={from} />

          <div className="field">
            <TextInput errors={email.errors} label="Email" onChange={(v) => setSignInField('email', v)} value={email.value} />
          </div>

          <div className="field last">
            <TextPasswordInput errors={password.errors} label="password" onChange={(v) => setSignInField('password', v)} value={password.value} />
            <Link to={REACT_ROUTERS_URLS.password.reset} >Forgot password ?</Link>
          </div>

          <button className={`btn-primary btn-full hg${is_loading ? ' loading':''}`} > {is_loading ? ' loading...':'Sing in'}</button>
          <small className="parser" ><span>OR</span></small>
          <Link to={REACT_ROUTERS_URLS.sign_up} className="btn-outline-primary btn-full hg" > Sign up </Link>
        </form>
      </div>
    </section>
  )
}

export default SignIn;

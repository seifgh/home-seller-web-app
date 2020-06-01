import React, { useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { GlobalContext } from './../state-manager/globalState';
import { HOME_PAGE_URL, REACT_ROUTERS_URLS } from './../settings';
import SINGUP_IMG from './../images/signup.svg';
import LOGO_IMG from './../images/logo.png';
import { TextInput, TextPasswordInput } from './forms/text-input';

function SignUp(){
  const { sign_up, setSignUpField, signUp, screen_types } = useContext(GlobalContext);

  const { password, email, full_name, password_confirmation, is_loading, is_done } = sign_up;

  function handleSubmit(e){
    e.preventDefault();
    signUp();
  }

  const { is_desktop, is_laptop } = screen_types;

  useEffect(()=>{
    document.title="Home seller | sign up"
  }, [])

  // rendering
  if ( is_done ){
    return <Redirect to={`${REACT_ROUTERS_URLS.sign_in}?from=signup`} />
  }
  return (
    <section className="section-1">

      { is_desktop || is_laptop ?
        <div className="part-1">
          <div className="image">
            <img alt="WShouses" src={SINGUP_IMG} />
          </div>
          <h1 className="title" >Join us</h1>
        </div>
        : null
      }

      <div className="part-2">
        <a href={HOME_PAGE_URL} className="logo" >
          <img alt="logo" src={LOGO_IMG} />
        </a>
        <h1 className="title" >Create your account</h1>

        <form onSubmit={(e) => handleSubmit(e)} className="form-1" >

          <small className="paragraph cr" >Fill out the fields below and get your account</small>

          <div className="field">
            <TextInput errors={full_name.errors} max={50} label="full name" onChange={(v) => setSignUpField('full_name', v)} value={full_name.value} />
          </div>

          <div className="field">
            <TextInput errors={email.errors} label="email" onChange={(v) => setSignUpField('email', v)} value={email.value} />
          </div>

          <div className="field">
            <TextPasswordInput errors={password.errors} max={128} label="password" onChange={(v) => setSignUpField('password', v)} value={password.value} />
          </div>

          <div className="field last">
            <TextPasswordInput errors={password_confirmation.errors} max={128} label="password confirmation" onChange={(v) => setSignUpField('password_confirmation', v)} value={password_confirmation.value} />
            <small className="info" >Password must contain at least 8 characters.</small>
          </div>

          <button className={`btn-primary btn-full hg${is_loading ? ' loading':''}`} > {is_loading ? ' loading...':'Sing Up'}</button>

          <small className="parser" ><span>OR</span></small>
          <Link to={REACT_ROUTERS_URLS.sign_in} className="btn-outline-primary btn-full hg" > Sign in </Link>

        </form>
      </div>
    </section>
  )
}

export default SignUp;

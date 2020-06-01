import React, { useContext, useEffect } from 'react';
import { Link, Redirect  } from 'react-router-dom';
import { GlobalContext } from './../state-manager/globalState';
import {HOME_PAGE_URL, REACT_ROUTERS_URLS} from './../settings';
import RESET_IMG from './../images/reset_password.svg';
import LOGO_IMG from './../images/logo.png';
import { TextInput } from './forms/text-input';

function PasswordReset(){
  const {
     setPasswordResetField, sendVerificationKey,
     password_reset, screen_types
   } = useContext(GlobalContext);

  const { email, is_done, is_loading } = password_reset;

  function handleSubmit(e){
    e.preventDefault();
    sendVerificationKey();
  }

  const { is_desktop, is_laptop } = screen_types;

  useEffect(()=>{
    document.title="Home seller | reset account"
  }, [])

  // rendering
  if ( is_done ){
    return <Redirect to={`${REACT_ROUTERS_URLS.sign_in}?from=passwordreset`} />
  }
  return (
    <section className="section-1">
      { is_desktop || is_laptop  ?
        <div className="part-1">
          <div className="image">
            <img alt="WShouses" src={RESET_IMG} />
          </div>
          <h1 className="title" >Forgot password ?</h1>

        </div>
        : null
      }

      <div className="part-2">
        <a href={HOME_PAGE_URL} className="logo" >
          <img alt="logo" src={LOGO_IMG} />
        </a>

        <h1 className="title" >Reset your password</h1>
        <form onSubmit={(e) => handleSubmit(e)} className="form-1" >
          <small className="paragraph cr" >Enter the email associated with your account and we will send an email with instructions to reset your password.</small>

          <div className="field last">
            <TextInput errors={email.errors} label="Email" onChange={(v) => setPasswordResetField('email', v)} value={email.value} />
          </div>

          <button className={`btn-primary btn-full hg${is_loading ? ' loading':''}`} > {is_loading ? ' loading...':'Send email'}</button>

          <small className="parser" ><span>OR</span></small>
          <Link to={REACT_ROUTERS_URLS.sign_in} className="btn-outline-primary btn-full hg" > Sign in </Link>
        </form>


      </div>
    </section>
  )
}

export default PasswordReset;

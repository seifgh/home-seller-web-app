import React, { useContext, useEffect } from 'react';
import { Link, Redirect, useParams  } from 'react-router-dom';
import { GlobalContext } from './../state-manager/globalState';
import { HOME_PAGE_URL, REACT_ROUTERS_URLS} from './../settings';
import RESET_IMG from './../images/reset_password.svg';
import LOGO_IMG from './../images/logo.png';
import { TextPasswordInput } from './forms/text-input';


function PasswordResetUpdate(){
  const {
    password_reset_update, setPasswordResetUpdateField,
    updatePassword, screen_types
  } = useContext(GlobalContext);
  const { KEY } = useParams();

  function handleSubmit(e){
    e.preventDefault();
    updatePassword(KEY);
  }

  const { is_desktop, is_laptop } = screen_types;

  useEffect(()=>{
    document.title="Home seller | reset account password"
  }, [])

  // rendering
  const { password, password_confirmation, is_done, is_loading } = password_reset_update;
  if ( is_done ){
    return <Redirect to={`${REACT_ROUTERS_URLS.sign_in}?from=passwordresetupdate`} />
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
        <h1 className="title" >Update your password</h1>

        <form onSubmit={(e) => handleSubmit(e)} className="form-1" >

          <small className="paragraph cr" >Please, Fill out the fields below to set new password.</small>

          <div className="field">
            <TextPasswordInput errors={password.errors} label="New password" onChange={(v) => setPasswordResetUpdateField('password', v)} value={password.value} />
          </div>

          <div className="field last">
            <TextPasswordInput errors={password_confirmation.errors} label="Password confirmation" onChange={(v) => setPasswordResetUpdateField('password_confirmation', v)} value={password_confirmation.value} />
          </div>

          <button className={`btn-primary btn-full hg${is_loading ? ' loading':''}`} > {is_loading ? ' loading...':'Update'}</button>

          <small className="parser" ><span>OR</span></small>
          <Link to={REACT_ROUTERS_URLS.sign_in} className="btn-outline-primary btn-full hg" > Sign in </Link>

        </form>

      </div>
    </section>
  )
}

export default PasswordResetUpdate;

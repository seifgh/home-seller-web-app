import React from 'react';

function Info({from}){
  switch (from){
    case 'signup':
      return(
        <div className="container-info active" >
          <small>Please check your email, we will send you an activation link to activate your account.</small>
          <div className="notes">
            <small>This is a demo app, you can sign in now without activation.</small>
          </div>
        </div>
      )
    case 'passwordreset':
      return(
        <div className="container-info active" >
          <small>Please check your email, we will send you a link to change your password.</small>
          <div className="notes">
            <small>This is a demo app, you wouldn't recieve any email.</small><br/>
            <small>Note: The link expired after 1 hour.</small>
          </div>
        </div>
      )
    case 'passwordresetupdate':
      return(
        <div className="container-info active" >
          <small>Your password change was successful, you can now connect to your account.</small>
        </div>
      )
    case 'activate':
      return(
        <div className="container-info active" >
          <small>Please check your email, we will send you an activation link to activate your account.</small>
        </div>
      )
    default: return null
  }
}


export default Info;

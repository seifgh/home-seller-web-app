import React from 'react';


function Notify({subject}){

  switch (subject){
    case 'offline':
      return(
        <div className="container-info notify" >
          <small>Oops, looks like you are offline please check your connection.</small>
        </div>
      )
    case 'bookmarks':
      return(
        <div className="container-info notify" >
          <small>Please sign in to add a property to your bookmarks.</small>
          <div className="notes" >
            <small>If you do not have an account just press sign up.</small>
          </div>
        </div>
      )
    case 'full-name-change':
      return(
        <div className="container-info notify" >
          <small>Your full name change was successful.</small>
        </div>
      )
    case 'password-change':
      return(
        <div className="container-info notify" >
          <small>Your password change was successful.</small>
        </div>
      )
    case 'sign-out-all-devices':
      return(
        <div className="container-info notify" >
          <small>All sessions are expired now except this device.</small>
        </div>
      )

    default: return null
  }



}


export default Notify;

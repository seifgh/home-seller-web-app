import React, { useContext, useEffect} from 'react';
import { GlobalContext } from './../../../state-manager/globalState';
import {TextInput, TextPasswordInput} from './../../forms/text-input';

function Edit(){
  const {
    edit_account, editAccount,
    setEditAccountField, user
  } = useContext(GlobalContext);

  function handleSubmit(e){
    e.preventDefault();
    editAccount();
  }
  useEffect( () => setEditAccountField('full_name', user.full_name), [])
  const {password, full_name, is_loading} = edit_account;
  // rendering
  return(
    <form onSubmit={(e) => handleSubmit(e) } className="form-1">

      <div className="field last">
        <TextInput errors={full_name.errors} label="Full name" onChange={(v) => setEditAccountField('full_name', v)} value={full_name.value} />
      </div>

      <div className="container-info" >
        <small>Please, enter your password to make sure is you.</small>
      </div>

      <div className="field last">
        <TextPasswordInput errors={password.errors} label="Password" onChange={(v) => setEditAccountField('password', v)} value={password.value} />
      </div>

      <button disabled={is_loading} className={`btn-primary btn-full btn-flat hg${is_loading ? ' loading':''}`} > {is_loading ? 'Loading...':'update'}</button>

    </form>
  )
}
export default Edit;

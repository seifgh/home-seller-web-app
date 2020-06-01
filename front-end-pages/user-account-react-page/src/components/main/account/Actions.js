import React, {useContext} from 'react';
import { GlobalContext } from './../../../state-manager/globalState';
import { ACCOUNT_ACTIONS } from './../../../Settings.js';
import { TextPasswordInput } from './../../forms/text-input';
import { SelectInput } from './../../forms/select-input';

function Actions(){

  const {
    setAccountActionsField,
    applyAccountActions, account_actions
  } = useContext(GlobalContext);


  function handleSubmit(e){
    e.preventDefault();
    applyAccountActions();
  }

  const { password, is_loading, selected_id } = account_actions;
  // rendering
  return(
    <form onSubmit={(e) => handleSubmit(e) } className="form-1">

      <div className="field last">
        <SelectInput  label="Actions"
          options={ACCOUNT_ACTIONS.map( (ac) =>({...ac, is_selected: ac.id === selected_id }) )}
          onChange={(id)=>setAccountActionsField('selected_id', id)}
        />
      </div>

      <div className="container-info" >
        <small>Please, enter your password to make sure is you.</small>
      </div>

      <div className="field last">
        <TextPasswordInput errors={password.errors} label="Password" onChange={(v) => setAccountActionsField('password', v)} value={password.value} />
      </div>

      {
        selected_id === 2 ?
        <div className="container-info" >
          <small className="bold">Please note, by pressing apply</small>
          <div className="notes">
            <small><li>You will be instantly signed out of your account.</li></small>
            <small><li>You won't be able to sign in again.</li></small>
            <small><li>Your bookmarks will be deleted.</li></small>
          </div>
        </div>
        :
        null
      }

      <button disabled={is_loading} className={`btn-${selected_id === 1 ? 'primary':'danger'} btn-full btn-flat hg${is_loading ? ' loading':''}`} > {is_loading ? 'Loading...':'apply'}</button>

    </form>
  )
}
export default Actions;

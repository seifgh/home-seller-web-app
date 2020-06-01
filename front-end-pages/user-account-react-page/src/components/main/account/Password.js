import React, {useContext} from 'react';
import { GlobalContext } from './../../../state-manager/globalState';
import { TextPasswordInput } from './../../forms/text-input';
import { CheckboxInput } from './../../forms/checkbox-input';

function Password(){

  const {
    account_password,
    setAccountPasswordField, changeAccountPassword
  } = useContext(GlobalContext);

  function handleSubmit(e){
    e.preventDefault();
    changeAccountPassword();
  }
  const {
    password, password_confirmation,
    current_password, sign_out, is_loading
  } = account_password;

  // rendering
  return(
    <form onSubmit={(e) => handleSubmit(e) } className="form-1">
      <div className="field">
        <TextPasswordInput errors={password.errors} label="New password" onChange={(v) => setAccountPasswordField('password', v)} value={password.value} />
      </div>

      <div className="field">
        <TextPasswordInput errors={password_confirmation.errors} label="New password confirmation" onChange={(v) => setAccountPasswordField('password_confirmation', v)} value={password_confirmation.value} />
      </div>

      <div className="field last">
        <CheckboxInput
          text={"Sign out from all other devices."}
          is_checked={ sign_out }
          onChange={(check_or_not) => setAccountPasswordField('sign_out', check_or_not)  }
        />
      </div>

      <div className="container-info" >
        <small>Please, enter your current password to make sure is you.</small>
      </div>

      <div className="field last">
        <TextPasswordInput errors={current_password.errors} label="Current password" onChange={(v) => setAccountPasswordField('current_password', v)} value={current_password.value} />
      </div>

      <button disabled={is_loading} className={`btn-primary btn-full btn-flat hg${is_loading ? ' loading':''}`} > {is_loading ? 'Loading...':'update'}</button>

    </form>
  )
}
export default Password;

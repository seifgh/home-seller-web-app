import React, {useContext, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { REACT_ROUTERS_URLS } from './../../settings';
import { GlobalContext } from './../../state-manager/globalState';
import { TextInput, TextAreaInput } from './../forms/text-input';


function Owner(){

  const {
    owner, images,
    handleOwnerSubmit, setOwnerField,
    is_authenticated, user, setOwner
  } = useContext(GlobalContext);

  useEffect(()=>{
    if ( is_authenticated  ){
      const email = {
        value: owner.email.value || user.email,
        errors: [],
      },
      full_name = {
        value: owner.full_name.value || user.full_name,
        errors: [],
      };
      setOwner({full_name, email, is_done: false});
    }else{
      setOwner({is_done: false});
    }
    window.scrollTo(0,0);
  }, [])

  const { full_name, email, phone, message } = owner;
  if ( images.is_done  ){
    return(
      <>
        <div className="part-full" >
          <div className="form-1">
            <h1 className="title" >Property Owner</h1>
            <p className="pragraph" >Please, full fill all fields to post your property.</p>
            <div className="field">
              <TextInput  errors={full_name.errors} label="Full name" value={full_name.value} onChange={ (value) => setOwnerField( 'full_name', value ) } />
            </div>

            <div className="field">
              <TextInput errors={phone.errors}  label="Phone" value={phone.value} onChange={ (value) => setOwnerField( 'phone', value ) } />
            </div>

            <div className="field">
              <TextInput errors={email.errors}  label="Email" value={email.value} onChange={ (value) => setOwnerField( 'email', value ) } />
            </div>
            <div className="field last">
      				<TextAreaInput className="message"  label="Message (optional)" value={message.value} onChange={ (value) => setOwnerField( 'message', value ) } />
      			</div>

            <div className="btns">
              <Link to={`${REACT_ROUTERS_URLS.sell_property}/4`} className="btn-outline-primary hg right-mr icon-only"><i className="fa fa-arrow-left"></i></Link>
              <Link to={`${REACT_ROUTERS_URLS.sell_property}/6`} onClick={ (e) => handleOwnerSubmit(e) } className="btn-primary btn-full hg">Post property</Link>
            </div>
          </div>
        </div>
      </>
    )
  }
  return <Redirect to={`${REACT_ROUTERS_URLS.sell_property}/4`}  />
}

export default Owner;

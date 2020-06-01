import React, {useContext, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import { GlobalContext } from './../../state-manager/globalState';
import { REACT_ROUTERS_URLS, HOME_PAGE_URL } from './../../settings';
import DONE_IMG from './../../images/order_confirmed.svg';
import REQUEST_LOST_IMG from './../../images/request_lost.svg';
import Loading from './../Loading';



function Type(props){

  const {
    owner, done, postProperty
  } = useContext(GlobalContext);

  useEffect(()=>{
    window.scrollTo(0, 0);
    if (done.is_done){
      function reload(){
        document.location.reload()
      }
      window.addEventListener('popstate', reload);
    }
  },[done.is_done])

  const {full_name} = owner;
  const { is_loading, has_errors } = done;

  // rendering
  if ( owner.is_done ){
    if ( is_loading ){
      return(
        <Loading messages={
          [
            'Cheking data',
            'Uploading images',
            'Saving data' ,
            'Please wait this process takes time.',
          ]
        } />
      )
    }
    if ( has_errors ){
      return(
        <div className="part-full">
          <div className="card-5">
            <h1 className="title" >Sorry, something went wrong.</h1>
            <small>{full_name.value} we couldn't connect to the server, please check your connection or press retry.</small>
            <button onClick={()=>postProperty()} className="btn-primary hg" >Retry<i className="fa fa-sync-alt right"></i></button>
            <br/><br/>
            <div className="image md">
              <img alt="Error" src={REQUEST_LOST_IMG} />
            </div>
          </div>
        </div>
      )
    }
    if ( done.is_done ){
      return(
        <div className="part-full">
          <div className="card-5">
            <h1 className="title" >Your property post was successful.</h1>
            <small className="" >{full_name.value} We will check your property informations first, then you will recieve an email to know if it is accepted or not.</small>
            <a href={HOME_PAGE_URL} className="btn-primary hg" >Go home <i className="fa fa-arrow-right right"></i></a>
            <br/><br/>
            <div className="image">
              <img alt="Success" src={DONE_IMG} />
            </div>
          </div>
        </div>
      )
    }
  }
  return <Redirect to={`${REACT_ROUTERS_URLS.sell_property}/1`}  />

}

export default Type;

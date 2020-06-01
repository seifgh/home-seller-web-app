import React, {useContext, useEffect} from 'react';
import { Route, useParams } from 'react-router-dom';
import { GlobalContext } from './../state-manager/globalState';
import { REACT_ROUTERS_URLS, HOME_PAGE_URL } from './../settings';
import LOGO_IMG from './../images/logo.png';
import Location from './post-property/Location';
import Type from './post-property/Type';
import Specifications from './post-property/Specifications';
import Images from './post-property/Images';
import Owner from './post-property/Owner';
import Done from './post-property/Done';




function StepsProgress(){
  const { screen_types } = useContext(GlobalContext);
  const STEP_ID = Number(useParams().STEP_ID);
  const progress_percent = STEP_ID * 20;
  const {is_desktop} = screen_types;
  if ( is_desktop )
    return (
      <div className="steps-progress" >
        <div className="steps">
          <span className={`step${STEP_ID === 1 ? ' active show-title':''}${STEP_ID > 1 ? ' fa fa-check active':' count'}`} ><span>Location</span></span>
          <span className={`step${STEP_ID === 2 ? ' active show-title':''}${STEP_ID > 2 ? ' fa fa-check active':' count'}`} ><span>Type</span></span>
          <span className={`step${STEP_ID === 3 ? ' active show-title':''}${STEP_ID > 3 ? ' fa fa-check active':' count'}`} ><span>Specifications</span></span>
          <span className={`step${STEP_ID === 4 ? ' active show-title':''}${STEP_ID > 4 ? ' fa fa-check active':' count'}`} ><span>Images</span></span>
          <span className={`step${STEP_ID === 5 ? ' active show-title':''}${STEP_ID > 5 ? ' fa fa-check active':' count'}`} ><span>Owner</span></span>
        </div>
        <div className="progress-bar"><span style={{ height: `${progress_percent}%` }} className="progress" ></span></div>
      </div>
    )
  return(
    <div className="steps-progress" >
      <div className="steps">
        <span className={`step${STEP_ID === 1 ? ' active show-title':''}${STEP_ID > 1 ? ' fa fa-check active':' count'}`} ></span>
        <span className={`step${STEP_ID === 2 ? ' active show-title':''}${STEP_ID > 2 ? ' fa fa-check active':' count'}`} ></span>
        <span className={`step${STEP_ID === 3 ? ' active show-title':''}${STEP_ID > 3 ? ' fa fa-check active':' count'}`} ></span>
        <span className={`step${STEP_ID === 4 ? ' active show-title':''}${STEP_ID > 4 ? ' fa fa-check active':' count'}`} ></span>
        <span className={`step${STEP_ID === 5 ? ' active show-title':''}${STEP_ID > 5 ? ' fa fa-check active':' count'}`} ></span>
      </div>
      <div className="progress-bar"><span style={{ width: `${progress_percent}%` }} className="progress" ></span></div>
    </div>
  )

}


function PostProperty(){

  const { setFetchCountries } = useContext(GlobalContext);
  useEffect(()=>{
    setFetchCountries();
  }, []);

  return(
    <section className="section-1" >
      <div className="steps-bar">
        <a href={HOME_PAGE_URL} className="logo">
          <img alt="logo" src={LOGO_IMG} />
        </a>
        <StepsProgress />
      </div>
      <Route path={`${REACT_ROUTERS_URLS.sell_property}/1`} >
        <Location />
      </Route>

      <Route path={`${REACT_ROUTERS_URLS.sell_property}/2`} >
        <Type />
      </Route>

      <Route path={`${REACT_ROUTERS_URLS.sell_property}/3`} >
        <Specifications />
      </Route>

      <Route path={`${REACT_ROUTERS_URLS.sell_property}/4`} >
        <Images />
      </Route>

      <Route path={`${REACT_ROUTERS_URLS.sell_property}/5`} >
        <Owner />
      </Route>

      <Route path={`${REACT_ROUTERS_URLS.sell_property}/6`} >
        <Done />
      </Route>

    </section>
  )
}

export default PostProperty;

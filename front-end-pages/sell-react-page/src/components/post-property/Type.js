import React, {useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { GlobalContext } from './../../state-manager/globalState';
import { REACT_ROUTERS_URLS } from './../../settings';
import { SelectCard } from './../forms/select-card';



function Type(props){

  const {
    location, type, setSelectedType,
    handleTypeSubmit, setType
  } = useContext(GlobalContext);

  useEffect(() =>{
   setType({is_done: false});
   window.scrollTo(0,0);
 },[]);


  const {options} = type;

  // rendering
  if (location.is_done){
    return(
      <div className="part-full">
        <div className="form-1 lg" >
          <h1 className="title" >Property type</h1>
          <p className="pragraph" >Please, select your home type.</p>

          <div className="multi-fields last" >
            {
              options.map( op =>(
                <SelectCard onClick={() => setSelectedType(op.id)} key={op.id} is_selected={op.is_selected} title={op.value} iconClassName={op.icon_class_name} />
              ))
            }
          </div>

          <div className="btns">
            <Link to={`${REACT_ROUTERS_URLS.sell_property}/1`} className="btn-outline-primary hg right-mr icon-only"><i className="fa fa-arrow-left"></i></Link>
            <Link onClick={ ()=> handleTypeSubmit() } to={`${REACT_ROUTERS_URLS.sell_property}/3`} className="btn-primary btn-full hg">Next<i className="fa fa-arrow-right right"></i></Link>
          </div>

        </div>
      </div>
    )
  }
  return <Redirect to={`${REACT_ROUTERS_URLS.sell_property}/1`}  />

}

export default Type;

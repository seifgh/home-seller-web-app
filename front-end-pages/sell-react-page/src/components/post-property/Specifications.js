import React, {useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { GlobalContext } from './../../state-manager/globalState';
import { REACT_ROUTERS_URLS } from './../../settings';
import { TextInput, TextAreaInput, NumberInput } from './../forms/text-input';
import { SelectCard } from './../forms/select-card';



function Specifications(props){

  const {
    specifications, type, location,
    handleSpecificationsSubmit, setSpecifications,
    setSpecificationsFieldValue, setSpecificationsIncludes
  } = useContext(GlobalContext);


  useEffect(() =>{
     setSpecifications({is_done: false});
     window.scrollTo(0,0);
  },[]);

  const {
     name, description, build_year, bedrooms_number,
     bathrooms_number, garages_number, parking_spaces_number,
     floor_space, price, includes
   } = specifications;

  function handleSubmit(e){
    handleSpecificationsSubmit(e);
    window.scrollTo(0,0);
  }

  // rendering
  if (type.is_done){
    const {currency} = location.countries.options.filter(({is_selected}) => is_selected)[0];
    return(
      <div className="part-full">
        <div className="form-1 lg" >
          <h1 className="title" >Property Specifications</h1>
          <p className="pragraph" >Please, full fill all fields to go forward.</p>

          <div className="field">
            <TextInput max={50} errors={name.errors} label="short name" value={name.value} onChange={ (v) => setSpecificationsFieldValue('name', v) }  />
          </div>

          <div className="field last">
            <TextAreaInput max={500} errors={description.errors} label="description" value={description.value} onChange={ (v) => setSpecificationsFieldValue('description', v) }  />
          </div>

          <small className="parser" ><span>Basics</span></small>
          <div className="two-fields last" >

            <div className="field">
              <NumberInput errors={build_year.errors} label="Build year" value={build_year.value} onChange={ (v) => setSpecificationsFieldValue('build_year', v) }  />
            </div>

            <div className="field">
              <NumberInput max={20} min={0}  label="Bedrooms number" value={bedrooms_number.value} onChange={ (v) => setSpecificationsFieldValue('bedrooms_number', v) }  />
            </div>

            <div className="field">
              <NumberInput max={20} min={0} label="Bathrooms number" value={bathrooms_number.value} onChange={ (v) => setSpecificationsFieldValue('bathrooms_number', v) }  />
            </div>

            <div className="field">
              <NumberInput max={10} min={0} label="Grages number" value={garages_number.value} onChange={ (v) => setSpecificationsFieldValue('garages_number', v) }  />
            </div>

            <div className="field">
              <NumberInput max={10} min={0} label="Parking spaces number" value={parking_spaces_number.value} onChange={ (v) => setSpecificationsFieldValue('parking_spaces_number', v) }  />
            </div>

            <div className="field">
              <NumberInput errors={floor_space.errors} label="Floor space (SQFT unit)" value={floor_space.value} onChange={ (v) => setSpecificationsFieldValue('floor_space', v) }  />
            </div>

            <div className="field">
              <NumberInput errors={price.errors}  label={`Price - ${currency} currency`} value={price.value} onChange={ (v) => setSpecificationsFieldValue('price', v) }  />
            </div>

          </div>

          <small className="parser" ><span>Includes</span></small>
          <div className="multi-fields last" >
            {
              includes.map( op =>(
                <SelectCard onClick={() => setSpecificationsIncludes(op.id)} key={op.id} is_selected={op.is_selected} title={op.value} iconClassName={op.icon_class_name} />
              ))
            }
          </div>
          <div className="btns">
            <Link to={`${REACT_ROUTERS_URLS.sell_property}/2`} className="btn-outline-primary hg right-mr icon-only"><i className="fa fa-arrow-left"></i></Link>
            <Link onClick={(e) => handleSubmit(e)}  to={`${REACT_ROUTERS_URLS.sell_property}/4`} className="btn-primary btn-full hg">Next<i className="fa fa-arrow-right right"></i></Link>
          </div>

        </div>
      </div>
    )
  }
  return <Redirect to={`${REACT_ROUTERS_URLS.sell_property}/2`}  />

}

export default Specifications;

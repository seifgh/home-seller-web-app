import React, {useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from './../../state-manager/globalState';
import { REACT_ROUTERS_URLS } from './../../settings';
import  GoogleMap  from './../utils/GoogleMap';
import { TextInput } from './../forms/text-input';
import { SelectInput } from './../forms/select-input';


function Location(props){

  const {
    location, setLocationStreet, setLocationAdditional,
     setLocation, setCountryAndFetchStates,
    setStateAndFetchCities, setCity,
    handleLocationSubmit, screen_types
  } = useContext(GlobalContext);

  useEffect(() =>{
     setLocation({is_done: false});
     window.scrollTo(0,0)
  },[]);

  function handleSubmit(e){
    handleLocationSubmit(e);
    window.scrollTo(0,0);
  }



  const {street, countries, cities, states, additional} = location;
  const city = cities.options.filter( ({is_selected}) => is_selected )[0] || { value: '' };
  const country = countries.options.filter( ({is_selected}) => is_selected )[0] || { value: '' };
  const state = states.options.filter( ({is_selected}) => is_selected )[0] || { value: '' };

  const {is_laptop, is_desktop} = screen_types;

  // rendering
  return(
    <>
      <div className="part-2">
        <div className="form-1" >
          <h1 className="title" >Property location</h1>
          <p className="pragraph" >Please, full fill these fields to recognise your home location.</p>

          <div className="field">
            <SelectInput errors={countries.errors}  label="Country" onChange={(id) => setCountryAndFetchStates(id)} options={countries.options} />
          </div>

          <div className="field">
            <SelectInput errors={states.errors}  label="State" onChange={(id) => setStateAndFetchCities(id)} options={states.options} />
          </div>

          <div className="field">
            <SelectInput errors={cities.errors}  label="City" onChange={(id) => setCity(id)} options={cities.options} />
          </div>

          <div className="field">
            <TextInput errors={street.errors} max={35}  label="Street name" onChange={(v) => setLocationStreet(v)} value={street.value} />
          </div>

          <div className="field last">
            <TextInput errors={additional.errors} max={35}  label="Additional informations" onChange={(v) => setLocationAdditional(v)} value={additional.value} />
            <small className="info" >Exp: appartment name, floor number...</small>
          </div>

          <div className="btns">
            <Link onClick={(e) => handleSubmit(e)} to={`${REACT_ROUTERS_URLS.sell_property}/2`} className="btn-primary btn-full hg">Next<i className="fa fa-arrow-right right"></i></Link>
          </div>
        </div>

      </div>
      { is_laptop || is_desktop ?
        <div className="part-1">
          <GoogleMap className="map" address={ `${city.value}+${state.value}+${country.value}` } />
        </div>
        : null
      }

    </>
  )

}

export default Location;

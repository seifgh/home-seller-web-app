import React , { useState, useContext } from 'react';
import { GlobalContext } from './../../state-manager/globalState';
import { SelectInput } from './../forms/select-input';
import { CheckboxInput } from './../forms/checkbox-input';
import { MultiRangeInput } from './../forms/range-input';
import {
	 SORTS_BY,
	 MAX_PRICE, MIN_PRICE,
	 MIN_SQUARE_FEET, MAX_SQUARE_FEET,
   PROPERTY_TYPE_OPTIONS,
   BED_BATH_ROOMS,
   SHOULD_HAS_OPTIONS
} from './../../Settings';


function Filters () {

  const {
     filters,
     setSortBy,
     setPriceMin, setPriceMax,
     setSquareFeetMax, setSquareFeetMin,
     setBathroom, setBedroom,
     setType, setShouldHas,
		 screen_types
   } = useContext(GlobalContext);
	const [ show_filters, setShowFilters ] = useState(false);


	function toggleFilters(){
    	setShowFilters(!show_filters);
	}

	function closeModal(e){
		if ( e.target.className.includes('modal-1') ){
			toggleFilters();
		}
	}

  const sortById = filters.sort_by.id;
  const { price, square_feet, rooms, type, should_has } = filters;
	const { is_desktop, is_laptop } = screen_types;
	// Rendering
	return(
		<section className="section-1" >
			<div className="container">

				<div className="horizontal-scroller">
					{SORTS_BY.map( ({id, value}) =>(
						<div key={id} onClick={ () => { setSortBy(id) } }  className={`order-box${ id === sortById ? ' active':''} `}> {value} </div>
					))}
				</div>
				{
					is_desktop || is_laptop ?
					<button onClick={ () => toggleFilters() } className={`btn${ show_filters ? '-':'-outline-'}primary hg left-mr`}> <i className="fas fa-filter"></i>Filters</button>
					:
					<button onClick={ () => toggleFilters() } className={`btn${ show_filters ? '-':'-outline-'}primary hg icon-only left-mr`}> <i className="fas fa-filter"></i></button>
				}
			</div>
			<div onClick={ (e) => closeModal(e) } className={`modal-1${ show_filters ? '':' hide'}`}>
				<div className="modal-container">
					<div className="top-bar">
						<i onClick={ () => toggleFilters() } className="fa fa-arrow-left"></i>
						All filters
					</div>

					<div className="fields">
            <SelectInput  label="Property type"
                options={
                  PROPERTY_TYPE_OPTIONS.map( t =>({...t, is_selected: t.id === type.id}))
                }
                onChange={(id) => setType(id) }
            />
					</div>

          <div className="fields-title">
						Rooms number
					</div>
          <div className="multi-fields">
            <SelectInput label="Bedrooms"   options={
              BED_BATH_ROOMS.map( r => ({...r, is_selected: r.id === rooms.bedroom.id}) )
            }
      			onChange={(id) =>  setBedroom(id)}  />

            <SelectInput label="Bathrooms" options={
              BED_BATH_ROOMS.map( r => ({...r, is_selected: r.id === rooms.bathroom.id}))
            }
      			onChange={(id) =>  setBathroom(id)}  />

          </div>


          <div className="fields-title">
						Price
					</div>
        <MultiRangeInput key={2} max={MAX_PRICE} min={MIN_PRICE}
            setGlobalValue1={setPriceMin}  setGlobalValue2={setPriceMax}
            init_value1={price.min}  init_value2={price.max}
            label1={"Min"}
            label2={"Max"}
            formatValue={(v) => `${v.toLocaleString()}` }
          />

					<div className="fields-title">
						Square feet
					</div>
        <MultiRangeInput key={1} max={MAX_SQUARE_FEET} min={MIN_SQUARE_FEET}
            setGlobalValue1={setSquareFeetMin}  setGlobalValue2={setSquareFeetMax}
            init_value1={square_feet.min}  init_value2={square_feet.max}
            label1={"Min"}
            label2={"Max"}
            formatValue={(v) => `${v.toLocaleString()} sqft` }
          />


					<div className="fields-title">
						Should has
					</div>

					<div className="fields">
            {
              SHOULD_HAS_OPTIONS.map( ({id, value}) =>(
                <CheckboxInput
                  key={id}
                  text={value}
                  is_checked={ should_has.map( o => o.id ).includes(id) }
                  onChange={(check_or_not) => setShouldHas(id, check_or_not)  }
                />
              ))
            }
					</div>

					<div className="btns">
						<button type="button" onClick={ () => setShowFilters(false) } className="btn-primary">Done</button>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Filters;

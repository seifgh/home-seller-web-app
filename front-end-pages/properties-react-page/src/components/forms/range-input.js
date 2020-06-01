import React, { useState, useEffect } from 'react';

import './range-input-styles.css';
import { TextInputDisabled } from './text-input';


export function RangeInput({min=0, max=100}){

  return(
    <div className="range-input">
      <input type="range" min={min} max={max}  />
    </div>
  )
}

export function MultiRangeInput({
   min=0, max=100, setGlobalValue1, setGlobalValue2, init_value1,
   init_value2, label1, label2, formatValue = (v) => v
}){

  const [ range1_value, setRange1 ] = useState(0);
  const [ range2_value, setRange2 ] = useState(0);


  function handleChange(e, wichInput){
    e.preventDefault();
    const newValue = Number(e.target.value);
    const maxBetween = max / 20;
    if ( wichInput === 0 ){
      if ( (newValue + maxBetween) < range2_value ){
        setRange1(newValue);
      }
    }else{
      if ( newValue > (range1_value + maxBetween) ){
        setRange2(newValue);
      }
    }
  }

  useEffect(()=>{
    setRange1(init_value1);
    setRange2(init_value2);
  }, [init_value1, init_value2])

  return(
    <div className="range-input multi">
      <input type="range" onMouseUp={(e) => setGlobalValue1(Number(e.target.value))}  onChange={ (e) => handleChange(e, 0) }  value={range1_value} min={min} max={max} />
      <input type="range" onMouseUp={(e) => setGlobalValue2(Number(e.target.value))}  onChange={ (e) => handleChange(e, 1) }  value={range2_value} min={min} max={max} />
      <div className="multi-fields">
        <TextInputDisabled label={label1} value={formatValue(range1_value)} />
        <TextInputDisabled label={label2} value={formatValue(range2_value)} />
      </div>
    </div>
  )
}

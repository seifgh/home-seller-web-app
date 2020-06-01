import React from 'react';

import './errors-styles.css';

function Errors({errors, className=''}){
  return(
    <>
      {errors.map((err, i)=>(
        <small className={`field-error${className ? ` ${className}`:'' }`}  key={i} >{err}</small>
      ))}
    </>
  )
}

export default Errors;

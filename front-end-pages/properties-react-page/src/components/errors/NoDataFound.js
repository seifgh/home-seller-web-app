import React from 'react';
import NoData from './../../images/no_data.svg';

function NoDataFound({message}){
  return (
    <div className="card-5">
      <h1>No matching results.</h1>
      <small>{message}</small>
      <div className="image md">
          <img alt="No matching results" src={NoData} />
      </div>
    </div>
  )
}
export default NoDataFound;

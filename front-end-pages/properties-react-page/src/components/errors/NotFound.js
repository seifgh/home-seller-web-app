import React from 'react';
import NotFoundImg from './../../images/not_found.svg';

function NotFound(){
  return (
    <div className="card-5">
      <h1>Sorry, this page isn't available.</h1>
      <small>The link you followed may be broken, or the page may have been removed.</small>
      <div className="image md">
        <img alt="Not found !" src={NotFoundImg} />
      </div>
    </div>
  )
}
export default NotFound;

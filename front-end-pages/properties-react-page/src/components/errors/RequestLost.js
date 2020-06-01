import React from 'react';
import Request_Lost_IMG from './../../images/request_lost.svg';

function RequestLost(){
  return (
    <div className="card-5">
      <h1>Sorry, something went wrong.</h1>
      <small>We couldn't connect to the server, please check your connection or refresh.</small>
      <div className="image md">
        <img alt="something went wrong" src={Request_Lost_IMG} />
      </div>
    </div>
  )
}
export default RequestLost;

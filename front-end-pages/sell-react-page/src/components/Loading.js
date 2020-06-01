import React, {useState, useEffect} from 'react';


function Loading({messages}){

  const [ index, setIndex ] = useState(0);
  useEffect(()=>{
    let didMount = true;
    if ( index !== messages.length - 1 ){
      setTimeout(()=>{
        if ( didMount ){
          setIndex( index + 1 )
        }
      }, 1000);
    }
    return () => didMount = false;
  }, [index]);

  return (
    <div className="loading-messages">
      {
        messages.map( (m, i) => (
            <small style={{display: i === index ? 'block' : 'none'}} key={i} className="message" >{m}</small>
        ))
      }

      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 38 38" stroke="#066AFF">
        <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
                <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
                <path d="M36 18c0-9.94-8.06-18-18-18" transform="rotate(277.945 18 18)">
                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
                </path>
            </g>
        </g>
      </svg>
    </div>
  )
}

export default Loading;

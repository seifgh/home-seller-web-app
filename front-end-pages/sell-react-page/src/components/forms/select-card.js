import React from 'react'

import './select-card-styles.css';


export function SelectCard({ className='', iconClassName='',  title, is_selected=false, onClick }){
  return(
    <div onClick={onClick} className={`select-card${className ?  ` ${className}` : '' }${is_selected ? ' selected' : ''}`} >
      <i className={iconClassName}  />
      <b>{title}</b>
    </div>
  )
}

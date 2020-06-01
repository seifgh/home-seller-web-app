import React, {useState, useRef} from 'react';
import './swiper-styles.css';

function Swiper({ children, className }){

	// React hooks
	// scroll_state cold be (s->start,m->middle,e->end)
	const [ scroll_pos, setScrollPos ] = useState('s');

	let el = useRef(null);
	function scrollRight(){
		el.current.scrollTo({
	    left: el.current.scrollLeft +  el.current.clientWidth,
	    behavior: 'smooth'
	  });
	}
	function scrollLeft(){
		el.current.scrollTo({
    	left: el.current.scrollLeft -  el.current.clientWidth,
     	behavior: 'smooth'
 	  });
	}
	function handleOnScroll(){
		const scroll_pos = el.current.scrollLeft;
		if (scroll_pos === 0){
			setScrollPos('s');
		}else if (scroll_pos  === (el.current.scrollWidth - el.current.clientWidth)){
			setScrollPos('e');
		}else{
			setScrollPos('m');
		}
	}


	return (
		<div className={className}>
			<div className="btns">
				<button onClick={ () => scrollLeft() } className={`left${ scroll_pos === 's' ? ' hide':'' }`} > <i className="fa fa-arrow-left"></i> </button>
				<button onClick={ () => scrollRight() } className={`right${ scroll_pos === 'e' ? ' hide':'' }`}> <i className="fa fa-arrow-right"></i> </button>
			</div>
			<div ref={(element) => el.current = element } onScroll={(e) => handleOnScroll(e) }   className="_horizontal-scroller">
				{children}
			</div>

		</div>
	)
}

export default Swiper;

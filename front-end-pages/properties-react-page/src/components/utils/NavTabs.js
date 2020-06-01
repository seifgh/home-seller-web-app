import React , { useState } from 'react';



function NavTabs({links, children, className=""}){


	const [ displayedIndex, setDisplayedIndex] = useState(0);


	//Update links onClick event
	links = links.map( (link, i) =>{
			const { className="" } = link.props;

			return {
				...link
				, props: {
					...link.props,
					className: `${className}${ displayedIndex === i ? " active":"" }` ,
					onClick: () => setDisplayedIndex( i )
				}
			}
	})

	children = children.map( (child, i) =>{
			const { className="" } = child.props;

			return {
				...child
				, props: {
					...child.props,
					className: `${className} ${ displayedIndex === i ? "show":"hide" }`
				}
			}
	})


	return (
		<div className={className} >
			<div className="links">
				{links}
			</div>
			<div className="elements">
				{children}
			</div>
		</div>
	)
}

export default NavTabs;

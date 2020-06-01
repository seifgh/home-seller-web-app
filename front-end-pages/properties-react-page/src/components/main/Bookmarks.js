import React , { useEffect, useContext } from 'react';
import { GlobalContext } from './../../state-manager/globalState';
import { REACT_ROUTERS_URLS } from './../../Settings';
// Components
import NoDataFound from './../errors/NoDataFound';
import RequestLost from './../errors/RequestLost';
import PropertyCard from './PropertyCard';

function Bookmarks(){
  const {
    fetchSetUserBookmarks, bookmarks,
    removeFromBookmarks, is_authenticated
  } = useContext(GlobalContext),
  { data, has_error, has_next, bookmarks_count, is_loading } = bookmarks;

  useEffect(()=>{
    if (!is_authenticated){
      window.location.href = REACT_ROUTERS_URLS.sign_in+'?to=/bookmaks';
    }else if (!data.length){
      fetchSetUserBookmarks(true)
    }
    window.scrollTo(0,0);
  }, [])

  if ( has_error ){
		return <RequestLost />
	}

	if (  data && data.length === 0 && ! is_loading ){
		return <NoDataFound message="No bookmarks found in your list." />
	}
  return(
		<section className="section-2" >
      <h1 class="sec-title">{`Bookmarks ${bookmarks_count ? ' - '+bookmarks_count : ''}`}</h1>
			<div className="container">
        {data.map( ({property}) =>(
          <PropertyCard onRemove={() => removeFromBookmarks(property.id)} key={property.id} with_remove_btn={true} {...property} />
        ))}
      </div>
      <div className="container">
				<button
					disabled={ is_loading ? true:false }
					onClick={ () => fetchSetUserBookmarks() }
					className={`btn-primary${has_next ? '':' hide'}${is_loading ? ' loading':''}`}
				>
					{ is_loading ? 'Loading ...':'Load more' }
				</button>
			</div>
    </section>
  )
}

export default Bookmarks;

import React, {useContext, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { GlobalContext } from './../../state-manager/globalState';
import { REACT_ROUTERS_URLS, ALLOWED_IMG_EXTENTIONS } from './../../settings';
import { ImageDropUpload } from './../forms/file-upload-drop.jsx';
import Errors from './../forms/errors';


function Images(props){

  const {
    specifications, images, setImages,
    setMainImage, setDetailsImage,
    handleImagesSubmit
  } = useContext(GlobalContext);

  useEffect(() =>{
     setImages({is_done: false});
     window.scrollTo(0,0);
  },[]);

  const {main_image, details_images} = images;


  function handleSubmit(e){
    handleImagesSubmit(e);
    window.scrollTo(0,0);
  }

  // rendering
  if (specifications.is_done){
    return(
      <>
        <div className="part-full">
          <div className="form-1 lg" >
            <h1 className="title" >Property images</h1>
            <p className="pragraph" >Please, upload at least 3 images.</p>

            <small className="parser cr" ><span>Cover</span></small>

            <div className="field">
              <ImageDropUpload errors={details_images.errors}  allowedTypes={ALLOWED_IMG_EXTENTIONS}
              has_errors={main_image.errors.length}
              onChange={(f) => setMainImage(f)} file={main_image.file}
              btnRemoveClassName="btn-outline-primary icon-only"
              btnClassName="btn-primary right-mr" />

            </div>
            <small className="parser" ><span>Details</span></small>
            <Errors className="cr" errors={details_images.errors} />
            <div className="two-fields last">
              { details_images.images.map( img => (
                  <div key={img.id} className="field">
                    <ImageDropUpload  allowedTypes={ALLOWED_IMG_EXTENTIONS}
                    onChange={(f) => setDetailsImage(img.id, f)}
                    file={img.file}
                    btnRemoveClassName="btn-outline-primary icon-only"
                    btnClassName="btn-primary right-mr" />
                  </div>
                ))
              }

            </div>

            <div className="btns">
              <Link to={`${REACT_ROUTERS_URLS.sell_property}/3`} className="btn-outline-primary hg right-mr icon-only"><i className="fa fa-arrow-left"></i></Link>
              <Link onClick={(e) => handleSubmit(e)} to={`${REACT_ROUTERS_URLS.sell_property}/5`} className="btn-primary btn-full hg">Next<i className="fa fa-arrow-right right"></i></Link>
            </div>

          </div>
        </div>
      </>
    )
  }
  return <Redirect to={`${REACT_ROUTERS_URLS.sell_property}/3`}  />
}

export default Images;

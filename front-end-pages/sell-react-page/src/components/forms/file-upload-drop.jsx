import React from 'react';

import './file-upload-drop-styles.css';
import Errors from './errors';



export class FileDropUpload extends React.Component{
  constructor(props){
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      drop_zone_active : false,
    }
  }


  handleDragEnter( e ){
    e.preventDefault();
    e.stopPropagation();
    // this.setState({drop_zone_active : true})

  }
  handleDragOver( e ){
    e.preventDefault();
    e.stopPropagation();
    this.setState({drop_zone_active : true})

  }
  handleDragLeave( e ){
    e.preventDefault();
    e.stopPropagation();
    this.setState({drop_zone_active : false})

  }
  handleDrop( e ){
    e.preventDefault();
    e.stopPropagation();
    this.setState({drop_zone_active : false});
    if ( e.dataTransfer.files && e.dataTransfer.files[0] ){
      const file = e.dataTransfer.files[0];
      this.props.onChange( file );
    }

  }

  handleChange( e ){
    e.preventDefault();
    if ( e.target.files[0] ){
      const file = e.target.files[0];
      this.props.onChange( file );
    }
  }


  render(){
    const { drop_zone_active } = this.state;
    const { file, errors=[], label, btnClassName='', btnRemoveClassName=''  } = this.props;
    const file_name = file ? file.name:null ;
    const has_errors = errors.length;
    return(
      <>
        <div className={ `file-input${ drop_zone_active ? ' active':'' }${has_errors ? ' errors':''}${ file_name ? ' has-file':''}` } >

          <div
            onDragEnter = { (e) => this.handleDragEnter(e) }
            onDragOver  = { (e) => this.handleDragOver(e) }
            onDragLeave = { (e) => this.handleDragLeave(e) }
            onDrop = { (e) => this.handleDrop(e) }

            className={`drop-zone`}>
            <label>{label}</label>
            <small className="ellipsis" >{ file_name || 'Drag your file here' }</small>
            <br/>
            <input ref={ this.fileInput } className="hidden"  onChange={ e => this.handleChange( e )  } type="file" />
            <center>
              <button  onClick={ (e) => { e.preventDefault();this.fileInput.current.click()} } className={btnClassName} >{ file_name ? 'Replace file' : 'Upload file'}</button>
              {  file_name ?
              <button title="Remove file"  onClick={ (e) => { e.preventDefault(); this.props.onChange(null)} } className={btnRemoveClassName} ><i className="fa fa-times" /></button>
                : null
              }
            </center>
          </div>
        </div>
        <Errors className="cr" errors={errors} />
      </>
    )
  }
}

export class ImageDropUpload extends React.Component{
  constructor(props){
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      drop_zone_active : false,
      img_src: props.file ? window.URL.createObjectURL(props.file) : null,
    }
  }


  handleDragEnter( e ){
    e.preventDefault();
    e.stopPropagation();
    // this.setState({drop_zone_active : true})

  }
  handleDragOver( e ){
    e.preventDefault();
    e.stopPropagation();
    this.setState({drop_zone_active : true})

  }
  handleDragLeave( e ){
    e.preventDefault();
    e.stopPropagation();
    this.setState({drop_zone_active : false})

  }
  handleDrop( e ){
    e.preventDefault();
    e.stopPropagation();

    if ( e.dataTransfer.files && e.dataTransfer.files[0] ){
      const file = e.dataTransfer.files[0];
      const { allowedTypes, onChange } = this.props;
      if ( allowedTypes.includes(file.type) ){
        onChange( file );
        const img_src = window.URL.createObjectURL(file);
        this.setState({drop_zone_active: false, img_src });
      }else{
        alert(`Image extension should be in this list: ${allowedTypes.map(t=>` ${t.split('/')[1]}`).toString()}.`)
      }
    }

  }

  handleChange( e ){
    e.preventDefault();
    if ( e.target.files[0] ){
      const file = e.target.files[0];

      const { allowedTypes, onChange } = this.props;
      if ( allowedTypes.includes(file.type) ){
        onChange( file );
        const img_src = window.URL.createObjectURL(file);
        this.setState({img_src });
      }else{
        alert(`Image extension should be in this list: ${allowedTypes.map(t=>` ${t.split('/')[1]}`).toString()}.`)
      }
    }
  }

  removeFile(e){
     e.preventDefault();
     this.props.onChange(null);
     this.setState({img_src:null});
     this.fileInput.current.value = '';
  }


  render(){
    const { drop_zone_active, img_src } = this.state;
    const { file, errors=[], label, btnClassName='', btnRemoveClassName=''  } = this.props;
    const file_name = file ? file.name:null ;
    const has_errors = errors.length;
    return(
      <>
        <div className={ `file-input${ drop_zone_active ? ' active':'' }${has_errors ? ' errors':''}${ file_name ? ' has-file':''}` } >
          <div
            onDragEnter = { (e) => this.handleDragEnter(e) }
            onDragOver  = { (e) => this.handleDragOver(e) }
            onDragLeave = { (e) => this.handleDragLeave(e) }
            onDrop = { (e) => this.handleDrop(e) }

            className={`drop-zone`}>
            <label>{label}</label>
            <small className="ellipsis" >{ file_name || 'Drag your file here' }</small>
            <br/>
            <input ref={ this.fileInput } className="hidden"  onChange={ e => this.handleChange( e )  } type="file" />
            <center>
              <button  onClick={ (e) => { e.preventDefault();this.fileInput.current.click()} } className={btnClassName} >{ file_name ? 'Replace image' : 'Upload image'}</button>
              {  file_name ?
              <button title="Remove image"  onClick={ (e) => this.removeFile(e) } className={btnRemoveClassName} ><i className="fa fa-times" /></button>
                : null
              }
            </center>
            {
              img_src ?
              <img className="uploaded-image" alt="Dropped" src={img_src} />
              : null
            }
          </div>
        </div>
        <Errors className="cr" errors={errors} />
      </>
    )
  }
}

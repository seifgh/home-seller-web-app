
export function generateURL(url, queries){

	// queries exemple : [{ key: 'filter', value: 'priceAsc' }, ]
	const searchParams = new URLSearchParams(window.location.search);
	queries.forEach( ( { key, value }) => {
		searchParams.set(key, value)
	})
	return `${url}?${searchParams.toString()}`;
}

export function changePushURL( url ){

	window.history.pushState(null, null, url);
}

export function formatNumber(number){

	if ( number < 1000 )
		return number
	// 1.5M format
	if ( number >= 1000000){
		const beforeComma = Math.trunc( number / 1000000 );
		const afterComma  = Math.trunc((number % 1000000) / 100000);

		return afterComma === 0 ? `${beforeComma}M`:`${beforeComma},${afterComma}M`;
	}
	// 1.5K format
	if ( number >= 1000 ){
		const beforeComma = Math.trunc( number / 1000 );
		const afterComma  = Math.trunc((number % 1000) / 100);

		return afterComma === 0 ? `${beforeComma}K`:`${beforeComma},${afterComma}K`;
	}

}


// fields validator
export const Validator = {

	errors:{
		required: 'This field is required.',
		email: 'Invalid email.',
    username: 'Username  must contain at least 6 characters.',
    password: 'Password must contain at least 8 characters without spaces.',
    password_confirmation: 'The two passwords did not match.',
		length: (min, max) => `This field can only contain between ${min} and ${max} characters.`,
		exact_length: (length) => `This field can only contain ${length} characters.`,

	},

	validateEmail: function(email){
	   var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	   return re.test(String(email).toLowerCase());
	},

  email: function(email){
		email = email.trim();
		if ( ! email ){
			return [this.errors.required];
		}
		if ( ! this.validateEmail(email)){
			return [this.errors.email];
		}
		return [];
	},


	minMaxLength: function(value, min, max){
		value = value.trim();
		if ( ! value ){
			return  [this.errors.required];
		}
		if ( value.length < min || value.length > max ){
			return [this.errors.length(min, max)];
		}
		return [];
	},

	exactLength: function(value, length){
		value = value.trim();
		if ( ! value ){
			return  [this.errors.required];
		}
		if ( value.length !== length ){
			return [this.errors.exact_length(length)];
		}
		return [];
	},

  username: function(value){
		value = value.trim();
    if ( ! value ){
      return  [this.errors.required];
    }
    if ( ! (/^\w{6,15}$/).test(value) ){
      return [this.errors.username];
    }
    return [];
  },

  password: function(value){
    if ( ! value ){
      return  [this.errors.required];
    }
    if ( (value.length < 8 || value.length > 128) || value.includes(' ') ){
      return [this.errors.password];
    }
    return [];
  },
  password_confirmation: function(value, password){
    if ( ! value ){
      return  [this.errors.required];
    }
    if ( value !== password ){
      return [this.errors.password_confirmation];
    }
    return [];
  }
}

// jwt authentication
export const AuthToken = {
	setToken: (token) => localStorage.setItem('token', token),
	getToken: () => localStorage.getItem('token'),
	getHeader: function(){
		return { Authorization: `Token ${this.getToken()}` }
	 }
}

// responsive design
export function getScreenTypes(){
	const width = window.innerWidth;
	return {
		is_md_mobile: width <= 320,
		is_mobile: width > 320 && width <= 480 ,
		is_phablet: width > 480 && width <= 600,
		is_tablet: width > 600 && width <= 768,
		is_laptop: width > 768 && width <= 1280,
		is_desktop: width > 1280
	}
}

import React from 'react';
import logo from './../images/logo.png';

function Footer() {


	return(
		<footer>
			<section className="section-1">

				<h1 className="sec-title" >The values that hold us true</h1>
				<div className="container-1">
					<div className="text-card">
						<h3 className="title" >Simlicity</h3>
						<p className="paragraph" >
						Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry.
						</p>
					</div>

					<div className="text-card">
						<h3 className="title" >Trust</h3>
						<p className="paragraph" >
						Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry.
						</p>
					</div>

					<div className="text-card">
						<h3 className="title" >Social good</h3>
						<p className="paragraph" >
						Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry.
						</p>
					</div>
				</div>

				<hr/>

				<div className="container-2">
					<div className="links">
						<div className="logo" >
							<img alt="logo" src={logo} />
						</div>
					</div>

					<div className="links">
						<h4 className="title" >Company</h4>
						<a href="/">Contact us</a>
						<a href="/">About us</a>
						<a href="/">Careers</a>
					</div>

					<div className="links">
						<h4 className="title" >Customers</h4>
						<a href="/">Services</a>
						<a href="/">Meet our agents</a>
						<a href="/">How it works ?</a>
					</div>

					<div className="links">
						<h4 className="title" >Further informations</h4>
						<a href="/">Terms & Conditions</a>
						<a href="/">Privacy Policy</a>
					</div>

				</div>
			</section>
		</footer>
	)
}
export default Footer;

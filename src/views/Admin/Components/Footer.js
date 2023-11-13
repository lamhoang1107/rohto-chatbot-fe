"use strict";

/* Package System */
import React from "react";

/* Package Application */


/* Package style */
import styles from '@public/scss/admin/layouts/Footer.module.scss'

class Footer extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<>
				<div id={styles.footer}>
					<div className="container-fluid d-flex align-items-center">
					</div>
				</div>
			</>
		)
	}
}

export default Footer;
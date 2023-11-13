"use strict";

/* Package System */
import React from "react";

class Page404 extends React.Component{

	constructor(props){
		super(props);
	}

	render(){

		return(
			<>
				<div className="tt404">
					<div className="tt404-wrapper">
						<h1>404</h1>
						<p>page not found</p>
					</div>
				</div>
			</>
		)
	}
}

export default Page404;
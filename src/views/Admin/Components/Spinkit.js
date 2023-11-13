"use strict";

/* Package System */
import React from "react";

/* Package Application */

/* Package style */

class Spinkit extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<>
				{(this.props.name=='sk-fading-circle')&&
					<div className={"sk-fading-circle "+this.props.color +" "+ this.props.className}>
						<div className="sk-circle1 sk-circle"></div>
						<div className="sk-circle2 sk-circle"></div>
						<div className="sk-circle3 sk-circle"></div>
						<div className="sk-circle4 sk-circle"></div>
						<div className="sk-circle5 sk-circle"></div>
						<div className="sk-circle6 sk-circle"></div>
						<div className="sk-circle7 sk-circle"></div>
						<div className="sk-circle8 sk-circle"></div>
						<div className="sk-circle9 sk-circle"></div>
						<div className="sk-circle10 sk-circle"></div>
						<div className="sk-circle11 sk-circle"></div>
						<div className="sk-circle12 sk-circle"></div>
					</div>
				}

				{(this.props.name=='spinner')&&
					<div className={"spinner "+this.props.color+" "+ this.props.className}></div>
				}

				{(this.props.name=='sk-chase')&&
					<div className={"sk-chase "+this.props.color+" "+ this.props.className}>
						<div className="sk-chase-dot"></div>
						<div className="sk-chase-dot"></div>
						<div className="sk-chase-dot"></div>
						<div className="sk-chase-dot"></div>
						<div className="sk-chase-dot"></div>
						<div className="sk-chase-dot"></div>
					</div>
				}

				{(this.props.name=='double-bounce')&&
					<div className={"double-bounce "+this.props.color+" "+ this.props.className}>
						<div className="double-bounce1"></div>
						<div className="double-bounce2"></div>
					</div>
				}

				{(this.props.name=='rect')&&
					<div className={"rect "+this.props.color+" "+ this.props.className}>
						<div className="rect1"></div>
						<div className="rect2"></div>
						<div className="rect3"></div>
						<div className="rect4"></div>
						<div className="rect5"></div>
					</div>
				}

				{(this.props.name=='cube')&&
					<div className={"cube "+this.props.color+" "+ this.props.className}>
						<div className="cube1"></div>
						<div className="cube2"></div>
					</div>
				}

				{(this.props.name=='once-bounce')&&
					<div className={"once-bounce "+this.props.color}></div>
				}

				{(this.props.name=='dot')&&
					<div className={"dot "+this.props.color+" "+ this.props.className}>
						<div className="dot1"></div>
						<div className="dot2"></div>
					</div>
				}

				{(this.props.name=='three-dots')&&
					<div className={"three-dots "+this.props.color+" "+ this.props.className}>
						<div className="bounce1"></div>
						<div className="bounce2"></div>
						<div className="bounce3"></div>
					</div>
				}

				{(this.props.name=='sk-circle')&&
					<div className={"sk-circle "+this.props.color+" "+ this.props.className}>
						<div className="sk-circle1 sk-child"></div>
						<div className="sk-circle2 sk-child"></div>
						<div className="sk-circle3 sk-child"></div>
						<div className="sk-circle4 sk-child"></div>
						<div className="sk-circle5 sk-child"></div>
						<div className="sk-circle6 sk-child"></div>
						<div className="sk-circle7 sk-child"></div>
						<div className="sk-circle8 sk-child"></div>
						<div className="sk-circle9 sk-child"></div>
						<div className="sk-circle10 sk-child"></div>
						<div className="sk-circle11 sk-child"></div>
						<div className="sk-circle12 sk-child"></div>
					</div>
				}

				{(this.props.name=='sk-cube-grid')&&
					<div className={"sk-cube-grid "+this.props.color+" "+ this.props.className}>
						<div className="sk-cube sk-cube1"></div>
						<div className="sk-cube sk-cube2"></div>
						<div className="sk-cube sk-cube3"></div>
						<div className="sk-cube sk-cube4"></div>
						<div className="sk-cube sk-cube5"></div>
						<div className="sk-cube sk-cube6"></div>
						<div className="sk-cube sk-cube7"></div>
						<div className="sk-cube sk-cube8"></div>
						<div className="sk-cube sk-cube9"></div>
					</div>
				}

				{(this.props.name=='sk-folding-cube')&&
					<div className={"sk-folding-cube "+this.props.color+" "+ this.props.className}>
						<div className="sk-cube1 sk-cube"></div>
						<div className="sk-cube2 sk-cube"></div>
						<div className="sk-cube4 sk-cube"></div>
						<div className="sk-cube3 sk-cube"></div>
					</div>
				}
			</>
		)
	}
}

export default Spinkit;
"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';

/* Package Application */
import FormLayout from '@views/Admin/Components/FormLayout';

/* Package style */

class Form extends React.Component{

	constructor(props){
		super(props);
	}

	render(){

		return(
			<>	
				<FormLayout
					hideColRight= {true}
					fields={[
						{key:'name',label:'Category',type:'text',col:'left',isRequired:true,capitalizeContent:false},
					]}
				/>
			</>
		)
	}
}

export default Form;
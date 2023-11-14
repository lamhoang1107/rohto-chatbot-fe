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
				{/* TYPE : text,status,radio,select,select_multi,image,video,textarea,autoComplete (multiple:true),password,dateTime
					col:'left', col:'right'
					hideColRight={true} -- ẩn cột phải
				*/}
				<FormLayout
					hideColRight= {true}
					getData={{category_id:process.env.API_URL+'/v1/categories?fqnull=deleted_at'}}
					fields={[
						{key:'name',label:'Nhóm sản phẩm',type:'text',col:'left',isRequired:true,capitalizeContent:false},
						{key:'category_id',label:'Category',type:'select',defaultValue:[],col:'left',isRequired:true},
					]}
				/>
			</>
		)
	}
}

export default Form;
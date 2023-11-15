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
					getData={{product_id:process.env.API_URL+process.env.PREFIX_API+'products?fqnull=deleted_at&limit=10000'}}
					fields={[
						{key:'prompt',label:'Câu hỏi',type:'text',col:'left',isRequired:true,capitalizeContent:false},
						{key:'completion',label:'Câu trả lời',type:'textarea',col:'left',isRequired:true},
						{key:'product_id',label:'Sản phẩm',type:'select',defaultValue:[],values:[{label:'Không chọn sản phẩm',value:''}],col:'left',isRequired:false},
					]}
				/>
			</>
		)
	}
}

export default Form;
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
					getData={{role_id:'roles?limit=10000'}}
					fields={[
						{key:'email',label:'Email',type:'text',col:'left',isRequied:true},
						{key:'password',label:'Mật khẩu',type:'password',col:'left',isRequied:true},
						{key:'role_id',label:'Vai trò',type:'select',col:'left',isRequied:true},
						{key:'status',label:'Trạng thái',type:'status',defaultValue:true,col:'right'},
					]}
				/>
			</>
		)
	}
}

export default Form;
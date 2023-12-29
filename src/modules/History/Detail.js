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
					hideColRight={true}
					fields={[
						{key:'dialog_id',label:'Dialog ID',type:'text',col:'left',isRequied:true},
						{key:'user_message',label:'User message',type:'textarea',col:'left',isRequied:true},
						{key:'assistant_message',label:'Assistant message',type:'textarea',col:'left',isRequied:true},
					]}
					detail={true}
				/>
			</>
		)
	}
}

export default Form;
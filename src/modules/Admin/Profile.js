"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';

/* Package Application */
import FormLayout from '@views/Admin/Components/FormLayout';

/* Package style */

class Profile extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<>
				<FormLayout
					urlForm={process.env.PREFIX_API+'accounts'}
					nameDisplay={'Cập nhật thông tin'}
					hideColRight={true}
					fields={[
						{key:'email',label:'Email',type:'text',col:'left',isRequied:true,updateDisable:true},
						{key:'oldPassword',label:'Mật khẩu cũ',type:'password',col:'left',isRequied:true},
						{key:'newPassword',label:'Mật khẩu mới',type:'password',col:'left',isRequied:true}
					]}
				/>
			</>
		)
	}
}

export default Profile;
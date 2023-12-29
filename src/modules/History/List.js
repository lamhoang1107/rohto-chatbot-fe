"use strict";

/* Package System */
import React from "react";

/* Package Application */
import ListLayout from '@views/Admin/Components/ListLayout';

class List extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	render(){
		return(
			<React.Fragment>
				{/*  
					maxWidthPopup: xl,lg,md,sm,xs
					isBtnAdd={true} -- Nút thêm
					search={true} -- tìm kiếm
					export={true} -- xuất dữ liệu
					isBtnFilter={true} -- bộ lọc
					hideAction={true} -- List ẩn hành động
					data -- các trường trong update/add
					search={true}
					export={true}
				*/}
				

				

				<ListLayout
					nameDisplay={'Quản lý lịch sử chat'}
					isBtnAdd={false}
					showActionDetail={true}
					search={true}
					search_fields={'user_message,assistant_message'}
					total = {true}
					isBtnFilter={true} 
					hideAction={false}
					maxWidthPopup='lg'
					data
					customSearch={false}
					export={false}
					isBtnImport={false}
					hideActionEdit={true}
					hideActionDel={true}
					sort='created_at'
					columns={[
						{key:'dialog_id',label:'Dialog ID',type:'text',width:100},
						{key:'user_message',label:'User message',type:'text'},
						{key:'assistant_message',label:'Assistant message',type:'text'},
						{key:'created_at',label:'Ngày tạo',type:'dateTime',width:150},
					]}
					filters={[
						{key:'created_at',label:'Ngày tạo',type:'dateRanger'},
					]}
				/>
			</React.Fragment>
		)
	}
}

export default List;
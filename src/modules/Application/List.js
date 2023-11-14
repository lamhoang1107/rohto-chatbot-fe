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
					nameDisplay={'Quản lý App keys'}
					isBtnAdd={false}
					search={false}
					search_fields={'name'}
					total = {false}
					isBtnFilter={false} 
					hideAction={false}
					maxWidthPopup='lg'
					data
					customSearch={false}
					export={false}
					isBtnImport={false}
					sort='created_at,-id'
					hideActionDel={true}
					columns={[
						{key:'key_name',label:'API Key',type:'text'},
						// {key:'created_at',label:'Ngày tạo',type:'dateTime',width:200},
						{key:'updated_at',label:'Ngày cập nhật',type:'dateTime',width:200}
					]}
				/>
			</React.Fragment>
		)
	}
}

export default List;
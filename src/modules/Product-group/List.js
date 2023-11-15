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
					nameDisplay={'Quản lý Nhóm sản phẩm'}
					isBtnAdd={true}
					search={true}
					search_fields={'name'}
					total = {true}
					isBtnFilter={true} 
					hideAction={false}
					maxWidthPopup='lg'
					data
					customSearch={false}
					export={false}
					isBtnImport={false}
					sort='created_at,-id'
					getFilterData={{category_id:process.env.API_URL+process.env.PREFIX_API+'categories?fqnull=deleted_at&limit=10000'}}

					columns={[
						{key:'name',label:'Nhóm sản phẩm',type:'text'},
						{key:'category_name',label:'Category',type:'text',width:200},
						{key:'created_at',label:'Ngày tạo',type:'dateTime',width:200},
						{key:'updated_at',label:'Ngày cập nhật',type:'dateTime',width:200}
					]}
					filters={[
						{key:'category_id',label:'Category',type:'select',values:[{label:'Chọn',value:''}]},
						{key:'created_at',label:'Ngày tạo',type:'dateRanger'},
					]}
				/>
			</React.Fragment>
		)
	}
}

export default List;
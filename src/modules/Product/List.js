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
					nameDisplay={'Quản lý danh sách sản phẩm'}
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
					getFilterData={{"categories.id":process.env.API_URL+process.env.PREFIX_API+'categories?fqnull=deleted_at&limit=10000',"product_groups.id":process.env.API_URL+process.env.PREFIX_API+'product-groups?fqnull=deleted_at&limit=10000'}}

					columns={[
						{key:'category_name',label:'Category',type:'text',width:200},
						{key:'product_group_name',label:'Nhóm sản phẩm',type:'text',width:200},
						{key:'name',label:'Tên sản phẩm',type:'text',width:200},
						{key:'created_at',label:'Ngày tạo',type:'dateTime',width:80},
						{key:'updated_at',label:'Ngày cập nhật',type:'dateTime',width:80}
					]}
					filters={[
						{key:'categories.id',label:'Category',type:'select',values:[{label:'Chọn',value:''}]},
						{key:'product_groups.id',label:'Nhóm sản phẩm',type:'select',values:[{label:'Chọn',value:''}]},
						{key:'created_at',label:'Ngày tạo',type:'dateRanger'},
					]}
				/>
			</React.Fragment>
		)
	}
}

export default List;
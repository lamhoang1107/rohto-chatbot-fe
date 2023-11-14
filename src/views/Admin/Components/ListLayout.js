"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';
import Router,{withRouter} from 'next/router';
import {connect} from 'react-redux';
import Image from "next/image";

/* Package Application */
const {fetchApi,postApi,deleteApi,putApi,formatNum} = require('@utils/Helper');
const moment = require('moment');
import { setFilter, setFormLayout, handleFailure, handleSuccess, setRoleLayout, setDetailLayout,setImportLayout,setMergerLayout } from '@features/Status';
import {Switch,Button,FormControl,Select,MenuItem,Box,Dialog,DialogActions,DialogTitle,Pagination,Stack,TextField,Autocomplete, Tooltip,DialogContent,DialogContentText,RadioGroup,FormControlLabel,Radio } from '@mui/material';
import FilterLayout from '@views/Admin/Components/FilterLayout';
import Spinkit from '@views/Admin/Components/Spinkit';
import _ from 'lodash';
import xlsx from 'json-as-xlsx'
import { CopyToClipboard } from 'react-copy-to-clipboard';

class ListLayout extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			module:props.router.query?.pages[0]??'',
			isLoadedData:false,
			isLoading:false,
			isExport:false,
			isCheckedAll: false,
			isCheck : [],
			isSort: 'desc',
			isSorting: (props.sort)?props.sort:'created_at',
			isDelete:false,
			isShare:false,
			isSendInvitation:false,
			shareType:'link',
			shareSuccess: false,
			isConfirm:false,
			isUpdate:{
				title: '',
			},
			token:'',
			data:[],
			dataExport:[],
			isLoadingExport:false,
			mapping:{},
			values:{},
			id:'',
			notification_data:'',
			limit: props?.limit??20,
			page: 1,
			total:0,
			next:'',
			popupSource: false,
			filter:'',
			statusExport: false,
			dataShow: [],
			defaultValue:{},
			customSearchStatus: false,
			customSelect:{}
		}
	}

	getObjectQuery(){
		const query = this.props.router.asPath?.split('?')?.[1];
		let _obj={};
		if(query){
			const obj = query.split('&');
			for (const item of obj) {
				const split = item.split('=');
				if(split?.length == 2)
				_obj[`${split[0]}`] = split[1];
			}
		}
		if(Object.keys(_obj).length > 0)
			this.setState({defaultValue:_obj})
		return _obj;
	}

	async componentDidMount() {
		this._isMounted = true;
		if(this.props.stateAccount?.access_token) this.getData(this.getObjectQuery());
	}

	async componentDidUpdate(prevProps,prevState){
		if(this.props.stateAccount?.access_token!=prevProps?.stateAccount?.access_token&&this.state.isLoadedData==false){
			this.getData(this.getObjectQuery());
		}
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	getData=async(filter=null)=>{
		if(this.state.module!=''&&!this.props?.router?.query?.token){
			try{
				let _filter = '';
				let _fq = '';
				let _fqRange = '';
				if(filter?.page&&filter?.page>0) await this.setState({page:filter?.page});
				_filter += '?sort='+(this.state.isSort=='desc'?'-':'')+this.state.isSorting;
				_filter += '&limit='+this.state.limit;
				_filter += '&offset='+(this.state.page-1)*this.state.limit;
				_filter += '&fqnull=deleted_at';
				this.setState({isLoading:true});
				if(filter!=null&&!filter?.page) await this.setState({values:{...this.state.values,...filter}});
				for (const [key, value] of Object.entries(this.state.values)) {
					if(value!=''){
						switch(key){
							case 'search':
							case 'tags':
								if (this.state.customSearchStatus == true) {
									if(this.state.values[key]) _filter += '&fq='+this.props?.customSearchFields +":"+ this.state.values[key];
								} else {
									if(this.state.values[key] && this.state.values[key].startsWith("http")) {
										_filter += '&s='+encodeURIComponent(this.state.values[key])+(this.props?.search_fields?'|'+this.props?.search_fields:'');
									} else {
										_filter += '&s='+this.state.values[key].replace(/^0+/, '')+(this.props?.search_fields?'|'+this.props?.search_fields:'');
									}
								}
								break;
							case 'range':
								if(this.state.values[key]){
									if(_fqRange=='') _fqRange = '&fqrange='+this.state.values[key];
									else _fqRange = ','+this.state.values[key];
									_filter += _fqRange;
								}
								break;
							case 'start':
								if(this.state.values[key]) _filter += '&start='+this.state.values[key];
								break;
							case 'from':
								if(this.state.values[key]) _filter += '&from='+this.state.values[key];
								break;
							case 'end':
								if(this.state.values[key]) _filter += '&end='+this.state.values[key];
								break;
							case 'to':
								if(this.state.values[key]) _filter += '&to='+this.state.values[key];
								break;
							case 'age_from':
								if(this.state.values[key]){
									let _ageFrom = new Date().getFullYear() - this.state.values[key];
									if(_fqRange=='') _fqRange = '&fqrange=birth_day:lte'+_ageFrom;
									else _fqRange = ',birth_day:lte'+_ageFrom;
									_filter += _fqRange;
								}
								break;
							case 'age_to':
								if(this.state.values[key]){
									let _ageTo = new Date().getFullYear() - this.state.values[key];
									if(_fqRange=='') _fqRange = '&fqrange=birth_day:gte'+_ageTo;
									else _fqRange = ',birth_day:gte'+_ageTo;
									_filter += _fqRange;
								}
								break;
							default:
								if(_fq=='') _fq = '&fq='+key+':'+this.state.values[key]
								else _fq += ','+key+':'+this.state.values[key]
								break;
						}
					}
				}
				_filter += _fq;
				if(this.state.next!='') _filter += '&next='+this.state.next;
				let _url = process.env.PREFIX_API+this.state.module;
				this.setState({filter:_filter});
				let _data = await fetchApi(_url+_filter,this.props.stateAccount.access_token);
				if(_data?.status=='success') {
					this._isMounted&&this.setState({isLoading:false,data:_data?.data ?? _data?.items,total:_data?.total??0});
				} else {
					if(_data?.response?.data?.errors?.msg) {
						this._isMounted &&this.props.handleFailure(_data?.response?.data?.errors?.msg)
					} else {
						this._isMounted &&this.props.handleFailure('Server error')
					};
				}
			}catch(e){
				console.log(e);
			}
		}

		// Get Data
		if(this.props.getData&&!this.props?.router?.query?.token){
			for (const [key, value] of Object.entries(this.props.getData)) {
				let _data = await fetchApi(process.env.PREFIX_API+value,this.props.stateAccount.access_token);
				if(_data?.status=='success'){
					this.setState({mapping:{...this.state.mapping,[key]:_data?.data ?? _data?.items}});
				}
			}
		}
	}

	handlePagination=async(e,page)=>{
		this.setState({page:page},()=>this.getData());
	}

	handleChangeValue=e=>{
		let _value = e.target.type==='checkbox' ? e.target.checked : e.target.value;
		this.setState({values:{...this.state.values,[e.target.name]:_value}});
	}

	handleCustomSearch=e=>{
		let _value = e.target.type==='checkbox' ? e.target.checked : e.target.value;
		this.setState({customSearchStatus:_value});
	}

	handleSubmit=e=>{
		e.preventDefault();
		if(this.state.isLoading==false){
			this.setState({isLoading:true},()=>this.getData());
		}
	}

	handleSubmitSource=e=>{
		e.preventDefault();
	}

	handleChangeLimit = async(e) => {
	    await this.setState({ limit: e.target.value });
		this.getData();
	};

	handleSelectedAll=(e)=>{
		this.setState({ isCheckedAll: !this.state.isCheckedAll });
		this.setState({ isCheck: this.state.data.map(r => r.id) });
		if(this.state.isCheckedAll){
			this.setState({ isCheck: [] });
		}
	}

	handleClick = async (e) => {
		const { checked } = e.target;
		const id = e.currentTarget.dataset.id;
		if (!checked) {
			await this.setState({ isCheck: this.state.isCheck.filter(item => item != id)})
		}else{
			await this.setState({ isCheck: [...this.state.isCheck, Number(id)]})
		}
	};

	handleFilter=()=>{
		let _value = !this.props.stateStatus.filter;
		this.props.setFilter(_value);
	}

	handleSort=(e)=>{
		let _column = e.currentTarget.dataset.column;
		this.setState({isSorting:_column});
		if(this.state.isSort==='asc'){
			const sorted = [...this.state.data].sort((a,b)=>{
				return a[_column] > b[_column] ? 1 : -1
			});
			this.setState({data:sorted})
			this.setState({isSort:'desc'})
		}

		if(this.state.isSort==='desc'){
			const sorted = [...this.state.data].sort((a,b)=>{
				return a[_column] < b[_column] ? 1 : -1
			});
			this.setState({data:sorted})
			this.setState({isSort:'asc'})
		}
	}

	handleFormLayout=async(e)=>{
		
		let _status = !this.props.stateStatus.formLayout.status;
		let _id = e.currentTarget?.dataset?.id??'';
		let _title = e.currentTarget.dataset.title;
		let _width = e.currentTarget.dataset.width;
		let _type = e.currentTarget.dataset.type;

		if(_type ==='role'){
			this.props.setRoleLayout({status:_status,id:_id,title:_title,width:_width});
		}else{
			this.props.setFormLayout({status:_status,id:_id,title:_title,width:_width});
		}
	}

	handleDetailLayout=async(e)=>{
		let _status = !this.props.stateStatus.formLayout.status;
		let _id = e.currentTarget?.dataset?.id??'';
		let _title = e.currentTarget.dataset.title;
		let _width = e.currentTarget.dataset.width;
		this.props.setDetailLayout({status:_status,id:_id,title:_title,width:_width});
	}
	handleImportLayout=async(e)=>{
		let _status = !this.props.stateStatus.importLayout.status;
		let _title = e.currentTarget.dataset.title;
		let _width = 'md';
		this.props.setImportLayout({status:_status,title:_title,width:_width});
	}
	handleMergerLayout=async(e)=>{
		let _status = !this.props.stateStatus.mergerLayout.status;
		let _id = e.currentTarget?.dataset?.id??'';
		let _title = e.currentTarget.dataset.title;
		let _width = 'md';
		console.log("_id",_id)
		this.props.setMergerLayout({status:_status,id:_id,title:_title,width:_width});
	}

	handleOpenPopupDelete=async(e)=>{
		await this.setState({isDelete:true,id:e.currentTarget.dataset.id});
	}

	handleOpenPopupShare=async(e)=>{
		await this.setState({isShare:true,id:e.currentTarget.dataset.id});
	}

	handleClosePopupShare=async(e)=>{
		await this.setState({isShare:false,id:'',shareEmail:'',shareSuccess:false,shareLink:''});
	}

	handleCustomSelect=e=>{
		let _value = e.target.type==='checkbox' ? e.target.checked : e.target.value;
		this.setState({customSelect: {...this.state.customSelect,[e.target.name]:_value}});
		setTimeout(()=>{
			this.getData();
		},300);
	}

	handleClosePopupDelete=async(e)=>{
		await this.setState({isDelete:false,id:''});
	}

	handleCloseConfirm=async(e)=>{
		await this.setState({isConfirm:false,id:''});
	}

	handleClosePopupSource=async()=>{
		await this.setState({popupSource:false});
	}

	handleDelete=async()=>{
		if(this.state.id!=''&&this.state.isLoading==false){
			this.setState({isLoading:true});
			let _result = await deleteApi(process.env.PREFIX_API+this.state.module+'/'+this.state.id,this.props.stateAccount.access_token);
			if(_result==''||_result?.status=='success'){
				setTimeout(()=>{
					this.handleClosePopupDelete();
					this.setState({isLoading:false});
					this.getData();
				},1000);
			}else{
				this.handleClosePopupDelete();
				this.setState({isLoading:false});
				if(_result?.response?.data?.errors?.msg) this.props.handleFailure(_result?.response?.data?.errors?.msg);
				if(_result?.response?.data?.errors[0]?.msg) this.props.handleFailure(_result?.response?.data?.errors[0]?.msg);
			}
		}
	}

	handleSource=async()=>{
		this.setState({popupSource:true});
	}

	handleStatusExportOpen=async(e)=>{
		await this.setState({statusExport:true});
	}

	handleStatusExportClose=async(e)=>{
		await this.setState({statusExport:false});
	}

	handleExport=async(e)=>{
		if(this.state.isLoading==false){
			let _url = process.env.API_URL+process.env.PREFIX_API+this.state.module??'';
			_url += this.state.filter;
			this.setState({isExport:true,isLoadingExport:true});
			if(this.props.funcExport){
				let _export = await this.props.funcExport(this.state.filter);
				if(_export==true) this.setState({isExport:false,isLoadingExport:false,next:'',dataExport:[]});
			}else if(_url!='') {
				var lm = 100;
				if(this.state.module == 'activities') {lm = 1000;}
				this.handleExportLink(_url,1,lm);
			}
			else this.getData();
		}
	}

	handleExportLink=async (url,page,limit)=>{
		url = url.replace(/limit=(\d*)/i, `limit=${limit}`).replace(/offset=(\d*)/i, `offset=${(page-1)*limit}`)
		console.log(url);
		let _data = await fetchApi(url,this.props.stateAccount.access_token);
		if(_data?.total > page*limit &&_data.data.length>0){
			let _exportData = this.state.dataExport;
			_exportData.push(..._data.data);
			this.setState({dataExport:_exportData},()=>this.handleExportLink(url,page+1,limit));
		}else{
			let _exportData = this.state.dataExport;
			_exportData.push(..._data.data);
			let _dataExport = [{
				sheet: "Data",
				content: _exportData
			}];
			//add index column to exportdata
			_dataExport[0].content.forEach((obj, index) => {
				obj.index = index + 1;
			  });
			if(this.props?.exportFields && this.props.exportFields?.length > 0){
				_dataExport[0].columns= this.props.exportFields.map(field=>({
					label:field.label,
					value: (row)=>{
						let _value = '';
						if (field.format == "dateTime") {
							_value= (row?.[field.key])?moment(row?.[field.key]).format('DD/MM/YYYY HH:mm'):'';
						} else {
							if(field.key.indexOf('.')>-1){
								for (const key of field.key.split('.')) {
									_value = row?.[key];
								}
							}else _value= row?.[field.key] ? row?.[field.key].toString() : '';
						}
						return _value;
					}
				}))
			}else{
				_dataExport[0].columns= Object.keys(_exportData?.[0])?.map(key=>({
					label:key,
					value: (row)=>row?.[key]??''
				}))
			}
			let _fileName = this.props?.fileName ?? this.state.module;
			xlsx(_dataExport, {fileName: _fileName+"_"+moment().format('DD_MM_YYYY_HH:mm')});
			this.setState({isExport:false,isLoadingExport:false,dataExport:[]});
		}
	}

	showValue=(val,column)=>{
		let _value;
		switch(column.type){
			case 'image':
				if(val[column.key]===null){
					_value=<Image className={column.objectFit?'objectFit':''} height="100px" width="100px" src={'/images/transparent.png'} alt="images" />
				}else{
					let _url = !val[column?.key]? '/images/transparent.png' :val[column?.key]?.indexOf('http') >= 0
					? (val[column.key]) : column.cdn+ val[column.key];
					if(column.linkTo==true) 
						_value=<><a target="_blank" href={_url} rel="noreferrer"><Image className={column.objectFit?'objectFit':''} height="100px" width="100px" src={_url} alt="images" /></a></>
					else
						_value=<Image className={column.objectFit?'objectFit':''} height="100px" width="100px" alt="images" src={_url}/>
				}
				break;
			case 'dateTime':
				_value=<span>{(val[column.key])?moment(val[column.key]).format('DD/MM/YYYY HH:mm'):''}</span>;
				break;
			case 'dateTimeDMY':
				_value=<span>{(val[column.key])?moment(val[column.key]).format('DD/MM/YYYY'):''}</span>;
				break;
			case 'default':
				_value=<span>{val[column.key]==true?'Có':'-'}</span>;
				break;
			case 'status_auth':
				_value=<span className={"text-border-"+(val[column.key]?'success':'danger')}>{val[column.key]?'Authorized':'Non-auth'}</span>;
				break;
			case 'status':
				_value=<div className={"status "+(val[column.key]==true?'text-success':'text-danger')}><i className="fas fa-circle"></i> {val[column.key]==true?'Kích hoạt':'Khóa'}</div>;
				break;
			case 'accept':
				_value=<div className={"accept "+(val[column.key]==true?'text-success':'text-danger')}><i className="fas fa-circle"></i> {val[column.key]==true?'Duyệt':'Không duyệt'}</div>;
				break;
			case 'crawl_status':
				_value=<div className={"accept "+(val[column.key]==1?'text-success':(val[column.key]==0?'text-warning':'text-danger'))}><i className="fas fa-circle"></i> {(val[column.key]==1?'Thành công':(val[column.key]==0?'Đang xử lý':'Xử lý lỗi'))}</div>;
				break;
			case 'mapping':
				let _arr = val[column.key].split(',');
				let _mapping = [];
				_arr.map(v=>{
					let _findKey = _.findIndex(this.state.mapping[column.key],{'id':v});
					if(_findKey>=0){
						_mapping.push(<Image key={v} src={process.env.CDN_URL+this.state.mapping[column.key][_findKey].image} alt="Picture of the author" width="50px" style={{marginRight:'10px'}} />);
					}
				});
				_value = _mapping;
				break;
			case 'switch':
				_value = <Switch name={column.key} onChange={this.handleUpdateStatus} checked={!!val[column.key]} />;
				break;
			case 'tags':
				let _defaultTags = (val[column.key])?val[column.key]:[];
				let _tags = [];
				if(_defaultTags.length>0){
					_defaultTags.map(tag=>_tags.push(tag.show_code));
				}
				_value = <Autocomplete
							className="tags-readOnly"
							multiple={true}
							size="small"
							options={this.state?.data[column.key]?this.state.data[column.key].map((option) => option.title):[]}
							defaultValue={_tags}
							readOnly
							renderInput={(params) => (
								<TextField {...params} />
							)}
						/>;
				break;
			case 'number':
				let _valNum = val[column.key];
				let _parseNum = column.key.split('.');
				if(_parseNum.length==2) _valNum = (val[_parseNum[0]]&&val[_parseNum[0]][_parseNum[1]])?val[_parseNum[0]][_parseNum[1]]:'';
				_value=<span>{_valNum?formatNum(_valNum):0}</span>;
				break;
			case 'gender':
				_value=<span>{val[column.key]=="Male"?'Nam':val[column.key] == "Female" ? 'Nữ' :''}</span>;
				break;
			case 'locale':
				_value=<span>{val[column.key]=="vi"?'Vietnam':'Japan'}</span>;
				break;
			case 'url':
				const width = column?.width ?? 150;
				_value = <Tooltip
				onClick={() =>{
					this.setState({...this.state,textClipBoard:'Copied'});
					setTimeout(() => {
						this.setState({...this.state,textClipBoard:undefined});
					}, 1000);
					return navigator.clipboard.writeText(val[column.key]);
				}}
				title={this.state?.textClipBoard ?? val[column.key]}><span style={{width}} className="url">{val[column.key]}</span></Tooltip>;
				break;
			case 'detailPopup':
				_value = val[column.key] ? <span style={{cursor:'pointer',color:'blue'}} onClick={()=>{
					this.props.setDetailLayout({status:true,id:val?.id, title:'Danh sách người dùng bình chọn',width:'lg'})
				}}>{formatNum(val[column.key])}</span> : <span>{val[column.key]}</span>;
				break;
			case 'group_avatar':
				let _valInfluencers = val[column.key];
				let _avatars = [];
				if (_valInfluencers) {
					_valInfluencers.map((v, k) => {
						if (k < 3) {
							let _pic = (v?.image_link) ? process.env.CDN_URL_S3 + v?.image_link : '/images/influencer-default.png';
							_avatars.push(<li key={k}><div className="item"><Image alt="" layout="fill" className="img-cover" src={_pic} /></div></li>);
						}
					})
				}

				if (_valInfluencers && _valInfluencers.length > 3) _avatars.push(<li key={'countNum'}><div className="item plus"><span>+ {_valInfluencers.length - 3}</span></div></li>);
				_value = <ul className='group-avatar'>{_avatars}</ul>;
				break;
			case 'select':
				const find = column?.values?.find(v=>v.value == val[column.key]);
				_value = find ? find.label : ''
				break;
			case 'percent':
				_valNum = val[column.key];
				_parseNum = column.key.split('.');
				if (_parseNum.length == 2) _valNum = (val[_parseNum[0]] && val[_parseNum[0]][_parseNum[1]]) ? val[_parseNum[0]][_parseNum[1]] : '';
				_value = <span>{_valNum ? `${formatNum(_valNum)}%` : 0}</span>;
				break;
			default:
				let _val = val[column.key];
				let _parse = column.key.split('.');
				if(_parse.length==2) _val = (val[_parse[0]]&&val[_parse[0]][_parse[1]])?val[_parse[0]][_parse[1]]:'';
				if(column.linkTo==true) {
					if(column.module)
					_value=<Link href="/[...page]" as={"/"+column.module+"/"+`?${column.fieldName}=${val['id']}&status=1`}><a><span>{_val}</span></a></Link>
					else _value=<Link href="/[...page]" as={"/"+this.state.module+"/"+val['id']+'/edit'}><a><span>{_val}</span></a></Link>
				}
				else _value=<span>{_val?_val.toString():''}</span>;
				break;
		}
		return _value;
	}
	
	render(){
		let {isCheck,limit,data,total,isSorting,isSort,isLoading} = this.state;
		let _errArr = this.state.errors;
		return(
			<React.Fragment>
				<div className={`infoHead ${this.props.stateStatus.asideMinimize ? 'asideMinimize' :''}`}>
					<Stack spacing={2}>
						<h2 style={{marginLeft:'25px'}} >{this.props.nameDisplay} <span className="Total">Tổng: {formatNum(this.state.total)}</span></h2>
					</Stack>
				</div>

				<div id="contentWrapper" className="stickyContainer">
					<div className="toolSearch">
						{(this.state.module!=''&&!this.props?.router?.query?.token)&&
						<div className="d-flex align-items-center wp-100 justify-content-between">
							<div className="resultInfo">
								{this.props.search&&
								<div className={"formSearch "+('me-4')}>
									<form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
										<div className="block">
											<input type="text" name="search" value={this.state.values.search||''} onChange={this.handleChangeValue} placeholder="Nội dung tìm kiếm ..." />
											<button type="submit">
												<i className="fal fa-search"></i>
											</button> 
										</div>
									</form>
									{this.props.customSearch &&
										<div className="customSeach">
											<span className="">{this.props.customSearchTitle}</span>
											<Switch name="customSearchStatus" onChange={this.handleCustomSearch} checked={this.state.customSearchStatus?this.state.customSearchStatus:false} />
										</div>
									}
								</div>
								}
							</div>

							<div className="searchContainer">
								{isCheck.length>0?
								<div className="resultSeleted d-flex align-items-center">
									<p>{isCheck.length} đã chọn</p>
									<Button className="btn btn-lightColor-danger font-weight-bold ms-3" variant="contained" onClick={this.handleOpenPopupDelete}>
										<i className="far fa-trash-alt"></i>
										Deleted
									</Button>
								</div>
								:
								<>
									{this.props.isBtnImport&&
									<Button className="btn btn-primary font-weight-bold ms-4" variant="contained" data-module={this.state.module}  data-title="Import" data-width={this.props.maxWidthPopup} onClick={this.handleImportLayout} data-type={(this.props.type?this.props.type:'default')} data-scroll="body">
										<i className="far fa-file-upload"></i>
									Import
									</Button>
									}
									{(this.props.export)&&
									<Box className="ms-4">
										<FormControl fullWidth className="selectCustom export">
											
											{this.props.exportMultiple===true?
											<div className="exportMultiple__root">
												<div className="exportMultiple__button">
													<Button className={"btn font-weight-bold "+(this.state.isLoadingExport?'btn-disabled':'btn-blue')} variant="contained" onClick={this.handleStatusExportOpen}>
														<i className="far fa-file-download"></i>
														Export
														{this.state.isLoadingExport&&<Spinkit name="sk-fading-circle" color="white" className="ml-5" />}
													</Button>
												</div>

												<Select
													displayEmpty
													value=''
													onChange={this.handleExport}
													open={this.state.statusExport}
											        onClose={this.handleStatusExportClose}
											        onOpen={this.handleStatusExportOpen}
												>	
													{this.props.exportMultipleValue.map((v,k)=>
						   								<MenuItem key={k} value={v.link}>{v.label}</MenuItem>
						   							)}
												</Select>
											</div>
											:
											<Button className={"btn btn-primary font-weight-bold "+(this.state.isLoadingExport?'btn-disabled':'btn-blue')} variant="contained" onClick={this.handleExport} disabled={this.state.isLoadingExport?true:false}>
												<i className="far fa-file-download"></i>
												Export
												{this.state.isLoadingExport&&<Spinkit name="sk-fading-circle" color="white" className="ml-5" />}
											</Button>
											}
										</FormControl>
									</Box>
									}

									{this.props.isBtnFilter&&
									<Button className="btn btn-primary font-weight-bold ms-4" variant="contained" onClick={this.handleFilter}>
										<i className="fas fa-filter"></i>
										Bộ lọc
									</Button>
									}
									
									{(this.props.isBtnAdd &&
										<Button className="btn btn-primary font-weight-bold ms-4" variant="contained" component="a" data-title="Thêm mới" data-width={this.props.maxWidthPopup} onClick={this.handleFormLayout} data-type={(this.props.type ? this.props.type : 'default')} data-scroll="body">
											Thêm mới
										</Button>
									)}

								</>
								}
							</div>
						</div>
						}
					</div>
					
					<div className="card">
						<div className="card-body pt-0">
							<div className="table-container">
								<table border={0} cellPadding={0} cellSpacing={0}>
									<thead>
										<tr>
				   							<th width={60}>STT</th>
				   							{this.props.columns.map(column =>(
				   								<th 
				   									key={column.key}
				   									data-column={column.key}
				   									width={((column.width)?column.width:'')}
				   									className={((column.center)?'text-center p-0 ':'') + ((column.sort)?'sort ':'') + ((isSorting==column.key&&isSort=='asc')?'sorting sortingAsc':'') + ((isSorting==column.key&&isSort=='desc')?'sorting sortingDesc':'')}
				   									onClick={column.sort&&this.handleSort}
				   								>
				   									{column.label}
				   								</th>
				   							))}
				   							{!this.props.hideAction&&
				   							<th width={90} className="text-center p-0">Hành động</th>
				   							}
				   						</tr>
									</thead>
					  				
					  				{isLoading?
				  					<tbody className="">
				  						<tr>
		  									<td style={{padding:'50px 0',border:'0',fontSize:'1.6rem'}} className="text-center" colSpan={this.props.columns.length + 3}>
		  										<div className="d-flex">
		  											<span style={{fontSize: '2rem'}}>Loading data</span>
		  											<div className="dot-pulse" style={{top:'17px'}}>
		  												<span></span>
		  											</div>
		  										</div>
		  									</td>
		  								</tr>
				  					</tbody>
					  				:
					  				<tbody className="">
			  							{data?.length>0?
			  								data.map((result,k)=>(
			  								<tr key={this.state.module+'_'+k}>
					   							<td>{k+1+((this.state.page-1)*this.state.limit)}</td>
					   							{this.props.columns.map(column=>
					   								<td 
					   									key={column.key}
					   									className={((column.center)?'text-center p-0 ':'')}
					   								>
					   									{this.showValue(result,column)}
					   								</td>
					   							)}
					   							{!this.props.hideAction&&
					   								<td className="p-0">
						   								<div className="d-flex">
															{	this.props.showActionDetail &&
																  <Button className="tt-btn btn btn-light" data-module={this.state.module} data-id={result.id} data-title="Chi tiết" data-width={this.props.maxWidthPopup} onClick={this.handleDetailLayout} data-type={(this.props.type?this.props.type:'default')} data-scroll="body">
																  <i className="far fa-eye"></i>
															  </Button>
															}
															{
																!this.props.hideActionEdit && <>
																	<Button className="tt-btn btn btn-light" data-module={this.state.module} data-id={result.id} data-title="Chỉnh sửa" data-width={this.props.maxWidthPopup} onClick={this.handleFormLayout} data-type={(this.props.type?this.props.type:'default')} data-scroll="body">
						   												<i className="far fa-edit"></i>
						   											</Button>
																</>
															}
															{
																this.props.showActionShare && <>
																	<Button className="tt-btn btn btn-light" data-id={result.id} onClick={this.handleOpenPopupShare}>
																		<i class="far fa-share"></i>
																	</Button>
																</>
															}
															{
																!this.props.hideActionDel && <>
																	<Button className="tt-btn btn btn-light" data-id={result.id} onClick={this.handleOpenPopupDelete}>
																		<i className="far fa-trash-alt"></i>
																	</Button>
																</>
															}
															{
																this.props.showActionMerger && <>
																	<Button className="tt-btn btn btn-light" data-id={result.email}  data-module={this.state.module}  data-title="Merger thông tin" data-width={this.props.maxWidthPopup} onClick={this.handleMergerLayout}>
																		<i className="far fa-light fa-clipboard-list-check"></i>
																	</Button>
																</>
															}
						   								</div>
						   							</td>
					   							}
					   						</tr>
			  							))
										:
			  								<tr>
			  									<td style={{padding:'50px 0',border:'0',fontSize:'1.6rem'}} className="text-center" colSpan={this.props.columns.length + 3}>Không có dữ liệu</td>
			  								</tr>
			  							}
			  						</tbody>
					  				}
			  					</table>
							</div>
						</div>

						{data?.length>0&&
						<div className="card-footer">
							<div className="d-flex justify-content-between wp-100">
								<div className="listBox">
									<Box sx={{ minWidth: 75 }}>
										<FormControl fullWidth className="selectCustom">
											<Select
												id="limit-select"
												value={limit}
												onChange={this.handleChangeLimit}
											>
												<MenuItem value="10">10</MenuItem>
												<MenuItem value="20">20</MenuItem>
												<MenuItem value="40">40</MenuItem>
												<MenuItem value="100">100</MenuItem>
											</Select>
										</FormControl>
									</Box>
								</div>

								{total>limit&&
								<Stack spacing={2} className="pagination">
									<Pagination count={(Math.ceil(total/limit)>Math.ceil(100000/limit))?Math.ceil(100000/limit):Math.ceil(total/limit)} shape="rounded" onChange={this.handlePagination} />
								</Stack>
								}
							</div>
						</div>
						}
					</div>
				</div>

				{this.props.isBtnFilter&&
					<FilterLayout get={this.getData} status={this.props.stateStatus.filter} fields={this.props.filters} module={this.state.module} filterData={this.props?.getFilterData} query={this.props.router?.query??''} defaultValue={this.state.defaultValue}/>
				}

				<Dialog
					className="tt-dialog"
					open={this.state.isDelete}
					onClose={this.handleClosePopupDelete}
					maxWidth="xs"
					fullWidth={true}
				>
					<DialogTitle>
						<div className="d-flex justify-content-between border-0">
							<h4>Bạn có chắc muốn {'xóa'}?</h4>
						</div>
					</DialogTitle>

					<DialogActions>
						<div className="d-flex justify-content-end border-0">
							<Button className="btn btn-light btn-active-primary font-weight-bold" variant="contained" onClick={this.handleClosePopupDelete}>
								Hủy
							</Button>
							<Button onClick={this.handleDelete} className="btn btn-primary font-weight-bold ms-3" variant="contained">
								Đồng ý
							</Button>
						</div>
					</DialogActions>
				</Dialog>

			</React.Fragment>
		)
	}
}

const mapStateToProps=state=>{
	return {
		stateStatus:state.status,
		stateAccount:state.account
	}
}

const mapDispatchToProps=dispatch=>{
	return{
		setFilter:val=>{dispatch(setFilter(val))},
		setFormLayout:val=>{dispatch(setFormLayout(val))},
		handleSuccess:msg=>{dispatch(handleSuccess(msg))},
		handleFailure:msg=>{dispatch(handleFailure(msg))},
		setRoleLayout:val=>{dispatch(setRoleLayout(val))},
		setDetailLayout:val=>{dispatch(setDetailLayout(val))},
		setImportLayout:val=>{dispatch(setImportLayout(val))},
		setMergerLayout:val=>{dispatch(setMergerLayout(val))},
		refreshToken: (params) => {
			dispatch(refreshToken(params));
		  },
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ListLayout));
"use strict";

/* Package System */
import React from "react";
import Router,{withRouter} from 'next/router';
import {connect} from 'react-redux';
import _ from 'lodash';

/* Package Application */
import { handleFailure, handleSuccess, setRoleLayout} from '@features/Status';
import {FormControl,InputLabel,Checkbox,TextField,Box,DialogContent,MenuItem,FormControlLabel,Tooltip,DialogActions,Button} from '@mui/material';
import {fetchApi,postApi,putApi,capitalize,cleanEmpty} from '@utils/Helper';

class RoleLayout extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			module:props.router.query.pages[0]??'',
			id:props.stateStatus?.roleLayout?.id??'',
			data:{},
			values:{},
			errors:[],
			modules:[],
			isCheckedAll: false,
			isCheck : [],
			isLoading: false
		}
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	async componentDidMount(){
		this._isMounted = true;
		if(this.state.id!=''&&!this.props?.router?.query?.token){
			let _result;
			let _url = process.env.PREFIX_API+this.state.module;
			_result = await fetchApi(_url+'/'+this.state.id,this.props.stateAccount.access_token);
			if(_result?.data?.permissions){
				let _permissions = JSON.parse(_result.data.permissions);
				let _modules = [];
				for(let [_k,_v] of Object.entries(_permissions)){
					if(_v.read==true) _modules.push('role_r_'+_k);
					if(_v.write==true) _modules.push('role_w_'+_k);
					if(_v.create==true) _modules.push('role_c_'+_k);
					if(_v.delete==true) _modules.push('role_d_'+_k);
				}
				this._isMounted&&this.setState({isCheck:_modules});
			}
			this._isMounted&&this.setState({values:{..._result.data}});
		}
		// Get Data
		if(this.props.getData&&!this.props?.router?.query?.token){
			for (const [key, value] of Object.entries(this.props.getData)) {
				let _url = (value.indexOf('http')>=0)?value:process.env.PREFIX_API+value;
				let _data = await fetchApi(_url,this.props.stateAccount.access_token);
				if(_data?.status=='success'){
					this._isMounted&&this.setState({modules:_data?.data});
				}
			}
		}
	}

	handleRoleLayout = () => {
		let _status = !this.props.stateStatus.roleLayout.status;
		this.props.setRoleLayout({status:_status,title:'',width:'',type:''});
	}

	handleChangeValue=async(e)=>{
		let _value = e.target.type==='checkbox' ? e.target.checked : e.target.value;
		let _err = this.state.errors;
		let _findKey = _.findIndex(_err,{'key':e.target?.name});
		if(_value!=''){
			delete _err[_findKey];
			this.setState({errors:_err})
		}
		if(e.target.type==='checkbox'){
			const { checked } = e.target;
			const name = e.target.name;
			if (!checked) {
				this.setState({ isCheck: this.state.isCheck.filter(item => item != name)})
			}else{
				this.setState({ isCheck: [...this.state.isCheck, name]})
			}
		}else{
			this.setState({values:{...this.state.values,[e.target.name]:_value}});
		}
		
	}

	handleSelectedAll=async(e)=>{
		this.setState({ isCheckedAll: !this.state.isCheckedAll });
		
		if(this.state.isCheckedAll){
			this.setState({ isCheck: [] });
		}else{
			let _modules = [];
			// _modules.push('role_r_default');
			// _modules.push('role_w_default');
			// _modules.push('role_d_default');
			this.state.modules.map(v=>{
				_modules.push('role_r_'+v.module);
				_modules.push('role_w_'+v.module);
				_modules.push('role_c_'+v.module);
				_modules.push('role_d_'+v.module);
			})
			this.setState({isCheck:_modules});
		}
	}

	handleSubmit=async e=>{
		e.preventDefault();
		let _form = document.getElementById('form');
		let _data = new FormData(_form);
		if(this.state.isLoading==false&&cleanEmpty(this.state.errors).length<=0){
			this.setState({isLoading:true});
			let _obj = {};
			_obj.permissions = {
				// default:{
				// 	'read':this.state.isCheck.includes('role_r_default'),
				// 	'write':this.state.isCheck.includes('role_w_default'),
				// 	'create':this.state.isCheck.includes('role_c_default'),
				// 	'delete':this.state.isCheck.includes('role_d_default')
				// }
			};
			_data.forEach((val,key)=>{
				if(key=='name' || key=='level' || key=='db_filters') _obj[key] = (val&&val!=null?val:'');
			});

			this.state.modules.map(v=>{
				_obj.permissions[v.module] = {
					'read':this.state.isCheck.includes('role_r_'+v.module),
					'write':this.state.isCheck.includes('role_w_'+v.module),
					'create':this.state.isCheck.includes('role_c_'+v.module),
					'delete':this.state.isCheck.includes('role_d_'+v.module)
				}
			})
			_obj.permissions = JSON.stringify(_obj.permissions);

			//Remove object empty
			for(let _key in _obj){
				if(_.isString(_obj[_key])==true&&_.isEmpty(_obj[_key])==true){
					delete _obj[_key];
				}
			}

			let _result;
			let _url = process.env.PREFIX_API+this.state.module;
			if(this.state.id=='') _result = await postApi(_url,_obj,this.props.stateAccount.access_token);
			else {
				_result = await putApi(_url+'/'+this.state.id,_obj,this.props.stateAccount.access_token).then(resp=>resp).catch(e=>e);
			}

			if(_result==''||_result.status=='success'){
				if(this.state.id==''&&this.props.stateStatus?.formLayout?.type&&this.props.stateStatus?.formLayout?.type!='Profile'){
					this._isMounted&&this.props.handleSuccess('Thêm mới thành công');
					setTimeout(()=>{
						this._isMounted&&this.setState({isLoading:false,errors:[]});
						('Router.push/'+this.state.module);
					},1000);
				}else{
					this._isMounted&&this.props.handleSuccess('Cập nhật thành công');
					setTimeout(()=>{
						this._isMounted&&this.setState({isLoading:false,errors:[]});
						if(!this.props.stateStatus?.formLayout?.type){
							Router.push('/'+this.state.module);
						}
						//this.props.stateStatus.formLayout.get();
					},1000);
				}
				this.props.setRoleLayout(false);
			}else{
				if(typeof _result.response.data.errors?.msg==='string'){
					this._isMounted&&this.props.handleFailure(_result.response.data.errors.msg);
				}else{
					this._isMounted&&this.setState({errors:_result.response.data.errors});
				}
				this._isMounted&&this.setState({isLoading:false});
			}
		}
	}

	render(){
		let {values,isCheck}= this.state;
		let _findKey;
		let _errArr = this.state.errors;
		let _groupName = '';
		let _modules = this.state.modules;
		_modules.map(v=>{let n = v.name.split(' - '); v.group_name = n[0];});
		if(_errArr?.length>0) _findKey = _.findIndex(_errArr,{'key':'name'});
		let {is_admin} = this.props.stateAccount;
		return(
			<>
				<div className="role-root">
					<form id="form" onSubmit={this.handleSubmit}>
						<DialogContent>
							<div className="row">
								<div className="col-lg-12">
									<div className="card">
										<div className="cardBody">
											<div className="form-root p-0">
												<div className="_r">
													<div className="row">
														<div className="col-lg-12">
															<label htmlFor="role-name" className="formLabel">
																<strong style={{fontSize:'1.8rem'}}>Role name</strong>
																<span className="ms-1 color-primary">*</span>
															</label>
														</div>

														<div className="col-lg-12">
															<TextField
																helperText={_findKey>=0?_errArr[_findKey].msg:''}
																error={_findKey>=0?true:false}
																name='name'
																value={this.state.values['name']||''}
																onChange={this.handleChangeValue}
															/>
														</div>

														{/* <div className="col-lg-12">
															<label htmlFor="role-name" className="formLabel">
																<strong style={{fontSize:'1.8rem'}}>Level</strong>
																<span className="ms-1 color-primary">*</span>
															</label>
														</div>

														<div className="col-lg-12">
															<TextField
																helperText={_findKey>=0?_errArr[_findKey].msg:''}
																error={_findKey>=0?true:false}
																name='level'
																value={typeof(this.state.values['level']!==undefined)?this.state.values['level']:''}
																onChange={this.handleChangeValue}
															/>
														</div> */}
														{is_admin&&<>
														<div className="col-lg-12">
															<label htmlFor="role-name" className="formLabel">
																<strong style={{fontSize:'1.8rem'}}>Data Filter</strong>
															</label>
														</div>

														<div className="col-lg-12">
															<TextField
																helperText={_findKey>=0?_errArr[_findKey].msg:''}
																error={_findKey>=0?true:false}
																name='db_filters'
																value={typeof(this.state.values['db_filters']!==undefined)?this.state.values['db_filters']:''}
																onChange={this.handleChangeValue}
															/>
														</div>
														</>}
													</div>
												</div>

												<div className="_r">
													<div className="row">
														<div className="col-lg-12">
															<label className="formLabel">
																<strong style={{fontSize:'1.8rem'}}>Role Permissions</strong>
															</label>
														</div>
													</div>
												</div>

												<div className="_r">
													<div className="row align-items-center">
														<div className="col-lg-4">
															<label className="formLabel">
																Administrator Access 
																<Tooltip title="Rule" arrow placement="right">
																	<i className="fas fa-info-circle ms-2"></i>
																</Tooltip>
															</label>
														</div>

														<div className="col-lg-8">
															<div className="row">
																<div className="col-lg-4">
																	<FormControl component="fieldset">
																		<FormControlLabel 
																			className="wp-100"
																			control={
																				<Checkbox 
																					name="all" 
																					onChange={this.handleSelectedAll}
																					icon={<span className="cbx" />} 
																					checkedIcon={<span className="cbx cbx-primary" />}
																					checked={this.state.isCheckedAll}
																				/>
																			} 
																			label="Select all" 
																		/>
																	</FormControl>
																</div>
															</div>
														</div>
													</div>
													
													{_modules&&_.orderBy(_modules,['sort_order'],['asc']).map(module=>{
														let _groupNameHtml = '';
														if(module.group_name !== _groupName){
															_groupName = module.group_name;
															let _groupKey = 'group_'+module.id;
															_groupNameHtml = <label key={_groupKey}className="formLabel"><strong style={{fontSize:'1.5rem',lineHeight:'35px',textDecoration:'underline'}}>{_groupName}</strong></label>;
														}
														return <>{_groupNameHtml}<div key={module.id} className="row align-items-center">
															<div className="col-lg-4">
																<label className="formLabel">
																	{capitalize(module.module)}
																</label>
															</div>

															<div className="col-lg-8">
																<div className="row">
																	<div className="col-lg-3">
																		<FormControl component="fieldset">
																			<FormControlLabel 
																				className="wp-100"
																				control={
																					<Checkbox 
																						name={'role_r_'+module.module}
																						data-name={'role_r_'+module.module}
																						onChange={this.handleChangeValue}
																						icon={<span className="cbx" />} 
																						checkedIcon={<span className="cbx cbx-primary" />}
																						checked={isCheck.includes('role_r_'+module.module)}
																					/>
																				} 
																				label="Read" 
																			/>
																		</FormControl>
																	</div>

																	<div className="col-lg-3">
																		<FormControl component="fieldset">
																			<FormControlLabel 
																				className="wp-100"
																				control={
																					<Checkbox 
																						name={'role_c_'+module.module}
																						data-name={'role_c_'+module.module}
																						onChange={this.handleChangeValue}
																						icon={<span className="cbx" />} 
																						checkedIcon={<span className="cbx cbx-primary" />}
																						checked={isCheck.includes('role_c_'+module.module)}
																					/>
																				} 
																				label="Create" 
																			/>
																		</FormControl>
																	</div>

																	<div className="col-lg-3">
																		<FormControl component="fieldset">
																			<FormControlLabel 
																				className="wp-100"
																				control={
																					<Checkbox 
																						name={'role_w_'+module.module}
																						data-name={'role_w_'+module.module}
																						onChange={this.handleChangeValue}
																						icon={<span className="cbx" />} 
																						checkedIcon={<span className="cbx cbx-primary" />}
																						checked={isCheck.includes('role_w_'+module.module)}
																					/>
																				} 
																				label="Edit" 
																			/>
																		</FormControl>
																	</div>

																	<div className="col-lg-3">
																		<FormControl component="fieldset">
																			<FormControlLabel 
																				className="wp-100"
																				control={
																					<Checkbox 
																						name={'role_d_'+module.module}
																						data-name={'role_d_'+module.module}
																						onChange={this.handleChangeValue}
																						icon={<span className="cbx" />} 
																						checkedIcon={<span className="cbx cbx-primary" />}
																						checked={isCheck.includes('role_d_'+module.module)}
																					/>
																				} 
																				label="Delete" 
																			/>
																		</FormControl>
																	</div>
																</div>
															</div>
														</div>
														</>
													}
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</DialogContent>

						<DialogActions>
							<div className="d-flex justify-content-end">
								<Button className="btn btn-light btn-active-primary font-weight-bold" variant="contained" onClick={this.handleRoleLayout}>
										Cancel
								</Button>
								<Button type="submit" className="btn btn-primary font-weight-bold ms-3" variant="contained">
									Submit
								</Button>
							</div>
						</DialogActions>
					</form>
				</div>
			</>
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
		setRoleLayout:val=>{dispatch(setRoleLayout(val))},
		handleSuccess:msg=>{dispatch(handleSuccess(msg))},
		handleFailure:msg=>{dispatch(handleFailure(msg))}
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(RoleLayout));
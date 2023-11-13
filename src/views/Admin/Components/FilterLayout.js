"use strict";

/* Package System */
import React from "react";
import {connect} from 'react-redux';
const moment = require('moment');

/* Package Application */
const {fetchApi} = require('@utils/Helper');
import { setFilter } from '@features/Status';
import {Button,FormControl,InputLabel,Select,MenuItem,TextField,FormControlLabel,Checkbox,Radio,RadioGroup,Switch,Slider,IconButton,Snackbar,Alert,FormHelperText,Box} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Image from "next/image";


class FilterLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isSelect: '',
			data:{},
			values:{...this.props.defaultValue},
			isAlert: {
				status: false,
				type: '',
				message: ''
			},
			preview: "",
			errors: []
		}
	}

	async componentDidMount(){
		this._isMounted = true;
		// Get Data
		if(this.props.filterData&&this.props.stateAccount.access_token){
			for (const [key, value] of Object.entries(this.props.filterData)) {
				let _url = (value.indexOf('http')>=0)?value:process.env.PREFIX_API+value;
				let optional_headers = {}
				let _data = await fetchApi(_url,this.props.stateAccount.access_token,optional_headers);
				if(_data?.status=='success'){
					this.setState({data:{...this.state.data,[key]:_data.data}});
				}
			}
		}
	}

	async componentDidUpdate(prevProps,prevState){
		if(this.props.filterData && this.props.stateAccount?.access_token!=prevProps?.stateAccount?.access_token){
			for (const [key, value] of Object.entries(this.props.filterData)) {
				let _url = (value.indexOf('http')>=0)?value:process.env.PREFIX_API+value;
				let optional_headers = {}
				let _data = await fetchApi(_url,this.props.stateAccount.access_token,optional_headers);
				if(_data?.status=='success'){
					this.setState({data:{...this.state.data,[key]:_data.data}});
				}
			}
		}
		if(this.props.defaultValue && prevProps.defaultValue != this.props.defaultValue)
			this.setState({values:{...this.state.values,...this.props.defaultValue}})
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	handleChangeValue=e=>{
		let _value = e.target.type==='checkbox' ? e.target.checked : e.target.value;
		this.setState({values:{...this.state.values,[e.target.name]:_value}});
	}

	handleUpload=(e)=>{
		let _err = this.state.errors;
		let _findKey = _.findIndex(_err,{'key':e.currentTarget?.name});
		delete _err[_findKey];
		if(e.currentTarget?.name && e.currentTarget.files[0]){
			if((e.currentTarget.files[0].size/1000)>=5000&&e.currentTarget.files[0].type.indexOf('image')>=0){
				_err.push({key:e.currentTarget?.name,msg:'Hình ảnh phải nhỏ hơn < 5Mb'});
				this.setState({errors:_err})
				return;
			}
			const _oldFile = this.state.oldFile && this.state.id ? this.state.oldFile : this.state.preview[e.currentTarget.name];
			this._isMounted && this.setState({ 'oldFile': _oldFile, preview: { ...this.state.preview, [e.currentTarget.name]: URL.createObjectURL(e.currentTarget.files[0]) } });
			let _reader = new FileReader();
			let _name = e.currentTarget.name;
			
			_reader.onload = async (e) => {
				this._isMounted&&this.setState({values:{...this.state.values,[_name]:e.target.result}});
			}
			_reader.readAsDataURL(e.currentTarget.files[0]);
		}
	}

	handleOpenAlert=async(type,message)=>{
		await this.setState({ isAlert:{...this.state.isAlert,status:true,type:type,message:message} });
	}

	handleCloseAlert = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ isAlert:{...this.state.isAlert,status:false} });
	};

	showFields=field=>{
		let _field;
		let _findKey;
		let _errArr = this.state.errors;
		if (_errArr?.length > 0)
		  _findKey = _.findIndex(_errArr, { key: field.key });

		switch(field.type){
			case 'switch':
				_field = <FormControlLabel control={<Switch size="small" />} label="" />;
				break;
			case 'slider':
				_field = <Slider
							getAriaLabel={() => 'Temperature range'}
							valueLabelDisplay="auto"
							defaultValue={[20, 37]}
						/>;
				break;
			case 'image':
				_field =  (
				<div
					className={"avatarUpload mt-2 " + (_findKey >= 0 ? "error" : "")}
				  >
					<div
					  className={"img " + (this.state.preview[field.key] ? "" : "show")}
					>
					  <Image
						src={
						  this.state.preview[field.key]
							? this.state.preview[field.key]
							: "/images/transparent.png"
						}
						alt="Picture of the author"
						className="img-cover"
						layout="fill"
					  />
		
					  <label
						htmlFor={field.key}
						className="btnInputFile"
						onChange={this.handleUpload}
					  >
						<IconButton
						  color="primary"
						  aria-label="upload picture"
						  component="span"
						>
						  <i className="fal fa-edit"></i>
						</IconButton>
					  </label>
					</div>
					<input
					  accept="image/*"
					  className="inputFile"
					  name={field.key}
					  id={field.key}
					  type="file"
					  onChange={this.handleUpload}
					/>
					<p className="MuiFormHelperText-root">
						{_findKey >= 0 ? _errArr[_findKey].msg : ""}
					</p>
				  </div>);
				break;
			case 'radio':
				//formCheckInline : 1 dòng
				_field = <FormControl component="fieldset">
							<RadioGroup
								name={field.key}
								aria-label="gender"
								value={this.state.values[field.key]||'7_day_ago'}
								onChange={this.handleChangeValue}
							>
								{field.values&&field.values.map(obj=>
								<FormControlLabel key={obj?.value} value={obj?.value} control={<Radio />} label={obj?.label??obj.value} />
								)}
							</RadioGroup>
						</FormControl>;
				break;
			case 'checkbox':
				_field = <FormControl component="fieldset">
							{field.values&&field.values.map(value=>
								<FormControlLabel
									key={value} 
									value={value}
									className="wp-100"
							        control={
							        	<Checkbox 
							        		name="checkbox" 
							        		icon={<span className="cbx" />} 
							        		checkedIcon={<span className="cbx cbx-primary" />} 
						        	/>}
						        	label={value}
						    	/>
							)}
						</FormControl>;
				break;
			case 'select':
				_field = <FormControl fullWidth className="selectCustom">
							<Select
								value={this.state?.values[field.key]??(field?.values?.length>0?(field?.values[0]?.value):'')}
								onChange={this.handleChangeValue}
								name={field.key}
								error={_findKey>=0?true:false}
							>
								{field.values&&field.values.map((v,k)=>
									<MenuItem key={k} value={v?.value}>{v.label}</MenuItem>
								)}
								{this.state.data[field.key]&&this.state.data[field.key].map(value=>
									<MenuItem key={value.id} value={value.id}>{(field?.mapField)?value[field?.mapField]:(value.name?value.name:value.title)}</MenuItem>
								)}
							</Select>
							<FormHelperText>{field.helperText}</FormHelperText>
						</FormControl>;
				break;
			case 'activity_select':
				_field = <FormControl fullWidth className="selectCustom">
							<Select
								value={this.state?.values[field.key]??(field?.values?.length>0?(field?.values[0]?.value):'')}
								onChange={this.handleChangeValue}
								name={field.key}
								error={_findKey>=0?true:false}
							>
								{field.values&&field.values.map((v,k)=>
									<MenuItem key={k} value={v?.value}>{v.label}</MenuItem>
								)}
								{this.state.data[field.key]&&this.state.data[field.key].map(value=>
									<MenuItem key={value.id} value={value.slug}>{(field?.mapField)?value[field?.mapField]:(value.name?value.name:value.title)}</MenuItem>
								)}
							</Select>
							<FormHelperText>{field.helperText}</FormHelperText>
						</FormControl>;
				break;
			case 'dateRanger':
				_field = <LocalizationProvider dateAdapter={AdapterDateFns} localeText={{ start: '', end: '' }}>
							<DateRangePicker
								className="dateRange"
							    value={this.state.values[field.key]||[null,null]}
							    inputFormat="dd-MM-yyyy"
							    onChange={(v)=>{
									// if(v!=''){
									// 	delete _errArr[_findKey];
									// 	this.setState({errors:_errArr});
									// }
									if(field.renderInput&&v[0]!==null&&v[1]!==null){
										const moment = extendMoment(Moment);
										const range = moment.range(v[0], v[1]);
										const rangeMonths = Array.from(range.by('month')).map((el,key) => {
											return el.format('MM-YYYY')
										});
										this.setState({kpiMonth:rangeMonths});
									};
									this.setState({values:{...this.state.values,[field.key]:v}});
								}}
								
							    renderInput={(startProps, endProps) => (
							      	<React.Fragment>
							        	<TextField name={'from'} {...startProps} inputProps={{
								          	...startProps.inputProps,
								          	placeholder: "Từ ngày"
								        }} />
							        	<Box sx={{ mx: 1 }}> to </Box>
							        	<TextField name={'to'} {...endProps} inputProps={{
								          	...endProps.inputProps,
								          	placeholder: "Đến ngày"
								        }} />
							      	</React.Fragment>
							    )}
							/>
						</LocalizationProvider>;
				break;
			case 'date':
				_field = <LocalizationProvider dateAdapter={AdapterDateFns}>
							<div className="formControl mt-3 mb-20">
								<DatePicker
									inputFormat="dd-MM-yyyy"
									value={this.state.values['from']||''}
									onChange={(v)=>{
										this.setState({values:{...this.state.values,['from']:v}});
									}}
									renderInput={(params) => <TextField name="from" className="dateTime" {...params} />}
								/>
							</div>
						</LocalizationProvider>;
				break;
			case 'dateMonthOnly':
				_field = <LocalizationProvider dateAdapter={AdapterDateFns}>
							<div className="formControl mt-3 mb-20">
								<DatePicker
									views={['year', 'month']}
									inputFormat="MM-yyyy"
									value={this.state.values['from']||''}
									onChange={(v) => {
										this.setState({values:{...this.state.values,['from']:v}});
									}}
									renderInput={(params) => <TextField name="from" className="dateTime" {...params} />}
								/>
							</div>
						</LocalizationProvider>;
				break;
			default:
				console.log(this.state.values)
				_field = <TextField
							name={field.key}
							value={this.state.values[field.key]||(field?.defaultValue??'')}
							onChange={this.handleChangeValue}
							error={field.isRequired}
							helperText={field.helperText}
						/>;
				break;
		}
		return _field;
	}

	handleCloseFilter=()=>{
		let _value = false;
		this.props.setFilter(_value);
	}

	handleResetForm=()=>{
		this.setState({values:{},preview:"",oldFile:undefined});
	}

	handleSubmit=e=>{
		e.preventDefault();
		let _obj = {};
		let _form = document.getElementById('formFilter');
		let _data = new FormData(_form);
		let _range = '';
		let _from = '';
		let _to = '';
		const key = this.props.fields?.find(val=>val?.type == 'dateRanger')?.key;
		_data.forEach((val,key)=>{
			_obj[key] = (val&&val!=null ? val:'');
			if(key=='day'&&val=='7_day_ago'){
				_from = moment().subtract(7,'d').format('YYYY-MM-DD');
				_to = moment().subtract(1,'d').format('YYYY-MM-DD');
			}else if(key=='day'&&val=='14_day_ago'){
				_from = moment().subtract(14,'d').format('YYYY-MM-DD');
				_to = moment().subtract(1,'d').format('YYYY-MM-DD');
			}else if(key=='day'&&val=='30_day_ago'){
				_from = moment().subtract(30,'d').format('YYYY-MM-DD');
				_to = moment().subtract(1,'d').format('YYYY-MM-DD');
			}else if(key=='user_images'&&val!=''){
				_obj[key] = this.state.values[key] == "" ? "" :this.state.values[key]
			}
		});
		if((_obj.from&&_obj.from!='')||(_obj.to&&_obj.to)!=''){
			_from = '';
			_to = '';
			if(_obj.from&&_obj.from!='') _from = moment(_obj.from,'DD-MM-YYYY').format('YYYY-MM-DD');
			if(_obj.to&&_obj.to!='') _to = moment(_obj.to,'DD-MM-YYYY').format('YYYY-MM-DD');
		}
		if(_from!='') _range += `${key}:gte`+_from;
		if(_to!=''&&_range=='') _range += `${key}:lte`+_to;
		else if(_to!=''&&_range!='') _range += `,${key}:lte`+_to;

		//Check module demographic
		if(_range!=''||!_range) _obj['range'] = _range;
		this.props.get(_obj);

		// Dong popup khi click apply
		this.handleCloseFilter();
	}

	combineChildren = (data, parentName = '') => {
		const result = [];
	  
		data.forEach(parent => {
		  if (parent.children && parent.children.length > 0) {
			parent.children.forEach(children => {
			  result.push({...children, name: parent.name +' - '+ children.name})
			})
		  }
		});
	  
		return result;
	  }

	render(){
		let {isAlert} = this.state
		return(
			<>
				<div id="filterOverlay" className={(this.props.status)?'open':''} onClick={this.handleCloseFilter}></div>

				<div id="filter" className={(this.props.status)?'open':''}>
					<div className="filterContainer">
						<div className="filterHead">
							<h4>Bộ lọc</h4>
							<Button variant="contained" className="filterClose" onClick={this.handleCloseFilter}>
								<i className="far fa-times-circle"></i>
							</Button>
						</div>
						

						<div className="filterBody form-root">
							<PerfectScrollbar>
								<form id="formFilter">
									{this.props.fields&&this.props.fields.map(field=>
										<div key={field.key} className="_r">
											<label htmlFor={field.key} className="formLabel">{field.label}</label>
											<div className="formControl mt-3">
												{this.showFields(field)}
											</div>
										</div>
									)}

									
									<div className="_r">
										
									</div>
								</form>
							</PerfectScrollbar>
						</div>

						<div className="filterFooter">
							<div className="d-flex">
								<Button className="btn btn-light btn-active-primary font-weight-bold" variant="contained" onClick={this.handleResetForm}>
									Reset
								</Button>
								<Button onClick={this.handleSubmit} className="btn btn-primary font-weight-bold ms-3" variant="contained">
									Apply
								</Button>
							</div>
						</div>
					</div>
				</div>

				{isAlert.type=='success'?
				<Snackbar open={isAlert.status} autoHideDuration={2000} onClose={this.handleCloseAlert}>
			        <Alert variant="filled" severity="success">
						{isAlert.message}
					</Alert>
				</Snackbar>
				:
				<Snackbar open={isAlert.status} autoHideDuration={2000} onClose={this.handleCloseAlert}>
			        <Alert variant="filled" severity="error">
						{isAlert.message}
					</Alert>
				</Snackbar>
				}
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
		setFilter:val=>{dispatch(setFilter(val))}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(FilterLayout);
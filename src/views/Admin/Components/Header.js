"use strict";

/* Package System */
import React from "react";
import Router from 'next/router';
import {connect} from 'react-redux';
import Link from 'next/link';

/* Package Application */
import { setDarkMode,setFormLayout } from '@features/Status';
import { logout } from '@features/Account';
import {AppBar,Toolbar,Button,ClickAwayListener,Breadcrumbs,Typography, Stack } from '@mui/material';
import HideOnScroll from '@views/Admin/Components/HideOnScroll';
const {deleteApi,capitalizeFirstLetter} = require('@utils/Helper');

/* Package style */
import styles from '@public/scss/admin/layouts/Header.module.scss'
import styleDropdown from '@public/scss/admin/components/Dropdown.module.scss'

class Header extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			dropdown: false,
			noti: true,
			notiDropdown: false
		};
	}

	handleDarkMode=()=>{
		let _value = !this.props.stateStatus.darkMode;
		this.props.setDarkMode(_value);
		localStorage.setItem('darkMode',_value);
	}

	handleToggleDropdown=()=>{
		this.setState({dropdown:!this.state.dropdown});
	}

	handleToggleNotiDropdown=()=>{
		this.setState({notiDropdown:!this.state.notiDropdown});
	}

	handleFormLayout=async(e)=>{
		this.setState({dropdown:false});
		let _status = !this.props.stateStatus.formLayout.status;
		let _title = e.currentTarget.dataset.title;
		let _width = e.currentTarget.dataset.width;
		let _type  = e.currentTarget?.dataset?.type??'';
		this.props.setFormLayout({status:_status,title:_title,width:_width,type:_type});
	}

	handleLogout=()=>{
		this.props.logout();
		Router.push('/login');
		deleteApi(process.env.BASE_URL+'/cookie');
	}

	render(){
		const { dropdown,notiDropdown } = this.state;
		let _status = this.props.stateStatus;
		let _account = this.props.stateAccount;
		let _page = this.props.router?.query?.pages??'';
		if(_page!='') _page = _page[0];
		
		return(
			<>
				<div id={styles.AdminHeader}>
					<HideOnScroll  {...this.props}>
						<AppBar id={styles.headerWrapper} className="header">
				          	<Toolbar>
				          		<div className="container-fluid d-flex justify-content-between align-items-center">
				          			<div className={"ms-auto "+ styles.notification}>
				          				{/* {this.state.noti&&
				          					<div className={styles.noti} onClick={this.handleToggleNotiDropdown}></div>
				          				}
				          				<div className={styles.notiIcon}><i className="fas fa-bell"></i></div> */}
				          				
			          					{notiDropdown&&
			          						<ClickAwayListener onClickAway={this.handleToggleNotiDropdown}>
			          							<div className={"animate__animated animate__fadeIn animate__faster mt-4 "+styles.notiList}>
			          								<div className={styles.timelineRoot}>
														<div className={styles.timelineItem}>
															<div className={"fw-bolder text-gray-800 "+styles.timelineLabel}>08:42</div>
															<div className={styles.timelineBadge}>
																<i className="fa fa-genderless text-info fs-1"></i>
															</div>
															<div className={"fw-mormal text-muted ps-3 dots-1" + styles.timelineContent}>Còn 04 ngày tài khoản hết hạn sử dụng quyền lấy dữ liệu</div>
														</div>

														<div className={styles.timelineItem}>
															<div className={"fw-bolder text-gray-800 "+styles.timelineLabel}>08:42</div>
															<div className={styles.timelineBadge}>
																<i className="fa fa-genderless text-warning fs-1"></i>
															</div>
															<div className={"fw-mormal text-muted ps-3 dots-1" + styles.timelineContent}>Còn 05 ngày tài khoản hết hạn sử dụng quyền lấy dữ liệu</div>
														</div>

														<div className={styles.timelineItem}>
															<div className={"fw-bolder text-gray-800 "+styles.timelineLabel}>08:42</div>
															<div className={styles.timelineBadge}>
																<i className="fa fa-genderless text-success fs-1"></i>
															</div>
															<div className={"fw-mormal text-muted ps-3 dots-1" + styles.timelineContent}>Còn 06 ngày tài khoản hết hạn sử dụng quyền lấy dữ liệu</div>
														</div>

														<div className={styles.timelineItem}>
															<div className={"fw-bolder text-gray-800 "+styles.timelineLabel}>08:42</div>
															<div className={styles.timelineBadge}>
																<i className="fa fa-genderless text-danger fs-1"></i>
															</div>
															<div className={"fw-mormal text-muted ps-3 dots-1" + styles.timelineContent}>Còn 07 ngày tài khoản hết hạn sử dụng quyền lấy dữ liệu</div>
														</div>
													</div>
			          							</div>
			          						</ClickAwayListener>
			          					}
				          			</div>
									{Object.keys(_account).length>0&&
					            	<div id="tt-profile__toggle" className="ms-5">
										<div className={styleDropdown.dropdown}>
											<Button className="btn symbol btn-icon btn-gradiant w-40 h-40 font-weight-bold" variant="contained" onClick={this.handleToggleDropdown}>
											{_account?.nickname?capitalizeFirstLetter(_account?.nickname):capitalizeFirstLetter(_account?.email)}
											</Button>
											{dropdown&&
												<ClickAwayListener onClickAway={this.handleToggleDropdown}>
													<div className={"animate__animated animate__fadeIn animate__faster mt-4 "+styleDropdown.dropdownMenu+' '+styleDropdown.dropdownMenuRight}>
														<div className={`${styleDropdown.profileDropdown} ${styleDropdown.profileDropdownArrow}`}>
															<div className={"d-flex align-items-center flex-column bg-gradiant "+styleDropdown.profileDropdownHeader}>
																<div className={styles.avata}>
																	<div className={styles.characters}><h2>{_account?.nickname?capitalizeFirstLetter(_account?.nickname):capitalizeFirstLetter(_account?.email)}</h2></div>
																</div>

																<div className={"text-center text-white mt-3 "+styleDropdown.info}>
																	<h6>{_account?.nickname??_account?.email}</h6>
																</div>
															</div>

															<ul className={styleDropdown.profileDropdownList}>
																<li>
																	<a title="Thông tin tài khoản" data-width="lg" data-type="Profile" onClick={this.handleFormLayout} data-title="Thông tin tài khoản"><i className="far fa-user"></i>Thông tin tài khoản</a>
																</li>
																{/* <li className={styleDropdown.liNoneLink}>
																	<i className="fal fa-eclipse-alt"></i>
																	<span>Dark mode</span>
																	<Switch
																		size="small"
																		defaultChecked={_status.darkMode}
																	    onChange={this.handleDarkMode}
																	    color="primary"
																	    name="checkedB"
																	    inputProps={{ 'aria-label': 'primary checkbox' }}
																	    className="ms-auto"
																	/>
																</li> */}
																<li>
																	<a title="Đăng xuất" onClick={this.handleLogout}><i className="fas fa-sign-out-alt"></i>Đăng xuất</a>
																</li>
															</ul>
														</div>
													</div>
												</ClickAwayListener>
											}
										</div>
									</div>
									}
				          		</div>
				          	</Toolbar>
				        </AppBar>
			        </HideOnScroll>
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
		setDarkMode:val=>{dispatch(setDarkMode(val))},
		setFormLayout:val=>{dispatch(setFormLayout(val))},
		logout:()=>{dispatch(logout())}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Header);
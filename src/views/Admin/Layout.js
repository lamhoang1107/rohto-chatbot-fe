"use strict";

/* Package System */
import React from "react";
import Router,{withRouter} from 'next/router';
import Dynamic from 'next/dynamic';
import {connect} from 'react-redux';

/* Application */
const {capitalize} = require('@utils/Helper');
let FormLayout = '';
let DetailLayout = '';
let RoleLayout = '';
import { setDarkMode,resetStatus,setFormLayout, setDetailLayout, setRoleLayout,setImportLayout,setMergerLayout} from '@features/Status';
import {CssBaseline,Fab,Snackbar,Alert,Dialog,DialogActions,DialogTitle,Button} from '@mui/material';
import BackToTop from '@views/Admin/Components/BackToTop';
import Head from '@views/Admin/Components/Head';
import Header from '@views/Admin/Components/Header';
import Aside from '@views/Admin/Components/Aside';
import Profile from '@modules/Admin/Profile';
import Footer from '@views/Admin/Components/Footer';
/* Package style */
import styles from '@public/scss/admin/layouts/Aside.module.scss';


class Layout extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			status: {
				asideMinimize: false,
			},
		}
	}

	componentDidMount(){
		// if (!this.props.route) {
		// 	console.log("hả")
		// 	Router.push('/login');
		// }
		this.props.setDarkMode(false);
	}

	handleFormLayout = () => {
		let _status = !this.props.stateStatus.formLayout.status;
		this.props.setFormLayout({status:_status,title:'',width:'',type:''});
	}

	handleDetailLayout = () => {
		let _status = !this.props.stateStatus.detailLayout.status;
		this.props.setDetailLayout({status:_status,title:'',width:'',type:''});
	}

	handleRoleLayout = () => {
		let _status = !this.props.stateStatus.roleLayout.status;
		this.props.setRoleLayout({status:_status,title:'',width:'',type:''});
	}
	handleImportLayout = () => {
		let _status = !this.props.stateStatus.importLayout.status;
		this.props.setImportLayout({status:_status,title:'',width:'',type:''});
	}
	handleMergerLayout = () => {
		let _status = !this.props.stateStatus.mergerLayout.status;
		this.props.setMergerLayout({status:_status,title:'',width:'',type:''});
	}

	handleScrollTop=()=>{
		if(typeof window!=="undefined") window.scrollTo({top:0,behavior:'smooth'})
	}

	handleCloseAlert = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		this.props.resetStatus();
	};

	render(){
		let {isFormLayout} = this.state;
		let _status = this.props.stateStatus;
		if(this.props.stateStatus.formLayout.status){
			let _page = this.props.router?.query?.pages??'';
			if(_page!='') _page = _page[0];
			let _folder = capitalize(_page.replace(/ies$/is,'y').replace(/s$/is,''));
			let _title = this.props.stateStatus.formLayout.title;
			if(this.props.stateStatus.formLayout.type=="Profile"){
				FormLayout = Profile;
			}else if(_page=="authorizers"){
				FormLayout = AddAuthen;	
			}else{
				FormLayout = Dynamic(()=>import(/*webpackChunkName:"[request]"*/'@modules/'+_folder+'/Form'));	
			}
		}
		
		if(this.props.stateStatus.detailLayout.status){
			let _page = this.props.router?.query?.pages??'';
			if(_page!='') _page = _page[0];
			let _folder = capitalize(_page.replace(/ies$/is,'y').replace(/s$/is,''));
			let _title = this.props.stateStatus.formLayout.title;
			DetailLayout = Dynamic(()=>import(/*webpackChunkName:"[request]"*/'@modules/'+_folder+'/Detail'));	
		}

		if(this.props.stateStatus.roleLayout.status){
			let _page = this.props.router?.query?.pages??'';
			if(_page!='') _page = _page[0];
			let _folder = capitalize(_page.replace(/ies$/is,'y').replace(/s$/is,''));
			let _title = this.props.stateStatus.formLayout.title;
			RoleLayout = Dynamic(()=>import(/*webpackChunkName:"[request]"*/'@modules/'+_folder+'/Role'));	
		}
		if(this.props.stateStatus.importLayout.status){
			let _page = this.props.router?.query?.pages??'';
			if(_page!='') _page = _page[0];
			let _folder = capitalize(_page.replace(/ies$/is,'y').replace(/s$/is,''));
			FormLayout = Dynamic(()=>import(/*webpackChunkName:"[request]"*/'@modules/'+_folder+'/Import'));	
		}
		if(this.props.stateStatus.mergerLayout.status){
			let _page = this.props.router?.query?.pages??'';
			if(_page!='') _page = _page[0];
			let _folder = capitalize(_page.replace(/ies$/is,'y').replace(/s$/is,''));
			FormLayout = Dynamic(()=>import(/*webpackChunkName:"[request]"*/'@modules/'+_folder+'/Merger'));	
		}
		return(
			<React.Fragment>
				<CssBaseline />
				<Head {...this.props} />

				<div id="tt-root" className={"d-flex flex-grow-1 "+(_status.asideMinimize&&styles.asideMiniminze)} >
					{(this.props.router?.query?.pages&&this.props.router?.query?.pages[0]=='login')
					?<>{this.props.children}</>
					:
					<div id="tt-main" className={"d-flex flex-grow-1 flex-column justify-content-between"+(this.props.router?.query?.token&&this.props.router?.query?.token!=''?' hideAsideMenu':'')}>
						<Aside />

						{/* <Header /> */}

						<div id="tt-content">
							<div className="scroll-inner" id="reviewLoadMore">
								{this.props.children}
							</div>
						</div>
						<Footer />
						<BackToTop {...this.props}>
							<Fab className="btn btn-primary" aria-label="scroll back to top" onClick={this.handleScrollTop}>
								<i className="fas fa-angle-up"></i>
							</Fab>
						</BackToTop>
					</div>
					}
				</div>

				{this.props.stateStatus.formLayout.status&&
				<Dialog
					className="tt-dialog"
					open={this.props.stateStatus.formLayout.status}
					// onClose={this.handleFormLayout}
					scroll="body"
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					fullWidth={true}
					maxWidth={this.props.stateStatus.formLayout.width}
					disableEnforceFocus
				>
					<DialogTitle id="scroll-dialog-title">
						<div className="d-flex justify-content-between">
							<h4>{this.props.stateStatus.formLayout.title}</h4>
							<Button variant="contained" className="popupClose" onClick={this.handleFormLayout}>
								<i className="far fa-times-circle"></i>
							</Button>
						</div>
					</DialogTitle>
					<FormLayout />	
				</Dialog>
				}

				{this.props.stateStatus.detailLayout.status&&
				<Dialog
					className="tt-dialog"
					open={this.props.stateStatus.detailLayout.status}
					onClose={this.handleDetailLayout}
					scroll="body"
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					fullWidth={true}
					maxWidth={this.props.stateStatus.detailLayout.width}
				>
					<DialogTitle id="scroll-dialog-title">
						<div className="d-flex justify-content-between">
							<h4>{this.props.stateStatus.detailLayout.title}</h4>
							<Button variant="contained" className="popupClose" onClick={this.handleDetailLayout}>
								<i className="far fa-times-circle"></i>
							</Button>
						</div>
					</DialogTitle>
					<DetailLayout />	
				</Dialog>
				}

				{this.props.stateStatus.roleLayout.status&&
				<Dialog
					className="tt-dialog"
					open={this.props.stateStatus.roleLayout.status}
					onClose={this.handleRoleLayout}
					scroll="body"
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					fullWidth={true}
					maxWidth={this.props.stateStatus.roleLayout.width}
				>
					<DialogTitle id="scroll-dialog-title">
						<div className="d-flex justify-content-between">
							<h4>{this.props.stateStatus.roleLayout.title}</h4>
							<Button variant="contained" className="popupClose" onClick={this.handleRoleLayout}>
								<i className="far fa-times-circle"></i>
							</Button>
						</div>
					</DialogTitle>
					<RoleLayout />	
				</Dialog>
				}
				{this.props.stateStatus.importLayout.status&&
				<Dialog
					className="tt-dialog"
					open={this.props.stateStatus.importLayout.status}
					onClose={this.handleImportLayout}
					scroll="body"
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					fullWidth={true}
					maxWidth={this.props.stateStatus.importLayout.width}
				>
					<DialogTitle id="scroll-dialog-title">
						<div className="d-flex justify-content-between">
							<h4>{this.props.stateStatus.importLayout.title}</h4>
							<Button variant="contained" className="popupClose" onClick={this.handleImportLayout}>
								<i className="far fa-times-circle"></i>
							</Button>
						</div>
					</DialogTitle>
					<FormLayout />	
				</Dialog>
				}
				{this.props.stateStatus.mergerLayout.status&&
				<Dialog
					className="tt-dialog"
					open={this.props.stateStatus.mergerLayout.status}
					onClose={this.handleMergerLayout}
					scroll="body"
					aria-labelledby="scroll-dialog-title"
					aria-describedby="scroll-dialog-description"
					fullWidth={true}
					maxWidth={this.props.stateStatus.mergerLayout.width}
				>
					<DialogTitle id="scroll-dialog-title">
						<div className="d-flex justify-content-between">
							<h4>{this.props.stateStatus.mergerLayout.title}</h4>
							<Button variant="contained" className="popupClose" onClick={this.handleMergerLayout}>
								<i className="far fa-times-circle"></i>
							</Button>
						</div>
					</DialogTitle>
					<FormLayout />	
				</Dialog>
				}

				<Snackbar open={this.props.stateStatus.status.isSuccessful} autoHideDuration={1000} onClose={this.handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
			        <Alert variant="filled" severity="success">
						{this.props.stateStatus.status.msg.text}
					</Alert>
				</Snackbar>

				<Snackbar open={this.props.stateStatus.status.isFailure} autoHideDuration={1000} onClose={this.handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
			        <Alert variant="filled" severity="error">
						{this.props.stateStatus.status.msg.text}
					</Alert>
				</Snackbar>
			</React.Fragment>
		)
	}
}

const mapStateToProps=state=>{

	return {
		stateStatus:state.status
	}
}

const mapDispatchToProps=dispatch=>{

	return{
		setDarkMode:val=>{dispatch(setDarkMode(val))},
		setFormLayout:val=>{dispatch(setFormLayout(val))},
		setDetailLayout:val=>{dispatch(setDetailLayout(val))},
		setRoleLayout:val=>{dispatch(setRoleLayout(val))},
		resetStatus:val=>{dispatch(resetStatus())},
		setImportLayout:val=>{dispatch(setImportLayout(val))},
		setMergerLayout:val=>{dispatch(setMergerLayout(val))},
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Layout);
"use strict";

/* Package System */
import React from "react";
import Dynamic from 'next/dynamic';
import Router from 'next/router';

/* Application */
import { refresh,renewToken } from '@features/Account';
const {capitalize,parseCookie,postApi,putApi,fetchApi,deleteApi,base64Encode,base64Decode} = require('@utils/Helper');
let renewTimeout = null;

export async function getServerSideProps(ctx) {
	let _params = {};
	let _query = ctx?.query??'';
	let _route = ctx.params?.pages[0]??'';
	let _slug = ctx.params?.pages[1]??'';
	let _id = ctx.params?.pages[2]??'';
	let _sg = parseCookie(ctx.req?.headers?.cookie)['_sg']??'';
	if(ctx?.query?.state){
		let _parseState = ctx?.query?.state.split('|');
		if(_parseState.length==2) _sg = _parseState[1];
	}

	_params = {
		query: _query,
		route: _route,
		slug: _slug,
		id: _id,
		sg: _sg
	}

	return { props: { ..._params } }
}

export default class CorePages extends React.Component {

	constructor(props){
		super(props);
		// props.store.subscribe(()=>console.log('Subscribe:',props.store.getState()));
	}

	refreshToken=async(sg,renew=false)=>{
		let _parse = base64Decode(sg).split(',');
		console.log('Refresh Token...','Start');
		if(_parse.length==2){
			let _info = await postApi(process.env.PREFIX_API+'token',{email:_parse[0],refreshToken:_parse[1]}).then(resp=>resp).catch(e=>e);
			if(_info?.status=='success'){
				if(renew==false){
					let _account = await fetchApi(process.env.PREFIX_API+'me',_info.access_token).then(resp=>resp).catch(e=>e);
					if(_account?.status=='success'){
						_account.result.access_token = _info.access_token;
						_account.result.refresh_token = _info.refresh_token;
						this.props.store.dispatch(refresh(_account));
					}
				}else this.props.store.dispatch(renewToken(_info.access_token));
				let _sg = base64Encode(_parse[0]+','+_info.refresh_token);
				let _cookie ={
					expires:_info.expires,
					sg:_sg
				}
				let result = putApi(process.env.BASE_URL+'/cookie',_cookie);
				if(renewTimeout!=null) clearTimeout(renewTimeout);
				renewTimeout = setTimeout(()=>this.refreshToken(_sg,true),25*60*1000);
				console.log('Refresh Token...','End',renewTimeout);
				return;
			}
		}
		deleteApi(process.env.BASE_URL+'/cookie');
		Router.push('/login');
	}

	async componentDidMount(){
		let _account = this.props.store.getState().account;
		if(this.props.route!='login'&&this.props.sg!=''&&Object.keys(_account).length==0) await this.refreshToken(this.props.sg);
		else if(Object.keys(_account).length==0&&this.props.route!='login'){
			if(this.props.route!='checkin'&&this.props.route!='check-qr'&&this.props.route!='checkin2'&&this.props.route!='test-qr') Router.push('/login');
		}
	}

	componentWillUnmount(){
		clearTimeout(renewTimeout);
	}

	render(){
		try{
			let { route, slug } = this.props;
			let _folder = capitalize(route.replace(/ies$/is,'y').replace(/s$/is,''));
			let _component = slug?'Detail':'List';
			let PageComponent = Dynamic(()=>import('@modules/'+_folder+'/'+_component).catch(err=>{
				if(err.code=='MODULE_NOT_FOUND'){
					return Dynamic(()=>import('@modules/Admin/'+_folder).catch(e=>{
						return Dynamic(()=>import('@modules/Admin/Page404'));
					}));
				}
			}));
			return(
				<PageComponent renewToken={this.refreshToken} {...this.props} />
			)
		}catch(e){
			console.log(1111,e);
		}
	}
}
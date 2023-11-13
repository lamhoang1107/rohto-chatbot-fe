"use strict";

/* Package System */
import React from "react";
import Head from 'next/head';

export default class HeadMeta extends React.Component{

	constructor(props){
		super(props);
	}

	render(){
		let _route = this.props.children.props.route;
		let _title = this.props.meta[_route]?this.props.meta[_route].title:this.props.meta['default'].title;
		let _description = this.props.meta[_route]?this.props.meta[_route].description:this.props.meta['default'].description;
		let _keywords = this.props.meta[_route]?this.props.meta[_route].keywords:this.props.meta['default'].keywords;

		return(
			<>
				<Head>
					<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
					<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no" />
					<meta name="format-detection" content="telephone=no" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta name="description" content={_description} />
					<meta name="keywords" content={_keywords} />
					<meta name="apple-mobile-web-app-capable" content="no"/>
					<title>{_title}</title>
				</Head>
			</>
		)
	}
}
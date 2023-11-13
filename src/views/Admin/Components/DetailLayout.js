"use strict";

/* Package System */
import React from "react";
import Link from 'next/link';
import Router,{withRouter} from 'next/router';
import {connect} from 'react-redux';
import _ from 'lodash';
const moment = require('moment');

/* Package Application */
import { handleFailure, handleSuccess, setDetailLayout, setFormLayout } from '@features/Status';
import {fetchApi,formatNum} from '@utils/Helper';
import ReactApexChart from 'react-apexcharts';

class DetailLayout extends React.Component {

	constructor(props) {
		super(props);
		this._isMounted = false;
		this._timeLoad = null;
		this.state = {
			isLoadedData:false,
			module:props.router.query.pages[0]??'',
			id:props.router.query.pages[1]??'',
			data:{},
			total:{},
			isDelete: false,
			deleteId: '',
			isLoading:false,
			isLoadingExport:false,
			sortCountry:{},
			sortProvince:{},
			totalProvince:{},
			insightAgeGender:{},
			seriesGender:[],
			optionsGender: {
				chart: {
				  type: 'donut',
				},
				title: {
					text: 'Tỉ lệ giới tính của user',
					align: 'center',
					margin: 20
				},
				legend: {
					position: 'top'
				},
				labels: ["Nam", "Nữ", "Không xác định", "Khác"],
				tooltip: {
					enabled: true,
					y: {
						formatter: function(value) {
						  return formatNum(value)
						}
					  }					
				}

			},
			seriesAge:[],
			optionsAge: {
				chart: {
				  type: 'donut',
				},
				title: {
					text: 'Tỉ lệ độ tuổi của user',
					align: 'center',
					margin: 20
				},
				legend: {
					position: 'top'
				},
				labels: ["<18", "18-30","30-40","40-50",">50","Không xác định"],
				tooltip: {
					enabled: true,
					y: {
						formatter: function(value) {
						  return formatNum(value)
						}
					  }					
				}
			},
			next:'',
			dataExport:[],
			sortReviewPosts: '',
			sortPublishPosts: ''
		}
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	async componentDidMount(){
		this._isMounted = true;
		if(this.props.stateAccount?.access_token||(this.state.module=='prompts'&&this.props?.router?.query?.token&&this.props?.router?.query?.token!='')) this.getChartData();
	}

	async componentDidUpdate(prevProps,prevState){
		if(this.props.stateAccount?.access_token!=prevProps?.stateAccount?.access_token&&this.state.isLoadedData==false){
			console.log('Load data');
			// this.getData();
		}
	}

	getChartData = async () => {
		try {
			const chart = { } = await fetchApi(process.env.PREFIX_API + `dashboards`,this.props.stateAccount.access_token);
			
			if (chart?.status == 'success') {
				// Age
				const seriesAge = []
				for (const [key, value] of Object.entries(chart.data.age)) {seriesAge.push(value)}

				// Gender
				const seriesGender = await Promise.all(chart.data.gender.map(async (v) => {
					return v.total}))

				// Province
				let totalProvince = 0
				const seriesProvince = await Promise.all(chart.data.province.map(async (v) => {
					totalProvince = totalProvince + v.total;
					return v.total}))
				this.setState({
					totalcustomers: chart.total,
					totalIndexed: chart.data.indexed,
					seriesGender: seriesGender,
					seriesAge: seriesAge,
					totalProvince:totalProvince,
					sortProvince: chart.data.province
				})
			}
			
			return true;
		} catch (e) {
			console.log(e);
			this.props.handleFailure('Server Error, Please try again later');
		}
	}


	render(){
		let totalOtherProvince = 0

		return(
			<>
				<div className="Detail pe-0">
					<div className="report-wrapper">
						<div className="total-data">
							<div className="ctn">
								<h4>Tổng số user</h4>
								<p>{formatNum(this.state?.totalcustomers??0)}</p>
							</div>
							<div className="ctn">
								<h4>Tổng số khuôn mặt được index</h4>
								<p>{formatNum(this.state?.totalIndexed??0)}</p>
							</div>
						</div>					
						<div className="chart-container">
							<div className="chart">
								<div className="chart-content">
									<ReactApexChart options={this.state.optionsGender} series={this.state.seriesGender} type="donut" width="80%" />
								</div>
							</div>
							<div className="chart">
								<div className="chart-content">
									<ReactApexChart options={this.state.optionsAge} series={this.state.seriesAge} type="donut" width="80%" />
								</div>
							</div>
							<div className="chart" style={{width:'100%'}}>
								<div className="table-container"style={{width:'100%'}}>
									<table>
										<thead>
											<tr>
												<th className="pb-0">Top Provinces</th>
												<th width={130} className="text-end pe-0 pb-0">Số User</th>
												<th width={130} className="text-end pe-0 pb-0">Tỉ lệ</th>
											</tr>
										</thead>
										{this.state.sortProvince&&
										<tbody>
											{Object.entries(this.state.sortProvince).map(([_k,_v],index)=>{
												if(index<10){
													totalOtherProvince = totalOtherProvince + _v.total
													return(<tr key={_v.province}>
														<td>{_v.province? _v.province : "Không xác định"}</td>
														<td className="text-end pe-0">{formatNum(_v.total?_v.total:0)}</td>
														<td className="text-end pe-0"> {(((_v.total/this.state.totalProvince) == Infinity ? 0 : (_v.total/this.state.totalProvince))*100).toFixed(1)}%</td>
													</tr>)
												}
											})}
											{Object.entries(this.state.sortProvince).length > 10 &&
											<tr>
												<td>Others</td>
												<td className="text-end pe-0">{formatNum(this.state.totalProvince - totalOtherProvince)}</td>
												<td className="text-end pe-0">{(((this.state.totalProvince - totalOtherProvince)/this.state.totalProvince)*100).toFixed(1)}%</td>
											</tr>
											}
										</tbody>
										}
									</table>
								</div>
							</div>	
						</div>
					</div>
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
		setDetailLayout:val=>{dispatch(setDetailLayout(val))},
		handleSuccess:msg=>{dispatch(handleSuccess(msg))},
		handleFailure:msg=>{dispatch(handleFailure(msg))},
		setFormLayout:val=>{dispatch(setFormLayout(val))},
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(DetailLayout));
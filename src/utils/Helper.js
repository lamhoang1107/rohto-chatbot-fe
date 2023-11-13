"use strict";

/* Application */
const axios = require('axios');
const apiUrl = process.env.API_URL;

export const fetchApi=async(url,token,_options={})=>{
	let _url;
	if(url.startsWith("http")) _url=url;
	else _url=apiUrl+url;
	if(token!='') _options.headers = {"Authorization":`Bearer ${token}`,..._options.headers};
	return await axios.get(_url,_options).then(resp=>resp?.data??resp).catch(e=>e);
}

export const postApi=async(url,params,token='')=>{
	let _url;
	let _options = {};
	if(url.indexOf("http")!="-1") _url=url;
	else _url=apiUrl+url;
	if(token!='') _options.headers = {"Authorization":`Bearer ${token}`};
	return await axios.post(_url,params,_options).then(resp=>resp?.data??resp).catch(e=>e);
}

export const putApi=async(url,params,token='',_options={})=>{
	let _url;
	if(url.indexOf("http")!="-1") _url=url;
	else _url=apiUrl+url;
	if(token!='') _options.headers = {"Authorization":`Bearer ${token}`};
	return await axios.put(_url,params,_options).then(resp=>resp?.data??resp).catch(e=>e);
}

export const deleteApi=async(url,token='',params='')=>{
	let _url;
	let _options = {};
	if(url.indexOf("http")!="-1") _url=url;
	else _url=apiUrl+url;
	if(token!='') _options.headers = {"Authorization":`Bearer ${token}`};
	if(params!='') _options.data = {ids:params};
	return await axios.delete(_url,_options).then(resp=>resp?.data??resp).catch(e=>e);
}

export const parseCookie=str=>{
	if(str){
		return str.split(';').map(v=>v.split('=')).reduce((cookie,v)=>{
			cookie[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
			return cookie;
		},{});
	}else return '';
}

export const base64Encode=str=>{
	return Buffer.from(str).toString('base64');
}

export const base64Decode=str=>{
	return Buffer.from(str,'base64').toString();
}

export const dateFormat=str=>{
	let _date = new Date(str);
	return  _date.getDate()+'/'+(_date.getMonth() + 1)+'/'+_date.getFullYear();
}

export const cleanEmpty = obj => {
	if (Array.isArray(obj)) { 
	  return obj
		  .map(v => (v && typeof v === 'object') ? this.cleanEmpty(v) : v)
		  .filter(v => !(v == null)); 
	} else { 
	  return Object.entries(obj)
		  .map(([k, v]) => [k, v && typeof v === 'object' ? this.cleanEmpty(v) : v])
		  .reduce((a, [k, v]) => (v == null ? a : (a[k]=v, a)), {});
	} 
}

export const changeToSlug=str=>{
	let _str = str.trim().toLowerCase();

	return _str
		.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi,'a')
		.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi,'e')
		.replace(/i|í|ì|ỉ|ĩ|ị/gi,'i')
		.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi,'o')
		.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi,'u')
		.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi,'y')
		.replace(/đ/gi,'d')
		.replace(/&/g,'-va-')
		.replace(/[^a-z0-9 -]/g,'')
		.replace(/\s+/g,'-')
		.replace(/-+/g,'-')
		.replace(/[^\w\-]+/g,'')
		.replace(/^-+/,'')
		.replace(/-+$/,'')
		.replace(/^-+/,'')
		.replace(/-+$/,'')
}

export const capitalize=str=>{
	if(typeof str==='string'&&str!=''){
		return str.charAt(0).toUpperCase() + str.slice(1);
	}else return '';
}

export const uppercaseStr=str=>{
	if(typeof str==='string'&&str!=''){
		return str.toUpperCase();
	}else return '';
}

export const capitalizeFirstLetter = (string) => {
	if(typeof string==='string'&&string!=''){
		return string.charAt(0).toUpperCase();
	}else return '';
}

export const formatView=num=>{
	if(num > 999 && num < 1000000){
		return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
	}else if(num > 1000000){
		return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
	}else if(num > 1000000000){
		return (num/1000000).toFixed(1) + 'B'; // convert to M for number from > 1 billion 
	}else if(num < 900){
		return num; // if value < 1000, nothing to do
	}
}

export const formatNum=num=>{
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
}
/**
   * display image in Editor
   */
export const customContentStateConverter = (contentState) => {
	// changes block type of images to 'atomic'
	const newBlockMap = contentState.getBlockMap().map((block) => {
		const entityKey = block.getEntityAt(0);
		if (entityKey !== null) {
			const entityBlock = contentState.getEntity(entityKey);
			const entityType = entityBlock.getType();
			switch (entityType) {
				case "IMAGE": {
					const newBlock = block.merge({
						type: "atomic",
						text: "img",
					});
					return newBlock;
				}
				default:
					return block;
			}
		}
		return block;
	});
	const newContentState = contentState.set("blockMap", newBlockMap);
	return newContentState;
}
export const convertImages = (htmlText) => htmlText.replace(/<div style="text-align:none;"><img/g, '<div style="text-align:center;"><img')
// module.exports = new Helper;

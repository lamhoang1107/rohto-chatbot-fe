"use strict";

/* Package System */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	darkMode:false,
	asideMinimize:false,
	filter:false,
	locale: "vi",
	formLayout: {
		status: false,
		title: '',
		type:'',
		width:''
	},
	detailLayout: {
		status: false,
		title: '',
		type:'',
		width:''
	},
	roleLayout: {
		status: false,
		title: '',
		type:'',
		width:''
	},
	importLayout: {
		status: false,
		title: '',
		type:'',
		width:''
	},
	mergerLayout: {
		status: false,
		title: '',
		type:'',
		width:''
	},
	status:{
		isLoading:false,
		isSuccessful:false,
		isFailure:false,
		isError:false,
		msg:{
			errors:[],
			text:''
		}
	}
}

const statusSlice = createSlice({
	name: 'status',
	initialState,
	reducers: {
		setDarkMode(state,action){
			let _bodyNode = document.getElementsByTagName("body")[0];
			if(action.payload==true){
				_bodyNode.classList.remove('__tt-light-mode');
				_bodyNode.classList.add('__tt-dark-mode');	
			}else{
				_bodyNode.classList.remove('__tt-dark-mode');
				_bodyNode.classList.add('__tt-light-mode');
			}
			state.darkMode = action.payload;
		},
		setAsideMinimize(state,action){
			state.asideMinimize = action.payload;
		},
		setFilter(state,action){
			state.filter = action.payload;
		},
		setFormLayout(state,action){
			return {
				...state,
				formLayout:action.payload
			}
		},
		setDetailLayout(state,action){
			return {
				...state,
				detailLayout:action.payload
			}
		},
		setRoleLayout(state,action){
			return {
				...state,
				roleLayout:action.payload
			}
		},
		setImportLayout(state,action){
			return {
				...state,
				importLayout:action.payload
			}
		},
		setMergerLayout(state,action){
			console.log("action.payload",action.payload)
			return {
				...state,
				mergerLayout:action.payload
			}
		},
		setLoading(state,action){
			state.status.isLoading = action.payload;
		},
		resetStatus(state,action){
			state.status = {...initialState.status};
		},
		handleSuccess(state,action){
			return {
				...state,
				status:{
					...initialState.status,
					isSuccessful:true,
					msg:{
						errors:[],
						text:action.payload
					}
				}
			}
		},
		handleFailure(state,action){
			return {
				...state,
				status:{
					...initialState.status,
					isFailure:true,
					msg:{
						errors:[],
						text:action.payload
					}
				}
			}
		},
		handleErrors(state,action){
			return {
				...state,
				status:{
					...initialState.status,
					isError:true,
					msg:{
						errors:action.payload,
						text:''
					}
				}
			}
		}
	}
})

export const { setDarkMode, setAsideMinimize, setFilter, setFormLayout, setDetailLayout, setRoleLayout, setLoading, resetStatus, handleSuccess, handleFailure, handleErrors,setImportLayout,setMergerLayout } = statusSlice.actions;
export default statusSlice.reducer;
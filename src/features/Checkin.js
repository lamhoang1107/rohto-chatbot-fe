"use strict";

/* Package System */
import Router from 'next/router';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/* Application */
import { handleFailure, handleErrors } from '@features/Status';
const initialState = {};
const {postApi,putApi,base64Encode} = require('@utils/Helper');

export const checkin = createAsyncThunk(
	"account/login",
	async (params, {dispatch,rejectWithValue}) => {
		let _resp = await postApi(process.env.PREFIX_API+'login',params);
		if(_resp?.status=='success'){
			let _info ={
				expires:_resp.result.expires,
				sg:base64Encode(_resp.result.email+','+_resp.result.refresh_token)
			}
			putApi(process.env.BASE_URL+'/cookie',_info);
			return _resp;
		}else{
			if(typeof _resp.response.data.errors.msg==='string'){
				dispatch(handleFailure(_resp.response.data.errors.msg));
				return rejectWithValue({status:'failure'},{msg:_resp.response.data.errors.msg});
			}else{
				dispatch(handleErrors(_resp.response.data.errors));
				return rejectWithValue({status:'error'},{errors:_resp.response.data.errors});
			}
		}
	}
);

const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		logout(state){
			state = {};
			return state;
		},
		refresh(state,action){
			state = action.payload.result;
			return state;
		},
		renewToken(state,action){
			state.access_token = action.payload;
		},
		updateProfile(state,action){
			state.nickname = action.payload.nickname;
			state.avatar = action.payload.avatar;
		}
	},
	extraReducers: {
		[login.fulfilled]: (state, action) => {
			if(action?.payload?.status=='success'){
				state = action.payload.result;
				Router.push('/customer-datas');
				return state;
			}else{
				return state;
			}
		},
		[login.rejected]: (state, action) => {
			return state;
		}
	}
})

export const { logout,refresh,renewToken,updateProfile } = accountSlice.actions;
export default accountSlice.reducer;
"use strict";

/* Package System */
import { configureStore } from '@reduxjs/toolkit';

/* Application */
import statusReducer from '@features/Status';
import accountReducer from '@features/Account';

const store = configureStore({
	reducer: {
		status: statusReducer,
		account: accountReducer
	},
});

export default store;
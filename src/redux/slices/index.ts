import {combineReducers} from '@reduxjs/toolkit';
import commonSlice from './common.slice';
import accountSlice from './account.slice';

const appReducer = combineReducers({
  common: commonSlice.reducer,
  account: accountSlice.reducer,
});

export default appReducer;

export const commonActions = commonSlice.actions;
export const accountActions = accountSlice.actions;

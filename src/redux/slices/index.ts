import {combineReducers} from '@reduxjs/toolkit';
import templateSlice from './template.slice';
import commonSlice from './common.slice';
import accountSlice from './account.slice';
import ticketSlice from './ticket.slice';

const appReducer = combineReducers({
  template: templateSlice.reducer,
  common: commonSlice.reducer,
  account: accountSlice.reducer,
  ticket: ticketSlice.reducer
});

const reducer = (state: any, action: any) => {
  if (action.type === 'LOG_OUT') {
    delete state?.template;
    return appReducer(state, action);
  }
  return appReducer(state, action);
};

export default reducer;

export const templateActions = templateSlice.actions;
export const commonActions = commonSlice.actions;
export const accountActions = accountSlice.actions;
export const ticketActions = ticketSlice.actions;

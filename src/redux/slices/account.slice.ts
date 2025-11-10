// External
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Internal
import SliceName from './slice.name';
import {IAccount} from '../../model/interface/account.interface';

const initialAccountState = {
  dataAccount: {} as IAccount,
  infoResponseLogin: {} as any,
};

const accountSlice = createSlice({
  name: SliceName.Account,
  initialState: initialAccountState,
  reducers: {
    setDataAccountSuccess: (state, action: PayloadAction<IAccount>) => {
      state.dataAccount = action.payload;
    },
    setDataAccountFail: state => {
      state.dataAccount = {};
    },
    fetchAccount: state => {},
    clearAccount: state => {
      state.dataAccount = {};
    },
    setInfoResponseLogin: (state, action: PayloadAction<any>) => {
      state.infoResponseLogin = action.payload;
    },
  },
});

const accountActions = accountSlice.actions;
export default accountSlice;

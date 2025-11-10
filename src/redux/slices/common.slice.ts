// External
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Internal
import SliceName from './slice.name';

const initialCommonState = {
  isAuthorized: false,
  accessToken: '',
  isLoading: false,
  language: 'vi',
  totalNumberNotiUnread: 0,
  storeFromHost: null,
  devicesInfo: {},
  activeRegisterNotify: false,
  isSaveAccount: false,
  currentUserId: null as number | null,
  userEmail: null as string | null,
  userPhone: null as string | null,
  userAvatar: null as string | null,
  userName: null as string | null,
};

const commonSlice = createSlice({
  name: SliceName.Common,
  initialState: initialCommonState,
  reducers: {
    setIsAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTotalNumberNotiUnread: (state, action: PayloadAction<number>) => {
      state.totalNumberNotiUnread = action.payload;
    },
    setStoreFromHost: (state, action: PayloadAction<any>) => {
      state.storeFromHost = action.payload;
    },
    updateDevices: (state, action: PayloadAction<any>) => {
      state.devicesInfo = action.payload;
    },
    setIsSaveAccount: (state, action: PayloadAction<boolean>) => {
      state.isSaveAccount = action.payload;
    },
    setCurrentUserId: (state, action: PayloadAction<number | null>) => {
      state.currentUserId = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<string | null>) => {
      state.userEmail = action.payload;
    },
    setUserPhone: (state, action: PayloadAction<string | null>) => {
      state.userPhone = action.payload;
    },
    setUserAvatar: (state, action: PayloadAction<string | null>) => {
      state.userAvatar = action.payload;
    },
    setUserName: (state, action: PayloadAction<string | null>) => {
      state.userName = action.payload;
    },
  },
});

const commonActions = commonSlice.actions;
export default commonSlice;

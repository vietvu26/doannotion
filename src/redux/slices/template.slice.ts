// External
import {
  createSlice,
  PayloadAction,
  createAction,
  isAnyOf,
} from '@reduxjs/toolkit';

// Internal
import SliceName from './slice.name';

const initialTemplateState = {
  loading: false,
  data: '',
  number: 0,
};

export type UserType = {
  id: string;
  name: string;
  lastname: string;
};

const increment = createAction<string>('counter/increment');

const templateSlice = createSlice({
  name: SliceName.Template,
  initialState: initialTemplateState,
  reducers: {
    todoDemoRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
    },
    todoDemoSuccess: (state, action: PayloadAction<UserType>) => {
      state.loading = false;
      state.data = action.payload.name;
    },
    todoDemoFail: state => {
      state.loading = false;
      state.data = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(increment, (state, action) => {
        state.data = action.payload;
      })
      .addMatcher(
        isAnyOf(increment, templateActions.todoDemoRequest),
        (state, action: PayloadAction<string>) => {
          state.data = action.payload;
        },
      );
  },
});

const templateActions = templateSlice.actions;
export default templateSlice;

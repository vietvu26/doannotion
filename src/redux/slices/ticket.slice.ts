// External
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Internal
import SliceName from './slice.name';
import {IAccount} from '../../model/interface/account.interface';
import {
  IRecipientTicketImpl,
  ITicket,
} from '../../model/interface/service.interface';
import {IOrigin} from '../../model/interface/orgin.interface';
import {ITasksSLA} from '../../app/screens/review-eid/interface';
import {IModeler} from '../../model/interface/modeler.interface';
import {IInfoForm} from '../../app/screens/ticket-detail/components/TabView/components/Document/interface';

const initialAccountState = {
  dataTicketRedux: {} as ITicket,
  dataUserTicket: {} as IAccount,
  dataOrgin: {} as IOrigin,
  recipientDetaiImpl: [] as IRecipientTicketImpl[],
  selectTabBottom: 1,
  dataListRecipientsSLA: [] as ITasksSLA[],
  modeler: {} as IModeler,
  formData: {} as IInfoForm,
  statusPartyRaw: {} as any,
  reloadType: [] as string[],
};

const ticketSlice = createSlice({
  name: SliceName.ticket,
  initialState: initialAccountState,
  reducers: {
    setDataUserTicket: (state, action: PayloadAction<IAccount>) => {
      state.dataUserTicket = action.payload;
    },
    setDataTicket: (state, action: PayloadAction<ITicket>) => {
      state.dataTicketRedux = action.payload;
    },
    setDataOrgin: (state, action: PayloadAction<IOrigin>) => {
      state.dataOrgin = action.payload;
    },
    setSelectTabBottom: (state, action: PayloadAction<number>) => {
      state.selectTabBottom = action.payload;
    },
    setDataRecipientDetailImpl: (
      state,
      action: PayloadAction<IRecipientTicketImpl[]>,
    ) => {
      state.recipientDetaiImpl = action.payload;
    },
    setDataListRecipientsSLA: (state, action: PayloadAction<ITasksSLA[]>) => {
      state.dataListRecipientsSLA = action.payload;
    },
    setModeler: (state, action: PayloadAction<IModeler>) => {
      state.modeler = action.payload;
    },
    setFormData: (state, action: PayloadAction<IInfoForm>) => {
      state.formData = action.payload;
    },
    setStatusPartyRaw: (state, action: PayloadAction<any>) => {
      state.statusPartyRaw = action.payload;
    },
    setReloadType: (state, action: PayloadAction<string[]>) => {
      state.reloadType = action.payload;
    },
  },
});

const ticketActions = ticketSlice.actions;
export default ticketSlice;

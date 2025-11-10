import {create} from 'zustand';
import {INotification} from '../model/interface/notification.interface';

interface ETaskZutandStore {
  totalNotify: number;
  listNotify: INotification[];
  setTotalNotify: (notiQuantity: number) => void;
  setListNotify: (istNotify: INotification[]) => void;
}

const initialSettingState = {
  totalNotify: 0,
  listNotify: [],
};

export const useETaskZutandStore = create<ETaskZutandStore>((set, get) => ({
  ...initialSettingState,
  setTotalNotify: (notiQuantity: number) => {
    set({totalNotify: notiQuantity});
  },
  setListNotify: (listNotify: INotification[]) => {
    set({listNotify});
  },
}));

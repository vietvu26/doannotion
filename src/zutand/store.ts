import {create} from 'zustand';
import {MenuViewItem} from '../model/interface/service.interface';

interface ZutandStore {
  listMenuViewERequest: MenuViewItem[];
  listMenuViewEAccount: MenuViewItem[];
  setListMenuViewERequest: (listMenuView: MenuViewItem[]) => void;
  setListMenuViewEAccount: (listMenuView: MenuViewItem[]) => void;
}

const initialSettingState = {
  listMenuViewERequest: [],
  listMenuViewEAccount: [],
};

export const useZutandStore = create<ZutandStore>((set, get) => ({
  ...initialSettingState,
  setListMenuViewERequest: (listMenuView: MenuViewItem[]) => {
    set({listMenuViewERequest: listMenuView});
  },
  setListMenuViewEAccount: (listMenuView: MenuViewItem[]) => {
    set({listMenuViewEAccount: listMenuView});
  },
}));

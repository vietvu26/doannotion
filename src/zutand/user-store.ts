import {create} from 'zustand';
import {IOrgIn, IUser, IUserGroup} from '../model/interface/account.interface';

interface UserStore {
  listUser: IUser[];
  listOrgIn: IOrgIn[];
  listGroupUser: IUserGroup[];
  listUserInTask: IUser[];
  setListUser: (listUser: IUser[]) => void;
  addUser: (user: IUser) => void;
  deleteUser: (userId: any) => void;
  setListOrgIn: (listOrgIn: IOrgIn[]) => void;
  setListGroupUser: (listGroupUser: IUserGroup[]) => void;
  addGroupUser: (groupUser: IUserGroup[]) => void;
  deleteGroupUser: (groupId: any) => void;
  setListUserInTask: (listUserInTask: IUser[]) => void;
  addListUserInTask: (user: IUser) => void;
  deleteListUserInTask: (userId: any) => void;
}

const initialSettingState = {
  listUser: [],
  listOrgIn: [],
  listGroupUser: [],
  listUserInTask: [],
};

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialSettingState,
  setListUser: (listUser: IUser[]) => {
    set({listUser: listUser});
  },
  setListOrgIn: (listOrgIn: IOrgIn[]) => {
    set({listOrgIn: listOrgIn});
  },
  setListGroupUser: (listGroupUser: IUserGroup[]) => {
    set({listGroupUser: listGroupUser});
  },
  addUser: (user: IUser) => {
    set({listUser: [...get().listUser, user]});
  },
  deleteUser: (userId: any) => {
    set({
      listUser: get().listUser.filter(user => user.id !== userId),
    });
  },
  addGroupUser: (groupUser: IUserGroup[]) => {
    set({listGroupUser: [...get().listGroupUser, ...groupUser]});
  },
  deleteGroupUser: (groupId: any) => {
    set({
      listGroupUser: get().listGroupUser.filter(user => user.id !== groupId),
    });
  },
  setListUserInTask: (listUserInTask: IUser[]) => {
    set({listUserInTask: listUserInTask});
  },
  addListUserInTask: (user: IUser) => {
    const userInList = get().listUserInTask?.find(
      u => u.resourceId === user?.resourceId,
    );
    if (!userInList) {
      set({listUserInTask: [...get().listUserInTask, user]});
    }
  },
  deleteListUserInTask: (userId: any) => {
    set({
      listUserInTask: get().listUserInTask.filter(user => user.id !== userId),
    });
  },
}));

import {useUserStore} from '../../../../../zutand/user-store';
import {useEffect, useState} from 'react';
import {
  IOrgIn,
  IUserGroup,
} from '../../../../../model/interface/account.interface';
import {View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Color} from '../../../../../constants';
import {useUserService} from '../../../../../hooks/apiHooks/useAPI';
import {AssignGroupList} from '../../../../screens/task-detail/components/task-detail-item/helper';
import {set} from 'lodash';
import {useTranslation} from 'react-i18next';

type Props = {
  assignGroupUserList: AssignGroupList[] | undefined;
  setAssignGroupUserList: (
    assignGroupUserList: AssignGroupList[] | undefined,
  ) => void;
  type: 'L' | 'T' | 'C';
  resourceId: string | undefined;
};

const GroupUser = ({
  assignGroupUserList,
  setAssignGroupUserList,
  type,
  resourceId,
}: Props) => {
  const {t} = useTranslation();
  const {listOrgIn, addGroupUser} = useUserStore();

  const [setListOrginState] = useState<IOrgIn[]>(listOrgIn);
  const [userGroups, setUserGroups] = useState<IUserGroup[]>([]);
  const [open, setOpen] = useState(false);
  const [openGroupUser, setOpenGroupUser] = useState(false);
  const [value, setValue] = useState<string>('');
  const [valueGroupUser, setValueGroupUser] = useState<number[] | null>(null);

  const UserServices = useUserService();

  useEffect(() => {
    if (value) {
      handleSelect(value);
    }
  }, [value]);

  useEffect(() => {
    if (valueGroupUser) {
      const filterGroupUser =
        userGroups?.filter(g => valueGroupUser?.includes(g.id)) || [];
      addGroupUser(filterGroupUser);
      handleSelectGroup(valueGroupUser);
    }
  }, [valueGroupUser]);

  const handleSelectGroup = (valueGroupUserSelect: any[]) => {
    if (valueGroupUserSelect) {
      const groupOtherOrgIn =
        assignGroupUserList?.filter(group => group?.orgIn !== value) || [];
      const groupSameOrgIn =
        assignGroupUserList?.filter(group => group?.orgIn === value) || [];
      const listGroupSelect = userGroups
        ?.filter((group: IUserGroup) =>
          valueGroupUserSelect?.find(g => g === group?.id),
        )
        .map((group: IUserGroup) => {
          const groupInList = groupSameOrgIn?.find(
            g => g.groupId === group?.id,
          );
          if (groupInList) return groupInList;
          return {
            id: `${new Date().getTime().toString()}`,
            resourceId: resourceId,
            orgIn: group.orgIn,
            custId: group.custId,
            type: type,
            groupId: group.id,
          } as unknown as AssignGroupList;
        });
      setAssignGroupUserList([...listGroupSelect, ...groupOtherOrgIn]);
    }
  };

  const handleSelect = async (value: string) => {
    try {
      setValue(value);
      const params = {
        orgIn: value,
        page: 0,
        size: 10000,
        sort: 'createdDate,desc',
      };
      const body = {
        search: '',
      };

      const data = await UserServices.groupSearch(body, params);
      if (data) {
        setUserGroups(data);
        const listGroupSelect = data
          ?.filter((group: IUserGroup) =>
            assignGroupUserList?.find(g => g.groupId === group?.id),
          )
          .map((group: IUserGroup) => group.id);
        if (listGroupSelect?.length > 0) {
          setValueGroupUser(listGroupSelect);
        } else {
          setValueGroupUser(null);
        }
      }
    } catch (error) {}
  };

  return (
    <View style={{padding: 10}}>
      <View style={{zIndex: open ? 1 : 0}}>
        <DropDownPicker
          open={open}
          value={value}
          items={listOrgIn.map(org => ({
            ...org,
            value: org.orgIn,
            label: org.name,
          }))}
          searchable
          setOpen={value => {
            setOpen(value);
            setOpenGroupUser(false);
          }}
          setValue={setValue}
          setItems={setListOrginState}
          placeholder={t('board.select-department')}
          style={{
            borderRadius: 8,
            borderColor: Color.borderColor,
          }}
          searchContainerStyle={{
            borderColor: Color.borderColor,
          }}
          searchTextInputStyle={{
            borderColor: Color.borderColor,
          }}
          dropDownContainerStyle={{
            borderColor: Color.borderColor,
          }}
          searchPlaceholderTextColor={Color.Text}
          placeholderStyle={{
            color: Color.Text,
          }}
        />
      </View>

      {userGroups?.length > 0 && (
        <View style={{zIndex: openGroupUser ? 1 : 0, marginTop: 16}}>
          <DropDownPicker
            multiple={true}
            open={openGroupUser}
            value={valueGroupUser}
            items={userGroups.map(group => ({
              ...group,
              value: group.id,
              label: group.name,
            }))}
            searchable
            setOpen={value => {
              setOpenGroupUser(value);
              setOpen(false);
            }}
            setValue={setValueGroupUser}
            setItems={setUserGroups}
            placeholder={'Chọn nhóm người dùng'}
            style={{
              borderRadius: 8,
              borderColor: Color.borderColor,
            }}
            searchContainerStyle={{
              borderColor: Color.borderColor,
            }}
            searchTextInputStyle={{
              borderColor: Color.borderColor,
            }}
            dropDownContainerStyle={{
              borderColor: Color.borderColor,
            }}
            searchPlaceholderTextColor={Color.Text}
            placeholderStyle={{
              color: Color.Text,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default GroupUser;

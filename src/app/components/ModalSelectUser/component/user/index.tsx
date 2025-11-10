import {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import useDebounce from '../../../../../hooks/useDebounce';
import {IUser} from '../../../../../model/interface/account.interface';
import {useUserService} from '../../../../../hooks/apiHooks/useAPI';
import TextCM from '../../../Text';
import {Icon, List} from '@ui-kitten/components';
import {Color, Font, String} from '../../../../../constants';
import {useUserStore} from '../../../../../zutand/user-store';
import {
  AssignReviewList,
  AssignTaskList,
} from '../../../../screens/task-detail/components/task-detail-item/helper';
import HeaderCM from '../../../Header/HeaderCM';
import {useTranslation} from 'react-i18next';

type Props = {
  assignUserList: AssignTaskList[] | undefined | AssignReviewList[];
  handleUserSelect: (
    assignUserList: AssignTaskList[] | undefined | AssignReviewList[],
  ) => void;
  type: 'L' | 'T' | 'C';
  resourceId: string | undefined;
  multiple?: boolean;
  id?: string;
  isShowHeader?: boolean;
  onClose?: () => void;
};

const CustomSelectUser = ({
  assignUserList,
  handleUserSelect,
  type,
  resourceId,
  multiple = true,
  id,
  isShowHeader = false,
  onClose,
}: Props) => {
  const {t} = useTranslation();
  const {
    listUser: listUserStore,
    addUser,
    deleteUser,
    addListUserInTask,
  } = useUserStore();
  const uniqueById =
    (assignUserList?.map(user =>
      listUserStore.find(u => u.resourceId === user.userId),
    ) as IUser[]) || [];
  const [valueText, setValueText] = useState('');
  const valueTextDebounce = useDebounce(valueText);
  const [listUser, setListUser] = useState<IUser[]>([]);
  const [listUserSelect, setListUserSelect] = useState<IUser[]>(uniqueById);
  const [userSelect, setUserSelect] = useState<IUser>(uniqueById[0]);
  const [page, setPage] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const UserServices = useUserService();

  useEffect(() => {
    getListUser(0, valueTextDebounce);
  }, [valueTextDebounce]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(0);
    getListUser(0, valueTextDebounce);
  };

  const fetchNextData = () => {
    if (listUser?.length < totalItem) {
      setPage(page + 1);
      getListUser(page + 1, valueTextDebounce);
    }
  };

  const getListUser = async (page: number, valueTextDebounce: string) => {
    try {
      const body = {
        q: valueTextDebounce,
      };
      const params = {
        page: page,
        size: 50,
        role: true,
      };
      const data = await UserServices.getUser(body, params);
      if (data) {
        if (page === 0) {
          setListUser(data.data);
        } else {
          setListUser([...listUser, ...data.data]);
        }
        setTotalItem(data.total);
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleSelect = (item: IUser) => {
    setValueText('');
    const newDataSelect = [...listUserSelect, item];
    setListUserSelect(newDataSelect);
    addUser(item);
    addListUserInTask(item);
    handleUpdateData(newDataSelect);
  };

  const handleUpdateData = (newDataSelect: IUser[]) => {
    const dataFilterUserAssign = newDataSelect.map(user => {
      const userInList = assignUserList?.find(
        u => u.userId === user?.resourceId,
      );
      if (userInList) {
        return userInList;
      }
      return {
        id: `${new Date().getTime().toString()}`,
        resourceId: resourceId,
        orgIn: user?.orgIn,
        custId: user?.custId,
        userId: user?.resourceId,
        type: type,
      } as unknown as AssignTaskList;
    });
    handleUserSelect(dataFilterUserAssign);
  };

  const handleClear = (id: any) => {
    setValueText('');
    const newDataSelect = listUserSelect?.filter(user => user.id !== id);
    setListUserSelect(newDataSelect);
    deleteUser(id);
    // deleteListUserInTask(id);
    handleUpdateData(newDataSelect);
  };

  const handlePress = (item: IUser) => {
    if (!multiple) {
      if (item.resourceId === userSelect?.resourceId) return;
      setUserSelect(item);
      addUser(item);
      handleUserSelect([
        {
          id: id,
          resourceId: resourceId,
          orgIn: item?.orgIn,
          custId: item?.custId,
          userId: item?.resourceId,
          type: type,
        } as unknown as AssignTaskList,
      ]);
      return;
    }
    if (listUserSelect?.find(user => user?.id === item.id)) {
      handleClear(item.id);
    } else {
      handleSelect(item);
    }
  };

  return (
    <>
      {isShowHeader && (
        <HeaderCM
          title=""
          style={{
            backgroundColor: '#fff',
          }}
          contentStyle={{
            backgroundColor: '#fff',
          }}
          titleStyle={{
            color: '#000810',
          }}
          fillIconBackLeft="#000810"
          onPressIconLeft={onClose}
        />
      )}
      <View style={{padding: 10, flex: 1, rowGap: 10}}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: Color.borderColor,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
          allowFontScaling={false}
          placeholder={t('board.select-assignee')}
          placeholderTextColor={Color.Text}
          value={valueText}
          onChangeText={setValueText}
        />

        <List
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={listUser}
          contentContainerStyle={{backgroundColor: '#fff', rowGap: 16}}
          onEndReachedThreshold={0.5}
          onEndReached={fetchNextData}
          renderItem={({item}) => (
            <>
              <TouchableOpacity onPress={() => handlePress(item)}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      columnGap: 8,
                    }}>
                    <Image
                      style={{width: 32, height: 32, borderRadius: 16}}
                      source={{uri: item.imageUrl || String.DEFAULT_IMAGE}}
                    />
                    <View>
                      <TextCM
                        style={{
                          fontSize: 14,
                          fontFamily: Font.InterRegular400,
                          color: Color.Text,
                        }}>
                        {item.personalName}
                      </TextCM>
                      <TextCM
                        style={{
                          fontSize: 12,
                          fontFamily: Font.InterRegular400,
                          color: Color.Text07,
                        }}>
                        {item.email}
                      </TextCM>
                    </View>
                  </View>
                  {multiple &&
                    listUserSelect &&
                    listUserSelect?.find(user => user?.id === item?.id) && (
                      <Icon name="checkmark" width={16} height={16} />
                    )}
                  {!multiple && userSelect?.id === item?.id && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        columnGap: 16,
                      }}>
                      <Icon name="checkmark" width={16} height={16} />
                      <Pressable
                        onPress={() => {
                          setUserSelect(null as any);
                          handleUserSelect([]);
                        }}>
                        <Icon name="close" width={16} height={16} />
                      </Pressable>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </>
          )}
        />
      </View>
    </>
  );
};

export default CustomSelectUser;

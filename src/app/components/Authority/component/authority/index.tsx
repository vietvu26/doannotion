import {
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import TextCM from '../../../Text';
import {Divider, Icon, Input, Spinner, Toggle} from '@ui-kitten/components';
import {Color, Font, String} from '../../../../../constants';
import DropdownListWithSearch from '../../../DropdonwWithSearch';
import {useUserStore} from '../../../../../zutand/user-store';
import {Fragment, useEffect, useMemo, useState} from 'react';
import {
  useTaskService,
  useUserService,
} from '../../../../../hooks/apiHooks/useAPI';
import ModalFullScreen from '../../../ModalFullScreen';
import WaitAuthority from '../wait-authority';
import useDebounce from '../../../../../hooks/useDebounce';
import {IAuthSelect, IUserAcl} from '../../interface';
import {ITask} from '../../../../screens/board/store/interface';
import ButtonCM from '../../../Button';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {t} from 'i18next';

type Props = {
  type: 'L' | 'T' | 'C';
  resource?: ITask;
};

const Authority = ({type, resource}: Props) => {
  const {listOrgIn} = useUserStore();
  const [valueOrgInSelect, setValueOrgInSelect] = useState(null);
  const [listData, setListData] = useState<any[]>([]);
  const [listDataInit, setListDataInit] = useState<any[]>([]);
  const [listSelect, setListSelect] = useState<any[]>([]);
  const [listSelectInit, setListSelectInit] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [userAcls, setUserAcls] = useState<IAuthSelect[]>([]);
  const [dataUserAcl, setDataUserAcl] = useState<
    {
      id: string;
      name?: string;
      child: IUserAcl[];
    }[]
  >([]);

  const [showListAuthority, setShowListAuthority] = useState(true);
  const [showListOrgIn, setShowListOrgIn] = useState<{
    [key: string]: boolean;
  }>();
  const [reloadData, setReloadData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search, 200);

  const UserService = useUserService();
  const TaskService = useTaskService();

  const {listOrgIn: listOrgInState} = useUserStore();

  const typeAcl = useMemo(
    () => userAcls?.find(acl => acl?.name === 'all')?.id,
    [userAcls],
  );

  useEffect(() => {
    getUserAcl();
  }, []);

  useEffect(() => {
    getInitUserAcl();
  }, [reloadData]);

  useEffect(() => {
    if (valueOrgInSelect) {
      handleChangeOrgIn(valueOrgInSelect);
    }
  }, [valueOrgInSelect]);

  useEffect(() => {
    if (searchDebounce) {
      const data = listData.filter((item: any) => {
        if (item?.type === 'user') {
          if (
            item?.personalName
              .toLowerCase()
              .includes(searchDebounce.toLowerCase())
          ) {
            return item;
          }
        } else {
          if (item?.name.toLowerCase().includes(searchDebounce.toLowerCase())) {
            return item;
          }
        }
      });
      setListData(data);
    } else {
      setListData(
        listDataInit.map((item: any) => ({
          ...item,
          check: listSelect?.find(l => {
            if (l?.type === 'user') {
              if (l?.resourceId === item?.resourceId) return l;
            } else {
              if (l?.id === item?.id) return l;
            }
          })
            ? true
            : false,
        })),
      );
    }
  }, [searchDebounce]);

  const getUserAcl = async () => {
    try {
      const data = await TaskService.getAclsResource();
      if (data) {
        const newDataFilter = data
          .filter((item: any) => item.name !== 'fe_ignore')
          .map((item: any) => ({
            ...item,
            ...getNameItem(item.name),
          }));
        if (type === 'L') {
          setUserAcls(newDataFilter?.filter((d: any) => d.name !== 'comment'));
        } else {
          setUserAcls(newDataFilter);
        }
      }
    } catch (error) {}
  };

  const getInitUserAcl = async () => {
    try {
      setIsLoading(true);
      const dataFindByResourceIdAndType =
        (await TaskService.getUserAclByResourceIdAndType(
          resource?.id || '',
          type,
        )) as IUserAcl[];
      if (dataFindByResourceIdAndType) {
        const groupIds = dataFindByResourceIdAndType
          .filter(r => !!r.groupUserId)
          .map(r => r.groupUserId);
        const userIds = dataFindByResourceIdAndType
          .filter(r => !!r.userId)
          .map(r => r.userId);

        const dataUserAcl = await getDataUserAcl(
          groupIds as number[],
          userIds as number[],
        );
        const dataGroupFilter = dataFindByResourceIdAndType
          ?.filter(r => !!r.groupUserId)
          .map(g => {
            const find = dataUserAcl?.dataGroups?.find(
              (v: any) => v.id === g.groupUserId,
            );
            setListSelectInit(prev => [
              ...prev,
              {...find, type: 'group', check: true},
            ]);
            return {
              ...g,
              name: find.name,
              email: null,
              avatar: null,
              haveAvatar: false,
              typeGroup: 'group',
            };
          });

        const dataUserFilter = dataFindByResourceIdAndType
          ?.filter(r => !!r.userId)
          .map(u => {
            const find = dataUserAcl?.dataUsers?.find(
              (v: any) => v.resourceId === u.userId,
            );
            setListSelectInit(prev => [
              ...prev,
              {...find, type: 'user', check: true},
            ]);

            return {
              ...u,
              name: find?.personalName,
              email: find?.email,
              avatar: find?.imageUrl,
              haveAvatar: !!find?.avatar,
              typeGroup: 'user',
            };
          });
        const dataFilter = [...dataGroupFilter, ...dataUserFilter];

        const grouped = Object.values(
          dataFilter.reduce(
            (
              acc: Record<string, {id: string; name?: string; child: any[]}>,
              item,
            ) => {
              const org = item.orgIn as string;
              if (!acc[org]) {
                acc[org] = {
                  id: org,
                  name: listOrgInState?.find(o => o.orgIn === org)?.name,
                  child: [],
                };
              }
              acc[org].child.push(item);
              return acc;
            },
            {},
          ),
        );
        setDataUserAcl(grouped);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getDataUserAcl = async (groupIds: number[], userIds: number[]) => {
    try {
      const bodyGetUser = {
        resourceIds: userIds,
      };
      const params = {
        page: 0,
        size: 10000,
        role: true,
      };

      if (groupIds.length && userIds.length) {
        const [dataGroups, dataUsers] = await Promise.all([
          UserService.findListGroup(groupIds as number[]),
          UserService.getUser(bodyGetUser, params),
        ]);
        return {
          dataGroups,
          dataUsers: dataUsers?.data,
        };
      } else if (groupIds.length) {
        const dataGroupIds = await UserService.findListGroup(
          groupIds as number[],
        );
        return {
          dataGroups: dataGroupIds,
          dataUsers: [],
        };
      } else if (userIds.length) {
        const dataUsers = await UserService.getUser(bodyGetUser, params);
        return {
          dataGroups: [],
          dataUsers: dataUsers?.data,
        };
      } else {
        return {
          dataGroups: [],
          dataUsers: [],
        };
      }
    } catch (error) {}
  };

  const getNameItem = (
    key: string,
  ): {title: string; subTitle: string; icon: string} => {
    if (key === 'all') {
      return {
        title: 'shared.selectAuth.all',
        subTitle: 'shared.selectAuth.allSub',
        icon: 'pricetags',
      };
    } else if (key === 'edit') {
      return {
        title: 'shared.selectAuth.edit',
        subTitle: 'shared.selectAuth.editSub',
        icon: 'edit',
      };
    } else if (key === 'read') {
      return {
        title: 'shared.selectAuth.read',
        subTitle: 'shared.selectAuth.readSub',
        icon: 'eye',
      };
    } else if (key === 'comment') {
      return {
        title: 'shared.selectAuth.comment',
        subTitle: 'shared.selectAuth.commentSub',
        icon: 'message-circle',
      };
    }
    return {
      title: '',
      subTitle: '',
      icon: '',
    };
  };

  const handleChangeOrgIn = async (value: any) => {
    try {
      const [dataGroup, dataUser] = (await Promise.all([
        getGroup(value),
        getUser(value),
      ])) as any;
      const dataGroupNew = dataGroup
        ?.filter((g: any) => {
          const dataInList = listSelectInit.find(l => l.id === g.id);
          if (!dataInList) return g;
        })
        .map((group: any) => ({
          ...group,
          type: 'group',
          check: listSelect?.find(l => l.id === group.id) ? true : false,
        }));
      const dataUserNew = dataUser.data
        ?.filter((g: any) => {
          const dataInList = listSelectInit.find(
            l => l.resourceId === g.resourceId,
          );
          if (!dataInList) return g;
        })
        .map((user: any) => ({
          ...user,
          type: 'user',
          check: listSelect?.find(u => u.resourceId === user.resourceId)
            ? true
            : false,
        }));
      setListData([...dataGroupNew, ...dataUserNew] as any);
      setListDataInit([...dataGroupNew, ...dataUserNew] as any);
    } catch (error) {}
  };

  const getGroup = async (orgIn: string) => {
    try {
      const body = {
        search: '',
      };
      const params = {
        page: 0,
        size: 10000,
        sort: 'createdDate,desc',
        orgIn,
      };
      const data = UserService.groupSearch(body, params);
      return data;
    } catch (error) {}
  };

  const getUser = async (orgIn: string) => {
    try {
      const body = {
        orgIn,
      };
      const params = {
        page: 0,
        size: 10000,
        role: true,
      };
      const data = UserService.getUser(body, params);
      return data;
    } catch (error) {}
  };

  const handleSelect = (data: any, check: boolean) => {
    setListData(
      listData.map((item: any) => ({
        ...item,
        check: item[data.var] === data.id ? !item.check : item.check,
      })),
    );
    if (check) {
      const newList = listSelect
        ?.filter(d => d[data.var] !== data.id)
        .map(d => ({...d, aclId: typeAcl}));
      setListSelect(newList);
    } else {
      const dataInList = listData?.find(d => d[data.var] === data.id);
      if (dataInList) {
        setListSelect([...listSelect, {...dataInList, aclId: typeAcl}]);
      }
    }
  };

  const handleAddAll = () => {
    if (listSelect?.length === 0) {
      setListSelect([...listData.map(l => ({...l, aclId: typeAcl}))]);
    } else {
      const newListData = listData?.filter((item: any) => {
        if (item.type === 'user') {
          const userInList = listSelect?.find(
            u => u.resourceId === item.resourceId,
          );
          if (!userInList) {
            return {
              ...item,
              aclId: typeAcl,
            };
          }
        } else {
          const groupInList = listSelect?.find(g => g.id === item.id);
          if (!groupInList) {
            return {
              ...item,
              aclId: typeAcl,
            };
          }
        }
      });
      setListSelect([...listSelect, ...newListData]);
    }
    setListData(listData?.map((item: any) => ({...item, check: true})));
  };

  const handleChangeAclUser = async (
    id: string,
    value: string | boolean,
    type: string,
    child: IUserAcl,
  ) => {
    try {
      const preAclUser = {...dataUserAcl};
      setDataUserAcl(
        dataUserAcl.map(item => {
          if (item.id === id) {
            return {
              ...item,
              child: item.child?.map(c =>
                c.id === child.id ? {...c, [type]: value} : c,
              ),
            };
          }
          return item;
        }),
      );
      const data = await TaskService.updateUserAcl({...child, [type]: value});
      if (!data) {
        Toast.show({
          type: 'error',
          text1: t('CM.noti'),
          text2: t('CM.error'),
        });
        setDataUserAcl(preAclUser);
      }
    } catch (error) {}
  };

  const handleClearAll = async () => {
    try {
      const data = await TaskService.deleteUserAclByResourceIdAndType(
        resource?.id as any,
        type,
      );
      if (data) {
        setDataUserAcl([]);
        setListSelect(
          listSelect?.filter(s => {
            if (s.type === 'user') {
              const dataUserInList = listSelectInit?.find(
                si => si.resourceId === s.resourceId,
              );
              if (!dataUserInList) return s;
            } else {
              const dataGroupInList = listSelectInit?.find(
                si => si.id === s.id,
              );
              if (!dataGroupInList) return s;
            }
          }),
        );
        setListSelectInit([]);
      }
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Spinner />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <View
          style={{flexDirection: 'row', columnGap: 8, alignItems: 'center'}}>
          <Icon name="link-outline" width={24} height={24} />
          <TextCM>Link riêng tư</TextCM>
        </View>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 5,
            borderRadius: 4,
            backgroundColor: '#ca1e66',
          }}>
          <TextCM
            style={{
              color: Color.White,
              fontSize: 14,
              fontFamily: Font.InterMedium500,
            }}>
            Sao chép liên kết
          </TextCM>
        </TouchableOpacity>
      </View> */}

      {showListAuthority ? (
        <>
          <ScrollView style={{flex: 1}}>
            <View style={styles.ctnListAuthor}>
              <TextCM style={styles.txtAuthor}>
                {t('board.list-permission')}
              </TextCM>
              <TouchableOpacity
                onPress={handleClearAll}
                disabled={!dataUserAcl?.length}
                style={styles.viewClearAll}>
                <TextCM style={styles.txtClear}>{t('board.delete-all')}</TextCM>
              </TouchableOpacity>
            </View>
            {dataUserAcl?.map((acl, index) => (
              <View key={index}>
                <View style={styles.ctnUserAcl}>
                  <Pressable
                    onPress={() =>
                      setShowListOrgIn(prev => {
                        if (!prev?.[acl.id]) {
                          return {...prev, [acl.id]: true};
                        } else {
                          return {...prev, [acl.id]: false};
                        }
                      })
                    }>
                    <Icon
                      name={
                        showListOrgIn?.[acl.id] ? 'arrow-down' : 'arrow-right'
                      }
                      width={24}
                      height={24}
                    />
                  </Pressable>
                  <TextCM>{acl?.name}</TextCM>
                </View>

                {showListOrgIn?.[acl.id] && (
                  <View>
                    {acl?.child?.map((child, index) => (
                      <Fragment key={index}>
                        <View style={styles.viewAcl}>
                          <View style={styles.viewSubAcl}>
                            {child.typeGroup === 'group' ? (
                              <>
                                <View style={styles.viewPeople}>
                                  <Icon
                                    fill={'#fff'}
                                    name="people"
                                    width={16}
                                    height={16}
                                  />
                                </View>
                                <TextCM>{child.name}</TextCM>
                              </>
                            ) : (
                              <>
                                <Image
                                  style={styles.viewImg}
                                  source={{
                                    uri: child.avatar || String.DEFAULT_IMAGE,
                                  }}
                                />
                                <View style={{flex: 1}}>
                                  <TextCM>{child.name}</TextCM>
                                  <TextCM>{child.email}</TextCM>
                                </View>
                              </>
                            )}
                          </View>

                          <Toggle
                            onChange={value =>
                              handleChangeAclUser(
                                acl.id,
                                value,
                                'enable',
                                child,
                              )
                            }
                            checked={child?.enable}
                          />
                        </View>
                        <View style={styles.viewUserAcls}>
                          {userAcls?.map((aclUser, index) => (
                            <Pressable
                              onPress={() =>
                                child?.aclId !== aclUser?.id &&
                                handleChangeAclUser(
                                  acl.id,
                                  aclUser.id as any,
                                  'aclId',
                                  child,
                                )
                              }
                              style={styles.ctnUserAcls}
                              key={index}>
                              <Icon
                                fill={
                                  child?.aclId === aclUser?.id
                                    ? '#ca1e66'
                                    : '#000'
                                }
                                name={aclUser.icon}
                                width={20}
                                height={20}
                              />
                              <TextCM
                                style={{
                                  color:
                                    child?.aclId === aclUser?.id
                                      ? '#ca1e66'
                                      : '#000',
                                }}>
                                {aclUser.name}
                              </TextCM>
                            </Pressable>
                          ))}
                        </View>
                        <Divider style={{height: 4}} />
                      </Fragment>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          <ButtonCM
            label={t('HM.board.share')}
            onPress={() => setShowListAuthority(false)}
          />
        </>
      ) : (
        <>
          <DropdownListWithSearch
            data={listOrgIn.map(o => ({
              ...o,
              value: o.orgIn,
              label: o.name,
            }))}
            searchable={true}
            placeholder={t('task.add-coodinator.placeholder-selectOrg')}
            onChangeData={setValueOrgInSelect}
          />

          {valueOrgInSelect && (
            <View style={{flex: 1}}>
              <View style={{paddingVertical: 12}}>
                <View>
                  <TextCM>{t('task.list-member')}</TextCM>
                  <View style={styles.viewOrgIn}>
                    <Input
                      style={{flex: 1}}
                      placeholder={t('task.enter-email-in-organization')}
                      value={search}
                      onChangeText={setSearch}
                      accessoryLeft={
                        <Icon name="search-outline" width={24} height={24} />
                      }
                    />
                    <TouchableOpacity
                      onPress={handleAddAll}
                      style={styles.ctnAddAll}>
                      <TextCM style={styles.txtAddAll}>Add all</TextCM>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <ScrollView>
                {listData.map((item: any, index: number) => (
                  <TouchableOpacity
                    onPress={() =>
                      handleSelect(
                        item.type === 'user'
                          ? {
                              var: 'resourceId',
                              id: item.resourceId,
                            }
                          : {
                              var: 'id',
                              id: item.id,
                            },
                        item.check,
                      )
                    }
                    key={index}
                    style={styles.ctnSelect}>
                    <View style={styles.ctnViewGroup}>
                      {item.type === 'group' ? (
                        <>
                          <View style={styles.viewPeople}>
                            <Icon
                              fill={'#fff'}
                              name="people"
                              width={16}
                              height={16}
                            />
                          </View>
                          <TextCM>{item.name}</TextCM>
                        </>
                      ) : (
                        <>
                          <Image
                            style={styles.viewImg}
                            source={{
                              uri: item.imageUrl || String.DEFAULT_IMAGE,
                            }}
                          />
                          <View>
                            <TextCM>{item.personalName}</TextCM>
                            <TextCM>{item.email}</TextCM>
                          </View>
                        </>
                      )}
                    </View>

                    {item.check && (
                      <Icon
                        name="checkmark"
                        width={24}
                        height={24}
                        fill={'#ca1e66'}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <Divider />

          {!showListAuthority && !valueOrgInSelect && (
            <>
              <View style={{flex: 1}} />
              <ButtonCM
                label={t('CM.back')}
                onPress={() => setShowListAuthority(true)}
              />
            </>
          )}

          {valueOrgInSelect && (
            <View style={styles.footer}>
              <Pressable onPress={() => setShowListAuthority(true)}>
                <Icon name="arrow-back" width={24} height={24} />
              </Pressable>

              <TextCM>
                {t('board.list-waiting-permission')} ({listSelect?.length})
              </TextCM>
              <Pressable
                onPress={() => listSelect?.length > 0 && setOpenModal(true)}>
                <Icon name="arrow-forward" width={24} height={24} />
              </Pressable>
            </View>
          )}
        </>
      )}

      <ModalFullScreen
        isVisible={openModal}
        children={
          <WaitAuthority
            listSelect={listSelect}
            setListSelect={setListSelect}
            setListData={setListData}
            userAcls={userAcls}
            onClose={() => setOpenModal(false)}
            setShowListAuthority={setShowListAuthority}
            type={type}
            resource={resource}
            setReloadData={setReloadData}
          />
        }
      />
    </View>
  );
};

export default Authority;

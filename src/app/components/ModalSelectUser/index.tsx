import {Image, Pressable, ScrollView, View} from 'react-native';
import {TabView, Tab, Icon} from '@ui-kitten/components';
import {useEffect, useState} from 'react';
import ButtonCM from '../Button';
import TextCM from '../Text';
import {useUserStore} from '../../../zutand/user-store';
import CustomSelectUser from './component/user';
import Departments from './component/department';
import GroupUser from './component/group-user';
import {
  AssignGroupList,
  AssignOrgList,
  AssignTaskList,
  ITaskDetail,
} from '../../screens/task-detail/components/task-detail-item/helper';
import {Color, Font, String} from '../../../constants';
import {useBoardService} from '../../../hooks/apiHooks/useAPI';
import {ITask} from '../../screens/board/store/interface';
import HeaderCM from '../Header/HeaderCM';
import {useTranslation} from 'react-i18next';

type Props = {
  onClose: () => void;
  type: 'L' | 'T' | 'C'; // listTask | task | checklist
  listTask?: ITask;
  task?: ITaskDetail;
  assignTaskList?: AssignTaskList[];
  assignGroupList?: AssignGroupList[];
  assignOrgList?: AssignOrgList[];
  handleResponseData?: (data: any) => void;
};

const ModalSelectUser = ({
  onClose,
  type,
  listTask,
  task,
  assignTaskList,
  assignGroupList,
  assignOrgList,
  handleResponseData,
}: Props): React.ReactElement => {
  const {t} = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectAssign, setSelectAssign] = useState(false);
  const [assignUserList, setAssignUserList] = useState<
    AssignTaskList[] | undefined
  >([]);
  const [assignGroupUserList, setAssignGroupUserList] = useState<
    AssignGroupList[] | undefined
  >([]);
  const [assignDepartmentsList, setAssignDepartmentsList] = useState<
    AssignOrgList[] | undefined
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const {listOrgIn, listUser, listGroupUser} = useUserStore();

  const BoardServices = useBoardService();

  useEffect(() => {
    handleInitData();
  }, []);

  const handleInitData = () => {
    if (type === 'L' || (type === 'T' && task)) {
      setAssignUserList(
        type === 'L' ? listTask?.assignTaskList : task?.assignTaskList,
      );
      setAssignGroupUserList(
        type === 'L' ? listTask?.assignGroupList : task?.assignGroupList,
      );
      setAssignDepartmentsList(
        type === 'L' ? listTask?.assignOrgList : task?.assignOrgList,
      );
    } else if (type === 'T' && !task) {
      setAssignUserList(assignTaskList);
      setAssignGroupUserList(assignGroupList);
      setAssignDepartmentsList(assignOrgList);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (type === 'T') {
        console.log('abc', task);

        if (task?.createdDate) {
          console.log('task?.createdDate', task?.createdDate);
          console.log('dhdf');

          const dataUpdate = {
            ...task,
            assignTaskList: assignUserList || [],
            assignGroupList: assignGroupUserList || [],
            assignOrgList: assignDepartmentsList || [],
          };

          const data = await BoardServices.updateTask(dataUpdate);
          if (data) {
            if (task) {
              task.assignTaskList = dataUpdate.assignTaskList;
              task.assignGroupList = dataUpdate.assignGroupList;
              task.assignOrgList = dataUpdate.assignOrgList;
            }
          }
        } else {
          handleResponseData?.({
            assignUserList,
            assignGroupUserList,
            assignDepartmentsList,
          });
        }
      }
      onClose();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = (type: string) => {
    if (type.startsWith('user')) {
      const userId = type.split('-')[1];
      if (userId) {
        setAssignUserList(
          assignUserList?.filter(item => item.userId !== Number(userId)),
        );
      }
    }
    if (type.startsWith('group')) {
      const groupId = type.split('-')[1];
      if (groupId) {
        setAssignGroupUserList(
          assignGroupUserList?.filter(item => item.groupId !== Number(groupId)),
        );
      }
    }
    if (type.startsWith('org')) {
      const orgIn = type.split('-')[1];
      if (orgIn) {
        setAssignDepartmentsList(
          assignDepartmentsList?.filter(item => item.orgIn !== orgIn),
        );
      }
    }
  };

  const renderAssign = (
    avt: string,
    name: string,
    email: string,
    type: string,
  ) => {
    return (
      <View
        key={type}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8,
          }}>
          {type?.startsWith('user') ? (
            <Image
              style={{width: 32, height: 32, borderRadius: 16}}
              source={{uri: avt}}
            />
          ) : (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#cb1d66',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon fill={'#fff'} name="people" width={16} height={16} />
            </View>
          )}
          <View>
            <TextCM>{name}</TextCM>
            {type.startsWith('user') && <TextCM>{email}</TextCM>}
          </View>
        </View>
        <Pressable onPress={() => handleClearData(type)}>
          <Icon name="trash-2-outline" width={20} height={20} />
        </Pressable>
      </View>
    );
  };

  const shouldLoadComponent = (index: any): boolean => index === selectedIndex;

  return (
    <>
      {selectAssign && (
        <>
          <HeaderCM
            contentStyle={{backgroundColor: Color.White}}
            title={''}
            fillIconBackLeft={Color.Black}
            onPressIconLeft={() => setSelectAssign(false)}
          />
          <TabView
            style={{flex: 1}}
            selectedIndex={selectedIndex}
            shouldLoadComponent={shouldLoadComponent}
            swipeEnabled={false}
            onSelect={index => setSelectedIndex(index)}>
            <Tab title={t('board.user')}>
              <CustomSelectUser
                assignUserList={assignUserList}
                handleUserSelect={setAssignUserList}
                type={type}
                resourceId={type === 'T' ? task?.id : listTask?.id}
              />
            </Tab>
            <Tab title={t('board.group-user')}>
              <GroupUser
                assignGroupUserList={assignGroupUserList}
                setAssignGroupUserList={setAssignGroupUserList}
                type={type}
                resourceId={type === 'T' ? task?.id : listTask?.id}
              />
            </Tab>
            <Tab title={t('board.organization')}>
              <Departments
                assignDepartmentsList={assignDepartmentsList}
                setAssignDepartmentsList={setAssignDepartmentsList}
                type={type}
                resourceId={type === 'T' ? task?.id : listTask?.id}
              />
            </Tab>
          </TabView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 8,
              paddingHorizontal: 16,
            }}>
            <ButtonCM
              style={{flex: 1}}
              onPress={() => setSelectAssign(false)}
              label={t('CM.confirm')}
            />
          </View>
        </>
      )}
      {!selectAssign && (
        <>
          <HeaderCM
            contentStyle={{backgroundColor: Color.White}}
            titleStyle={{color: Color.Black}}
            title={t('board.list-assigned')}
            fillIconBackLeft={Color.Black}
            onPressIconLeft={() => onClose()}
            renderContentRight={() => (
              <Pressable onPress={() => setSelectAssign(true)}>
                <TextCM
                  style={{
                    color: '#cb1d66',
                    textAlign: 'right',
                    fontSize: 14,
                    fontFamily: Font.InterSemiBold600,
                  }}>
                  Thêm +
                </TextCM>
              </Pressable>
            )}
          />
          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              marginBottom: 10,
            }}>
            <TextCM
              style={{
                fontSize: 16,
                fontFamily: Font.InterSemiBold600,
              }}>
              Danh sách đã giao
            </TextCM>
            <Pressable style={{flex: 1}} onPress={() => setSelectAssign(true)}>
              <TextCM
                style={{
                  color: '#cb1d66',
                  textAlign: 'right',
                  fontSize: 14,
                  fontFamily: Font.InterSemiBold600,
                }}>
                Thêm +
              </TextCM>
            </Pressable>
          </View> */}
          <View style={{flex: 1}}>
            <ScrollView
              style={{
                margin: 10,
                flex: 1,
              }}
              contentContainerStyle={{
                rowGap: 16,
              }}>
              {assignUserList?.map(user => {
                const userInList = listUser?.find(
                  item => item.resourceId === user.userId,
                );
                return renderAssign(
                  userInList?.imageUrl || String.DEFAULT_IMAGE,
                  userInList?.personalName || '',
                  userInList?.email || '',
                  `user-${user.userId}`,
                );
              })}

              {assignGroupUserList?.map(group => {
                const groupInList = listGroupUser?.find(
                  item => item.id === group.groupId,
                );
                return renderAssign(
                  String.DEFAULT_IMAGE,
                  groupInList?.name || '',
                  '',
                  `group-${group.groupId}`,
                );
              })}
              {assignDepartmentsList?.map(org => {
                const orgInList = listOrgIn?.find(
                  item => item.orgIn === org.orgIn,
                );
                return renderAssign(
                  String.DEFAULT_IMAGE,
                  orgInList?.name || '',
                  '',
                  `org-${org.orgIn}`,
                );
              })}
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: 8,
                paddingHorizontal: 16,
              }}>
              <ButtonCM
                style={{flex: 1}}
                onPress={onClose}
                label={t('CM.back')}
              />
              <ButtonCM
                loading={isLoading}
                style={{flex: 1}}
                onPress={handleSubmit}
                label={t('CM.confirm')}
              />
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default ModalSelectUser;

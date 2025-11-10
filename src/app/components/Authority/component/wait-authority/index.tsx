import {Image, Pressable, ScrollView, View} from 'react-native';
import HeaderCM from '../../../Header/HeaderCM';
import TextCM from '../../../Text';
import {Divider, Icon} from '@ui-kitten/components';
import {String} from '../../../../../constants';
import ButtonCM from '../../../Button';
import {IAuthSelect} from '../../interface';
import {useTaskService} from '../../../../../hooks/apiHooks/useAPI';
import {useAppSelector} from '../../../../../hooks/useRedux';
import {ITask} from '../../../../screens/board/store/interface';
import {useState} from 'react';
import styles from './styles';
import {useTranslation} from 'react-i18next';

type Props = {
  onClose?: () => void;
  listSelect?: any[];
  setListSelect?: (data: any) => void;
  setListData?: (data: any) => void;
  userAcls: IAuthSelect[];
  type: 'L' | 'T' | 'C';
  resource?: ITask;
  setReloadData?: any;
  setShowListAuthority?: (value: boolean) => void;
};

const WaitAuthority = ({
  onClose,
  listSelect,
  setListSelect,
  setListData,
  userAcls,
  type,
  resource,
  setReloadData,
  setShowListAuthority,
}: Props) => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const {dataAccount} = useAppSelector(state => state.account);
  const TaskService = useTaskService();
  const handleClear = (item: any) => {
    setListSelect?.(
      listSelect?.filter((d: any) => {
        if (d.type === 'group') {
          if (d.id !== item.id) {
            return d;
          }
        } else {
          if (d.resourceId !== item.resourceId) {
            return d;
          }
        }
      }),
    );
    setListData?.((prev: any) => {
      return prev?.map((d: any) => {
        if (d.type === 'group') {
          if (d.id === item.id) {
            return {...d, check: false};
          }
        } else {
          if (d.resourceId === item.resourceId) {
            return {...d, check: false};
          }
        }
        return d;
      });
    });
  };

  const clearAll = () => {
    setListSelect?.([]);
    setListData?.((prev: any) => {
      return prev?.map((d: any) => {
        return {...d, check: false};
      });
    });
    onClose?.();
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const body = {
        taskShareInternalList: listSelect?.map(v => ({
          aclId: v.aclId,
          custId: dataAccount.custId || 7,
          groupUserId: v.type === 'group' ? v.id : null,
          orgIn: v.orgIn,
          resourceId: resource?.id,
          type: type,
          userId: v.type === 'user' ? v.resourceId : null,
        })),
      };

      const data = await TaskService.updateListTaskAcl(body);
      if (data) {
        setReloadData?.((prev: boolean) => !prev);
        setListSelect?.([]);
        setListData?.([]);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
      onClose?.();
      setShowListAuthority?.(true);
    }
  };

  const handleChangeAcl = (item: any, aclId: string) => {
    setListSelect?.(
      listSelect?.map(s => {
        if (s.type === 'user') {
          if (s.resourceId === item.resourceId) {
            return {
              ...s,
              aclId: aclId,
            };
          } else {
            return s;
          }
        } else {
          if (s.id === item.id) {
            return {
              ...s,
              aclId: aclId,
            };
          }
          return s;
        }
      }),
    );
  };

  return (
    <>
      <HeaderCM
        style={{
          backgroundColor: '#fff',
        }}
        titleStyle={{
          color: '#00204D',
        }}
        fillIconBackLeft="#00204DB2"
        contentStyle={{
          backgroundColor: '#fff',
        }}
        title={''}
        onPressIconLeft={onClose}
        renderContentRight={() => (
          <Pressable onPress={clearAll}>
            <TextCM>Clear all</TextCM>
          </Pressable>
        )}
      />

      <ScrollView style={styles.ctn}>
        {listSelect &&
          listSelect?.map((item: any, index: number) => (
            <View key={index}>
              <View style={styles.body}>
                <View style={styles.bodyView}>
                  {item.type === 'group' ? (
                    <>
                      <View style={styles.viewGroup}>
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
                        style={styles.viewImage}
                        source={{uri: item.imageUrl || String.DEFAULT_IMAGE}}
                      />
                      <View>
                        <TextCM>{item.personalName}</TextCM>
                        <TextCM>{item.email}</TextCM>
                      </View>
                    </>
                  )}
                </View>

                <View style={styles.viewTrash}>
                  <Pressable onPress={() => handleClear(item)}>
                    <Icon
                      name="trash"
                      width={24}
                      height={24}
                      fill={'#ca1e66'}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.viewAcl}>
                {userAcls?.map((aclUser, index) => (
                  <Pressable
                    onPress={() => handleChangeAcl(item, aclUser.id as string)}
                    style={styles.bodyAcl}
                    key={index}>
                    <Icon
                      fill={item.aclId === aclUser?.id ? '#ca1e66' : '#000'}
                      name={aclUser.icon}
                      width={20}
                      height={20}
                    />
                    <TextCM
                      style={{
                        color: item.aclId === aclUser?.id ? '#ca1e66' : '#000',
                      }}>
                      {aclUser.name}
                    </TextCM>
                  </Pressable>
                ))}
              </View>
              <Divider style={{height: 2, marginBottom: 10}} />
            </View>
          ))}
      </ScrollView>

      <ButtonCM
        style={{marginHorizontal: 16, marginTop: 10}}
        label={t('CM.confirm')}
        onPress={handleSubmit}
        loading={isLoading}
      />
    </>
  );
};

export default WaitAuthority;

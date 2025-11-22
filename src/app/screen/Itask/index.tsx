import {
  View,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import HeaderCM from '../../components/Header/HeaderCM';
import { 
  Icon, 
  Spinner,
  Menu,
  MenuItem,
  IconElement,
} from '@ui-kitten/components';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NavigationName } from '../../../constants';
import TextCM from '../../components/Text';
import styles from './styles';
import ModalFullScreen from '../../components/ModalFullScreen';
import CreateNewWorkspaceScreen from './component/CreateNewWorkspaceScreen';
import AssignedListScreen from './component/AssignedListScreen';
import WorkspacePermissionScreen from './component/WorkspacePermissionScreen';
import BottomSheetCM from '../../components/BottomSheet';
import ModalConfirmCM from '../../components/ModalConfirm';
import TextFieldCM from '../../components/TextField';
import ButtonCM from '../../components/Button';
import { useAppSelector } from '../../../hooks/useRedux';
import { getApiUrl } from '../../../config/api.config';
import Toast from 'react-native-toast-message';
import { Color } from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MenuItemData {
  id: number;
  title: string;
  iconName: string;
}

interface Workspace {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  createdAt: string;
  updatedAt: string;
  startAt: string | null;
  dueAt: string | null;
}

const ETaskHome = () => {
  const navigation = useNavigation<any>();
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const [loading, setLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isVisibleCreateWorkspace, setIsVisibleCreateWorkspace] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [isShowAction, setIsShowAction] = useState(false);
  const [workspaceSelect, setWorkspaceSelect] = useState<Workspace | null>(null);
  const [isShowRename, setIsShowRename] = useState(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isShowAssign, setIsShowAssign] = useState(false);
  const [isShowWorkspacePermission, setIsShowWorkspacePermission] = useState(false);

  const menuItems: MenuItemData[] = [
    {
      id: 0,
      title: 'Không gian làm việc của tôi',
      iconName: 'browser-outline',
    },
    {
      id: 1,
      title: 'Không gian làm việc được phân quyền',
      iconName: 'browser-outline',
    },
    {
      id: 2,
      title: 'Đã xem gần đây',
      iconName: 'browser-outline',
    },
  ];

  // Lưu workspace đã xem gần đây
  const saveRecentWorkspace = async (workspace: Workspace) => {
    if (!currentUserId) return;
    
    try {
      const key = `recent_workspaces_${currentUserId}`;
      const existingData = await AsyncStorage.getItem(key);
      let recentWorkspaces: Workspace[] = existingData ? JSON.parse(existingData) : [];
      
      // Loại bỏ workspace đã tồn tại (nếu có)
      recentWorkspaces = recentWorkspaces.filter(w => w.id !== workspace.id);
      
      // Thêm workspace mới vào đầu danh sách
      recentWorkspaces.unshift(workspace);
      
      // Giới hạn tối đa 10 workspace gần đây
      if (recentWorkspaces.length > 10) {
        recentWorkspaces = recentWorkspaces.slice(0, 10);
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(recentWorkspaces));
    } catch (error) {
      console.error('Error saving recent workspace:', error);
    }
  };

  // Xóa workspace khỏi danh sách đã xem gần đây
  const removeRecentWorkspace = async (workspaceId: number) => {
    if (!currentUserId) return;
    
    try {
      const key = `recent_workspaces_${currentUserId}`;
      const existingData = await AsyncStorage.getItem(key);
      
      if (existingData) {
        let recentWorkspaces: Workspace[] = JSON.parse(existingData);
        // Loại bỏ workspace đã xóa
        recentWorkspaces = recentWorkspaces.filter(w => w.id !== workspaceId);
        await AsyncStorage.setItem(key, JSON.stringify(recentWorkspaces));
      }
    } catch (error) {
      console.error('Error removing recent workspace:', error);
    }
  };

  // Lấy danh sách workspace đã xem gần đây
  const fetchRecentWorkspaces = async () => {
    if (!currentUserId) {
      setLoadingWorkspaces(false);
      return;
    }
    
    setLoadingWorkspaces(true);
    try {
      const key = `recent_workspaces_${currentUserId}`;
      const data = await AsyncStorage.getItem(key);
      
      if (data) {
        const recentWorkspaces: Workspace[] = JSON.parse(data);
        setWorkspaces(recentWorkspaces);
      } else {
        setWorkspaces([]);
      }
    } catch (error) {
      console.error('Error fetching recent workspaces:', error);
      setWorkspaces([]);
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  const fetchWorkspaces = async (itemId?: number | null) => {
    // Sử dụng itemId được truyền vào hoặc selectedItemId hiện tại
    const targetItemId = itemId !== undefined && itemId !== null ? itemId : selectedItemId;
    
    if (!currentUserId) {
      setLoadingWorkspaces(false);
      setWorkspaces([]);
      return;
    }
    
    try {
      const API_URL = getApiUrl();
      let url = '';
      
      // Nếu là "Công việc được phân quyền" (itemId === 1), lấy workspace mà user có role là member
      if (targetItemId === 1) {
        url = `${API_URL}/api/workspace?user_id=${currentUserId}&role=member`;
      } else {
        // Nếu là "Công việc của tôi" (itemId === 0), lấy workspace do user tạo
        url = `${API_URL}/api/workspace?created_by=${currentUserId}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      // Chỉ cập nhật workspaces nếu selectedItemId vẫn đúng (tránh race condition)
      if (selectedItemId === targetItemId) {
        if (result.success && result.workspaces) {
          setWorkspaces(result.workspaces);
        } else {
          setWorkspaces([]);
        }
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      // Chỉ cập nhật nếu selectedItemId vẫn đúng
      if (selectedItemId === targetItemId) {
        setWorkspaces([]);
      }
    } finally {
      // Chỉ cập nhật loading nếu selectedItemId vẫn đúng
      if (selectedItemId === targetItemId) {
        setLoadingWorkspaces(false);
      }
    }
  };

  useEffect(() => {
    if (!currentUserId) {
      setWorkspaces([]);
      setLoadingWorkspaces(false);
      return;
    }
    
    // Clear workspaces ngay lập tức khi selectedItemId thay đổi
    setWorkspaces([]);
    setLoadingWorkspaces(true);
    
    // Lưu selectedItemId hiện tại để tránh race condition
    const currentSelectedId = selectedItemId;
    
    if (currentSelectedId === 0 || currentSelectedId === 1) {
      fetchWorkspaces(currentSelectedId);
    } else if (currentSelectedId === 2) {
      fetchRecentWorkspaces();
    } else {
      setWorkspaces([]);
      setLoadingWorkspaces(false);
    }
  }, [selectedItemId, currentUserId]);

  useFocusEffect(
    useCallback(() => {
      if (!currentUserId) return;
      
      if (selectedItemId === 0 || selectedItemId === 1) {
        fetchWorkspaces(selectedItemId);
      } else if (selectedItemId === 2) {
        fetchRecentWorkspaces();
      }
    }, [selectedItemId, currentUserId])
  );

  const handleItemPress = (item: MenuItemData) => {
    // Toggle: nếu đã chọn thì bỏ chọn, nếu chưa chọn thì chọn
    const willBeSelected = selectedItemId !== item.id;
    
    if (willBeSelected) {
      // Clear workspaces và set loading ngay lập tức trước khi set selectedItemId
      setWorkspaces([]);
      setLoadingWorkspaces(true);
      // Sau đó mới set selectedItemId để trigger useEffect
      setSelectedItemId(item.id);
      // useEffect sẽ tự động gọi fetchWorkspaces hoặc fetchRecentWorkspaces
    } else {
      // Đóng: bỏ chọn và xóa danh sách
      setSelectedItemId(null);
      setWorkspaces([]);
      setLoadingWorkspaces(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsVisibleCreateWorkspace(false);
    if (selectedItemId === 0 || selectedItemId === 1) {
      fetchWorkspaces(selectedItemId);
    }
  };

  const handleRename = async () => {
    if (!workspaceSelect || !renameValue.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Tên không được để trống',
      });
      return;
    }

    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/workspace/${workspaceSelect.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: renameValue.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đổi tên không gian làm việc thành công',
        });
        setIsShowRename(false);
        setRenameValue('');
        setIsShowAction(false);
        setWorkspaceSelect(null);
        // Refresh workspace list
        if (selectedItemId === 0 || selectedItemId === 1) {
          fetchWorkspaces(selectedItemId);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Đổi tên không gian làm việc thất bại',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    }
  };

  const handleDelete = async () => {
    if (!workspaceSelect || !currentUserId) {
      return;
    }

    try {
      const API_URL = getApiUrl();
      // Truyền user_id để kiểm tra quyền xóa
      const response = await fetch(`${API_URL}/api/workspace/${workspaceSelect.id}?user_id=${currentUserId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Xóa không gian làm việc thành công',
        });
        
        // Xóa workspace khỏi danh sách đã xem gần đây
        if (workspaceSelect) {
          removeRecentWorkspace(workspaceSelect.id);
        }
        
        setIsShowDeleteConfirm(false);
        setIsShowAction(false);
        setWorkspaceSelect(null);
        // Refresh workspace list
        if (selectedItemId === 0 || selectedItemId === 1) {
          fetchWorkspaces(selectedItemId);
        } else if (selectedItemId === 2) {
          // Nếu đang xem "Đã xem gần đây", refresh lại danh sách
          fetchRecentWorkspaces();
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Xóa không gian làm việc thất bại',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    }
  };

  return (
    <>
      <HeaderCM
        renderContentLeftDynamic={() => (
          <Image
            resizeMode="contain"
            source={{
              uri: 'https://res.cloudinary.com/de0sqyhr9/image/upload/v1745664779/logo-task_3x_cb2elr.png',
            }}
            style={{
              width: 91,
              height: 28,
            }}
          />
        )}
        title=""
        renderContentRight={() => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 8,
            }}>
            <Pressable onPress={() => setIsVisibleCreateWorkspace(true)}>
              <Icon fill={'#fff'} width={24} height={24} name="plus-outline" />
            </Pressable>
            <Pressable onPress={() => navigation.navigate(NavigationName.Dashboard)}>
              <Icon fill={'#fff'} width={24} height={24} name="home-outline" />
            </Pressable>
          </View>
        )}
        showIconBackLeft={false}
      />

      <ScrollView style={styles.container}>
        <TextCM style={styles.txtHeader}>Không gian làm việc</TextCM>

        {loading ? (
          <View style={styles.load}>
            <Spinner />
          </View>
        ) : (
          <View>
            {menuItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              
              return (
                <View key={item.id}>
                  <Pressable
                    style={[
                      styles.menuItem,
                      isSelected && styles.menuItemSelected,
                    ]}
                    onPress={() => handleItemPress(item)}>
                    <View style={styles.menuItemContent}>
                      <Icon
                        name={item.iconName}
                        style={styles.menuItemIcon}
                        fill={isSelected ? '#7C3AED' : '#999'}
                      />
                      <TextCM
                        style={[
                          styles.menuItemText,
                          isSelected && styles.menuItemTextSelected,
                        ]}>
                        {item.title}
                      </TextCM>
                    </View>
                    <Icon
                      name={isSelected ? "chevron-up-outline" : "chevron-down-outline"}
                      style={styles.chevronIcon}
                      fill="#999"
                    />
                  </Pressable>
                  
                  {/* Hiển thị danh sách workspace khi chọn "Công việc của tôi", "Công việc được phân quyền" hoặc "Đã xem gần đây" */}
                  {isSelected && (item.id === 0 || item.id === 1 || item.id === 2) && (
                    <View style={styles.taskListContainer}>
                      {loadingWorkspaces ? (
                        <View style={styles.taskLoading}>
                          <Spinner size="small" />
                        </View>
                      ) : workspaces.length === 0 ? (
                        <View style={styles.taskEmpty}>
                          <TextCM style={styles.taskEmptyText}>
                            Chưa có không gian làm việc nào
                          </TextCM>
                        </View>
                      ) : (
                        <Menu scrollEnabled={false}>
                          {workspaces.map((workspace) => {
                            const WorkspaceIcon = (props: any): IconElement => (
                              <Icon {...props} name="folder-outline" />
                            );
                            
                            return (
                              <MenuItem
                                key={workspace.id}
                                title={workspace.name}
                                accessoryLeft={WorkspaceIcon}
                                accessoryRight={
                                  <Pressable
                                    onPress={(e) => {
                                      e.stopPropagation();
                                      setWorkspaceSelect(workspace);
                                      setIsShowAction(true);
                                    }}>
                                    <Icon name="more-horizontal-outline" />
                                  </Pressable>
                                }
                                onPress={() => {
                                  // Lưu workspace vào danh sách đã xem gần đây
                                  saveRecentWorkspace(workspace);
                                  
                                  // Navigate to workspace detail or task list
                                  navigation.navigate(NavigationName.ETaskDetail, {
                                    workspaceId: workspace.id,
                                    initialWorkspace: workspace,
                                  });
                                }}
                              />
                            );
                          })}
                        </Menu>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <ModalFullScreen
        isVisible={isVisibleCreateWorkspace}
        children={
          <CreateNewWorkspaceScreen
            onClose={handleCreateSuccess}
          />
        }
      />

      <ModalFullScreen
        isVisible={isShowAssign}
        children={
          workspaceSelect && (
            <AssignedListScreen
              taskId={workspaceSelect.id}
              onClose={() => {
                setIsShowAssign(false);
                setWorkspaceSelect(null);
              }}
            />
          )
        }
      />

      <ModalFullScreen
        isVisible={isShowWorkspacePermission}
        children={
          workspaceSelect && (
            <WorkspacePermissionScreen
              workspaceId={workspaceSelect.id}
              onClose={() => {
                setIsShowWorkspacePermission(false);
                setWorkspaceSelect(null);
              }}
            />
          )
        }
      />

      <BottomSheetCM
        title="Thao tác"
        isVisible={isShowAction}
        onClose={() => {
          setIsShowAction(false);
          setWorkspaceSelect(null);
        }}
        renderContent={
          <Menu>
            {/* Chỉ hiển thị "Đổi tên", "Phân quyền" và "Xóa" nếu user là owner */}
            {workspaceSelect && currentUserId && workspaceSelect.created_by === currentUserId ? (
              <>
                <MenuItem
                  title="Đổi tên"
                  accessoryLeft={<Icon name="edit-2-outline" />}
                  onPress={() => {
                    if (workspaceSelect) {
                      setRenameValue(workspaceSelect.name);
                      setIsShowRename(true);
                      setIsShowAction(false);
                    }
                  }}
                />
                <MenuItem
                  title="Phân quyền"
                  accessoryLeft={<Icon name="people-outline" />}
                  onPress={() => {
                    if (workspaceSelect) {
                      setIsShowWorkspacePermission(true);
                      setIsShowAction(false);
                    }
                  }}
                />
                <MenuItem
                  title="Xóa"
                  accessoryLeft={<Icon name="trash-2-outline" />}
                  onPress={() => {
                    setIsShowDeleteConfirm(true);
                    setIsShowAction(false);
                  }}
                />
              </>
            ) : (
              <MenuItem
                title={workspaceSelect && currentUserId ? "Bạn không có quyền thực hiện thao tác này" : "Không có workspace được chọn"}
                disabled
                accessoryLeft={<Icon name="info-outline" />}
              />
            )}
          </Menu>
        }
      />

      <BottomSheetCM
        title="Đổi tên"
        isVisible={isShowRename}
        withKeyboardAvoidingView
        onClose={() => {
          setIsShowRename(false);
          setRenameValue('');
        }}
        renderContent={
          <>
            <TextFieldCM
              value={renameValue}
              onChangeText={setRenameValue}
              label="Tên không gian làm việc"
              placeholder="Nhập tên không gian làm việc"
            />
            <ButtonCM
              label="Lưu"
              onPress={handleRename}
              disabled={!renameValue.trim()}
            />
          </>
        }
      />

      <ModalConfirmCM
        isVisible={isShowDeleteConfirm}
        onClose={() => {
          setIsShowDeleteConfirm(false);
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa không gian làm việc này không?"
        type="cancel"
        labelCancel="Hủy"
        labelConfirm="Xóa"
        styleBtnRight={{ backgroundColor: Color.RedE14337 }}
      />
    </>
  );
};

export default ETaskHome;


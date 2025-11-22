import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, FlatList, RefreshControl, Pressable, TouchableOpacity} from 'react-native';
import HeaderCM from '../../../components/Header/HeaderCM';
import TextCM from '../../../components/Text';
import styles from './styles';
import {useAppSelector} from '../../../../hooks/useRedux';
import {getApiUrl} from '../../../../config/api.config';
import {Spinner, Icon} from '@ui-kitten/components';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SizeDP} from '../../../../constants/Size';
import BottomSheetCM from '../../../components/BottomSheet';
import Toast from 'react-native-toast-message';
import ModalConfirmCM from '../../../components/ModalConfirm';
import {Color, NavigationName} from '../../../../constants';

interface Notification {
  id: number;
  task_id: number | null;
  workspace_id: number | null;
  task_name: string | null;
  workspace_name: string | null;
  type: string;
  message: string;
  is_read: boolean | number;
  created_at: string;
}

type FilterType = 'all' | 'read' | 'unread';

const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
  const [isShowDeleteAllReadConfirm, setIsShowDeleteAllReadConfirm] = useState(false);

  const fetchNotifications = async () => {
    if (!currentUserId) {
      return;
    }

    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const url = `${API_URL}/api/notification?user_id=${currentUserId}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success && result.notifications) {
        setNotifications(result.notifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [currentUserId]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [currentUserId])
  );

  const markAsRead = async (notificationId: number) => {
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/notification/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNotifications((prev) =>
          prev.map((noti) =>
            noti.id === notificationId ? {...noti, is_read: true} : noti
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    if (!currentUserId) return;

    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/notification/${notificationId}?user_id=${currentUserId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNotifications((prev) => prev.filter((noti) => noti.id !== notificationId));
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đã xóa thông báo',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể xóa thông báo',
        });
      }
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    }
  };

  const deleteAllReadNotifications = async () => {
    if (!currentUserId) return;

    try {
      const API_URL = getApiUrl();
      const url = `${API_URL}/api/notification/read?user_id=${currentUserId}`;
      console.log('[Delete All Read] Calling API:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('[Delete All Read] API Response:', result);

      if (response.ok && result.success) {
        // Lọc ra các notification chưa đọc (giữ lại)
        setNotifications((prev) =>
          prev.filter((noti) => {
            const isRead = noti.is_read;
            return isRead === false || (typeof isRead === 'number' && isRead === 0);
          })
        );
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: `Đã xóa ${result.deletedCount || 0} thông báo đã đọc`,
        });
      } else {
        console.error('[Delete All Read] API Error:', result);
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể xóa thông báo đã đọc',
        });
      }
    } catch (error: any) {
      console.error('[Delete All Read] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const handleNotificationPress = (item: Notification) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!item.is_read) {
      markAsRead(item.id);
    }

    // Điều hướng đến task hoặc workspace tương ứng
    if (item.task_id) {
      // Nếu có task_id, điều hướng đến TaskDetailScreen
      navigation.navigate(NavigationName.TaskDetailScreen, {
        taskId: item.task_id,
      });
    } else if (item.workspace_id) {
      // Nếu có workspace_id, điều hướng đến ETaskDetail (workspace)
      navigation.navigate(NavigationName.ETaskDetail, {
        workspaceId: item.workspace_id,
      });
    }
  };

  const renderNotificationItem = ({item}: {item: Notification}) => (
    <View
      style={[
        styles.notificationItem,
        !item.is_read && styles.notificationItemUnread,
      ]}>
      <Pressable
        style={styles.notificationContentWrapper}
        onPress={() => handleNotificationPress(item)}>
        <View style={styles.notificationIcon}>
          <Icon
            name={
              item.type === 'reminder' 
                ? 'bell-outline' 
                : item.type === 'task_created' 
                ? 'checkmark-circle-outline' 
                : item.type === 'task_updated'
                ? 'edit-outline'
                : item.type === 'task_deleted'
                ? 'trash-2-outline'
                : item.type === 'task_assigned'
                ? 'person-add-outline'
                : item.type === 'workspace_created'
                ? 'folder-outline'
                : item.type === 'workspace_updated'
                ? 'edit-outline'
                : item.type === 'workspace_deleted'
                ? 'trash-2-outline'
                : item.type === 'workspace_assigned'
                ? 'people-outline'
                : 'info-outline'
            }
            fill={item.is_read ? '#9CA3AF' : '#7C3AED'}
            width={24}
            height={24}
          />
        </View>
        <View style={styles.notificationContent}>
          <TextCM
            style={[
              styles.notificationTitle,
              !item.is_read && styles.notificationTitleUnread,
            ]}>
            {item.task_name || item.workspace_name || 'Thông báo'}
          </TextCM>
          <TextCM style={styles.notificationMessage}>{item.message}</TextCM>
          <TextCM style={styles.notificationTime}>{formatDate(item.created_at)}</TextCM>
        </View>
        {!item.is_read && <View style={styles.unreadDot} />}
      </Pressable>
      <Pressable
        style={styles.optionButton}
        onPress={() => {
          setSelectedNotification(item);
          setIsShowDeleteConfirm(true);
        }}>
        <Icon name="more-vertical-outline" fill="#9CA3AF" width={20} height={20} />
      </Pressable>
    </View>
  );

  // Filter notifications based on selected filter
  const filteredNotifications = useMemo(() => {
    if (filter === 'all') {
      return notifications;
    } else if (filter === 'read') {
      return notifications.filter((noti) => {
        const isRead = noti.is_read;
        return isRead === true || (typeof isRead === 'number' && isRead === 1);
      });
    } else if (filter === 'unread') {
      return notifications.filter((noti) => {
        const isRead = noti.is_read;
        return isRead === false || (typeof isRead === 'number' && isRead === 0);
      });
    }
    return notifications;
  }, [notifications, filter]);

  const renderFilterButton = () => {
    return (
      <Pressable
        onPress={() => setMenuVisible(true)}
        style={styles.filterButton}>
        <Icon name="options-2-outline" fill="#ffffff" width={24} height={24} />
      </Pressable>
    );
  };

  const renderBottomSheetContent = () => {
    const readNotificationsCount = notifications.filter((noti) => {
      const isRead = noti.is_read;
      return isRead === true || (typeof isRead === 'number' && isRead === 1);
    }).length;

    return (
      <View>
        <TouchableOpacity
          style={styles.filterOptionItem}
          onPress={() => {
            setFilter('all');
            setMenuVisible(false);
          }}>
          <TextCM style={styles.filterOptionText}>Tất cả</TextCM>
          {filter === 'all' && (
            <Icon name="checkmark-outline" fill="#7C3AED" width={24} height={24} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterOptionItem}
          onPress={() => {
            setFilter('read');
            setMenuVisible(false);
          }}>
          <TextCM style={styles.filterOptionText}>Đã đọc</TextCM>
          {filter === 'read' && (
            <Icon name="checkmark-outline" fill="#7C3AED" width={24} height={24} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterOptionItem}
          onPress={() => {
            setFilter('unread');
            setMenuVisible(false);
          }}>
          <TextCM style={styles.filterOptionText}>Chưa đọc</TextCM>
          {filter === 'unread' && (
            <Icon name="checkmark-outline" fill="#7C3AED" width={24} height={24} />
          )}
        </TouchableOpacity>
        {readNotificationsCount > 0 && (
          <>
            <View style={styles.filterDivider} />
            <TouchableOpacity
              style={styles.filterOptionItem}
              onPress={() => {
                setMenuVisible(false);
                setIsShowDeleteAllReadConfirm(true);
              }}>
              <Icon name="trash-2-outline" fill={Color.RedE14337} width={20} height={20} />
              <TextCM style={[styles.filterOptionText, {color: Color.RedE14337, marginLeft: 8}]}>
                Xóa tất cả đã đọc ({readNotificationsCount})
              </TextCM>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="bell-off-outline" fill="#9CA3AF" width={64} height={64} />
      <TextCM style={styles.emptyText}>
        {filter === 'all'
          ? 'Chưa có thông báo nào'
          : filter === 'read'
          ? 'Chưa có thông báo đã đọc'
          : 'Chưa có thông báo chưa đọc'}
      </TextCM>
    </View>
  );

  return (
    <>
      <HeaderCM
        title="Thông báo"
        showIconBackLeft={false}
        renderContentRight={renderFilterButton}
      />
      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Spinner />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={
            filteredNotifications.length === 0 ? styles.emptyListContainer : styles.listContainer
          }
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <BottomSheetCM
        title="Lọc thông báo"
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
        renderContent={renderBottomSheetContent()}
      />
      <ModalConfirmCM
        isVisible={isShowDeleteConfirm}
        onClose={() => {
          setIsShowDeleteConfirm(false);
          setSelectedNotification(null);
        }}
        onConfirm={() => {
          if (selectedNotification) {
            deleteNotification(selectedNotification.id);
            setIsShowDeleteConfirm(false);
            setSelectedNotification(null);
          }
        }}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa thông báo này không?"
        type="cancel"
        labelCancel="Hủy"
        labelConfirm="Xóa"
        styleBtnRight={{backgroundColor: Color.RedE14337}}
      />
      <ModalConfirmCM
        isVisible={isShowDeleteAllReadConfirm}
        onClose={() => setIsShowDeleteAllReadConfirm(false)}
        onConfirm={() => {
          deleteAllReadNotifications();
          setIsShowDeleteAllReadConfirm(false);
        }}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa tất cả thông báo đã đọc không?"
        type="cancel"
        labelCancel="Hủy"
        labelConfirm="Xóa"
        styleBtnRight={{backgroundColor: Color.RedE14337}}
      />
    </>
  );
};

export default NotificationScreen;



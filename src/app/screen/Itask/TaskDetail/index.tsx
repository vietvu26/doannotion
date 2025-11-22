import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { View, Pressable, ScrollView, Dimensions, Image } from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import HeaderCM from '../../../components/Header/HeaderCM';
import TextCM from '../../../components/Text';
import { Icon, Spinner, Menu, MenuItem } from '@ui-kitten/components';
import { ProgressBar } from 'react-native-paper';
import styles from './styles';

// Try to import PagerView, fallback to ScrollView if not available
let PagerView: any = null;
try {
  PagerView = require('react-native-pager-view').default;
} catch (e) {
  // PagerView not installed, will use ScrollView fallback
}
import { useAppSelector } from '../../../../hooks/useRedux';
import { getApiUrl } from '../../../../config/api.config';
import Toast from 'react-native-toast-message';
import { DateUtils } from '../../../../utils';
import BottomSheetCM from '../../../components/BottomSheet';
import ModalFullScreen from '../../../components/ModalFullScreen';
import AssignedListScreen from '../component/AssignedListScreen';
import ModalConfirmCM from '../../../components/ModalConfirm';
import TextFieldCM from '../../../components/TextField';
import ButtonCM from '../../../components/Button';
import CreateNewWorkspaceScreen from '../component/CreateNewWorkspaceScreen';
import AddTaskScreen from '../component/AddTaskScreen';
import { Color } from '../../../../constants';
import { NavigationName } from '../../../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Task {
  id: number;
  name: string;
  description: string | null;
  status: 'new' | 'processing' | 'completed';
  priority: string | null;
  start_date: string | null;
  due_date: string | null;
  completed_date: string | null;
  created_by: number;
  createdAt: string;
  updatedAt: string;
}

interface AssignedUser {
  id: number;
  user_id: number;
  name: string;
  email: string;
  avatar: string | null;
}

const TASK_COLUMNS: Array<{
  key: Task['status'];
  title: string;
  accent: string;
  background: string;
}> = [
  {
    key: 'new',
    title: 'Mới',
    accent: '#6366F1',
    background: '#EEF2FF',
  },
  {
    key: 'processing',
    title: 'Đang thực hiện',
    accent: '#F59E0B',
    background: '#FFF7E6',
  },
  {
    key: 'completed',
    title: 'Hoàn thành',
    accent: '#10B981',
    background: '#ECFDF5',
  },
];

const getPriorityLabel = (priority: string | null) => {
  switch (priority) {
    case '1':
      return 'Khẩn cấp';
    case '2':
      return 'Cao';
    case '3':
      return 'Trung bình';
    case '4':
      return 'Thấp';
    default:
      return 'Chưa đặt';
  }
};

const getPriorityMeta = (priority: string | null) => {
  const label = getPriorityLabel(priority);
  if (!priority || label === 'Chưa đặt') {
    return null;
  }

  switch (priority) {
    case '1':
      return {
        label,
        background: '#FEE2E2',
        color: '#FF4930', // Giống e-task-mobile: danger
      };
    case '2':
      return {
        label,
        background: '#FEF3C7',
        color: '#CA8A04', // Giống e-task-mobile: high
      };
    case '3':
      return {
        label,
        background: '#E0F2FE',
        color: '#16A34A', // Giống e-task-mobile: medium
      };
    case '4':
      return {
        label,
        background: '#E2E8F0',
        color: '#00204D47', // Giống e-task-mobile: low
      };
    default:
      return null;
  }
};

const formatDateValue = (value: string | null) => {
  if (!value) {
    return 'Chưa hẹn';
  }

  try {
    return DateUtils.convertDateToDDMMYYYY(value);
  } catch (error) {
    return 'Chưa hẹn';
  }
};

const TaskScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const currentUserId = useAppSelector(state => state.common.currentUserId);
  const { taskId, initialTask, workspaceId, initialWorkspace } =
    route.params || {};

  const [tasks, setTasks] = useState<Task[]>(initialTask ? [initialTask] : []);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [taskSelect, setTaskSelect] = useState<Task | null>(
    initialTask ?? null,
  );
  const [isShowAction, setIsShowAction] = useState(false);
  const [isShowAssign, setIsShowAssign] = useState(false);
  const [isShowRename, setIsShowRename] = useState(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isShowAddTask, setIsShowAddTask] = useState(false);
  const [addTaskStatus, setAddTaskStatus] = useState<Task['status']>('new');
  const pagerRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [taskAssignedUsers, setTaskAssignedUsers] = useState<
    Record<number, AssignedUser[]>
  >({});

  const selectedTask = useMemo(() => {
    if (taskSelect) {
      return tasks.find(task => task.id === taskSelect.id) || taskSelect;
    }
    return tasks.find(task => task.id === taskId) || null;
  }, [tasks, taskSelect, taskId]);

  const fetchAssignedUsers = useCallback(async (taskId: number) => {
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}/assign`);
      const result = await response.json();
      if (response.ok && result.success) {
        return result.assignedUsers || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching assigned users:', error);
      return [];
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    setLoading(true);
    try {
      const API_URL = getApiUrl();
      // Nếu có workspaceId, lấy tất cả task của workspace đó (không chỉ của currentUserId)
      // Nếu không có workspaceId, lấy task của currentUserId
      let url = '';
      if (workspaceId) {
        url = `${API_URL}/api/task?workspace_id=${workspaceId}`;
      } else {
        url = `${API_URL}/api/task?created_by=${currentUserId}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok && result.success) {
        const fetchedTasks = result.tasks || [];
        setTasks(fetchedTasks);

        // Fetch assigned users for all tasks
        const usersMap: Record<number, AssignedUser[]> = {};
        await Promise.all(
          fetchedTasks.map(async (task: Task) => {
            const users = await fetchAssignedUsers(task.id);
            usersMap[task.id] = users;
          }),
        );
        setTaskAssignedUsers(usersMap);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể tải dữ liệu công việc',
        });
      }
    } catch (error: any) {
      console.error('Error fetching task detail:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  }, [currentUserId, fetchAssignedUsers, workspaceId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks]),
  );

  useEffect(() => {
    if (!selectedTask) return;

    let tabIndex = 0;
    if (selectedTask.status === 'processing') {
      tabIndex = 1;
    } else if (selectedTask.status === 'completed') {
      tabIndex = 2;
    }

    setSelectedTab(tabIndex);
    if (PagerView && pagerRef.current) {
      pagerRef.current.setPage(tabIndex);
    } else if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: tabIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  }, [selectedTask]);

  const handleRename = async () => {
    if (!taskSelect || !renameValue.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Tên không được để trống',
      });
      return;
    }

    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskSelect.id}`, {
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
          text2: 'Đổi tên task thành công',
        });
        setIsShowRename(false);
        setRenameValue('');
        setIsShowAction(false);
        fetchTasks();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Đổi tên task thất bại',
        });
      }
    } catch (error: any) {
      console.error('Error renaming task:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    }
  };

  const handleDelete = async () => {
    if (!taskSelect) {
      return;
    }

    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskSelect.id}`, {
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
          text2: 'Xóa task thành công',
        });
        setIsShowDeleteConfirm(false);
        setIsShowAction(false);
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Xóa task thất bại',
        });
      }
    } catch (error: any) {
      console.error('Error deleting task:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    }
  };

  const renderTaskCard = (
    task: Task,
    status: Task['status'],
    columnMeta: (typeof TASK_COLUMNS)[0],
  ) => {
    const priorityMeta = getPriorityMeta(task.priority);
    const assignedUsers = taskAssignedUsers[task.id] || [];
    const isCurrentUserAssigned =
      currentUserId &&
      assignedUsers.some(user => user.user_id === currentUserId);
    const priorityIcon = priorityMeta ? (
      <Icon
        name="flag"
        style={{ width: 22, height: 22 }}
        fill={priorityMeta.color}
      />
    ) : null;

    return (
      <Pressable
        key={task.id}
        style={styles.taskCardContainer}
        onPress={() => {
          navigation.navigate(NavigationName.TaskDetailScreen, {
            taskId: task.id,
            initialTask: task,
          });
        }}
      >
        {/* Task Content */}
        <View style={styles.taskCardContent}>
          {/* Task Name and Priority */}
          <View style={styles.taskNameRow}>
            <View style={{ flex: 1 }}>
              <TextCM style={styles.taskName} numberOfLines={3}>
                {task.description || task.name}
              </TextCM>
              {isCurrentUserAssigned && (
                <View style={styles.assignedIndicator}>
                  <Icon
                    name="checkmark-circle"
                    width={14}
                    height={14}
                    fill="#22C55E"
                  />
                  <TextCM style={styles.assignedIndicatorText}>
                    Đã được giao
                  </TextCM>
                </View>
              )}
            </View>
            {priorityIcon}
          </View>

          {/* Dates */}
          {task.createdAt && (
            <TextCM style={styles.taskDateText}>
              Ngày tạo: {DateUtils.convertDateToDDMMYYYY_H_M(task.createdAt)}
            </TextCM>
          )}
          {task.start_date && (
            <TextCM style={styles.taskDateText}>
              Ngày bắt đầu:{' '}
              {DateUtils.convertDateToDDMMYYYY_H_M(task.start_date)}
            </TextCM>
          )}

          {/* Metadata Icons */}
          <View style={styles.taskMetadataRow}>
            {/* Assigned Users */}
            <Pressable
              onPress={e => {
                e.stopPropagation();
                setTaskSelect(task);
                setIsShowAssign(true);
              }}
            >
              {assignedUsers.length > 0 ? (
                <View style={styles.taskUserAvatars}>
                  {assignedUsers.slice(0, 3).map((user, index) => (
                    <Image
                      key={user.user_id}
                      source={
                        user.avatar
                          ? { uri: user.avatar }
                          : { uri: 'https://via.placeholder.com/32' }
                      }
                      style={[
                        styles.taskUserAvatar,
                        { marginLeft: index > 0 ? -8 : 0 },
                      ]}
                    />
                  ))}
                  {assignedUsers.length > 3 && (
                    <View
                      style={[styles.taskUserAvatar, styles.taskUserAvatarMore]}
                    >
                      <TextCM style={styles.taskUserAvatarMoreText}>
                        +{assignedUsers.length - 3}
                      </TextCM>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.taskUserAvatars}>
                  <View style={styles.taskAddUserButton}>
                    <Icon
                      name="person-add-outline"
                      width={16}
                      height={16}
                      fill="#475467"
                    />
                  </View>
                </View>
              )}
            </Pressable>
            <View style={{ flex: 1 }} />

            {/* More Menu */}
            <Pressable
              onPress={e => {
                e.stopPropagation();
                setTaskSelect(task);
                setRenameValue(task.name);
                setIsShowAction(true);
              }}
            >
              <Icon
                name="more-horizontal-outline"
                width={24}
                height={24}
                fill="#475467"
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderPageContent = (status: Task['status'], pageIndex: number) => {
    const columnMeta = TASK_COLUMNS.find(column => column.key === status);
    if (!columnMeta) return null;

    const columnTasks = tasks.filter(task => task.status === status);
    const taskName =
      (initialWorkspace?.name && initialWorkspace.name.trim()) ||
      'Chi tiết không gian làm việc';

    return (
      <View style={styles.fullScreenPage}>
        <HeaderCM
          title={taskName}
          fillIconBackLeft={Color.Black}
          onPressIconLeft={() => navigation.goBack()}
          titleStyle={{ color: Color.Black }}
          contentStyle={{ backgroundColor: Color.White }}
          style={{ backgroundColor: Color.White }}
        />

        <View style={{ flex: 1, backgroundColor: columnMeta.background }}>
          <View
            style={[
              styles.statusHeader,
              { backgroundColor: columnMeta.background },
            ]}
          >
            <View style={styles.statusHeaderContent}>
              <TextCM style={styles.statusHeaderTitle}>
                {columnMeta.title}
              </TextCM>
              <View
                style={[
                  styles.statusHeaderBadge,
                  { backgroundColor: columnMeta.accent },
                ]}
              >
                <TextCM style={styles.statusHeaderBadgeText}>
                  {columnTasks.length}
                </TextCM>
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.pageScrollView}
            contentContainerStyle={styles.pageScrollContent}
          >
            {columnTasks.map(task => renderTaskCard(task, status, columnMeta))}

            {/* Add Task Button - Always show at bottom for all columns */}
            <View style={styles.addTaskContainer}>
              <Pressable
                style={styles.addTaskButton}
                onPress={() => {
                  setAddTaskStatus(status);
                  setIsShowAddTask(true);
                }}
              >
                <Icon
                  name="plus-circle-outline"
                  style={styles.addTaskIcon}
                  fill="#00204D"
                />
                <TextCM style={styles.addTaskText}>Thêm công việc</TextCM>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Spinner />
        </View>
      </View>
    );
  }

  if (PagerView) {
    return (
      <View style={styles.container}>
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={selectedTab}
          onPageSelected={(e: any) => {
            setSelectedTab(e.nativeEvent.position);
          }}
        >
          {renderPageContent('new', 0)}
          {renderPageContent('processing', 1)}
          {renderPageContent('completed', 2)}
        </PagerView>

        <ModalFullScreen
          isVisible={isShowAssign && !!taskSelect}
          children={
            taskSelect ? (
              <AssignedListScreen
                taskId={taskSelect.id}
                onClose={() => {
                  setIsShowAssign(false);
                  fetchTasks();
                }}
              />
            ) : null
          }
        />

        <BottomSheetCM
          title="Thao tác"
          isVisible={isShowAction}
          onClose={() => {
            setIsShowAction(false);
            setTaskSelect(null);
          }}
          renderContent={
            <Menu>
              <MenuItem
                title="Đổi tên"
                accessoryLeft={<Icon name="edit-2-outline" />}
                onPress={() => {
                  setIsShowRename(true);
                  setIsShowAction(false);
                }}
              />
              <MenuItem
                title="Giao cho"
                accessoryLeft={<Icon name="person-add-outline" />}
                onPress={() => {
                  setIsShowAssign(true);
                  setIsShowAction(false);
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
                label="Tên task"
                placeholder="Nhập tên task"
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
          onClose={() => setIsShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title="Xác nhận xóa"
          content="Bạn có chắc chắn muốn xóa task này không?"
          type="cancel"
          labelCancel="Hủy"
          labelConfirm="Xóa"
          styleBtnRight={{ backgroundColor: Color.RedE14337 }}
        />
      </View>
    );
  }

  // Fallback to ScrollView if PagerView is not available
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const pageIndex = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
          );
          setSelectedTab(pageIndex);
        }}
        contentOffset={{ x: selectedTab * SCREEN_WIDTH, y: 0 }}
      >
        {renderPageContent('new', 0)}
        {renderPageContent('processing', 1)}
        {renderPageContent('completed', 2)}
      </ScrollView>

      <ModalFullScreen
        isVisible={isShowAssign && !!taskSelect}
        children={
          taskSelect ? (
            <AssignedListScreen
              taskId={taskSelect.id}
              onClose={() => {
                setIsShowAssign(false);
                fetchTasks();
              }}
            />
          ) : null
        }
      />

      <BottomSheetCM
        title="Thao tác"
        isVisible={isShowAction}
        onClose={() => {
          setIsShowAction(false);
          setTaskSelect(null);
        }}
        renderContent={
          <Menu>
            <MenuItem
              title="Đổi tên"
              accessoryLeft={<Icon name="edit-2-outline" />}
              onPress={() => {
                setIsShowRename(true);
                setIsShowAction(false);
              }}
            />
            <MenuItem
              title="Giao cho"
              accessoryLeft={<Icon name="person-add-outline" />}
              onPress={() => {
                setIsShowAssign(true);
                setIsShowAction(false);
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
              label="Tên task"
              placeholder="Nhập tên task"
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
        onClose={() => setIsShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa task này không?"
        type="cancel"
        labelCancel="Hủy"
        labelConfirm="Xóa"
        styleBtnRight={{ backgroundColor: Color.RedE14337 }}
      />

      <ModalFullScreen
        isVisible={isShowAddTask}
        children={
          <AddTaskScreen
            onClose={() => {
              setIsShowAddTask(false);
              fetchTasks(); // Refresh tasks after creating
            }}
            initialStatus={addTaskStatus}
            workspaceId={route.params?.workspaceId}
          />
        }
      />
    </View>
  );
};

export default TaskScreen;

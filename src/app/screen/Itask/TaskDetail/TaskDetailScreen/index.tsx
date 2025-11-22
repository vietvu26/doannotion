import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon, Divider, Spinner, Menu, MenuItem, Input } from '@ui-kitten/components';
import HeaderCM from '../../../../components/Header/HeaderCM';
import TextCM from '../../../../components/Text';
import { Color } from '../../../../../constants';
import { DateUtils } from '../../../../../utils';
import { getApiUrl } from '../../../../../config/api.config';
import Toast from 'react-native-toast-message';
import AssignedListScreen from '../../component/AssignedListScreen';
import ModalFullScreen from '../../../../components/ModalFullScreen';
import BottomSheetCM from '../../../../components/BottomSheet';
import DatePickerModal from '../../../../components/ModalPickCalender';
import ModalRemindScreen, { ConfigRemind } from '../../component/ModalRemindScreen';
import { useAppSelector } from '../../../../../hooks/useRedux';
import styles from './styles';

interface Task {
  id: number;
  name: string;
  description: string | null;
  status: 'new' | 'processing' | 'completed';
  priority: string | null;
  start_date: string | null;
  due_date: string | null;
  completed_date: string | null;
  reminder_date: string | null;
  reminder_config: string | null;
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

const STATUS_LABELS = {
  new: 'Mới',
  processing: 'Đang thực hiện',
  completed: 'Hoàn thành',
};

const STATUS_COLORS = {
  new: '#00A3FF',
  processing: '#EF5DA8',
  completed: '#22C55E',
};

const PRIORITIES = [
  { label: 'Khẩn cấp', value: '1', color: '#FF4930' },
  { label: 'Cao', value: '2', color: '#CA8A04' },
  { label: 'Trung bình', value: '3', color: '#16A34A' },
  { label: 'Thấp', value: '4', color: '#00204D47' },
];

const getPriorityMeta = (priority: string | null) => {
  if (!priority) return null;
  return PRIORITIES.find(p => p.value === priority) || null;
};

const TaskDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { taskId, initialTask } = route.params || {};
  const currentUserId = useAppSelector((state) => state.common.currentUserId);

  console.log('[TaskDetailScreen] Rendered with params:', { taskId, initialTask, routeParams: route.params });

  const [task, setTask] = useState<Task | null>(initialTask || null);
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isShowAssign, setIsShowAssign] = useState(false);
  const [isShowStatusSheet, setIsShowStatusSheet] = useState(false);
  const [isShowPrioritySheet, setIsShowPrioritySheet] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [showModalRemind, setShowModalRemind] = useState(false);
  const [reminderConfig, setReminderConfig] = useState<ConfigRemind | null>(null);

  const fetchTask = useCallback(async () => {
    if (!taskId) {
      console.log('[TaskDetailScreen] No taskId provided');
      return;
    }

    console.log('[TaskDetailScreen] Fetching task with ID:', taskId);
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const url = `${API_URL}/api/task/${taskId}`;
      console.log('[TaskDetailScreen] Fetching from URL:', url);
      const response = await fetch(url);
      const result = await response.json();

      console.log('[TaskDetailScreen] API response:', JSON.stringify(result, null, 2));

      if (response.ok && result.success && result.task) {
        console.log('[TaskDetailScreen] Task fetched successfully:', result.task.id, result.task.name);
        setTask(result.task);
      } else {
        console.error('[TaskDetailScreen] Failed to fetch task:', result.error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể tải thông tin công việc',
        });
      }
    } catch (error: any) {
      console.error('[TaskDetailScreen] Error fetching task:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  const fetchAssignedUsers = useCallback(async () => {
    if (!taskId) return;

    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}/assign`);
      const result = await response.json();

      if (response.ok && result.success) {
        setAssignedUsers(result.assignedUsers || []);
      }
    } catch (error) {
      // Silent fail
    }
  }, [taskId]);

  const handleStatusChange = async (newStatus: 'new' | 'processing' | 'completed') => {
    if (!taskId || !task) return;

    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTask({ ...task, status: newStatus });
        setIsShowStatusSheet(false);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đã cập nhật trạng thái',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể cập nhật trạng thái',
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

  const handlePriorityChange = async (newPriority: string | null) => {
    if (!taskId || !task) return;

    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priority: newPriority,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTask({ ...task, priority: newPriority });
        setIsShowPrioritySheet(false);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đã cập nhật độ ưu tiên',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể cập nhật độ ưu tiên',
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

  const handleDescriptionChange = async (newDescription: string) => {
    if (!taskId || !task) return;

    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newDescription,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTask({ ...task, description: newDescription });
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đã cập nhật mô tả',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể cập nhật mô tả',
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

  const convertToDateTime = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() || 0).padStart(2, '0');
    const minutes = String(date.getMinutes() || 0).padStart(2, '0');
    const seconds = '00';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleStartDateChange = async (date: string) => {
    if (!taskId || !task) return;

    const dateTime = convertToDateTime(date);
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_date: dateTime,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTask({ ...task, start_date: dateTime });
        setShowStartDatePicker(false);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đã cập nhật ngày bắt đầu',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể cập nhật ngày bắt đầu',
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

  const handleDueDateChange = async (date: string) => {
    if (!taskId || !task) return;

    const dateTime = convertToDateTime(date);
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          due_date: dateTime,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTask({ ...task, due_date: dateTime });
        setShowDueDatePicker(false);
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đã cập nhật ngày kết thúc',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể cập nhật ngày kết thúc',
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

  const handleReminderConfigSave = async (config: ConfigRemind) => {
    if (!taskId || !task) return;

    const dateTime = config.dateStart ? convertToDateTime(config.dateStart) : null;
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reminder_date: dateTime,
          reminder_config: JSON.stringify(config),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setTask({ ...task, reminder_date: dateTime });
        setReminderConfig(config);
        setShowModalRemind(false);
        
        // Schedule Firebase notification
        if (dateTime) {
          await scheduleReminderNotification(taskId, task.name, dateTime);
        }
        
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đã cập nhật nhắc nhở',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Không thể cập nhật nhắc nhở',
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

  const scheduleReminderNotification = async (taskId: number, taskName: string, reminderDate: string | null) => {
    if (!reminderDate) return;

    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}/schedule-reminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          taskName,
          reminderDate,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error('Failed to schedule reminder notification:', result.error);
      }
    } catch (error) {
      console.error('Error scheduling reminder notification:', error);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchTask();
      fetchAssignedUsers();
    } else if (initialTask) {
      setTask(initialTask);
      fetchAssignedUsers();
    }
  }, [taskId, initialTask, fetchTask, fetchAssignedUsers]);

  useEffect(() => {
    if (task) {
      setDescription(task.description || '');
      // Parse reminder_config if exists
      if (task.reminder_config) {
        try {
          const config = JSON.parse(task.reminder_config) as ConfigRemind;
          setReminderConfig(config);
        } catch (error) {
          // If parse fails, create default config from reminder_date
          if (task.reminder_date) {
            setReminderConfig({
              dateStart: task.reminder_date,
              typeLoop: null,
              alwaysLoop: false,
              iterationCount: null,
              dateEnd: null,
            });
          }
        }
      } else if (task.reminder_date) {
        // If no config but has reminder_date, create default config
        setReminderConfig({
          dateStart: task.reminder_date,
          typeLoop: null,
          alwaysLoop: false,
          iterationCount: null,
          dateEnd: null,
        });
      }
    }
  }, [task]);

  if (loading && !task) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextCM>Không tìm thấy công việc</TextCM>
      </View>
    );
  }

  const statusLabel = STATUS_LABELS[task.status];
  const statusColor = STATUS_COLORS[task.status];
  const priorityMeta = getPriorityMeta(task.priority);
  
  // Kiểm tra xem user hiện tại có được assigned vào task này không
  const isCurrentUserAssigned = currentUserId && assignedUsers.some(user => user.user_id === currentUserId);

  return (
    <View style={{ flex: 1, backgroundColor: Color.White }}>
      <HeaderCM
        title={task.name}
        fillIconBackLeft={Color.White}
        onPressIconLeft={() => navigation.goBack()}
        alignment="start"
      />
      {isCurrentUserAssigned && (
        <View style={styles.assignedBadge}>
          <Icon name="checkmark-circle" width={16} height={16} fill="#22C55E" />
          <TextCM style={styles.assignedBadgeText}>Bạn đã được giao nhiệm vụ này</TextCM>
        </View>
      )}
      <Divider />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16 }}>
          
          {/* Status and Priority */}
          <View style={styles.ctnTaskInfo}>
            {/* Status */}
            <View style={styles.ctnItem}>
              <TextCM style={styles.ctnTextItem}>Trạng thái</TextCM>
              <View style={styles.ctnStatus}>
                <View
                  style={[
                    styles.styleStatus,
                    { backgroundColor: `${statusColor}1A` },
                  ]}>
                  <TextCM style={[styles.statusText, { color: statusColor }]}>
                    {statusLabel}
                  </TextCM>
                </View>
                <View style={styles.diviverHeight} />
                <Pressable
                  onPress={() => setIsShowStatusSheet(true)}
                  style={[
                    styles.styleStatusSelect,
                    { backgroundColor: `${statusColor}1A` },
                  ]}>
                  <Icon
                    fill={statusColor}
                    name="arrow-ios-forward"
                    width={16}
                    height={16}
                  />
                </Pressable>
                <View style={{ flex: 1 }} />
              </View>
            </View>

            {/* Priority */}
            <View style={styles.ctnItem}>
              <TextCM style={styles.ctnTextItem}>Độ ưu tiên</TextCM>
              <View style={styles.ctnStatus}>
                <Pressable
                  onPress={() => setIsShowPrioritySheet(true)}
                  style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
                  {priorityMeta ? (
                    <View
                      style={[
                        styles.viewPriority,
                        { borderColor: priorityMeta.color },
                      ]}>
                      <Icon
                        name="flag"
                        style={{ width: 22, height: 22 }}
                        fill={priorityMeta.color}
                      />
                    </View>
                  ) : (
                    <TextCM style={styles.placeholderText}>Chọn độ ưu tiên</TextCM>
                  )}
                  <Icon
                    name="arrow-ios-forward"
                    width={16}
                    height={16}
                    fill={Color.Text}
                  />
                </Pressable>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </View>
          <Divider style={styles.divider} />

          {/* Description */}
          <View style={styles.ctnDescription}>
            <View style={styles.ctnOpenDescription}>
              <Icon name="menu" width={24} height={24} />
              <Input
                style={{ flex: 1 }}
                placeholder="Thêm mô tả"
                value={description}
                onChangeText={setDescription}
                onBlur={() => {
                  if (description !== (task?.description || '')) {
                    handleDescriptionChange(description);
                  }
                }}
                multiline
                textStyle={{ minHeight: 40 }}
              />
            </View>
          </View>
          <Divider style={styles.divider} />

          {/* Dates */}
          <View style={styles.ctnTaskDate}>
            <Icon name="clock" width={20} height={20} />
            <View style={styles.viewDate}>
              <Pressable onPress={() => setShowStartDatePicker(true)}>
                <TextCM style={styles.dateText}>
                  {task.start_date
                    ? DateUtils.convertDateToDDMMYYYY_H_M(task.start_date)
                    : 'Ngày bắt đầu'}
                </TextCM>
              </Pressable>
              <Divider style={{ height: 2 }} />
              <Pressable onPress={() => setShowDueDatePicker(true)}>
                <TextCM style={styles.dateText}>
                  {task.due_date
                    ? DateUtils.convertDateToDDMMYYYY_H_M(task.due_date)
                    : 'Ngày kết thúc'}
                </TextCM>
              </Pressable>
              <Divider style={{ height: 2 }} />
              <Pressable onPress={() => setShowModalRemind(true)}>
                <TextCM style={styles.dateText}>
                  {task.reminder_date
                    ? DateUtils.convertDateToDDMMYYYY_H_M(task.reminder_date)
                    : 'Nhắc nhở'}
                </TextCM>
              </Pressable>
            </View>
          </View>
          <Divider style={styles.divider} />

          {/* Tags */}
          
          <Divider style={styles.divider} />

          {/* Assigned Users */}
          <View style={[styles.ctnTaskDate, { alignItems: 'center' }]}>
            <Icon name="people" width={20} height={20} />
            <Pressable
              onPress={() => setIsShowAssign(true)}
              style={{ flex: 1 }}>
              {assignedUsers.length > 0 ? (
                <View style={styles.userAvatars}>
                  {assignedUsers.slice(0, 3).map((user, index) => (
                    <Image
                      key={user.user_id}
                      source={
                        user.avatar
                          ? { uri: user.avatar }
                          : { uri: 'https://via.placeholder.com/40' }
                      }
                      style={[
                        styles.userAvatar,
                        { marginLeft: index > 0 ? -8 : 0 },
                      ]}
                    />
                  ))}
                  {assignedUsers.length > 3 && (
                    <View style={[styles.userAvatar, styles.userAvatarMore]}>
                      <TextCM style={styles.userAvatarMoreText}>
                        +{assignedUsers.length - 3}
                      </TextCM>
                    </View>
                  )}
                </View>
              ) : (
                <TextCM style={styles.placeholderText}>Người được giao</TextCM>
              )}
            </Pressable>
          </View>
          <Divider style={styles.divider} />
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalFullScreen
        isVisible={isShowAssign}
        children={
          taskId ? (
            <AssignedListScreen
              taskId={taskId}
              onClose={() => {
                setIsShowAssign(false);
                fetchAssignedUsers();
              }}
            />
          ) : null
        }
      />

      <BottomSheetCM
        title="Trạng thái"
        isVisible={isShowStatusSheet}
        onClose={() => setIsShowStatusSheet(false)}
        renderContent={
          <Menu>
            <MenuItem
              title="Mới"
              accessoryRight={
                task?.status === 'new' ? <Icon name="checkmark" /> : undefined
              }
              onPress={() => handleStatusChange('new')}
            />
            <MenuItem
              title="Đang thực hiện"
              accessoryRight={
                task?.status === 'processing' ? <Icon name="checkmark" /> : undefined
              }
              onPress={() => handleStatusChange('processing')}
            />
            <MenuItem
              title="Hoàn thành"
              accessoryRight={
                task?.status === 'completed' ? <Icon name="checkmark" /> : undefined
              }
              onPress={() => handleStatusChange('completed')}
            />
          </Menu>
        }
      />

      <BottomSheetCM
        title="Độ ưu tiên"
        isVisible={isShowPrioritySheet}
        onClose={() => setIsShowPrioritySheet(false)}
        renderContent={
          <Menu>
            <MenuItem
              title="Khẩn cấp"
              accessoryLeft={
                <Icon
                  name="flag"
                  style={{ width: 22, height: 22 }}
                  fill="#FF4930"
                />
              }
              accessoryRight={
                task?.priority === '1' ? <Icon name="checkmark" /> : undefined
              }
              onPress={() => handlePriorityChange('1')}
            />
            <MenuItem
              title="Cao"
              accessoryLeft={
                <Icon
                  name="flag"
                  style={{ width: 22, height: 22 }}
                  fill="#CA8A04"
                />
              }
              accessoryRight={
                task?.priority === '2' ? <Icon name="checkmark" /> : undefined
              }
              onPress={() => handlePriorityChange('2')}
            />
            <MenuItem
              title="Trung bình"
              accessoryLeft={
                <Icon
                  name="flag"
                  style={{ width: 22, height: 22 }}
                  fill="#16A34A"
                />
              }
              accessoryRight={
                task?.priority === '3' ? <Icon name="checkmark" /> : undefined
              }
              onPress={() => handlePriorityChange('3')}
            />
            <MenuItem
              title="Thấp"
              accessoryLeft={
                <Icon
                  name="flag"
                  style={{ width: 22, height: 22 }}
                  fill="#00204D47"
                />
              }
              accessoryRight={
                task?.priority === '4' ? <Icon name="checkmark" /> : undefined
              }
              onPress={() => handlePriorityChange('4')}
            />
            <MenuItem
              title="Bỏ chọn"
              accessoryRight={
                !task?.priority ? <Icon name="checkmark" /> : undefined
              }
              onPress={() => handlePriorityChange(null)}
            />
          </Menu>
        }
      />

      <DatePickerModal
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onSelect={(date: string | null) => {
          if (date) {
            handleStartDateChange(date);
          }
        }}
      />

      <DatePickerModal
        visible={showDueDatePicker}
        onClose={() => setShowDueDatePicker(false)}
        onSelect={(date: string | null) => {
          if (date) {
            handleDueDateChange(date);
          }
        }}
      />

      <ModalFullScreen
        isVisible={showModalRemind}
        children={
          <ModalRemindScreen
            onClose={() => setShowModalRemind(false)}
            onSave={handleReminderConfigSave}
            valueConfig={reminderConfig || undefined}
          />
        }
      />
    </View>
  );
};

export default TaskDetailScreen;


import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList, Pressable, RefreshControl} from 'react-native';
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';
import HeaderCM from '../../../../components/Header/HeaderCM';
import TextCM from '../../../../components/Text';
import styles from './styles';
import {useAppSelector} from '../../../../../hooks/useRedux';
import {getApiUrl} from '../../../../../config/api.config';
import {Spinner, Icon} from '@ui-kitten/components';
import {NavigationName} from '../../../../../constants';
import {DateUtils} from '../../../../../utils';

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

type FilterType = 'total' | 'completed' | 'inProgress' | 'pending' | 'overdue';

const TaskListScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const {filterType, title} = route.params || {filterType: 'total', title: 'Danh sách nhiệm vụ'};

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    setLoading(true);
    try {
      const API_URL = getApiUrl();
      let url = `${API_URL}/api/task?created_by=${currentUserId}`;

      // Add filter based on filterType
      switch (filterType) {
        case 'completed':
          url += '&status=completed';
          break;
        case 'inProgress':
          url += '&status=processing';
          break;
        case 'pending':
          url += '&status=new';
          break;
        case 'overdue':
          url += '&overdue=true';
          break;
        case 'total':
        default:
          // No filter, get all tasks
          break;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok && result.success) {
        let fetchedTasks = result.tasks || [];

        // Filter overdue tasks if needed
        if (filterType === 'overdue') {
          const now = new Date();
          fetchedTasks = fetchedTasks.filter((task: Task) => {
            if (!task.due_date || task.status === 'completed') {
              return false;
            }
            const dueDate = new Date(task.due_date);
            return dueDate < now;
          });
        }

        setTasks(fetchedTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId, filterType]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks();
  }, [fetchTasks]);

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'new':
        return 'Mới';
      case 'processing':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'new':
        return '#6366F1';
      case 'processing':
        return '#F59E0B';
      case 'completed':
        return '#10B981';
      default:
        return '#9CA3AF';
    }
  };

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa hẹn';
    try {
      return DateUtils.convertDateToDDMMYYYY(dateString);
    } catch (error) {
      return 'Chưa hẹn';
    }
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate(NavigationName.TaskDetailScreen, {
      taskId: task.id,
    });
  };

  const renderTaskItem = ({item}: {item: Task}) => {
    const isOverdue =
      filterType === 'overdue' &&
      item.due_date &&
      new Date(item.due_date) < new Date() &&
      item.status !== 'completed';

    return (
      <Pressable
        style={styles.taskItem}
        onPress={() => handleTaskPress(item)}>
        <View style={styles.taskHeader}>
          <TextCM style={styles.taskName} numberOfLines={2}>
            {item.name}
          </TextCM>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(item.status) + '20'},
            ]}>
            <TextCM
              style={[
                styles.statusText,
                {color: getStatusColor(item.status)},
              ]}>
              {getStatusLabel(item.status)}
            </TextCM>
          </View>
        </View>

        {item.description && (
          <TextCM style={styles.taskDescription} numberOfLines={2}>
            {item.description}
          </TextCM>
        )}

        <View style={styles.taskFooter}>
          <View style={styles.taskInfo}>
            {item.priority && (
              <View style={styles.infoItem}>
                <Icon
                  name="flag-outline"
                  fill="#6B7280"
                  width={16}
                  height={16}
                />
                <TextCM style={styles.infoText}>
                  {getPriorityLabel(item.priority)}
                </TextCM>
              </View>
            )}
            {item.due_date && (
              <View style={styles.infoItem}>
                <Icon
                  name="calendar-outline"
                  fill={isOverdue ? '#EF4444' : '#6B7280'}
                  width={16}
                  height={16}
                />
                <TextCM
                  style={[
                    styles.infoText,
                    isOverdue && styles.overdueText,
                  ]}>
                  {formatDate(item.due_date)}
                </TextCM>
              </View>
            )}
          </View>
          <Icon
            name="chevron-right-outline"
            fill="#9CA3AF"
            width={20}
            height={20}
          />
        </View>
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="file-text-outline" fill="#9CA3AF" width={64} height={64} />
      <TextCM style={styles.emptyText}>Chưa có nhiệm vụ nào</TextCM>
    </View>
  );

  return (
    <>
      <HeaderCM title={title} />
      {loading && tasks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Spinner />
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={
            tasks.length === 0 ? styles.emptyListContainer : styles.listContainer
          }
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </>
  );
};

export default TaskListScreen;


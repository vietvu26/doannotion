import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationName} from '../../constants';
import ETaskHome from '../../app/screen/Itask';
import ETaskDetail from '../../app/screen/Itask/TaskDetail';
import TaskDetailScreen from '../../app/screen/Itask/TaskDetail/TaskDetailScreen';
import StatisticsScreen from '../../app/screen/Itask/Statistics';
import NotificationScreen from '../../app/screen/Itask/Notification';
import TaskListScreen from '../../app/screen/Itask/TaskDetail/TaskListScreen';
import TabBarETask from './TabBarETask';
import {useState, useEffect, useCallback} from 'react';
import {useAppSelector} from '../../hooks/useRedux';
import {getApiUrl} from '../../config/api.config';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator cho Home để có thể navigate sang ETaskDetail và TaskDetailScreen
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ETaskHomeMain" component={ETaskHome} />
      <Stack.Screen name={NavigationName.ETaskDetail} component={ETaskDetail} />
      <Stack.Screen name={NavigationName.TaskDetailScreen} component={TaskDetailScreen} />
      <Stack.Screen name={NavigationName.TaskListScreen} component={TaskListScreen} />
    </Stack.Navigator>
  );
};

// Stack Navigator cho Statistics để có thể navigate sang TaskListScreen
const StatisticsStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StatisticsMain" component={StatisticsScreen} />
      <Stack.Screen name={NavigationName.TaskListScreen} component={TaskListScreen} />
      <Stack.Screen name={NavigationName.TaskDetailScreen} component={TaskDetailScreen} />
    </Stack.Navigator>
  );
};

const BottomTabNavigationETask = () => {
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadNotifications = useCallback(async () => {
    if (!currentUserId) {
      setUnreadCount(0);
      return;
    }

    try {
      const API_URL = getApiUrl();
      // Sử dụng API endpoint riêng để lấy số lượng unread nhanh hơn
      const response = await fetch(`${API_URL}/api/notification/unread-count?user_id=${currentUserId}`);
      const result = await response.json();

      if (result.success && result.unreadCount !== undefined) {
        setUnreadCount(result.unreadCount);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
      setUnreadCount(0);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchUnreadNotifications();
    
    // Refresh mỗi 2 giây để cập nhật số thông báo ngay lập tức khi có thông báo mới
    const interval = setInterval(() => {
      fetchUnreadNotifications();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [fetchUnreadNotifications]);

  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <TabBarETask {...props} totalRecoders={unreadCount} />}>
      <Tab.Screen 
        name={NavigationName.ETaskHome} 
        component={HomeStack}
        listeners={{
          focus: () => {
            fetchUnreadNotifications();
          },
        }}
      />
      <Tab.Screen 
        name={NavigationName.ETaskStatistics} 
        component={StatisticsStack}
        listeners={{
          focus: () => {
            fetchUnreadNotifications();
          },
        }}
      />
      <Tab.Screen 
        name={NavigationName.ETaskNotification} 
        component={NotificationScreen}
        listeners={{
          focus: () => {
            // Refresh unread count khi vào màn hình notification
            fetchUnreadNotifications();
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigationETask;


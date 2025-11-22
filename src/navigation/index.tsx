import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { LIST_SCREEN } from './helper';
import Toast from 'react-native-toast-message';
import toastConfig from '../utils/ToastConfig';
import { NavigationName } from '../constants';
import BottomTabNavigationENotion from './BottomTabs/BottomTabNavigationENotion';
import DashboardApp from '../app/screen/DashboardApp';
import { LoginScreen } from '../app/screen/Account';
import SignUpScreen from '../app/screen/Account/SignUp';
import ForgotPasswordScreen from '../app/screen/Account/ForgotPassword';
import OTPVerificationScreen from '../app/screen/Account/OTPVerification';
import CreatePasswordScreen from '../app/screen/Account/CreatePassword';
import ResetPasswordScreen from '../app/screen/Account/ResetPassword';
import SettingsScreen from '../app/screen/Settings';
import AccountInfoScreen from '../app/screen/AccountInfo';
import DetailScreen from '../app/screen/Notion/Detail';
import BottomTabNavigationETask from './BottomTabs/BottomTabNavigationETask';
import ETaskDetail from '../app/screen/Itask/TaskDetail';
import TaskDetailScreen from '../app/screen/Itask/TaskDetail/TaskDetailScreen';
import TaskListScreen from '../app/screen/Itask/TaskDetail/TaskListScreen';
import { useAppSelector } from '../hooks/useRedux';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const isAuthorized = useAppSelector((state) => state.common.isAuthorized);
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const accessToken = useAppSelector((state) => state.common.accessToken);
  
  // Xác định initial route dựa trên trạng thái đăng nhập
  // PersistGate đã đảm bảo state được restore từ AsyncStorage trước khi component này render
  // Vì vậy, khi component này render lần đầu, state đã có giá trị từ lần đăng nhập trước
  const initialRoute = (isAuthorized && currentUserId && accessToken) 
    ? NavigationName.Dashboard 
    : NavigationName.Login;

  return (
    <PaperProvider>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }} 
        initialRouteName={initialRoute}
      >
        <Stack.Screen
          name={NavigationName.Login}
          component={LoginScreen}
        />
        <Stack.Screen
          name={NavigationName.SignUp}
          component={SignUpScreen}
        />
        <Stack.Screen
          name={NavigationName.Dashboard}
          component={DashboardApp}
        />
         <Stack.Screen
          name={NavigationName.ForgotPassword}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name={NavigationName.OTPVerification}
          component={OTPVerificationScreen}
        />
        <Stack.Screen
          name={NavigationName.CreatePassword}
          component={CreatePasswordScreen}
        />
        <Stack.Screen
          name={NavigationName.ResetPassword}
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name={NavigationName.BottomTabs}
          component={BottomTabNavigationENotion}
        />
        <Stack.Screen
          name={NavigationName.Settings}
          component={SettingsScreen}
        />
        <Stack.Screen
          name={NavigationName.AccountInfo}
          component={AccountInfoScreen}
        />
        <Stack.Screen
          name={NavigationName.NotionDetail}
          component={DetailScreen}
        />
        <Stack.Screen
          name={NavigationName.ETaskHome}
          component={BottomTabNavigationETask}
        />
        <Stack.Screen
          name={NavigationName.ETaskDetail}
          component={ETaskDetail}
        />
        <Stack.Screen
          name={NavigationName.TaskDetailScreen}
          component={TaskDetailScreen}
        />
        <Stack.Screen
          name={NavigationName.TaskListScreen}
          component={TaskListScreen}
        />
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </PaperProvider>
  );
}

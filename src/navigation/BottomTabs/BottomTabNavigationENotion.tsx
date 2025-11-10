import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../../app/screen/Notion/Search';
import EditorScreen from '../../app/screen/Notion/Editor';
import HomeNotion from '../../app/screen/Notion/Home';
import DetailScreen from '../../app/screen/Notion/Detail';
import { Icon } from '@ui-kitten/components';
import { NavigationName } from '../../constants';

const Stack = createNativeStackNavigator();

// Stack Navigator cho Home để có thể navigate sang Detail
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeNotion} />
      <Stack.Screen name={NavigationName.NotionDetail} component={DetailScreen} />
    </Stack.Navigator>
  );
};

const BottomTabNavigationENotion = () => {

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName = 'home-outline';
          if (route.name === 'Search') iconName = 'search-outline';
          if (route.name === 'Editor') iconName = 'edit-2-outline';

          return <Icon name={iconName} fill={color} style={{ width: 24, height: 24 }} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Editor" component={EditorScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigationENotion;

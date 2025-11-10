
import DashboardApp from '../app/screen/DashboardApp';
import HomeNotion from '../app/screen/Notion/Home';
import {NavigationName} from '../constants';
import BottomTabNavigationENotion from './BottomTabs/BottomTabNavigationENotion';

export const LIST_SCREEN = [
  {
    name: NavigationName.BottomTabs,
    component: BottomTabNavigationENotion,
  },
  {
    name: NavigationName.Dashboard,
    component: DashboardApp,
  },
  {
    name: NavigationName.NotionApp,
    component: HomeNotion,
  },
  
 
];

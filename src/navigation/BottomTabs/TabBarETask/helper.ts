// import Home

import DashboardApp from "../../../app/screen/DashboardApp";
import HomeNotion from "../../../app/screen/Notion/Home";
import EditorScreen from "../../../app/screen/Notion/Editor";
import SearchScreen from "../../../app/screen/Notion/Search";


export const TabName = {
  Dashboard: 'Dashboard',
  Search: 'Search',
  Editor: 'Editor',
  Home: 'Home',
};

export type BottomTabitem = {
  name: string;
  component: React.FunctionComponent;
  permission: string | null;
};

export const listBottomTab: BottomTabitem[] = [
  {
    name: TabName.Dashboard,
    component: DashboardApp,
    permission: null,
  },
  {
    name: TabName.Editor,
    component: EditorScreen,
    permission: null,
  },
  {
    name: TabName.Search,
    component: SearchScreen,
    permission: null,
  },
  {
    name: TabName.Home,
    component: HomeNotion,
    permission: null,
  },
];

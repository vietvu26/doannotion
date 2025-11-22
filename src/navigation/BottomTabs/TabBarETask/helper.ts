// Tab names for ETask bottom navigation
export const TabName = {
  ETaskHome: 'ETaskHome',
  ETaskStatistics: 'ETaskStatistics',
  ETaskNotification: 'ETaskNotification',
  // Legacy tab names (for Notion - kept for backward compatibility)
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

// Legacy listBottomTab removed - not used for ETask navigation
// If needed for Notion tabs, should be in a separate helper file

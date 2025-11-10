import {createDashboardServices} from '../services/dashboard';
import {useFetchRequest} from './useFetch';

export const useDashboardServices = () => {
  const fetchRequest = useFetchRequest();
  return createDashboardServices(fetchRequest);
};

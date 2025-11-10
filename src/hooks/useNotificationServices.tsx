import {createNotificationServices} from '../services/notification';
import {useFetchRequest} from './useFetch';

export const useNotificationServices = () => {
  const fetchRequest = useFetchRequest();
  return createNotificationServices(fetchRequest);
};

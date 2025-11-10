import { createHomeServices } from '../services/home';
import {useFetchRequest} from './useFetch';

export const useHomeService = () => {
  const fetchRequest = useFetchRequest();
  return createHomeServices(fetchRequest);
};

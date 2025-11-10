import {createBoardServices} from '../../services/board.services';
import {createTaskServices} from '../../services/task.services';
import {createUtilsServices} from '../../services/ultis.services';
import {createUserServices} from '../../services/users.services';
import {useFetchRequest} from '../useFetch';

export const useBoardService = () => {
  const fetch = useFetchRequest();
  return createBoardServices(fetch);
};

export const useUserService = () => {
  const fetch = useFetchRequest();
  return createUserServices(fetch);
};

export const useTaskService = () => {
  const fetch = useFetchRequest();
  return createTaskServices(fetch);
};

export const useUtilsService = () => {
  const fetch = useFetchRequest();
  return createUtilsServices(fetch);
};

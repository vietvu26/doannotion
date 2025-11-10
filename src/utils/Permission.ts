import {MenuViewItem} from '../model/interface/service.interface';

const hasPermission = (
  listMenuView: MenuViewItem[],
  nameId?: string | null,
) => {
  if (!nameId) return true;
  return listMenuView?.some(view => view.nameId === nameId);
};

export default {hasPermission};

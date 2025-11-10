import {useUserStore} from '../../../../../zutand/user-store';
import {useEffect, useState} from 'react';
import {IOrgIn} from '../../../../../model/interface/account.interface';
import {Icon, Input, List, ListItem} from '@ui-kitten/components';
import useDebounce from '../../../../../hooks/useDebounce';
import {AssignOrgList} from '../../../../screens/task-detail/components/task-detail-item/helper';
import { useTranslation } from 'react-i18next';

type Props = {
  assignDepartmentsList: AssignOrgList[] | undefined;
  setAssignDepartmentsList: (
    assignUserList: AssignOrgList[] | undefined,
  ) => void;
  type: 'L' | 'T' | 'C';
  resourceId: string | undefined;
};

const Departments = ({
  assignDepartmentsList,
  setAssignDepartmentsList,
  type,
  resourceId,
}: Props) => {
  const {t} = useTranslation();
  const {listOrgIn} = useUserStore();
  const [listOrginState, setListOrginState] = useState<IOrgIn[]>(listOrgIn);
  const [listOrginSelect, setListOrginSelect] = useState<IOrgIn[]>(
    listOrgIn?.filter(org =>
      assignDepartmentsList?.find(o => o.orgIn === org.orgIn),
    ) || [],
  );
  const [valueText, setValueText] = useState('');
  const valueTextDebounce = useDebounce(valueText, 200);

  const handleFilter = () => {
    if (valueTextDebounce) {
      setListOrginState(
        listOrgIn.filter(org =>
          org.name.toLowerCase().includes(valueTextDebounce.toLowerCase()),
        ),
      );
    } else {
      setListOrginState(listOrgIn);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [valueTextDebounce]);

  const handleSelect = (org: IOrgIn) => {
    const listOrgIn = listOrginSelect?.map(org => org.orgIn);
    let newDataSelect;
    if (listOrgIn?.includes(org.orgIn)) {
      newDataSelect = listOrginSelect?.filter(
        orgState => orgState.orgIn !== org.orgIn,
      );
      setListOrginSelect(newDataSelect);
    } else {
      newDataSelect = [...listOrginSelect, org];
      setListOrginSelect(newDataSelect);
    }
    handleSave(newDataSelect);
  };

  const handleSave = (newDataSelect: IOrgIn[]) => {
    const dataFilterOrgAssign = newDataSelect.map(org => {
      const orgInList = assignDepartmentsList?.find(
        o => o.orgIn === org?.orgIn,
      );
      if (orgInList) {
        return orgInList;
      }
      return {
        id: `${new Date().getTime().toString()}`,
        resourceId: resourceId,
        orgIn: org?.orgIn,
        custId: org?.custId,
        type: type,
        assignOrgIn: org?.orgIn,
      } as unknown as AssignOrgList;
    });
    setAssignDepartmentsList(dataFilterOrgAssign);
  };
  return (
    <>
      <Input
        style={{padding: 10}}
        value={valueText}
        onChangeText={setValueText}
        placeholder={t('board.organization')}
      />
      <List
        style={{paddingHorizontal: 10, backgroundColor: '#fff'}}
        data={listOrginState}
        contentContainerStyle={{backgroundColor: '#fff', rowGap: 16}}
        renderItem={({item}) => (
          <ListItem
            onPress={() => handleSelect(item)}
            title={item.name}
            accessoryRight={
              listOrginSelect?.find(user => user.orgIn === item.orgIn) ? (
                <Icon name="checkmark" width={16} height={16} />
              ) : undefined
            }
          />
        )}
      />
    </>
  );
};

export default Departments;

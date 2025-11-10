import {Tab, TabView} from '@ui-kitten/components';
import HeaderCM from '../Header/HeaderCM';
import {useState} from 'react';
import Authority from './component/authority';
import Share from './component/share';
import {ITask} from '../../screens/board/store/interface';
import {useTranslation} from 'react-i18next';

type Props = {
  onClose?: () => void;
  type: 'L' | 'T' | 'C';
  resource?: ITask;
};

const AuthorityAndShareScreen = ({onClose, type, resource}: Props) => {
  const {t} = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <HeaderCM
        style={{
          backgroundColor: '#fff',
        }}
        titleStyle={{
          color: '#00204D',
        }}
        fillIconBackLeft="#00204DB2"
        contentStyle={{
          backgroundColor: '#fff',
        }}
        title={t('board.share-permission')}
        onPressIconLeft={onClose}
      />

      <TabView
        style={{flex: 1}}
        swipeEnabled={false}
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>
        <Tab title={t('board.share-permission')}>
          <Authority type={type} resource={resource} />
        </Tab>
        <Tab title={t('CM.share')}>
          <Share />
        </Tab>
      </TabView>
    </>
  );
};

export default AuthorityAndShareScreen;

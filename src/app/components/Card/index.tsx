import {Image, TouchableOpacity, View} from 'react-native';
import TextCM from '../Text';
import CheckboxCM from '../Checkbox';
import {FC, useEffect, useState} from 'react';
import styles from './styles';
import {Iconhigh, Iconlow, Iconmedium} from '../../../assets/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SizeDP} from '../../../constants/Size';
import {Propity, Status} from '../../../model/enum/common.enum';
import {ITicket} from '../../../model/interface/service.interface';
import {DateUtils} from '../../../utils';
import {Color, String} from '../../../constants';
import {IAccount} from '../../../model/interface/account.interface';
import {useTranslation} from 'react-i18next';
import {Divider} from '@ui-kitten/components';

type Props = {
  dataCard: ITicket;
  onSelect?: (listSelect: ITicket[]) => void;
  select?: ITicket[];
  account: IAccount;
  isView?: boolean;
};

const CardCM: FC<Props> = ({dataCard, select, onSelect, account, isView}) => {
  const {t} = useTranslation();
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (!isView) {
      select?.forEach(item => {
        if (item.id === dataCard.id) {
          setChecked(true);
        }
      });
    }
  }, []);

  const handleSelect = (checkedValue: boolean) => {
    setChecked(checkedValue);
    if (checkedValue) {
      onSelect?.([...select!, dataCard]);
    } else {
      const filterData = select!.filter(data => data.id !== dataCard.id);
      onSelect?.(filterData);
    }
  };

  const renderPriority = () => {
    switch (dataCard?.priority) {
      case Propity.high:
        return <Iconhigh width={SizeDP(16)} height={SizeDP(16)} />;
      case Propity.medium:
        return <Iconmedium width={SizeDP(16)} height={SizeDP(16)} />;
      case Propity.low:
        return <Iconlow width={SizeDP(16)} height={SizeDP(16)} />;
    }
  };

  const renderContent = (color: string, bgColor: string, status: Status) => {
    return (
      <View
        style={{
          backgroundColor: bgColor,
          paddingHorizontal: SizeDP(10),
          paddingVertical: SizeDP(6),
          borderRadius: SizeDP(16),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextCM style={{color: color}}>{t(`TK.${status}`)}</TextCM>
      </View>
    );
  };

  const renderStatusTicket = () => {
    switch (dataCard?.ticketStatus) {
      case Status.completed:
        return renderContent(
          Color.completed,
          Color.completed01,
          Status.completed,
        );
      case Status.draft:
        return renderContent(Color.draft, Color.draft01, Status.draft);
      case Status.voided:
        return renderContent(Color.voided, Color.voided01, Status.voided);
      case Status.rejected:
        return renderContent(Color.rejected, Color.rejected01, Status.rejected);
      case Status.processing:
        return renderContent(
          Color.processing,
          Color.processing01,
          Status.processing,
        );
      case Status.overdue:
        return renderContent(Color.rejected, Color.rejected01, Status.overdue);
    }
  };

  return (
    <View style={styles.ctnMain}>
      {!isView && (
        <CheckboxCM checked={checked} onChange={() => handleSelect(!checked)} />
      )}
      <SafeAreaView edges={['right']} style={{flex: 1}}>
        <View
          style={[styles.ctnCard, isView && {marginHorizontal: SizeDP(16)}]}>
          <View style={[styles.ctnHeader]}>
            <View style={styles.ctnRow}>
              <View style={styles.ctnImage}>
                <Image
                  width={SizeDP(40)}
                  height={SizeDP(40)}
                  style={{borderRadius: SizeDP(20)}}
                  source={{
                    uri: account?.imageUrl
                      ? account?.imageUrl
                      : 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
                  }}
                />
              </View>
              <View style={{rowGap: SizeDP(6)}}>
                <TextCM style={styles.name}>{dataCard?.createdBy}</TextCM>
                <TextCM style={styles.group}>
                  {t('CM.serviceName')}: {dataCard?.serviceName}
                </TextCM>
              </View>
            </View>
            {renderPriority()}
          </View>
          <Divider />
          <View style={[styles.ctnTitle]}>
            <View style={styles.ctnRow}>
              <TextCM style={styles.name}>{t('CM.titleCard')}</TextCM>
              <TextCM numberOfLines={1} style={styles.handleNewGroup}>
                {dataCard?.title}
              </TextCM>
            </View>
            <View style={styles.ctnRow}>
              <TextCM style={styles.name}>{t('CM.createDateCard')}</TextCM>
              <TextCM numberOfLines={1} style={styles.handleNewGroup}>
                {DateUtils.convertDateToDDMMYYYY_H_M(dataCard?.createdDate)}
              </TextCM>
            </View>
            <View style={styles.ctnRow}>
              <TextCM style={styles.name}>{t('CM.statusCard')}</TextCM>
              {renderStatusTicket()}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CardCM;

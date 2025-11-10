import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleProp,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {isEmpty} from 'lodash';
import ButtonCM from '../Button';
import TextCM from '../Text';
import {
  IconCancel,
  IconInfo,
  IconNotiModal,
  IconCheckmarkCircle,
} from '../../../assets/images';
import {IScreen, SizeDP, TYPE_SCREEN} from '../../../constants/Size';
import {Color} from '../../../constants';

type Props = {
  onClose: () => void;
  onConfirm?: () => void;
  isVisible: boolean;
  labelCancel?: string;
  labelConfirm?: string;
  labelClose?: string;
  title: string;
  content?: string;
  renderContent?: () => React.ReactNode;
  type?: 'delete' | 'success' | 'error' | 'info' | 'cancel' | 'noti' | 'rate' ;
  styleBtnLeft?: StyleProp<ViewStyle>;
  styleBtnRight?: StyleProp<ViewStyle>;
};

const ModalConfirmCM = ({
  onClose,
  onConfirm,
  isVisible,
  title,
  content,
  labelCancel,
  labelConfirm,
  renderContent,
  type = 'delete',
  styleBtnLeft,
  styleBtnRight,
}: Props) => {
  const {t} = useTranslation();
  const {width, height} = useWindowDimensions();
  const [heightOfKeyboard, setHeightOfKeyboard] = useState(0);

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', e => {
      setHeightOfKeyboard(e.endCoordinates.height);
    });
    const sub1 = Keyboard.addListener('keyboardDidHide', e => {
      setHeightOfKeyboard(0);
    });

    return () => {
      sub.remove();
      sub1.remove();
    };
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'cancel':
        return <IconCancel width={SizeDP(56)} height={SizeDP(56)} />;
      case 'delete':
        return <IconInfo width={SizeDP(56)} height={SizeDP(56)} />;
      case 'success':
        return <IconInfo width={SizeDP(56)} height={SizeDP(56)} />;
      case 'error':
        return <IconInfo width={SizeDP(56)} height={SizeDP(56)} />;
      case 'info':
        return <IconInfo width={SizeDP(56)} height={SizeDP(56)} />;
      case 'noti':
        return <IconNotiModal width={SizeDP(56)} height={SizeDP(56)} />;
      case 'rate':
        return (
          <IconCheckmarkCircle
            fill={Color.green}
            width={SizeDP(56)}
            height={SizeDP(56)}
          />
        );
    }
  };

  const onPressConfirm = () => {
    onConfirm?.();
  };

  const renderFooter = () => {
    return (
      <View style={styles.viewBtn}>
        <ButtonCM
          label={labelCancel}
          onPress={onClose}
          style={[styles.btn, styleBtnLeft, styles.btnLeft]}
          styleLabel={styles.labelStyleLeft}
        />
        <ButtonCM
          label={labelConfirm}
          onPress={onPressConfirm}
          style={[styles.btn, styleBtnRight]}
        />
      </View>
    );
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.ctnContainer}>
          <View
            style={[
              styles.container,
              width >= TYPE_SCREEN.mobile && {
                width: (width / 3) * 1.5,
              },
            ]}>
            <View style={styles.body}>
              <View style={styles.viewIconDelete}>{getIcon()}</View>
              {!isEmpty(title) && (
                <TextCM style={styles.txtTitle}>{title}</TextCM>
              )}
              {!isEmpty(content) && (
                <TextCM style={styles.txtContent}>{content}</TextCM>
              )}
              {renderContent?.()}
            </View>
            {renderFooter()}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalConfirmCM;

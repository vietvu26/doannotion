import {isEmpty} from 'lodash';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styles from './styles';
import {SizeDP} from '../../../constants/Size';
import TextCM from '../Text';
import {Icon} from '@ui-kitten/components';

type Props = {
  onClose: () => void;
  isVisible: boolean;
  iconClose?: React.ReactElement;
  renderContent?: React.ReactElement;
  title: string;
  labelRight?: string;
  onPresLabelRight?: () => void;
  withKeyboardAvoidingView?: boolean;
};

const BottomSheetCM = ({
  onClose,
  isVisible,
  iconClose,
  renderContent,
  title,
  labelRight,
  onPresLabelRight,
  withKeyboardAvoidingView,
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="fade" transparent visible={isVisible}>
      {!withKeyboardAvoidingView ? (
        <View style={styles.ctnContainer}>
          <View style={styles.ctnTop} onTouchEnd={onClose} />
          <View style={[styles.ctnContent, {paddingBottom: insets.bottom}]}>
            <View style={styles.viewHeader}>
              <TouchableOpacity hitSlop={10} onPress={onClose}>
                {isEmpty(iconClose) ? (
                  <Icon
                    name="arrow-back"
                    width={SizeDP(24)}
                    height={SizeDP(24)}
                    fill="#000"
                  />
                ) : (
                  iconClose
                )}
              </TouchableOpacity>
              <TextCM style={styles.txtTitle}>{title}</TextCM>
              {isEmpty(labelRight) ? (
                <View />
              ) : (
                <TouchableOpacity onPress={onPresLabelRight}>
                  <TextCM style={styles.txtRight}>{labelRight}</TextCM>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.viewBody}>{renderContent}</View>
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={'padding'}
          keyboardVerticalOffset={-insets.bottom}>
          <View style={styles.ctnContainer}>
            <View style={styles.ctnTop} onTouchEnd={onClose} />
            <View style={[styles.ctnContent, {paddingBottom: insets.bottom}]}>
              <View style={styles.viewHeader}>
                <TouchableOpacity hitSlop={10} onPress={onClose}>
                  {isEmpty(iconClose) ? (
                    <Icon name="chevron-left" width={24} height={24} />
                  ) : (
                    iconClose
                  )}
                </TouchableOpacity>
                <TextCM style={styles.txtTitle}>{title}</TextCM>
                {isEmpty(labelRight) ? (
                  <View />
                ) : (
                  <TouchableOpacity onPress={onPresLabelRight}>
                    <TextCM style={styles.txtRight}>{labelRight}</TextCM>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.viewBody}>{renderContent}</View>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </Modal>
  );
};

export default BottomSheetCM;

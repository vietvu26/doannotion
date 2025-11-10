import {Divider, Icon, Menu, MenuItem} from '@ui-kitten/components';
import {Animated, Pressable, View} from 'react-native';
import TextCM from '../Text';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import ModalFullScreen from '../ModalFullScreen';
import HeaderCM from './HeaderCM';
import styles from './styleHeaderScroll';
import BottomSheetCM from '../BottomSheet';
type Props = {
  imageOpacity?: Animated.AnimatedInterpolation<number>;
  imageTranslateY?: Animated.AnimatedInterpolation<number>;
   selectColor?: string;
  onSelectColor?: (color: string) => void;
};
const ImageCover = ({imageOpacity, imageTranslateY,selectColor,onSelectColor}: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const {t} = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const COLORS = [
    '#fff',
    '#33FF57',
    '#3357FF',
    '#F39C12',
    '#8E44AD',
    '#2ECC71',
    '#E74C3C',
    '#1ABC9C',
    '#34495E',
    '#FFC300',
  ];
  const renderAction = () => {
    return (
      <Menu>
        <MenuItem
          title={props => (
            <TextCM {...props}>{t('task.choose-from-library')}</TextCM>
          )}
          onPress={() => {}}
        />
        <MenuItem
          title={props => <TextCM {...props}>{t('task.take-photo')}</TextCM>}
          onPress={() => {}}
        />
      </Menu>
    );
  };
  return (
    <View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          opacity: imageOpacity,
          transform: [{translateY: imageTranslateY ?? 0}],
          backgroundColor: 'black',
          padding: 8,
          borderRadius: 20,
        }}>
        <Pressable
          onPress={() => setOpenModal(true)}
          style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <Icon name="image-outline" height={20} width={20} fill="white" />
          <TextCM style={{color: 'white'}}>{t('task.cover-photo')}</TextCM>
        </Pressable>
      </Animated.View>
      <ModalFullScreen
        isVisible={openModal}
        children={
          <View>
            <HeaderCM
              style={{
                backgroundColor: '#fff',
              }}
              contentStyle={{
                backgroundColor: '#fff',
              }}
              titleStyle={{
                color: '#000810',
              }}
              fillIconBackLeft="#000810"
              onPressIconLeft={() => {
                setOpenModal(false);
              }}
              title={t('task.background')}
              alignment="start"
            />
            <Divider />
            <View style={styles.colorbgctn}>
              <TextCM style={{marginBottom: 8}}>{t('CM.color')}</TextCM>

              <View style={styles.colorGrid}>
                {COLORS.map((color, index) => {
                  const isSelected = selectColor === color;

                  return (
                    <Pressable
                      key={index}
                      onPress={() => onSelectColor?.(color)}
                      style={[
                        styles.colorBox,
                        {backgroundColor: color},
                        isSelected && styles.selectedColorBox,
                      ]}
                    />
                  );
                })}
              </View>
            </View>

            <View style={styles.colorbgctn}>
              <TextCM>{t('task.attachments')}</TextCM>
              <View style={{marginTop: 20}}>
                <Pressable
                  style={styles.imgBox}
                  onPress={() => setIsVisible(true)}>
                  <Icon name="plus-outline" height={34} width={34} />
                </Pressable>
              </View>
            </View>
          </View>
        }
      />
      <BottomSheetCM
        title={t('task.choose-file')}
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
        renderContent={renderAction()}
      />
    </View>
  );
};

export default ImageCover;

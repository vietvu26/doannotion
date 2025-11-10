import {forwardRef, useRef, useState} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HEADER_MAX_HEIGHT, HEADER_SCROLL_DISTANCE} from './styleHeaderScroll';
import styles from './styleHeaderScroll';
import {Divider, Icon, Menu, MenuItem} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import TextCM from '../Text';
import ModalFullScreen from '../ModalFullScreen';
import HeaderCM from './HeaderCM';
import BottomSheetCM from '../BottomSheet';
import {useTranslation} from 'react-i18next';
import ImageCover from './ImageCover';

type Props = {
  title?: string;
  renderContent?: any;
  srcImage?: any;
  handleBackPress?: () => void;
};

const HeaderScrollView = forwardRef(
  (
    {title = 'quangnh39', renderContent, srcImage, handleBackPress}: Props,
    ref,
  ) => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const scrollY = useRef(new Animated.Value(0)).current; // our animated value
    const [selectColor, setSelectColor] = useState<string | undefined>();

    // our header y-axis animated from 0 to HEADER_SCROLL_DISTANCE,
    // we move our element for -HEADER_SCROLL_DISTANCE at the same time.
    const headerTranslateY = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    // our opacity animated from 0 to 1 and our opacity will be 0
    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslateY = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    // change header title size from 1 to 0.9
    const titleScale = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    });
    // change header title y-axis
    const titleTranslateY = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -8],
      extrapolate: 'clamp',
    });

    const handleBack = () => {
      if (handleBackPress) {
        handleBackPress();
      } else {
        navigation.goBack();
      }
    };
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1, backgroundColor: '#eff3fb'}}>
        <SafeAreaView edges={['top']} style={styles.saveArea}>
          <Animated.ScrollView
            ref={ref as any}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: HEADER_MAX_HEIGHT,
            }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true},
            )}>
            {renderContent}
          </Animated.ScrollView>

          
          <Animated.View
            style={[
              styles.header,
              {transform: [{translateY: headerTranslateY}]},
            ]}>
            <View
              style={{
                height: HEADER_MAX_HEIGHT,
                overflow: 'hidden',
              }}>
              {selectColor ? (
                <Animated.View
                  style={[
                    styles.headerBackground,
                    {
                      backgroundColor: selectColor,
                      opacity: imageOpacity,
                      transform: [{translateY: imageTranslateY}],
                    },
                  ]}
                />
              ) : (
                <Animated.Image
                  style={[
                    styles.headerBackground,
                    {
                      opacity: imageOpacity,
                      transform: [{translateY: imageTranslateY}],
                    },
                  ]}
                  source={
                    srcImage || {
                      uri: 'https://media.daily.dev/image/upload/f_auto,q_auto/v1/posts/e7e602321e6ead7d05920979a037fea1?_a=AQAEuj9',
                    }
                  }
                />
              )}
            </View>
            <ImageCover
              imageOpacity={imageOpacity}
              imageTranslateY={imageTranslateY}
              selectColor={selectColor}
              onSelectColor={setSelectColor}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.topBar,
              {
                transform: [{scale: titleScale}, {translateY: titleTranslateY}],
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
              }}>
              <Pressable
                onPress={handleBack}
                style={{
                  left: 0,
                  zIndex: 1,
                  position: 'absolute',
                }}>
                <Icon name="close" width={24} height={24} fill={'#fff'} />
              </Pressable>
              <Animated.Text
                numberOfLines={1}
                style={[styles.title, {opacity: opacity}]}>
                {title}
              </Animated.Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  },
);

export default HeaderScrollView;

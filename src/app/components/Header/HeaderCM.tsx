// Import external
import React from 'react';
import {StyleProp, TextProps, TextStyle, View, ViewStyle} from 'react-native';
import {isUndefined} from 'lodash';
import {
  Icon,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Color, Font} from '../../../constants';
import TextCM from '../Text';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  style?: StyleProp<ViewStyle>;
  title?: string;
  subtitle?: RenderProp<TextProps> | React.ReactText | undefined;
  onPressIconLeft?: () => void;
  viewIconLeft?: string;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  renderContentRight?: () => React.ReactElement;
  appearance?: 'default' | 'control';
  alignment?: 'start' | 'center';
  fillIconBackLeft?: string;
  showIconBackLeft?: boolean;
  renderContentLeftDynamic?: () => React.ReactElement;
  useLinearGradient?: boolean;
};

const HeaderCM = ({
  style,
  onPressIconLeft,
  viewIconLeft = 'arrow-back',
  title = 'quangnh39',
  contentStyle,
  renderContentRight,
  appearance = 'default',
  alignment = 'start',
  subtitle = '',
  fillIconBackLeft = '#ffffff',
  titleStyle,
  showIconBackLeft = true,
  renderContentLeftDynamic,
  useLinearGradient = true,
}: Props) => {
  const navigation = useNavigation();

  const handleOnpressIconLeft = () => {
    if (isUndefined(onPressIconLeft)) {
      navigation.goBack();
    } else {
      onPressIconLeft();
    }
  };

  const renderBackAction = () => {
    if (renderContentLeftDynamic) {
      return renderContentLeftDynamic?.();
    }
    if (showIconBackLeft) {
      return (
        <TopNavigationAction
          hitSlop={15}
          onPress={handleOnpressIconLeft}
          icon={<Icon name={viewIconLeft} fill={fillIconBackLeft} />}
        />
      );
    } else return <View />;
  };

  const renderBody = () => {
    return (
      <TopNavigation
        title={props => (
          <TextCM
            {...props}
            numberOfLines={1}
            style={[
              {
                color: '#fff',
                fontFamily: Font.InterSemiBold600,
                fontSize: 18,
              },
              titleStyle,
            ]}>
            {title}
          </TextCM>
        )}
        appearance={appearance}
        accessoryLeft={renderBackAction}
        accessoryRight={renderContentRight}
        alignment={alignment}
        subtitle={subtitle}
        style={[
          {
            backgroundColor: useLinearGradient
              ? 'transparent'
              : Color.BgPrimary,
            minHeight: 40,
          },
          contentStyle,
        ]}
      />
    );
  };

  return (
    <>
      {useLinearGradient ? (
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 0}}
          colors={['#e9519f', '#ca1e66']}>
          <SafeAreaView
            edges={['top']}
            style={[
              {
                backgroundColor: 'transparent',
              },
              style,
            ]}>
            {renderBody()}
          </SafeAreaView>
        </LinearGradient>
      ) : (
        <SafeAreaView
          edges={['top']}
          style={[
            {
              backgroundColor: Color.BgPrimary,
            },
            style,
          ]}>
          {renderBody()}
        </SafeAreaView>
      )}
    </>
  );
};

export default HeaderCM;

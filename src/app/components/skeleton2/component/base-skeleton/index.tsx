import React, {useRef, useEffect} from 'react';
import {Animated, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  width?: number;
  height?: number;
  style?: any;
};
const BaseSkeleton = ({width = 0, height = 0, style}: Props) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const skeletonColor = '#E1E9EE';
  const highlightColor = '#F2F8FC';

  return (
    <View
      style={[
        {
          width: width,
          height: height,
          backgroundColor: skeletonColor,
          borderRadius: 10,
          overflow: 'hidden',
        },
        style,
      ]}>
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          transform: [{translateX: translateX}],
        }}>
        <LinearGradient
          colors={[skeletonColor, highlightColor, skeletonColor]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{flex: 1}}
        />
      </Animated.View>
    </View>
  );
};

export default BaseSkeleton;

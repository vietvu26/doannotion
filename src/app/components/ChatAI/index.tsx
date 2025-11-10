import React, {useState} from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TextCM from '../Text';
import ModalFullScreen from '../ModalFullScreen';
import {ChatMessage} from './component/chat';

const SIZE = 30;

type Props = {
  ticketId: string;
  userTaskId: string;
};

export default function ChatAI({ticketId, userTaskId}: Props) {
  const offsetY = useSharedValue<number>(0);
  const height = useSharedValue<number>(0);
  const insets = useSafeAreaInsets();
  const {height: heightValue} = useWindowDimensions();
  const onLayout = (event: LayoutChangeEvent) => {
    height.value = event.nativeEvent.layout.height;
  };

  const [isVisableChat, setIsVisableChat] = useState(false);

  const pan = Gesture.Pan()
    .onChange(event => {
      offsetY.value += event.changeY;
    })
    .onFinalize(event => {
      offsetY.value = withDecay({
        velocity: event.velocityY,
        rubberBandEffect: true,
        deceleration: 0.1,
        velocityFactor: 0.5,
        rubberBandFactor: 1,
        reduceMotion: ReduceMotion.System,
        clamp: [
          -height.value / 2 + SIZE / 2 + insets.top,
          Math.min(height.value / 2, offsetY.value + insets.top),
        ],
      });
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: offsetY.value}],
  }));

  return (
    <>
      <GestureHandlerRootView
        style={[
          styles.container,
          {
            bottom: heightValue / 4,
          },
        ]}>
        <View onLayout={onLayout} style={styles.wrapper}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.box, animatedStyles]}>
              {/* <Icon name="github-outline" width={26} height={26} /> */}
              <Pressable onPress={() => setIsVisableChat(true)}>
                <TextCM
                  style={{
                    color: '#fff',
                    fontSize: 12,
                  }}>
                  AI Chat
                </TextCM>
              </Pressable>
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>

      <ModalFullScreen
        isVisible={isVisableChat}
        children={
          <ChatMessage
            ticketId={ticketId}
            userTaskId={userTaskId}
            onClose={() => setIsVisableChat(false)}
          />
        }
      />
    </>
  );
}

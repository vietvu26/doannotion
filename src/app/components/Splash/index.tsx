import React from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import {MD3Colors, Text} from 'react-native-paper';
import FontSize, {SizeDP} from '../../../constants/Size';
import FastImage from 'react-native-fast-image';

const SplashScreen = ({app}: {app: string}) => {
  return (
    <ImageBackground
      source={{
        uri: 'https://res.cloudinary.com/de0sqyhr9/image/upload/v1745662431/background_3x_z7dvqo.png',
      }}
      style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Text allowFontScaling={false} style={styles.text}>
          {app}
        </Text>
        <FastImage
          style={{width: '100%', height: '90%'}}
          source={{
            uri: 'https://res.cloudinary.com/de0sqyhr9/image/upload/v1745663546/logo_mmwu8t.gif',
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  text: {
    padding: SizeDP(16),
    fontSize: FontSize.FontBigger,
    color: MD3Colors.primary20,
    textAlign: 'center',
  },
  progress: {
    marginVertical: SizeDP(16),
    marginHorizontal: SizeDP(32),
  },
});

export default SplashScreen;

import {useWindowDimensions, View} from 'react-native';
import BaseSkeleton from '../base-skeleton';

const ImageSkelete = () => {
  const {width} = useWindowDimensions();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
      }}>
      <BaseSkeleton width={width - 32} height={200} />
    </View>
  );
};

export default ImageSkelete;

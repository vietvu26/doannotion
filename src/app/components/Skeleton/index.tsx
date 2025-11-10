import {View} from 'react-native';
import styles from './styles';

const Skeleton = () => (
  <View style={styles.skeletonItem}>
    <View
      style={{
        width: 40,
        height: 40,
        backgroundColor: '#E4E9F2',
        borderRadius: 8,
      }}></View>
    <View style={styles.skeletonContent}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonDescription} />
    </View>
  </View>
);

export default Skeleton;

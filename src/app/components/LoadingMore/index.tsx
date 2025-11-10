import {ActivityIndicator, View} from 'react-native';
import {Color} from '../../../constants';
import styles from './styles';

const LoadingMore = () => (
  <View style={styles.loadingMore}>
    <ActivityIndicator size="small" color={Color.BgPrimary} />
  </View>
);

export default LoadingMore;

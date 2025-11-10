import {View} from 'react-native';
import BaseSkeleton from '../base-skeleton';

const CommentSkeleton = () => {
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
      <BaseSkeleton width={60} height={60} style={{borderRadius: 30}} />
      <View
        style={{
          marginLeft: 16,
        }}>
        <BaseSkeleton width={250} height={20} style={{marginBottom: 6}} />
        <BaseSkeleton width={180} height={20} />
      </View>
    </View>
  );
};
export default CommentSkeleton;

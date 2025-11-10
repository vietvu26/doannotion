import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ImageSkelete from '../image-skeleton';
import CommentSkeleton from '../comment-skeleton';

const DefaultSkeleton = () => {
  return (
    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
      <ImageSkelete />
      <CommentSkeleton />
      <CommentSkeleton />
      <CommentSkeleton />
      <CommentSkeleton />
      <CommentSkeleton />
      <CommentSkeleton />
      <CommentSkeleton />
      <CommentSkeleton />
    </ScrollView>
  );
};

export default DefaultSkeleton;

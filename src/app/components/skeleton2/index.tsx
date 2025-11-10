import {ScrollView} from 'react-native';
import ImageSkelete from './component/image-skeleton';
import CommentSkeleton from './component/comment-skeleton';
import DefaultSkeleton from './component/default-skeleton';
type Props = {
  query?: string[];
};
const Skeleton = ({query}: Props) => {
  if (query?.length) {
    return (
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {query?.map((item, index) => {
          if (item === 'i') {
            return <ImageSkelete key={index} />;
          } else if (item === 'c') {
            return <CommentSkeleton key={index} />;
          }
          return <CommentSkeleton key={index} />;
        })}
      </ScrollView>
    );
  }
  return <DefaultSkeleton />;
};

export default Skeleton;

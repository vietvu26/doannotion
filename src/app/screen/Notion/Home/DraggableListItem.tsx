import { RenderItemParams } from 'react-native-draggable-flatlist';
import NotionFileItem from './NotionFileItem';
import { NotionItem } from './index';
type Props = RenderItemParams<NotionItem> & {
  onRefresh: () => void;
  refreshFlag: number
};

export default function DraggableListItem({ drag, isActive, item, onRefresh,refreshFlag }: Props) {
  return (
    <NotionFileItem
      drag={drag}
      isActive={isActive}
      notionFile={item}
      onRefresh={onRefresh}
      refreshFlag={refreshFlag}
    />
  );
}

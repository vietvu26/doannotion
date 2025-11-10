import {Pressable, View} from 'react-native';
import TextCM from '../../../Text';
import Markdown from 'react-native-markdown-display';
import {IAIResponseClass} from '../chat/helper';

type Props = {
  itemChat: IAIResponseClass;
  handleSendChat?: (question: string) => void;
};

const ChatBubble = ({itemChat, handleSendChat}: Props) => {
  return (
    <View
      style={{
        marginBottom: 10,
        backgroundColor: itemChat.userId === -1 ? '#e6eaf0' : '#6f2ced',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxWidth: '75%',
        alignSelf: itemChat.userId === -1 ? 'flex-start' : 'flex-end',
        justifyContent: 'center',
      }}>
      {itemChat.userId === -1 && <Markdown>{itemChat.message}</Markdown>}
      {itemChat.userId !== -1 && itemChat.userId !== -2 && (
        <TextCM style={[itemChat.userId !== -1 && {color: '#fff'}]}>
          {itemChat.message}
        </TextCM>
      )}
      {itemChat.userId === -2 && (
        <Pressable onPress={() => handleSendChat?.(itemChat.message)}>
          <TextCM style={{color: '#fff'}}>{itemChat.message}</TextCM>
        </Pressable>
      )}
    </View>
  );
};

export default ChatBubble;

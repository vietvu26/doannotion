import React, {useState, useCallback, useEffect, useRef} from 'react';
// import {GiftedChat} from 'react-native-gifted-chat';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderCM from '../../../Header/HeaderCM';
import {Divider, Spinner} from '@ui-kitten/components';
import InputCM from '../../../../screens/review-eid/components/InputCM';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {IconSend} from '../../../../../assets/images';
import {useAIStore} from '../storeMessage/store-chat';
import ChatBubble from '../chat-bubble';
import {IRequestBodyAI} from '../../helper';
import {IAIResponseClass, listQuestion} from './helper';
import {useAppSelector} from '../../../../../hooks/useRedux';
import styles from './styles';

type Props = {
  onClose?: () => void;
  userTaskId: string;
  ticketId: string;
};

const SIZE = 50;

export function ChatMessage({onClose, userTaskId, ticketId}: Props) {
  const [chat, setChat] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>('');
  const [listInitQuestion, setListInitQuestion] = useState<IAIResponseClass[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const {
    listAIResponse,
    addListAIResponse,
    setListAIResponse,
    getListAIResponse,
  } = useAIStore();
  const {dataAccount} = useAppSelector(state => state.account);
  const AIServices = useAIServices();
  const refFlatList = useRef<any>(null);

  useEffect(() => {
    getMessageInit(0);
  }, []);

  useEffect(() => {
    if (listAIResponse.length > 0 && refFlatList.current) {
      setTimeout(() => {
        refFlatList.current?.scrollToEnd({animated: true});
      }, 1000);
    }
  }, [listAIResponse, refFlatList.current]);

  const getMessageInit = async (page: number) => {
    try {
      const params = {
        ticketId: ticketId,
        userTaskId: userTaskId,
        page: page,
        size: SIZE,
      };
      const dataResp = await AIServices.getMessage(params);
      if (dataResp && dataResp?.data.length > 0) {
        if (page === 0) {
          setListAIResponse(dataResp.data);
        } else {
          setListAIResponse([...getListAIResponse(), ...dataResp.data]);
        }
        setConversationId(dataResp.data[0]?.conversationId);
        setTotalPage(Math.ceil(dataResp?.totalData / SIZE));
      } else {
        setListInitQuestion(
          listQuestion.map(
            question =>
              new IAIResponseClass({
                message: question,
                userId: -2,
                createdBy: dataAccount.email,
                orgIn: dataAccount.orgIn,
                custId: dataAccount.custId,
              }),
          ),
        );
      }
    } catch (error) {
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSendChat = async (question: string) => {
    if (!question.trim()) return;
    handleCreateQuestionChat(question);
    setIsLoading(true);
    try {
      const body: IRequestBodyAI = {
        question: question,
        conversationId: conversationId,
        ticketId: ticketId,
        userTaskId: userTaskId,
      };
      const dataResp = (await AIServices.sendMessage(body)) as IAIResponseClass;
      if (dataResp) {
        setConversationId(dataResp.conversationId);
        addListAIResponse(dataResp);
        refFlatList.current?.scrollToEnd({
          animated: true,
        });
      }
    } catch (error) {
    } finally {
      setChat('');
      Keyboard.dismiss();
      setIsLoading(false);
    }
  };

  const handleCreateQuestionChat = (question: string) => {
    const message = new IAIResponseClass({
      message: question,
      userId: dataAccount.id,
      createdBy: dataAccount.email,
      orgIn: dataAccount.orgIn,
      custId: dataAccount.custId,
    });
    addListAIResponse(message);
    Keyboard.dismiss();
  };

  const handleFocusInput = () => {
    setTimeout(() => {
      refFlatList.current?.scrollToIndex({
        index: getListAIResponse().length - 1,
        animated: true,
      });
    }, 100);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setPage(0);
    getMessageInit(0);
  };

  const handleLoadMore = () => {
    if (page < totalPage) {
      setPage(page + 1);
      getMessageInit(page + 1);
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={60}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <HeaderCM
            style={{
              backgroundColor: '#fff',
            }}
            contentStyle={{
              backgroundColor: '#fff',
            }}
            titleStyle={{
              color: '#000810',
            }}
            fillIconBackLeft="#000810"
            onPressIconLeft={() => {
              setListAIResponse([]);
              onClose?.();
            }}
            title="Trợ lý số Kyta Intelligent"
          />
          <Divider />

          <View style={styles.body}>
            {listAIResponse.length > 0 ? (
              <>
                <FlatList
                  ref={refFlatList}
                  showsVerticalScrollIndicator={false}
                  style={{flex: 1}}
                  data={listAIResponse}
                  keyExtractor={index => '' + index.id}
                  renderItem={({item}) => <ChatBubble itemChat={item} />}
                  onEndReachedThreshold={0.5}
                  onRefresh={onRefresh}
                  refreshing={isRefreshing}
                  onEndReached={handleLoadMore}
                />
                {isLoading && <Spinner />}
              </>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                style={{flex: 1}}
                data={listInitQuestion}
                keyExtractor={index => '' + index.id}
                renderItem={({item}) => (
                  <ChatBubble itemChat={item} handleSendChat={handleSendChat} />
                )}
              />
            )}
          </View>

          <View style={styles.footer}>
            <InputCM
              value={chat}
              onChangeText={setChat}
              placeholder="Đặt câu hỏi cho AI"
              onFocus={handleFocusInput}
            />
            <TouchableOpacity onPress={() => handleSendChat(chat)} hitSlop={15}>
              <IconSend width={24} height={24} />
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

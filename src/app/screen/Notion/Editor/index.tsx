import React, { useRef, useState } from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Icon } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import HeaderCM from '../../../components/Header/HeaderCM';
import UploadIcon from '../../../../assets/images/ic/upload.svg';
import InputRichText, { InputRichTextRef } from '../../../components/InputRichToolBar';
import { getApiUrl } from '../../../../config/api.config';
import { useAppSelector } from '../../../../hooks/useRedux';
import ModalFullScreen from '../../../components/ModalFullScreen';
import ShareSettings from './ShareSettings';
import TextCM from '../../../components/Text';
import Color from '../../../../constants/Color';

const EditorScreen = () => {
  const navigation = useNavigation<any>();
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const titleRef = useRef<TextInput>(null);
  const richTextRef = useRef<InputRichTextRef>(null);
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [notionId, setNotionId] = useState<number | null>(null);
  
  // Hàm để dismiss keyboard và blur editor
  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
    richTextRef.current?.blur();
    titleRef.current?.blur();
  };

  // Hàm lưu notion vào database
  const saveNotion = async () => {
    if (isSaving) return; // Tránh lưu nhiều lần
    
    // Kiểm tra nếu không có nội dung thì chỉ quay về không lưu
    const content = richTextRef.current?.getContent() || '';
    const titleValue = title.trim();
    
    // Nếu cả title và content đều rỗng, chỉ quay về
    if (titleValue === '' && content === '') {
      console.log('Editor trống, không lưu gì');
      setTitle('');
      richTextRef.current?.setContent('');
      navigation.goBack();
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (!currentUserId) {
        Alert.alert('Lỗi', 'Chưa đăng nhập. Vui lòng đăng nhập để lưu ghi chú.');
        setIsSaving(false);
        return;
      }

      const finalTitle = titleValue === '' ? 'Không có tiêu đề' : titleValue;
      
      const response = await axios.post(`${getApiUrl()}/api/add-notion`, {
        title: finalTitle,
        content: content,
        authorId: currentUserId,
        icon: 'file-text-outline',
      });

      console.log('Đã lưu ghi chú:', response.data);
      
      // Lưu notionId nếu có
      if (response.data && response.data.id) {
        setNotionId(response.data.id);
      }
      
      // Xóa thông tin trong editor sau khi lưu thành công
      setTitle('');
      richTextRef.current?.setContent('');
      
      // Quay lại màn hình trước sau khi lưu thành công
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi lưu ghi chú:', error);
      Alert.alert('Lỗi', 'Không thể lưu ghi chú. Vui lòng thử lại.');
      setIsSaving(false);
    }
  };

  // Hàm xử lý khi nhấn nút quay lại trên Header
  const handleGoBack = () => {
    saveNotion();
  };

  // Hàm lưu notion và mở share sheet
  const handleOpenShareSheet = async () => {
    if (!currentUserId) {
      Alert.alert('Lỗi', 'Chưa đăng nhập. Vui lòng đăng nhập để chia sẻ.');
      return;
    }

    const content = richTextRef.current?.getContent() || '';
    const titleValue = title.trim();
    const finalTitle = titleValue === '' ? 'Không có tiêu đề' : titleValue;

    // Nếu đã có notionId, mở share sheet luôn
    if (notionId) {
      setShowShareSheet(true);
      return;
    }

    // Nếu chưa có notionId, lưu notion trước
    try {
      setIsSaving(true);
      const response = await axios.post(`${getApiUrl()}/api/add-notion`, {
        title: finalTitle,
        content: content,
        authorId: currentUserId,
        icon: 'file-text-outline',
      });

      if (response.data && response.data.id) {
        setNotionId(response.data.id);
        setShowShareSheet(true);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu ghi chú. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi lưu ghi chú:', error);
      Alert.alert('Lỗi', 'Không thể lưu ghi chú. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
        <View>
          <HeaderCM
            title="New notion"
            onPressIconLeft={handleGoBack}
            renderContentRight={() => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  marginRight: 10,
                }}
              >
                <TouchableOpacity onPress={handleOpenShareSheet} disabled={isSaving}>
                  <UploadIcon width={24} height={24} fill="#FFFFFF" />
                </TouchableOpacity>
                <Icon
                  name="more-horizontal-outline"
                  width={24}
                  height={24}
                  fill="white"
                />
              </View>
            )}
          />
        </View>
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <ScrollView 
            style={{ flex: 1, backgroundColor: '#fff' }}
            contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, padding: 24, backgroundColor: '#fff' }}>
              {/* Title input */}
              <TextInput
                ref={titleRef}
                placeholder="New page"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                style={{ 
                  fontSize: 24, 
                  marginBottom: 12,
                  color: '#000',
                }}
              />

              <InputRichText 
                ref={richTextRef}
                containerStyle={{ flex: 1 }}
                editorStyle={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Share Settings Full Screen Modal */}
      <ModalFullScreen
        isVisible={showShareSheet}
        animationType="slide"
      >
        <View style={{ flex: 1, backgroundColor: Color.White }}>
          {/* Custom Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: Color.Background,
              position: 'relative',
            }}
          >
            <View style={{ width: 60 }} />
            <TextCM
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: Color.colorText,
                flex: 1,
                textAlign: 'center',
              }}
            >
              Cài đặt chia sẻ
            </TextCM>
            <TouchableOpacity 
              onPress={() => setShowShareSheet(false)}
              style={{ width: 80, alignItems: 'flex-end' }}
            >
              <TextCM
                style={{
                  fontSize: 16,
                  color: Color.add,
                  fontWeight: '600',
                }}
              >
                Hoàn tất
              </TextCM>
            </TouchableOpacity>
          </View>
          <ShareSettings 
            onClose={() => setShowShareSheet(false)}
            notionId={notionId}
            notionTitle={title.trim() || 'Không có tiêu đề'}
          />
        </View>
      </ModalFullScreen>
    </View>
  );
};

export default EditorScreen;

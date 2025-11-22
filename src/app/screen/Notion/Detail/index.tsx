import React, { useRef, useState, useEffect } from 'react';
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
  Image,
  AppState,
  Dimensions,
} from 'react-native';
import { Icon } from '@ui-kitten/components';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import HeaderCM from '../../../components/Header/HeaderCM';
import UploadIcon from '../../../../assets/images/ic/upload.svg';
import InputRichText, { InputRichTextRef } from '../../../components/InputRichToolBar';
import { NotionItem } from '../Home';
import { getApiUrl } from '../../../../config/api.config';
import ModalFullScreen from '../../../components/ModalFullScreen';
import ShareSettings from '../Editor/ShareSettings';
import TextCM from '../../../components/Text';
import Color from '../../../../constants/Color';
import { useAppSelector } from '../../../../hooks/useRedux';
import BottomSheetCM from '../../../components/BottomSheet';
import { StyleSheet } from 'react-native';
import ModalConfirmCM from '../../../components/ModalConfirm';
import { ChoosePhoto } from '../../../components/ImageCropPicker';
import Toast from 'react-native-toast-message';

const DetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const notionItem: NotionItem = route.params?.notionItem;
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const userAvatar = useAppSelector((state) => state.common.userAvatar);
  const userName = useAppSelector((state) => state.common.userName);
  const userEmail = useAppSelector((state) => state.common.userEmail);

  const titleRef = useRef<TextInput>(null);
  const richTextRef = useRef<InputRichTextRef>(null);
  const [title, setTitle] = useState(notionItem?.title || '');
  const [isSaving, setIsSaving] = useState(false);
  const [notionData, setNotionData] = useState<NotionItem | null>(notionItem || null);
  const [loadingNotion, setLoadingNotion] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Mặc định cho phép edit
  const [permission, setPermission] = useState<'full' | 'comment' | 'view' | null>('full');
  const [loadingPermission, setLoadingPermission] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);
  const [showErrorDelete, setShowErrorDelete] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef<TextInput>(null);
  const [comments, setComments] = useState<Array<{
    id: number;
    userId: number;
    userName: string;
    userAvatar: string | null;
    content: string;
    createdAt: string;
    attachments?: Array<{
      id: number;
      fileName: string;
      fileUrl: string;
      fileType: string;
      fileSize?: number;
    }>;
  }>>([]);
  const [showCommentOptions, setShowCommentOptions] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [showConfirmDeleteComment, setShowConfirmDeleteComment] = useState(false);
  const [commentAttachments, setCommentAttachments] = useState<Array<{
    uri: string;
    type: string;
    name: string;
    size?: number;
  }>>([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  
  // Fetch permission khi mở notion
  useEffect(() => {
    const fetchPermission = async () => {
      if (!notionItem?.id || !currentUserId) {
        setLoadingPermission(false);
        return;
      }

      try {
        const response = await axios.get(
          `${getApiUrl()}/api/notion-permission/${notionItem.id}/${currentUserId}`
        );
        
        if (response.data && response.data.success) {
          setPermission(response.data.permission);
          setCanEdit(response.data.canEdit || false);
        }
      } catch (error) {
        console.error('Error fetching permission:', error);
        // Mặc định cho phép edit nếu lỗi (để tương thích với notion cũ)
        setCanEdit(true);
        setPermission('full');
      } finally {
        setLoadingPermission(false);
      }
    };

    fetchPermission();
  }, [notionItem?.id, currentUserId]);

  // Fetch comments khi mở notion và khi màn hình được focus lại
  const fetchComments = React.useCallback(async () => {
    if (!notionItem?.id) {
      return;
    }

    try {
      const response = await axios.get(
        `${getApiUrl()}/api/notion-comments/${notionItem.id}`
      );
      
      if (response.data && response.data.success) {
        const newComments = response.data.comments || [];
        
        // So sánh để chỉ update nếu có thay đổi (tránh re-render không cần thiết)
        setComments(prev => {
          // Kiểm tra xem có thay đổi không bằng cách so sánh số lượng và ID
          if (prev.length !== newComments.length) {
            return newComments;
          }
          
          // So sánh từng comment ID
          const prevIds = prev.map((c: { id: number }) => c.id).sort().join(',');
          const newIds = newComments.map((c: { id: number }) => c.id).sort().join(',');
          
          if (prevIds !== newIds) {
            return newComments;
          }
          
          // Không có thay đổi, giữ nguyên state
          return prev;
        });
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Nếu lỗi, không cập nhật state để tránh mất dữ liệu hiện tại
    }
  }, [notionItem?.id]);

  // Load comments khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      fetchComments();
    }, [fetchComments])
  );

  // Polling để cập nhật comments theo thời gian thực
  useEffect(() => {
    if (!notionItem?.id) {
      return;
    }

    // Poll mỗi 3 giây để cập nhật comments mới
    const pollInterval = setInterval(() => {
      // Chỉ poll khi app đang active (foreground)
      if (AppState.currentState === 'active') {
        fetchComments();
      }
    }, 3000); // 3 giây

    // Cleanup interval khi component unmount
    return () => {
      clearInterval(pollInterval);
    };
  }, [notionItem?.id, fetchComments]);
  
  // Fetch notion data từ database khi vào màn hình
  const fetchNotionData = React.useCallback(async () => {
    if (!notionItem?.id) {
      return;
    }

    try {
      setLoadingNotion(true);
      const response = await axios.get(
        `${getApiUrl()}/api/notion-by-id/${notionItem.id}`
      );
      
      if (response.data && response.data.success && response.data.data) {
        const fetchedNotion = response.data.data;
        setNotionData(fetchedNotion);
        // Cập nhật title và content từ database
        setTitle(fetchedNotion.title || '');
        
        // Đợi một chút để đảm bảo richTextRef đã sẵn sàng
        setTimeout(() => {
          if (fetchedNotion.content && richTextRef.current) {
            richTextRef.current.setContent(fetchedNotion.content);
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching notion data:', error);
      // Nếu lỗi, vẫn dùng dữ liệu từ route params
    } finally {
      setLoadingNotion(false);
    }
  }, [notionItem?.id]);

  // Fetch lại dữ liệu khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      fetchNotionData();
    }, [fetchNotionData])
  );

  // Load nội dung ban đầu vào editor (chỉ lần đầu khi mount)
  useEffect(() => {
    if (notionItem?.content && !notionData) {
      // Đợi một chút để đảm bảo richTextRef đã sẵn sàng
      setTimeout(() => {
        if (richTextRef.current) {
          richTextRef.current.setContent(notionItem.content);
        }
      }, 100);
    }
  }, []);

  // Hàm để dismiss keyboard và blur editor
  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
    richTextRef.current?.blur();
    titleRef.current?.blur();
  };

  // Hàm cập nhật notion vào database
  const updateNotion = async () => {
    if (isSaving) return; // Tránh lưu nhiều lần
    
    // Kiểm tra quyền edit
    if (!canEdit) {
      // Nếu không có quyền edit, chỉ quay về không lưu
      navigation.goBack();
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Lấy content từ RichEditor (luôn là Promise)
      const content = await (richTextRef.current?.getContent() || Promise.resolve(''));
      const finalContent = content || '';
      
      const titleValue = title.trim();
      
      // Nếu cả title và content đều rỗng, chỉ quay về
      if (titleValue === '' && finalContent === '') {
        console.log('Editor trống, không lưu gì');
        setIsSaving(false);
        navigation.goBack();
        return;
      }
      
      const finalTitle = titleValue === '' ? 'Không có tiêu đề' : titleValue;
      
      const response = await axios.put(
        `${getApiUrl()}/api/update-notion/${notionItem.id}`,
        {
          title: finalTitle,
          content: finalContent,
          icon: notionItem.icon,
          userId: currentUserId, // Gửi userId để kiểm tra quyền
        }
      );

      console.log('Đã cập nhật ghi chú:', response.data);
      
      // Quay lại màn hình trước sau khi cập nhật thành công
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi cập nhật ghi chú:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật ghi chú. Vui lòng thử lại.');
      setIsSaving(false);
    }
  };

  // Hàm xử lý khi nhấn nút quay lại trên Header
  const handleGoBack = () => {
    if (canEdit) {
      updateNotion();
    } else {
      // Nếu không có quyền edit, chỉ quay về
      navigation.goBack();
    }
  };

  // Hàm xử lý chuyển vào thùng rác
  const handleMoveToTrash = () => {
    setShowBottomSheet(false);
    setShowConfirmDelete(true);
  };

  // Hàm xác nhận xóa notion
  const handleConfirmDelete = async () => {
    setShowConfirmDelete(false);
    try {
      const response = await axios.delete(
        `${getApiUrl()}/api/delete-notion/${notionItem.id}`
      );
      
      if (response.status === 200) {
        setShowSuccessDelete(true);
      }
    } catch (error) {
      console.error('Lỗi khi xóa notion:', error);
      setShowErrorDelete(true);
    }
  };

  // Hàm xử lý sau khi xóa thành công
  const handleSuccessDelete = () => {
    setShowSuccessDelete(false);
    navigation.goBack();
  };

  // Hàm xử lý thêm bình luận
  const handleAddComment = () => {
    setShowBottomSheet(false);
    setShowCommentInput(true);
    // Focus vào input sau một chút để đảm bảo UI đã render
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
  };

  // Hàm xử lý chọn ảnh
  const handlePickImage = async () => {
    setShowAttachmentOptions(false);
    try {
      const image: any = await ChoosePhoto({
        cropping: false,
        compressImageQuality: 0.8,
      });
      
      if (image && image.path) {
        setCommentAttachments(prev => [...prev, {
          uri: image.path,
          type: image.mime || 'image/jpeg',
          name: image.path.split('/').pop() || 'image.jpg',
          size: image.size,
        }]);
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled image picker') {
        console.error('Lỗi chọn ảnh:', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể chọn ảnh. Vui lòng thử lại.',
        });
      }
    }
  };


  // Hàm xóa attachment
  const handleRemoveAttachment = (index: number) => {
    setCommentAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Hàm upload file lên server
  const uploadAttachment = async (file: { uri: string; type: string; name: string }) => {
    const formData = new FormData();
    
    // Tạo file object cho FormData (React Native format)
    const fileData: any = {
      uri: file.uri,
      type: file.type,
      name: file.name,
    };
    
    formData.append('file', fileData);
    
    try {
      const response = await axios.post(
        `${getApiUrl()}/api/upload-comment-attachment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data && response.data.success) {
        return response.data.fileUrl;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Lỗi upload file:', error);
      throw error;
    }
  };

  // Hàm gửi bình luận
  const handleSendComment = async () => {
    if ((!commentText.trim() && commentAttachments.length === 0) || !notionItem?.id || !currentUserId) {
      return;
    }

    try {
      setUploadingAttachment(true);
      
      // Upload tất cả attachments trước
      const uploadedAttachments = [];
      for (const attachment of commentAttachments) {
        try {
          const fileUrl = await uploadAttachment(attachment);
          uploadedAttachments.push({
            fileName: attachment.name,
            fileUrl: fileUrl,
            fileType: attachment.type,
            fileSize: attachment.size,
          });
        } catch (error) {
          console.error('Lỗi upload attachment:', error);
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: `Không thể upload file ${attachment.name}`,
          });
        }
      }

      // Gọi API để lưu comment
      const response = await axios.post(
        `${getApiUrl()}/api/notion-comments`,
        {
          notionId: notionItem.id,
          userId: currentUserId,
          content: commentText.trim() || '',
          attachments: uploadedAttachments,
        }
      );

      if (response.data && response.data.success && response.data.comment) {
        // Thêm comment mới vào đầu danh sách
        setComments(prev => [response.data.comment, ...prev]);
        
        // Xóa text input và attachments
        setCommentText('');
        setCommentAttachments([]);
        
        console.log('Đã gửi bình luận thành công:', response.data.comment);
      } else {
        console.error('Lỗi: API không trả về comment');
      }
    } catch (error) {
      console.error('Lỗi gửi bình luận:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể gửi bình luận. Vui lòng thử lại.',
      });
    } finally {
      setUploadingAttachment(false);
    }
  };

  // Format thời gian comment
  const formatCommentTime = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days === 1) {
        return '1 ngày trước';
      } else {
        return `${days} ngày trước`;
      }
    }
  };

  // Lấy chữ cái đầu của user
  const getFirstLetter = () => {
    const displayName = userName || userEmail?.split('@')[0] || 'User';
    return displayName.charAt(0).toUpperCase();
  };

  // Hàm xử lý khi nhấn nút more options của comment
  const handleCommentMoreOptions = (commentId: number) => {
    setSelectedCommentId(commentId);
    setShowCommentOptions(true);
  };

  // Hàm xử lý xóa comment
  const handleDeleteComment = () => {
    setShowCommentOptions(false);
    setShowConfirmDeleteComment(true);
  };

  // Hàm xác nhận xóa comment
  const handleConfirmDeleteComment = async () => {
    if (!selectedCommentId || !currentUserId) {
      setShowConfirmDeleteComment(false);
      return;
    }

    try {
      const response = await axios.delete(
        `${getApiUrl()}/api/notion-comments/${selectedCommentId}`,
        {
          data: { userId: currentUserId }
        }
      );

      if (response.data && response.data.success) {
        // Xóa comment khỏi danh sách
        setComments(prev => prev.filter(comment => comment.id !== selectedCommentId));
        setSelectedCommentId(null);
        setShowConfirmDeleteComment(false);
        console.log('Đã xóa comment thành công');
      } else {
        console.error('Lỗi: API không trả về success');
        Alert.alert('Lỗi', 'Không thể xóa comment. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Lỗi xóa comment:', error);
      const errorMessage = error.response?.data?.error || 'Không thể xóa comment. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setShowConfirmDeleteComment(false);
      setSelectedCommentId(null);
    }
  };

  // Render nội dung bottom sheet
  const renderBottomSheetContent = () => {
    return (
      <View style={detailStyles.bottomSheetContent}>
        {/* Option: Chuyển vào thùng rác - chỉ hiển thị nếu có quyền edit */}
        {canEdit && (
          <>
            <TouchableOpacity
              style={detailStyles.bottomSheetOption}
              onPress={handleMoveToTrash}
              activeOpacity={0.7}
            >
              <Icon
                name="trash-2-outline"
                width={24}
                height={24}
                fill="#ff4444"
              />
              <TextCM style={[detailStyles.bottomSheetOptionText, { color: '#ff4444' }]}>
                Chuyển vào thùng rác
              </TextCM>
            </TouchableOpacity>
            <View style={detailStyles.separator} />
          </>
        )}
        
        {/* Option: Thêm bình luận */}
        <TouchableOpacity
          style={detailStyles.bottomSheetOption}
          onPress={handleAddComment}
          activeOpacity={0.7}
        >
          <Icon
            name="message-circle-outline"
            width={24}
            height={24}
            fill="#666"
          />
          <TextCM style={detailStyles.bottomSheetOptionText}>
            Thêm bình luận
          </TextCM>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
        <View>
          <HeaderCM
            title="Chi tiết Notion"
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
                {/* Chỉ hiển thị nút chia sẻ nếu có quyền edit (owner) */}
                {canEdit && (
                  <TouchableOpacity onPress={() => setShowShareSheet(true)}>
                    <UploadIcon width={24} height={24} fill="#FFFFFF" />
                  </TouchableOpacity>
                )}
                {!canEdit && (
                  <View style={{ paddingHorizontal: 8 }}>
                    <TextCM style={{ color: '#fff', fontSize: 12 }}>
                      {permission === 'view' ? 'Chỉ xem' : permission === 'comment' ? 'Có thể bình luận' : ''}
                    </TextCM>
                  </View>
                )}
                <TouchableOpacity onPress={() => setShowBottomSheet(true)}>
                  <Icon
                    name="more-horizontal-outline"
                    width={24}
                    height={24}
                    fill="white"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <ScrollView 
            style={{ flex: 1, backgroundColor: '#fff' }}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ padding: 24, backgroundColor: '#fff' }}>
              {/* Title input */}
              <TextInput
                ref={titleRef}
                placeholder="New page"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                editable={canEdit}
                style={{ 
                  fontSize: 24, 
                  marginBottom: 12,
                  color: '#000',
                }}
              />

              {/* Comments Section - Hiển thị ngay dưới title */}
              <View style={detailStyles.commentsSection}>
                {/* Comments List - Luôn hiển thị nếu có comments */}
                {comments.length > 0 && (
                  <View style={detailStyles.commentsList}>
                    {comments.map((comment) => (
                      <View key={comment.id} style={detailStyles.commentItem}>
                        <View style={detailStyles.commentItemLeft}>
                          {/* Avatar */}
                          <View style={detailStyles.commentAvatarContainer}>
                            {comment.userAvatar ? (
                              <Image
                                source={{ uri: comment.userAvatar }}
                                style={detailStyles.commentAvatar}
                              />
                            ) : (
                              <View style={detailStyles.commentAvatarPlaceholder}>
                                <TextCM style={detailStyles.commentAvatarText}>
                                  {comment.userName.charAt(0).toUpperCase()}
                                </TextCM>
                              </View>
                            )}
                          </View>

                          {/* Comment Content */}
                          <View style={detailStyles.commentContent}>
                            <View style={detailStyles.commentHeader}>
                              <TextCM style={detailStyles.commentUserName}>
                                {comment.userName}
                              </TextCM>
                              <TextCM style={detailStyles.commentTime}>
                                {formatCommentTime(comment.createdAt)}
                              </TextCM>
                            </View>
                            <TextCM style={detailStyles.commentText}>
                              {comment.content}
                            </TextCM>
                            
                            {/* Attachments trong comment */}
                            {comment.attachments && comment.attachments.length > 0 && (
                              <View style={detailStyles.commentAttachments}>
                                {comment.attachments.map((attachment, idx) => (
                                  <TouchableOpacity
                                    key={idx}
                                    style={detailStyles.commentAttachmentItem}
                                    onPress={() => {
                                      // TODO: Mở file/ảnh để xem
                                      console.log('Open attachment:', attachment.fileUrl);
                                    }}
                                  >
                                    {attachment.fileType.startsWith('image/') ? (
                                      <Image
                                        source={{ 
                                          uri: attachment.fileUrl.startsWith('http') 
                                            ? attachment.fileUrl 
                                            : `${getApiUrl()}${attachment.fileUrl}`
                                        }}
                                        style={detailStyles.commentAttachmentImage}
                                        resizeMode="cover"
                                      />
                                    ) : (
                                      <View style={detailStyles.commentAttachmentFile}>
                                        <Icon
                                          name="file-outline"
                                          width={24}
                                          height={24}
                                          fill="#666"
                                        />
                                        <TextCM style={detailStyles.commentAttachmentFileName} numberOfLines={1}>
                                          {attachment.fileName}
                                        </TextCM>
                                      </View>
                                    )}
                                  </TouchableOpacity>
                                ))}
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={detailStyles.commentItemActions}>
                          <TouchableOpacity
                            style={detailStyles.commentActionBtn}
                            onPress={() => {
                              // TODO: Implement reaction
                              console.log('Add reaction');
                            }}
                          >
                            <Icon
                              name="heart-outline"
                              width={18}
                              height={18}
                              fill="#999"
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={detailStyles.commentActionBtn}
                            onPress={() => handleCommentMoreOptions(comment.id)}
                          >
                            <Icon
                              name="more-horizontal-outline"
                              width={18}
                              height={18}
                              fill="#999"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Comment Input - Luôn hiển thị nếu đã có comments hoặc khi showCommentInput = true, hiển thị bên dưới comments */}
                {(comments.length > 0 || showCommentInput) && (
                  <View style={detailStyles.commentContainer}>
                    <View style={detailStyles.commentInputWrapper}>
                      {/* Avatar */}
                      <View style={detailStyles.avatarContainer}>
                        {userAvatar && userAvatar.trim() !== '' ? (
                          <Image
                            source={{ uri: userAvatar }}
                            style={detailStyles.avatar}
                            onError={() => {
                              console.log('Error loading avatar');
                            }}
                          />
                        ) : (
                          <View style={detailStyles.avatarPlaceholder}>
                            <TextCM style={detailStyles.avatarText}>
                              {getFirstLetter()}
                            </TextCM>
                          </View>
                        )}
                      </View>

                      {/* Input Field */}
                      <TextInput
                        ref={commentInputRef}
                        style={detailStyles.commentInput}
                        placeholder="Thêm bình luận..."
                        placeholderTextColor="#999"
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                        maxLength={500}
                      />

                      {/* Action Icons */}
                      <View style={detailStyles.commentActions}>
                        <TouchableOpacity
                          style={detailStyles.commentActionButton}
                          onPress={() => setShowAttachmentOptions(true)}
                        >
                          <Icon
                            name="link-outline"
                            width={20}
                            height={20}
                            fill="#999"
                          />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={detailStyles.commentActionButton}
                          onPress={() => {
                            console.log('Mention user');
                          }}
                        >
                          <Icon
                            name="person-add-outline"
                            width={20}
                            height={20}
                            fill="#999"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            detailStyles.commentSendButton,
                            commentText.trim() && detailStyles.commentSendButtonActive
                          ]}
                          onPress={handleSendComment}
                          disabled={(!commentText.trim() && commentAttachments.length === 0) || uploadingAttachment}
                        >
                          <Icon
                            name="checkmark-outline"
                            width={20}
                            height={20}
                            fill={commentText.trim() ? "#fff" : "#999"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Attachments Preview */}
                    {commentAttachments.length > 0 && (
                      <View style={detailStyles.attachmentsPreview}>
                        {commentAttachments.map((attachment, index) => (
                          <View key={index} style={detailStyles.attachmentItem}>
                            {attachment.type.startsWith('image/') ? (
                              <Image
                                source={{ uri: attachment.uri }}
                                style={detailStyles.attachmentImage}
                                resizeMode="cover"
                              />
                            ) : (
                              <View style={detailStyles.attachmentFileIcon}>
                                <Icon
                                  name="file-outline"
                                  width={24}
                                  height={24}
                                  fill="#666"
                                />
                              </View>
                            )}
                            <View style={detailStyles.attachmentInfo}>
                              <TextCM style={detailStyles.attachmentName} numberOfLines={1}>
                                {attachment.name}
                              </TextCM>
                              {attachment.size && (
                                <TextCM style={detailStyles.attachmentSize}>
                                  {(attachment.size / 1024).toFixed(2)} KB
                                </TextCM>
                              )}
                            </View>
                            <TouchableOpacity
                              style={detailStyles.attachmentRemove}
                              onPress={() => handleRemoveAttachment(index)}
                            >
                              <Icon
                                name="close-outline"
                                width={18}
                                height={18}
                                fill="#ff4444"
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>

              {loadingPermission ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                  <TextCM style={{ color: '#000' }}>Đang tải...</TextCM>
                </View>
              ) : (
                <View style={{ flex: 1, minHeight: 400 }}>
                  <InputRichText 
                    key={notionData?.id || notionItem?.id}
                    ref={richTextRef}
                    initialValue={notionData?.content || notionItem?.content || ""}
                    editable={canEdit}
                    containerStyle={{ flex: 1 }}
                  />
                </View>
              )}
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
            notionId={notionItem?.id || null}
            notionTitle={title.trim() || notionItem?.title || 'Không có tiêu đề'}
          />
        </View>
      </ModalFullScreen>

      {/* Bottom Sheet cho menu options */}
      <BottomSheetCM
        title="Tùy chọn"
        isVisible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        renderContent={renderBottomSheetContent()}
      />

      {/* Modal xác nhận xóa */}
      <ModalConfirmCM
        isVisible={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        title="Chuyển vào thùng rác"
        content="Bạn có chắc chắn muốn chuyển notion này vào thùng rác?"
        labelCancel="Hủy"
        labelConfirm="Chuyển"
        type="delete"
      />

      {/* Modal thông báo xóa thành công */}
      <ModalConfirmCM
        isVisible={showSuccessDelete}
        onClose={handleSuccessDelete}
        onConfirm={handleSuccessDelete}
        title="Thành công"
        content="Đã chuyển notion vào thùng rác"
        labelConfirm="OK"
        type="success"
      />

      {/* Modal thông báo lỗi xóa */}
      <ModalConfirmCM
        isVisible={showErrorDelete}
        onClose={() => setShowErrorDelete(false)}
        onConfirm={() => setShowErrorDelete(false)}
        title="Lỗi"
        content="Không thể chuyển notion vào thùng rác. Vui lòng thử lại."
        labelConfirm="OK"
        type="error"
      />

      {/* Bottom Sheet cho comment options */}
      <BottomSheetCM
        title="Tùy chọn bình luận"
        isVisible={showCommentOptions}
        onClose={() => {
          setShowCommentOptions(false);
          setSelectedCommentId(null);
        }}
        renderContent={
          <View style={detailStyles.bottomSheetContent}>
            <TouchableOpacity
              style={[detailStyles.bottomSheetOption, { borderBottomWidth: 0 }]}
              onPress={handleDeleteComment}
              activeOpacity={0.7}
            >
              <Icon
                name="trash-2-outline"
                width={24}
                height={24}
                fill="#ff4444"
              />
              <TextCM style={[detailStyles.bottomSheetOptionText, { color: '#ff4444' }]}>
                Xóa bình luận
              </TextCM>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal xác nhận xóa comment */}
      <ModalConfirmCM
        isVisible={showConfirmDeleteComment}
        onClose={() => {
          setShowConfirmDeleteComment(false);
          setSelectedCommentId(null);
        }}
        onConfirm={handleConfirmDeleteComment}
        title="Xóa bình luận"
        content="Bạn có chắc chắn muốn xóa bình luận này?"
        labelCancel="Hủy"
        labelConfirm="Xóa"
        type="delete"
      />

      {/* Bottom Sheet cho attachment options */}
      <BottomSheetCM
        title="Đính kèm"
        isVisible={showAttachmentOptions}
        onClose={() => setShowAttachmentOptions(false)}
        renderContent={
          <View style={detailStyles.bottomSheetContent}>
            <TouchableOpacity
              style={detailStyles.bottomSheetOption}
              onPress={handlePickImage}
              activeOpacity={0.7}
            >
              <Icon
                name="image-outline"
                width={24}
                height={24}
                fill="#666"
              />
              <TextCM style={detailStyles.bottomSheetOptionText}>
                Chọn ảnh
              </TextCM>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const detailStyles = StyleSheet.create({
  bottomSheetContent: {
    paddingVertical: 8,
  },
  bottomSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  bottomSheetOptionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  commentsSection: {
    marginBottom: 12,
  },
  commentContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 16,
  },
  commentsList: {
    marginTop: 8,
  },
  commentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  commentItemLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  commentAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  commentItemActions: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 8,
  },
  commentActionBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  commentInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentActionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSendButtonActive: {
    backgroundColor: '#ca1e66',
  },
  attachmentsPreview: {
    marginTop: 12,
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    gap: 12,
  },
  attachmentImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  attachmentFileIcon: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  attachmentSize: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  attachmentRemove: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAttachments: {
    marginTop: 8,
    gap: 8,
  },
  commentAttachmentItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  commentAttachmentImage: {
    width: '100%',
    maxWidth: 300,
    height: 200,
    borderRadius: 8,
  },
  commentAttachmentFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  commentAttachmentFileName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default DetailScreen;


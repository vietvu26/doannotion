  import { Image, Pressable, TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';
  import TextCM from '../../../components/Text';
  import HeaderCM from '../../../components/Header/HeaderCM';
  import { IcWaveHand } from '../../../../assets/images';
  import styles from './styles';
  import { Icon } from '@ui-kitten/components';
  import DraggableFlatList from 'react-native-draggable-flatlist';
  import { useCallback, useEffect, useState } from 'react';
  import DraggableListItem from './DraggableListItem';
  import { useFocusEffect, useNavigation } from '@react-navigation/native';
  import axios from 'axios';
  import { NavigationName } from '../../../../constants';
  import { useAppSelector } from '../../../../hooks/useRedux';
  import { getApiUrl } from '../../../../config/api.config';
  import PagingCM from '../../../components/Paging';

  export type NotionItem = {
    id: number;
    title: string;
    order: number;
    parentFileId: number | null;
    icon: string;
    content: string;
  };
  const HomeNotion = () => {
  const navigation = useNavigation<any>();
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const userAvatar = useAppSelector((state) => state.common.userAvatar);
  const userName = useAppSelector((state) => state.common.userName);
  const userEmail = useAppSelector((state) => state.common.userEmail);
  const [notionList, setNotionList] = useState<NotionItem[]>([]);
  const [sharedNotions, setSharedNotions] = useState<NotionItem[]>([]);
  const [loadingShared, setLoadingShared] = useState(false);
  const defaultAvatar = 'https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=';
  
  // Hiển thị tên user nếu có, nếu không thì dùng email
  const displayName = userName || userEmail?.split('@')[0] || 'User';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshFlag, setRefreshFlag] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchData = async () => {
      if (!currentUserId) {
        setLoading(false);
        setError('Chưa đăng nhập. Vui lòng đăng nhập để xem notion.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiUrl = getApiUrl();
        const url = `${apiUrl}/api/notion/${currentUserId}`;
        console.log('Fetching notion data from:', url);
        console.log('Current User ID:', currentUserId);
        
        const res = await axios.get(url);
        console.log('Response status:', res.status);
        console.log('Response data:', res.data);
        
        if (res.data && res.data.success) {
          // Lọc chỉ lấy các notion không có parent (root level) và sắp xếp theo order
          const data = res.data.data
            .filter((item: NotionItem) => item.parentFileId === null)
            .sort((a: NotionItem, b: NotionItem) => a.order - b.order);
          setNotionList(data);
          setCurrentPage(1); // Reset về trang đầu khi fetch lại data
          console.log('Notion list loaded:', data.length, 'items');
        } else {
          console.error('Invalid response format:', res.data);
          setError('Không thể tải dữ liệu từ server');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
        });
        
        if (error.response?.status === 404) {
          setError(`Không tìm thấy endpoint. Vui lòng kiểm tra server đã chạy và endpoint '/api/notion/${currentUserId}' tồn tại.`);
        } else if (error.response?.status === 500) {
          setError('Lỗi server. Vui lòng thử lại sau.');
        } else if (error.message === 'Network Error') {
          setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và đảm bảo server đang chạy.');
        } else {
          setError(`Lỗi khi tải dữ liệu: ${error.message || 'Vui lòng thử lại.'}`);
        }
        setNotionList([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, [refreshFlag, currentUserId]);

    const fetchSharedNotions = async () => {
      if (!currentUserId) {
        return;
      }

      try {
        setLoadingShared(true);
        const apiUrl = getApiUrl();
        const url = `${apiUrl}/api/shared-notions/${currentUserId}`;
        const res = await axios.get(url);
        
        if (res.data && res.data.success) {
          setSharedNotions(res.data.data || []);
        }
      } catch (error: any) {
        console.error('Error fetching shared notions:', error);
        setSharedNotions([]);
      } finally {
        setLoadingShared(false);
      }
    };

    useFocusEffect(
      useCallback(() => {
        fetchData(); // gọi lại API hoặc load lại danh sách
        fetchSharedNotions(); // gọi API lấy shared notions
      }, [currentUserId]),
    );

    const handleDragEnd = async (data: NotionItem[]) => {
      if (!currentUserId) {
        setError('Chưa đăng nhập. Không thể cập nhật thứ tự.');
        return;
      }

      // Cập nhật lại notionList với thứ tự mới từ trang hiện tại
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const newList = [...notionList];
      data.forEach((item, index) => {
        newList[startIndex + index] = item;
      });
      setNotionList(newList);

      // Tính toán order mới dựa trên vị trí trong toàn bộ list
      const newOrder = newList.map((item, index) => ({ id: item.id, order: index }));
      try {
        const res = await fetch(`${getApiUrl()}/api/update-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            updates: newOrder,
            authorId: currentUserId,
          }),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          setRefreshFlag(prev => prev + 1);
        } else {
          console.error('Server error:', result);
          setError('Không thể cập nhật thứ tự. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Error updating order:', error);
        setError('Lỗi khi cập nhật thứ tự. Vui lòng thử lại.');
      }
    };
    const handleNotionPress = async (notionItem: NotionItem) => {
      try {
        const response = await axios.get(`${getApiUrl()}/api/notion-by-id/${notionItem.id}`);
        if (response.data && response.data.success && response.data.data) {
          navigation.navigate(NavigationName.NotionDetail, {
            notionItem: response.data.data,
          });
        }
      } catch (error) {
        console.error('Error fetching notion detail:', error);
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <HeaderCM
          renderContentLeftDynamic={() => (
            <TouchableOpacity 
              onPress={() => {
                navigation.navigate(NavigationName.Settings);
              }} 
              style={[styles.ctnLeft]}
            >
              <View style={styles.ctnImage}>
                <Image
                  width={40}
                  height={40}
                  source={{
                    uri: userAvatar || defaultAvatar,
                  }}
                />
              </View>
              <View style={{ rowGap: 8 }}>
                <TextCM style={[styles.text, { fontSize: 16 }]}>
                  Xin chào
                  <IcWaveHand width={20} height={20} />
                </TextCM>
                <TextCM
                  numberOfLines={1}
                  style={[styles.text, { fontSize: 12, maxWidth: 200 }]}
                >
                  {displayName}
                </TextCM>
              </View>
            </TouchableOpacity>
          )}
          title=""
          renderContentRight={() => (
            <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* <Pressable>
              <Icon fill={'#fff'} name="bell" width={24} height={24} />
            </Pressable> */}
            <Pressable onPress={() => navigation.navigate(NavigationName.Dashboard)}>
              <Icon fill={'#fff'} name="home" width={24} height={24} />
            </Pressable>
            </View>
          )}
        />
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
            <ActivityIndicator size="large" color="#ca1e66" />
            <TextCM style={{ marginTop: 10, color: '#666' }}>Đang tải dữ liệu...</TextCM>
          </View>
        ) : error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20 }}>
            <Icon name="alert-circle" fill="#ca1e66" width={48} height={48} />
            <TextCM style={{ marginTop: 10, color: '#666', textAlign: 'center' }}>{error}</TextCM>
            <TouchableOpacity 
              onPress={fetchData}
              style={{ marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#ca1e66', borderRadius: 8 }}
            >
              <TextCM style={{ color: '#fff' }}>Thử lại</TextCM>
            </TouchableOpacity>
          </View>
        ) : notionList.length === 0 ? (
          <View style={{ flex: 1 }}>
            {/* Section "Đã chia sẻ với tôi" */}
            <View style={homeStyles.sectionContainer}>
              <View style={homeStyles.sectionHeader}>
                <TextCM style={homeStyles.sectionTitle}>Đã chia sẻ với tôi</TextCM>
              </View>
              {loadingShared ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#ca1e66" />
                </View>
              ) : sharedNotions.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Icon name="file-text" fill="#ccc" width={48} height={48} />
                  <TextCM style={{ marginTop: 10, color: '#999', fontSize: 14 }}>
                    Chưa có trang nào được chia sẻ với bạn
                  </TextCM>
                </View>
              ) : (
                <View style={homeStyles.sharedListContainer}>
                  {sharedNotions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={homeStyles.sharedItem}
                      onPress={() => handleNotionPress(item)}
                      activeOpacity={0.7}
                    >
                      <Icon name="arrow-forward" width={16} height={16} fill="#666" style={{ marginRight: 8 }} />
                      <Icon name="file-text" width={20} height={20} fill="#666" style={{ marginRight: 8 }} />
                      <TextCM style={homeStyles.sharedItemTitle} numberOfLines={1}>
                        {item.title || 'Chưa có tiêu đề'}
                      </TextCM>
                      <View style={{ flexDirection: 'row', gap: 8, marginLeft: 'auto' }}>
                        <Pressable>
                          <Icon name="more-horizontal" width={18} height={18} fill="#666" />
                        </Pressable>
                        <Pressable>
                          <Icon name="plus" width={18} height={18} fill="#666" />
                        </Pressable>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
              <Icon name="file-text-outline" fill="#ccc" width={64} height={64} />
              <TextCM style={{ marginTop: 10, color: '#999' }}>Chưa có notion nào</TextCM>
            </View>
          </View>
        ) : (
          <>
            <DraggableFlatList
              data={notionList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
              onDragEnd={({ data }) => handleDragEnd(data)}
              keyExtractor={item => item.id.toString()}
              ListHeaderComponent={() => (
                <>
                  {/* Section "Đã chia sẻ với tôi" */}
                  <View style={homeStyles.sectionContainer}>
                    <View style={homeStyles.sectionHeader}>
                      <TextCM style={homeStyles.sectionTitle}>Đã chia sẻ với tôi</TextCM>
                    </View>
                    {loadingShared ? (
                      <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color="#ca1e66" />
                      </View>
                    ) : sharedNotions.length === 0 ? (
                      <View style={{ padding: 20, alignItems: 'center' }}>
                        <Icon name="file-text" fill="#ccc" width={48} height={48} />
                        <TextCM style={{ marginTop: 10, color: '#999', fontSize: 14 }}>
                          Chưa có trang nào được chia sẻ với bạn
                        </TextCM>
                      </View>
                    ) : (
                      <View style={homeStyles.sharedListContainer}>
                        {sharedNotions.map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            style={homeStyles.sharedItem}
                            onPress={() => handleNotionPress(item)}
                            activeOpacity={0.7}
                          >
                            <Icon name="arrow-forward-outline" width={16} height={16} fill="#666" style={{ marginRight: 8 }} />
                            <Icon name="file-text-outline" width={20} height={20} fill="#666" style={{ marginRight: 8 }} />
                            <TextCM style={homeStyles.sharedItemTitle} numberOfLines={1}>
                              {item.title || 'Chưa có tiêu đề'}
                            </TextCM>
                            
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Section "Riêng tư" */}
                  <View style={homeStyles.sectionContainer}>
                    <View style={homeStyles.sectionHeader}>
                      <TextCM style={homeStyles.sectionTitle}>Riêng tư</TextCM>
                      {notionList.length > ITEMS_PER_PAGE && (
                        <TextCM style={homeStyles.sectionSubtitle}>
                          {((currentPage - 1) * ITEMS_PER_PAGE + 1)}-{Math.min(currentPage * ITEMS_PER_PAGE, notionList.length)} / {notionList.length}
                        </TextCM>
                      )}
                    </View>
                  </View>
                </>
              )}
              renderItem={params => (
                <DraggableListItem
                  {...params}
                  onRefresh={() => setRefreshFlag(prev => prev + 1)}
                  refreshFlag={refreshFlag}
                />
              )}
              ListFooterComponent={() => {
                if (notionList.length <= ITEMS_PER_PAGE) {
                  return null;
                }
                return (
                  <View style={homeStyles.paginationContainer}>
                    <PagingCM
                      collectionSize={notionList.length}
                      pageSize={ITEMS_PER_PAGE}
                      currentPage={currentPage}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                      }}
                    />
                  </View>
                );
              }}
            />
          </>
        )}
      </View>
    );
  };

  const homeStyles = StyleSheet.create({
    headerCmContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    sectionContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
    sharedListContainer: {
      gap: 8,
    },
    sharedItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
    sharedItemTitle: {
      flex: 1,
      fontSize: 14,
      color: '#333',
    },
    sectionSubtitle: {
      fontSize: 12,
      color: '#999',
      fontWeight: '400',
    },
    paginationContainer: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
  });

  export default HomeNotion;

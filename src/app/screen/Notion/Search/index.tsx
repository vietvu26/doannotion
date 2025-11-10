import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  SectionList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Icon } from '@ui-kitten/components';
import TextCM from '../../../components/Text';
import HeaderCM from '../../../components/Header/HeaderCM';
import { NavigationName } from '../../../../constants';
import { useAppSelector } from '../../../../hooks/useRedux';
import { getApiUrl } from '../../../../config/api.config';
import axios from 'axios';
import useDebounce from '../../../../hooks/useDebounce';
import styles from './styles';
import { NotionItem } from '../Home';

interface GroupedNotionItem {
  dateLabel: string;
  items: NotionItem[];
}

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const userAvatar = useAppSelector((state) => state.common.userAvatar);
  const [notionList, setNotionList] = useState<NotionItem[]>([]);
  const [sharedNotions, setSharedNotions] = useState<NotionItem[]>([]);
  const [filteredList, setFilteredList] = useState<NotionItem[]>([]);
  const [groupedList, setGroupedList] = useState<GroupedNotionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<TextInput>(null);
  
  // Map để track xem item nào là shared (dùng object thay vì Set)
  const [sharedNotionIds, setSharedNotionIds] = useState<{ [key: number]: boolean }>({});
  
  // Debounce search query để tối ưu performance (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Format date để hiển thị
  const formatDateLabel = (dateString: string | null | undefined): string => {
    if (!dateString) {
      // Nếu không có date, sử dụng thời gian hiện tại
      const now = new Date();
      const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 
                     'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
      return `${months[now.getMonth()]} ${now.getFullYear()}`;
    }
    
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Reset time để so sánh ngày
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      
      if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Hôm nay';
      } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Hôm qua';
      } else {
        // Format: "tháng 10 2025" (chữ thường như trong hình)
        const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 
                       'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      }
    } catch (error) {
      // Nếu parse date lỗi, trả về label mặc định
      const now = new Date();
      const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 
                     'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
      return `${months[now.getMonth()]} ${now.getFullYear()}`;
    }
  };

  // Fetch tất cả notion items (riêng tư và được chia sẻ)
  const fetchData = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      
      // Fetch private notions
      const privateRes = await axios.get(`${apiUrl}/api/notion/${currentUserId}`);
      
      // Fetch shared notions
      let sharedItems: NotionItem[] = [];
      const sharedIdsMap: { [key: number]: boolean } = {};
      try {
        const sharedRes = await axios.get(`${apiUrl}/api/shared-notions/${currentUserId}`);
        if (sharedRes.data && sharedRes.data.success) {
          sharedItems = sharedRes.data.data || [];
          sharedItems.forEach(item => {
            sharedIdsMap[item.id] = true;
          });
        }
      } catch (sharedError) {
        console.error('Error fetching shared notions:', sharedError);
        // Nếu API chưa có hoặc lỗi, bỏ qua
      }
      
      if (privateRes.data && privateRes.data.success) {
        // Lấy tất cả items (không filter parentFileId)
        const allItems = privateRes.data.data || [];
        setNotionList(allItems);
        setSharedNotions(sharedItems);
        setSharedNotionIds(sharedIdsMap);
        
        // Merge cả hai danh sách lại (loại bỏ duplicate nếu có)
        const allNotions = [...allItems];
        sharedItems.forEach(sharedItem => {
          // Chỉ thêm nếu chưa có trong private list
          if (!allItems.find(item => item.id === sharedItem.id)) {
            allNotions.push(sharedItem);
          }
        });
        setFilteredList(allNotions);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setNotionList([]);
      setSharedNotions([]);
      setFilteredList([]);
    } finally {
      setLoading(false);
    }
  };

  // Nhóm items theo ngày
  const groupItemsByDate = (items: NotionItem[]): GroupedNotionItem[] => {
    const groups: { [key: string]: NotionItem[] } = {};
    
    items.forEach((item: any) => {
      // Sử dụng updatedAt hoặc createdAt, nếu không có thì dùng thời gian hiện tại
      const dateKey = item.updatedAt || item.createdAt || new Date().toISOString();
      const label = formatDateLabel(dateKey);
      
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(item);
    });
    
    // Sắp xếp các nhóm: Hôm nay -> Hôm qua -> các tháng khác (mới nhất trước)
    const sortedGroups = Object.keys(groups).sort((a, b) => {
      if (a === 'Hôm nay') return -1;
      if (b === 'Hôm nay') return 1;
      if (a === 'Hôm qua') return -1;
      if (b === 'Hôm qua') return 1;
      return b.localeCompare(a); // Sắp xếp tháng/năm mới nhất trước
    });
    
    return sortedGroups.map(label => ({
      dateLabel: label,
      items: groups[label],
    }));
  };

  // Filter items theo search query với debounce - chỉ tìm kiếm theo title
  useEffect(() => {
    // Merge cả private và shared notions
    const allNotions = [...notionList];
    sharedNotions.forEach(sharedItem => {
      if (!notionList.find(item => item.id === sharedItem.id)) {
        allNotions.push(sharedItem);
      }
    });

    if (!debouncedSearchQuery.trim()) {
      // Nếu không có query, hiển thị tất cả items
      setFilteredList(allNotions);
    } else {
      // Chỉ tìm kiếm trong title (case-insensitive)
      const query = debouncedSearchQuery.toLowerCase().trim();
      const filtered = allNotions.filter((item) => {
        const title = (item.title || '').toLowerCase();
        // Chỉ tìm kiếm trong title
        return title.includes(query);
      });
      setFilteredList(filtered);
    }
  }, [debouncedSearchQuery, notionList, sharedNotions]);

  // Nhóm lại khi filteredList thay đổi
  useEffect(() => {
    const grouped = groupItemsByDate(filteredList);
    setGroupedList(grouped);
  }, [filteredList]);

  useEffect(() => {
    fetchData();
  }, [currentUserId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [currentUserId])
  );

  const handleItemPress = (item: NotionItem) => {
    // Đóng bàn phím nếu đang mở
    Keyboard.dismiss();
    navigation.navigate(NavigationName.NotionDetail, {
      notionItem: item,
    });
  };

  const handleSearchFocus = () => {
    // Scroll đến cuối danh sách khi focus vào search input
    // KeyboardAvoidingView sẽ tự động đẩy màn hình lên
  };

  const renderItem = ({ item, index, section }: { item: NotionItem; index: number; section: { data: NotionItem[] } }) => {
    const title = item.title || 'Chưa có tiêu đề';
    const isLastItem = index === section.data.length - 1;
    const isShared = sharedNotionIds[item.id] === true;
    
    return (
      <View>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.itemLeft}>
            <View style={styles.itemIcon}>
              <Icon
                name="file-text-outline"
                fill="#999"
                style={styles.icon}
              />
            </View>
            <View style={styles.itemContent}>
              <TextCM style={styles.itemTitle}>{title}</TextCM>
              <TextCM style={styles.itemSubtitle}>
                {isShared ? 'trong Đã chia sẻ với tôi' : 'trong Riêng tư'}
              </TextCM>
            </View>
          </View>
        </TouchableOpacity>
        {!isLastItem && <View style={styles.separator} />}
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => {
    return (
      <View style={styles.sectionHeader}>
        <TextCM style={styles.sectionHeaderText}>{section.title}</TextCM>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#ca1e66" />
          <TextCM style={styles.emptyText}>Đang tải...</TextCM>
        </View>
      );
    }

    if (debouncedSearchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Icon
            name="search-outline"
            fill="#ccc"
            style={styles.emptyIcon}
          />
          <TextCM style={styles.emptyText}>
            Không tìm thấy kết quả cho "{debouncedSearchQuery}"
          </TextCM>
          <TextCM style={styles.emptySubtext}>
            Thử tìm kiếm với từ khóa khác
          </TextCM>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon
          name="file-text-outline"
          fill="#ccc"
          style={styles.emptyIcon}
        />
        <TextCM style={styles.emptyText}>Chưa có ghi chú nào</TextCM>
      </View>
    );
  };

  // Transform groupedList to SectionList format
  const sectionData = groupedList.map((group) => ({
    title: group.dateLabel,
    data: group.items,
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderCM
        renderContentLeftDynamic={() => (
          <TouchableOpacity 
            onPress={() => {
              navigation.navigate(NavigationName.Settings);
            }} 
            style={styles.ctnLeft}
          >
           
          </TouchableOpacity>
        )}
        title="Tìm kiếm"
        showIconBackLeft={false}
        useLinearGradient={true}
        renderContentRight={() => (
          <TouchableOpacity onPress={() => navigation.navigate(NavigationName.Dashboard)}>
            <Icon fill={'#fff'} name="home-outline" width={24} height={24} />
          </TouchableOpacity>
        )}
      />

      {/* Search Bar below header */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Icon
            name="search-outline"
            fill="#999"
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              style={styles.clearButton}
            >
              <Icon
                name="close-circle-outline"
                fill="#999"
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterButton}>
            <Icon
              name="options-2-outline"
              fill="#999"
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.content}>
          {/* List of items */}
          <SectionList
            sections={sectionData}
            renderItem={({ item, index, section }) => renderItem({ item, index, section })}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => `item-${item.id}`}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            stickySectionHeadersEnabled={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SearchScreen;

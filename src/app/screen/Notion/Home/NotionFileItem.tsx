import React, { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { NotionItem } from './';
import TextCM from '../../../components/Text';
import { Icon, Menu, MenuItem } from '@ui-kitten/components';
import BottomSheetCM from '../../../components/BottomSheet';
import { NavigationName } from '../../../../constants';
import { useAppSelector } from '../../../../hooks/useRedux';
import { getApiUrl } from '../../../../config/api.config';

interface NotionFileItemProp {
  drag?: () => void;
  isActive?: boolean;
  notionFile: NotionItem;
  onRefresh?: () => void;
  openBottomSheet?: (item: NotionItem) => void;
  refreshFlag?: number;
}


function InnerNotionListItem({
  parentId,
  refreshFlag = 0,
  openBottomSheet,
}: {
  parentId: number;
  refreshFlag?: number;
  openBottomSheet?: (item: NotionItem) => void;
}) {
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const [data, setData] = useState<NotionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [localRefreshFlag, setRefreshFlag] = useState(0);
  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        if (!currentUserId) {
          setLoading(false);
          return;
        }
        try {
          const res = await axios.get(`${getApiUrl()}/api/notion/${currentUserId}`);
          if (res.data && res.data.success) {
            const filtered = res.data.data.filter(
              (item: NotionItem) => item.parentFileId === parentId
            );
            setData(filtered);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetch();
    }, [parentId, refreshFlag, currentUserId])
  );

  if (loading) {
    return <TextCM style={{ color: 'gray' }}>Đang tải...</TextCM>;
  }

  if (!data.length) {
    return (
      <TextCM style={{ color: 'gray', marginTop: 14 }}>
        Không có trang nào
      </TextCM>
    );
  }

  return (
    <View>
      {data.map((notionFile) => (
        <NotionFileItem
          key={notionFile.id}
          notionFile={notionFile}
          onRefresh={() => setRefreshFlag((prev) => prev + 1)}
          refreshFlag={refreshFlag}
          openBottomSheet={openBottomSheet}
        />
      ))}
    </View>
  );
}

export default function NotionFileItem({
  isActive,
  drag,
  notionFile,
  onRefresh,
  refreshFlag = 0,
}: NotionFileItemProp) {
  const navigation = useNavigation<any>();
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const [isOpen, setIsOpen] = useState(false);
  
const [openBottom, setOpenBottom] = useState(false);

  // Hàm xóa notion
  const handleDelete = async () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa "${notionFile.title}"?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
          onPress: () => setOpenBottom(false),
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${getApiUrl()}/api/delete-notion/${notionFile.id}`);
              console.log('Đã xóa notion:', notionFile.id);
              setOpenBottom(false);
              onRefresh?.(); // Refresh lại danh sách
            } catch (error) {
              console.error('Lỗi khi xóa notion:', error);
              Alert.alert('Lỗi', 'Không thể xóa notion. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  // Hàm nhân bản notion
  const handleDuplicate = async () => {
    if (!currentUserId) {
      Alert.alert('Lỗi', 'Chưa đăng nhập. Vui lòng đăng nhập để thực hiện chức năng này.');
      return;
    }
    try {
      const duplicatedItem = {
        title: `${notionFile.title} (Copy)`,
        parentFileId: notionFile.parentFileId,
        icon: notionFile.icon,
        content: notionFile.content,
        type: '',
        authorId: currentUserId,
        order: 0,
      };
      await axios.post(`${getApiUrl()}/api/add-notion`, duplicatedItem);
      console.log('Đã nhân bản notion');
      setOpenBottom(false);
      onRefresh?.(); // Refresh lại danh sách
    } catch (error) {
      console.error('Lỗi khi nhân bản notion:', error);
      Alert.alert('Lỗi', 'Không thể nhân bản notion. Vui lòng thử lại.');
    }
  };

 const renderAction = () => {
    return (
      <Menu>
        <MenuItem
          title={(props : any) => (
            <TextCM {...props}>Nhân bản</TextCM>
          )}
          onPress={handleDuplicate}
        />
        <MenuItem
          title={(props : any) => <TextCM {...props}>Xóa</TextCM>}
          onPress={handleDelete}
        />
      </Menu>
    );
  };
  const handleAdd = async () => {
    if (!currentUserId) {
      Alert.alert('Lỗi', 'Chưa đăng nhập. Vui lòng đăng nhập để thực hiện chức năng này.');
      return;
    }
    try {
      const newItem = {
        title: 'New Page',
        parentFileId: notionFile.id,
        icon: 'file-text-outline',
        content: '',
        type: '',
        authorId: currentUserId,
        order: 0,
      };
      await axios.post(`${getApiUrl()}/api/add-notion`, newItem);
      
      setIsOpen(true);
      onRefresh?.();
    } catch (e) {
      console.error('Add failed', e);
      Alert.alert('Lỗi', 'Không thể tạo trang mới. Vui lòng thử lại.');
    }
  };

  return (
    <View>
      <TouchableOpacity
        disabled={isActive}
        onLongPress={drag}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 16,
          marginLeft: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Pressable onPress={() => setIsOpen((val) => !val)} disabled={isActive}>
            <Icon
              name={isOpen ? 'chevron-down-outline' : 'chevron-right-outline'}
              style={{ marginRight: 12, width: 24, height: 24 }}
              
            />
          </Pressable>

          <TouchableOpacity
            disabled={isActive}
            onLongPress={drag}
            style={{ flexDirection: 'row' }}
            onPress={() => {
              // Navigate sang màn hình Detail với notionItem
              navigation.navigate(NavigationName.NotionDetail, { notionItem: notionFile });
            }}
          >
            <Icon name={notionFile.icon as any} style={{ marginRight: 12, width: 24, height: 24}} />
            <TextCM >
              {notionFile.title}
            </TextCM>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 }}>
            <Pressable onPress={() => {setOpenBottom(true)}}>
            <Icon name="more-horizontal-outline" style={{ width: 24, height: 24 }}  />
          </Pressable>
          <Pressable onPress={handleAdd} disabled={isActive}>
            <Icon name="plus-outline" style={{ width: 24, height: 24 }} />
          </Pressable>
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          <InnerNotionListItem
            parentId={notionFile.id}
            refreshFlag={refreshFlag}
          />
        </View>
      )}
      <BottomSheetCM
        title={notionFile.title}
        isVisible={openBottom}
        onClose={() => setOpenBottom(false)}
        renderContent={renderAction()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginLeft: 24,
  },
});

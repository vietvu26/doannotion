import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import TextCM from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderCM from '../components/Header/HeaderCM';
import styles from './styles';
import { IcWaveHand } from '../../assets/images';
import { Icon } from '@ui-kitten/components';
import ITask from '../../assets/images/ic/eTask.svg';

import { Color, Font, NavigationName } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../hooks/useRedux';

const DashboardApp = () => {
  const navigation = useNavigation<any>();
  const userAvatar = useAppSelector((state) => state.common.userAvatar);
  const userName = useAppSelector((state) => state.common.userName);
  const userEmail = useAppSelector((state) => state.common.userEmail);
  const defaultAvatar = 'https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=';
  
  // Hiển thị tên user nếu có, nếu không thì dùng email
  const displayName = userName || userEmail?.split('@')[0] || 'User';

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ backgroundColor: '#fff', flex: 1 }}
    >
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
          <Pressable>
            <Icon fill={'#fff'} name="bell-outline" width={24} height={24} />
          </Pressable>
        )}
      />
      <ScrollView
        style={{
          paddingHorizontal: 16,
          backgroundColor: '#fff',
        }}
      >
        <TextCM style={styles.textHead}>Danh sách dịch vụ</TextCM>

        <View
          style={{
            backgroundColor: Color.gray,
            height: 150,
            borderRadius: 8,
            padding: 15,
            marginTop: 20,
          }}
        >
          <TextCM style={{ fontSize: 16, fontFamily: Font.InterSemiBold600 }}>
            Quản lý chung
          </TextCM>
          <View style={{ flexDirection: 'row', marginTop: 20, gap: 16 }}>
            <Pressable style={styles.iconITask}>
              <ITask height={20} width={20} />
            </Pressable>
            <Pressable
              style={styles.ctnImage}
              onPress={() => {
                navigation.navigate(NavigationName.BottomTabs);
                console.log('abc');
              }}
            >
              <Image
                width={40}
                height={40}
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_YWUotEbuX7-L0y0FRaU_ZJPL62KaeyRRvKjOvKryeBf27qrDAeiHC2O0NERiygcUsrE&usqp=CAU',
                }}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardApp;

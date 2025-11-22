import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import TextCM from '../../../app/components/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from '@ui-kitten/components';
import {Color} from '../../../constants';
import {NavigationName} from '../../../constants';

const TabBarETask = ({state, navigation, totalRecoders = 0}: any) => {
  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={styles.ctnSafeTabBottom}>
      <View style={styles.ctnTabBottom}>
        {state.routes.map((route: any, index: number) => {
          let label = '';
          const isFocused = state.index === index;
          function getIcon() {
            switch (route.name) {
              case NavigationName.ETaskHome:
                label = 'Trang chủ';
                return (
                  <Icon
                    name={'home-outline'}
                    fill={isFocused ? '#7C3AED' : 'grey'}
                    width={24}
                    height={24}
                  />
                );
              case NavigationName.ETaskStatistics:
                label = 'Thống kê';
                return (
                  <Icon
                    name={'bar-chart-outline'}
                    fill={isFocused ? '#7C3AED' : 'grey'}
                    width={24}
                    height={24}
                  />
                );
              case NavigationName.ETaskNotification:
                label = 'Thông báo';
                return (
                  <View style={{position: 'relative'}}>
                    <Icon
                      name={'bell-outline'}
                      fill={isFocused ? '#7C3AED' : 'grey'}
                      width={24}
                      height={24}
                    />
                    {totalRecoders > 0 && (
                      <View
                        style={{
                          position: 'absolute',
                          backgroundColor: '#E14337',
                          borderRadius: 10,
                          minWidth: 18,
                          height: 18,
                          paddingHorizontal: totalRecoders > 9 ? 4 : 5,
                          top: -8,
                          right: -8,
                          zIndex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: '#fff',
                        }}>
                        <TextCM
                          style={{
                            fontSize: 10,
                            color: '#fff',
                            fontWeight: 'bold',
                          }}>
                          {totalRecoders > 99 ? '99+' : totalRecoders}
                        </TextCM>
                      </View>
                    )}
                  </View>
                );
              // Legacy tab names (for Notion)
              case 'Search':
                label = 'Thống kê';
                return (
                  <Icon
                    name={'bar-chart-outline'}
                    fill={isFocused ? '#ca1e66' : 'grey'}
                    width={24}
                    height={24}
                  />
                );
              case 'Editor':
                label = 'Bảng';
                return (
                  <Icon
                    name={'file-text'}
                    fill={isFocused ? '#ca1e66' : 'grey'}
                    width={24}
                    height={24}
                  />
                );
              case 'Home':
                label = 'Trang chủ';
                return (
                  <Icon
                    name={'home'}
                    fill={isFocused ? '#ca1e66' : 'grey'}
                    width={24}
                    height={24}
                  />
                );
              default:
                break;
            }
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.ctnItemTabBottom}
              accessibilityState={isFocused ? {selected: true} : {}}
              key={index}
              onPress={onPress}>
              {getIcon()}
              <TextCM
                style={isFocused ? styles.txtLabelSelect : styles.txtLabel}>
                {label}
              </TextCM>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default TabBarETask;

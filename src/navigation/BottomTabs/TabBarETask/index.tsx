import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import TextCM from '../../../app/components/Text';
import {TabName} from './helper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from '@ui-kitten/components';
import {Color} from '../../../constants';

const TabBarETask = ({state, navigation, t, totalRecoders}: any) => {
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
              case TabName.Search:
                label = t('board.statistical');
                return (
                  <Icon
                    name={'bar-chart-outline'}
                    fill={isFocused ? '#ca1e66' : 'grey'}
                    width={24}
                    height={24}
                  />
                );
              case TabName.Editor:
                label = t('CM.Board');
                return (
                  <Icon
                    name={'file-text'}
                    fill={isFocused ? '#ca1e66' : 'grey'}
                    width={24}
                    height={24}
                  />
                );
              // case TabName.Notification:
              //   label = t('CM.Notification');
              //   return (
              //     <View style={{position: 'relative'}}>
              //       {totalRecoders > 0 && (
              //         <View
              //           style={{
              //             position: 'absolute',
              //             backgroundColor: '#e14337',
              //             borderRadius: 100,
              //             paddingHorizontal: 4,
              //             paddingVertical: 2,
              //             top: -5,
              //             right: totalRecoders > 100 ? -20 : -12,
              //           }}>
              //           <TextCM
              //             style={{
              //               fontSize: 10,
              //               color: '#fff',
              //             }}>
              //             {totalRecoders < 100 ? totalRecoders : '99+'}
              //           </TextCM>
              //         </View>
              //       )}
              //       <Icon
              //         name={'bell'}
              //         fill={isFocused ? '#ca1e66' : 'grey'}
              //         width={24}
              //         height={24}
              //       />
              //     </View>
              //   );
              case TabName.Home:
                label = t('CM.Home');
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

import React, {useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Pressable, TouchableOpacity, Dimensions} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import HeaderCM from '../../../components/Header/HeaderCM';
import TextCM from '../../../components/Text';
import styles from './styles';
import {useAppSelector} from '../../../../hooks/useRedux';
import {getApiUrl} from '../../../../config/api.config';
import {Spinner, Icon} from '@ui-kitten/components';
import {NavigationName} from '../../../../constants';
import ModalFullScreen from '../../../components/ModalFullScreen';
import StatisticsPieChart from './StatisticsPieChart';
import StatisticsBarChart from './StatisticsBarChart';
import {Color} from '../../../../constants';

const {width} = Dimensions.get('window');

interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
}

type FilterType = 'total' | 'completed' | 'inProgress' | 'pending' | 'overdue';

const StatisticsScreen = () => {
  const navigation = useNavigation<any>();
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<TaskStatistics | null>(null);
  const [isShowChart, setIsShowChart] = useState(false);

  const fetchStatistics = useCallback(async () => {
    if (!currentUserId) {
      console.log('[Statistics] currentUserId is null, skipping fetch');
      return;
    }

    console.log('[Statistics] Fetching statistics for user_id:', currentUserId);
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const url = `${API_URL}/api/task/statistics?user_id=${currentUserId}`;

      console.log('[Statistics] API URL:', url);

      const response = await fetch(url);
      const result = await response.json();

      console.log('[Statistics] API Response:', JSON.stringify(result, null, 2));

      if (result.success && result.statistics) {
        console.log('[Statistics] Statistics received:', result.statistics);
        setStatistics(result.statistics);
      } else {
        console.warn('[Statistics] API returned success=false or no statistics:', result);
        setStatistics({
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0,
          overdue: 0,
        });
      }
    } catch (error) {
      console.error('[Statistics] Error fetching statistics:', error);
      setStatistics({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  useFocusEffect(
    useCallback(() => {
      fetchStatistics();
    }, [fetchStatistics])
  );

  const handleStatCardPress = (filterType: FilterType, title: string) => {
    if (statistics && statistics[filterType] === 0) {
      return; // Don't navigate if no tasks
    }
    navigation.navigate(NavigationName.TaskListScreen, {
      filterType,
      title,
    });
  };

  const StatCard = ({
    title,
    value,
    color,
    filterType,
  }: {
    title: string;
    value: number;
    color: string;
    filterType: FilterType;
  }) => (
    <Pressable
      style={[
        styles.statCard,
        {borderLeftColor: color},
        value === 0 && styles.statCardDisabled,
      ]}
      onPress={() => handleStatCardPress(filterType, title)}
      disabled={value === 0}>
      <View style={styles.statCardContent}>
        <TextCM style={styles.statTitle}>{title}</TextCM>
        <TextCM style={[styles.statValue, {color}]}>{value}</TextCM>
      </View>
      {value > 0 && (
        <View style={styles.statCardArrow}>
          <TextCM style={[styles.statCardArrowText, {color}]}>›</TextCM>
        </View>
      )}
    </Pressable>
  );

  return (
    <>
      <HeaderCM title="Thống kê" showIconBackLeft={false} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <Spinner />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <TextCM style={styles.sectionTitle}>Tổng quan nhiệm vụ</TextCM>
            
            {statistics && (
              <>
                <StatCard
                  title="Tổng số nhiệm vụ"
                  value={statistics.total}
                  color="#7C3AED"
                  filterType="total"
                />
                <StatCard
                  title="Đã hoàn thành"
                  value={statistics.completed}
                  color="#10B981"
                  filterType="completed"
                />
                <StatCard
                  title="Đang thực hiện"
                  value={statistics.inProgress}
                  color="#3B82F6"
                  filterType="inProgress"
                />
                <StatCard
                  title="Chưa bắt đầu"
                  value={statistics.pending}
                  color="#F59E0B"
                  filterType="pending"
                />
                <StatCard
                  title="Quá hạn"
                  value={statistics.overdue}
                  color="#EF4444"
                  filterType="overdue"
                />
              </>
            )}

            {statistics && statistics.total > 0 && (
              <>
                <View style={styles.progressContainer}>
                  <TextCM style={styles.sectionTitle}>Tiến độ hoàn thành</TextCM>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(statistics.completed / statistics.total) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <TextCM style={styles.progressText}>
                    {Math.round((statistics.completed / statistics.total) * 100)}% hoàn thành
                  </TextCM>
                </View>

                <View style={styles.chartContainer}>
                  <TouchableOpacity
                    onPress={() => setIsShowChart(true)}
                    style={[styles.chartCard, {width: width - 16 * 2}]}>
                    <View style={styles.chartCardContent}>
                      <Icon name="pie-chart-outline" width={24} height={24} fill="#7C3AED" />
                      <TextCM style={styles.chartCardText}>Biểu đồ phân tích</TextCM>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      )}

      <ModalFullScreen
        backdropStyle={{backgroundColor: Color.White}}
        paddingBottom={false}
        isVisible={isShowChart}
        children={
          <>
            <HeaderCM
              title="Biểu đồ phân tích"
              onPressIconLeft={() => setIsShowChart(false)}
              showIconBackLeft={true}
              fillIconBackLeft="#ffffff"
              useLinearGradient={true}
              titleStyle={{color: '#ffffff'}}
            />
            <ScrollView style={{flex: 1, backgroundColor: Color.White}}>
              {statistics && (
                <>
                  <StatisticsPieChart statistics={statistics} />
                  <StatisticsBarChart statistics={statistics} />
                </>
              )}
            </ScrollView>
          </>
        }
      />
    </>
  );
};

export default StatisticsScreen;


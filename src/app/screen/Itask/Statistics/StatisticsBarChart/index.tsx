import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import TextCM from '../../../../components/Text';
import styles from './styles';
import {Font} from '../../../../../constants';

// Try to import BarChart, fallback if not available
let BarChart: any = null;
try {
  const giftedCharts = require('react-native-gifted-charts');
  BarChart = giftedCharts.BarChart;
} catch (e) {
  console.warn('react-native-gifted-charts not installed. Please run: npm install react-native-gifted-charts');
}

interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
}

type Props = {
  statistics: TaskStatistics;
};

const StatisticsBarChart = ({statistics}: Props) => {
  const ChartColor: {[key: string]: string} = {
    completed: '#10B981',
    inProgress: '#3B82F6',
    pending: '#F59E0B',
    overdue: '#EF4444',
  };

  const transformData = () => {
    const data = [
      {
        value: statistics.completed,
        label: 'Hoàn thành',
        frontColor: ChartColor.completed,
      },
      {
        value: statistics.inProgress,
        label: 'Đang thực hiện',
        frontColor: ChartColor.inProgress,
      },
      {
        value: statistics.pending,
        label: 'Chưa bắt đầu',
        frontColor: ChartColor.pending,
      },
      {
        value: statistics.overdue,
        label: 'Quá hạn',
        frontColor: ChartColor.overdue,
      },
    ].filter(item => item.value > 0);

    return data;
  };

  const barData = transformData();

  const renderDot = (color: string) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 1,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderDescription = () => {
    const statusMap = [
      {key: 'completed', label: 'Hoàn thành', color: ChartColor.completed},
      {key: 'inProgress', label: 'Đang thực hiện', color: ChartColor.inProgress},
      {key: 'pending', label: 'Chưa bắt đầu', color: ChartColor.pending},
      {key: 'overdue', label: 'Quá hạn', color: ChartColor.overdue},
    ];

    return (
      <ScrollView horizontal style={{flexDirection: 'row', marginTop: 20}}>
        {statusMap.map(item => {
          return (
            <View
              key={item.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
                marginRight: 10,
              }}>
              {renderDot(item.color)}
              <Text
                style={{
                  color: item.color,
                  fontSize: 12,
                }}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  if (statistics.total === 0) {
    return (
      <View style={styles.container}>
        <TextCM style={{fontSize: 18, fontFamily: Font.InterBold700}}>
          Số lượng nhiệm vụ theo trạng thái
        </TextCM>
        <View style={styles.emptyContainer}>
          <TextCM style={styles.emptyText}>Chưa có dữ liệu để hiển thị</TextCM>
        </View>
      </View>
    );
  }

  if (!BarChart) {
    return (
      <View style={styles.container}>
        <TextCM style={{fontSize: 18, fontFamily: Font.InterBold700}}>
          Số lượng nhiệm vụ theo trạng thái
        </TextCM>
        <View style={styles.emptyContainer}>
          <TextCM style={styles.emptyText}>
            Vui lòng cài đặt: npm install react-native-gifted-charts
          </TextCM>
        </View>
        {renderDescription()}
      </View>
    );
  }

  // Tính max value để set noOfSections
  const maxValue = Math.max(
    statistics.completed,
    statistics.inProgress,
    statistics.pending,
    statistics.overdue,
    1
  );
  const noOfSections = Math.ceil(maxValue / Math.max(1, Math.floor(maxValue / 4)));

  return (
    <View style={styles.container}>
      <TextCM style={{fontSize: 18, fontFamily: Font.InterBold700}}>
        Số lượng nhiệm vụ theo trạng thái
      </TextCM>
      <View style={styles.chartWrapper}>
        <BarChart
          data={barData}
          barWidth={45}
          spacing={25}
          noOfSections={noOfSections}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          yAxisLabelSuffix=" "
          rulesType="dashed"
          rulesColor="#E0E0E0"
          showGradient={false}
          isAnimated
          animationDuration={800}
        />
      </View>
      {renderDescription()}
    </View>
  );
};

export default StatisticsBarChart;


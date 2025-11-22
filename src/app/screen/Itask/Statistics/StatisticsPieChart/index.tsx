import React from 'react';
import {View, ScrollView, Text, Platform, useWindowDimensions} from 'react-native';
import TextCM from '../../../../components/Text';
import styles from './styles';
import {Font} from '../../../../../constants';

// Try to import PieChart, fallback if not available
let PieChart: any = null;
let SvgText: any = null;
try {
  const giftedCharts = require('react-native-gifted-charts');
  PieChart = giftedCharts.PieChart;
  const svg = require('react-native-svg');
  SvgText = svg.Text;
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

const StatisticsPieChart = ({statistics}: Props) => {
  const {width} = useWindowDimensions();

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
        text: 'Hoàn thành',
        color: ChartColor.completed,
        externalLabelComponent: () => {
          return <SvgText>{statistics.completed}</SvgText>;
        },
      },
      {
        value: statistics.inProgress,
        text: 'Đang thực hiện',
        color: ChartColor.inProgress,
        externalLabelComponent: () => {
          return <SvgText>{statistics.inProgress}</SvgText>;
        },
      },
      {
        value: statistics.pending,
        text: 'Chưa bắt đầu',
        color: ChartColor.pending,
        externalLabelComponent: () => {
          return <SvgText>{statistics.pending}</SvgText>;
        },
      },
      {
        value: statistics.overdue,
        text: 'Quá hạn',
        color: ChartColor.overdue,
        externalLabelComponent: () => {
          return <SvgText>{statistics.overdue}</SvgText>;
        },
      },
    ].filter(item => item.value > 0);

    return data;
  };

  const pieData = transformData();

  const renderDot = (color: string) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderItemDescription = (item: any) =>
    item.value ? (
      <View
        key={item.text}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 5,
        }}>
        {renderDot(item.color)}
        <Text style={{color: item.color}}>{`${item.text}: ${item.value}`}</Text>
      </View>
    ) : null;

  const renderDescription = (pieData: any[]) => {
    // Chia thành mảng columns, mỗi column là mảng 1 hoặc 2 phần tử
    const columns: any[][] = pieData.reduce((acc, item, idx) => {
      if (idx % 2 === 0) {
        acc.push([item]);
      } else {
        acc[acc.length - 1].push(item);
      }
      return acc;
    }, [] as any[][]);

    return (
      <ScrollView horizontal style={{marginTop: 20}}>
        <View style={{flexDirection: 'row'}}>
          {columns.map((col, colIndex) => (
            <View
              key={colIndex}
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginRight: 10,
              }}>
              {col[0] && renderItemDescription(col[0])}
              {col[1] && renderItemDescription(col[1])}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  if (statistics.total === 0) {
    return (
      <View style={styles.container}>
        <TextCM style={{fontSize: 18, fontFamily: Font.InterBold700}}>
          Tỷ lệ nhiệm vụ theo trạng thái
        </TextCM>
        <View style={styles.emptyContainer}>
          <TextCM style={styles.emptyText}>Chưa có dữ liệu để hiển thị</TextCM>
        </View>
      </View>
    );
  }

  if (!PieChart) {
    return (
      <View style={styles.container}>
        <TextCM style={{fontSize: 18, fontFamily: Font.InterBold700}}>
          Tỷ lệ nhiệm vụ theo trạng thái
        </TextCM>
        <View style={styles.emptyContainer}>
          <TextCM style={styles.emptyText}>
            Vui lòng cài đặt: npm install react-native-gifted-charts
          </TextCM>
        </View>
        {renderDescription(pieData)}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextCM style={{fontSize: 18, fontFamily: Font.InterBold700}}>
        Tỷ lệ nhiệm vụ theo trạng thái
      </TextCM>
      <View
        style={{
          width: width,
          height: width - 40,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          overflow: 'hidden',
        }}>
        <PieChart
          data={pieData}
          textColor={'black'}
          labelsPosition={'outward'}
          showTooltip={true}
          showExternalLabels={Platform.OS === 'ios' ? true : true}
          shadow={true}
          strokeWidth={0}
          labelLineConfig={{
            color: 'black',
            avoidOverlappingOfLabels: true,
            thickness: 1,
          }}
        />
      </View>
      {renderDescription(pieData)}
    </View>
  );
};

export default StatisticsPieChart;


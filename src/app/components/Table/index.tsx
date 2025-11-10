import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import TextCM from '../Text';

type Props = {
  tableHeaders: string[];
  tableData: any[];
  stickyColumnLeftIndex?: number;
  stickyColumnRightIndex?: number;
  stickyLeft?: boolean;
  stickyRight?: boolean;
  isPaging?: boolean;
  styleTextHeader?: StyleProp<TextStyle>;
  styleHeader?: StyleProp<ViewStyle>;
  useOnLayout?: boolean;
  styleTextData?: StyleProp<TextStyle>;
};

const TableCM = ({
  tableHeaders,
  tableData,
  stickyColumnLeftIndex = 0,
  stickyColumnRightIndex,
  stickyLeft,
  stickyRight,
  isPaging = true,
  styleTextHeader,
  styleHeader,
  useOnLayout,
  styleTextData,
}: Props) => {
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  const [widthOfStickey, setWidthOfStickey] = useState(0);
  const [rowHeights, setRowHeights] = useState<number[]>([]);
  function onRowLayout(height: number, index: number) {
    setRowHeights(prev => {
      const next = [...prev];
      next[index] = height;
      return next;
    });
  }
  return (
    <View style={styles.container}>
      <View style={styles.tableBody}>
        {/* Sticky Name Column */}
        {stickyLeft &&
          stickyColumnLeftIndex &&
          tableHeaders
            .slice(-stickyColumnLeftIndex)
            .reverse()
            .map((header, index) => (
              <View
                onLayout={e => {
                  setWidthOfStickey(e.nativeEvent.layout.width);
                }}
                key={header}
                style={[
                  styles.stickyColumnScroll,
                  {
                    right: index * widthOfStickey,
                    position: 'absolute',
                    zIndex: 10,
                  },
                  1 === stickyColumnLeftIndex && styles.box,
                ]}>
                {/* Sticky Header Column */}
                <View
                  style={[
                    styles.stickyHeader,
                    header === 'action' && {alignItems: 'center'},
                    styleHeader,
                  ]}>
                  <TextCM style={[styles.headerText, styleTextHeader]}>
                    {t(header)}
                  </TextCM>
                </View>
                {/* Sticky Data Column */}
                {tableData?.map((rowData, index) => (
                  <View
                    key={index}
                    style={[
                      styles.stickyColumn,
                      header === 'action' && {alignItems: 'center'},
                      {height: rowHeights[index]},
                    ]}>
                    {typeof (rowData as any)[header] !== 'object' ? (
                      <TextCM style={styles.cellText}>
                        {(rowData as any)[header]}
                      </TextCM>
                    ) : (
                      (rowData as any)[header]
                    )}
                  </View>
                ))}
              </View>
            ))}

        {/* Scrollable Header + Columns */}
        <ScrollView horizontal>
          {/* Scrollable Columns */}
          <View
            style={[
              styles.row,
              !stickyLeft && {
                marginRight: 0,
              },
            ]}>
            {tableHeaders
              .slice(0, tableHeaders.length - stickyColumnLeftIndex)
              .map((header, index) => (
                <View key={index}>
                  <View
                    style={[
                      styles.stickyHeader,
                      header === 'action' && {alignItems: 'center'},
                      {
                        minWidth:
                          header === 'STT'
                            ? 30
                            : (width - 30) /
                              (tableHeaders.length - stickyColumnLeftIndex - 1),
                      },
                      styleHeader,
                    ]}>
                    <TextCM style={[styles.headerText, styleTextHeader]}>
                      {t(header)}
                    </TextCM>
                  </View>

                  {tableData?.map((rowData, index) => (
                    <View
                      onLayout={e =>
                        useOnLayout &&
                        onRowLayout(e.nativeEvent.layout.height, index)
                      }
                      key={index}
                      style={[
                        styles.stickyColumn,
                        header === 'action' && {alignItems: 'center'},
                        {
                          minWidth:
                            header === 'STT'
                              ? 30
                              : (width - 30) /
                                (tableHeaders.length -
                                  stickyColumnLeftIndex -
                                  1),
                          maxWidth: 150,
                        },
                      ]}>
                      {typeof (rowData as any)[header] !== 'object' ? (
                        <TextCM
                          style={[styles.cellText, styleTextData]}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {(rowData as any)[header]}
                        </TextCM>
                      ) : (
                        (rowData as any)[header]
                      )}
                    </View>
                  ))}
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default TableCM;

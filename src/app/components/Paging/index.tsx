import {TouchableOpacity, View} from 'react-native';
import TextCM from '../Text';
import {useEffect, useState} from 'react';
import styles from './styles';
import {SizeDP} from '../../../constants/Size';
import {IconArrowGrey} from '../../../assets/images';
import React from 'react';

type Props = {
  collectionSize: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (currentPage: number) => void;
};

const PagingCM = ({
  collectionSize,
  pageSize,
  currentPage,
  onPageChange,
}: Props) => {
  const [totalPages, setTotalPages] = useState(
    Array.from(Array(Math.ceil(collectionSize / pageSize))).map(
      (item, idx) => idx + 1,
    ),
  );

  useEffect(() => {
    setTotalPages(
      Array.from(Array(Math.ceil(collectionSize / pageSize))).map(
        (item, idx) => idx + 1,
      ),
    );
  }, [collectionSize]);

  const createPaginationArray = (): number[] => {
    const array = [];
    const beforePage = Math.max(1, currentPage - 1);
    const afterPage = Math.min(totalPages.length, currentPage + 1);

    for (let plength = beforePage; plength <= afterPage; plength++) {
      if (plength > totalPages.length) {
        continue;
      }
      if (plength === 0) {
        plength = plength + 1;
      }
      array.push(plength);
    }

    return array;
  };

  const selectPageNumber = (pageNumber: number) => {
    onPageChange(pageNumber);
    createPaginationArray();
  };

  const next = () => {
    const nextPage = currentPage + 1;
    if (nextPage > totalPages.length) return;
    nextPage <= totalPages.length && selectPageNumber(nextPage);
  };

  /** Set previous page number */
  const previous = () => {
    const previousPage = currentPage - 1;
    if (previousPage <= 0) return;
    previousPage >= 1 && selectPageNumber(previousPage);
  };

  return (
    <View style={styles.ctnMain}>
      <TouchableOpacity
        onPress={previous}
        style={[styles.ctnText, {transform: [{rotate: '90deg'}]}]}
        hitSlop={SizeDP(15)}>
        <IconArrowGrey width={SizeDP(16)} height={SizeDP(16)} />
      </TouchableOpacity>
      {totalPages.length > 5 ? (
        <>
          {currentPage > 2 && (
            <>
              <TouchableOpacity
                hitSlop={SizeDP(15)}
                onPress={() => selectPageNumber(1)}
                style={[styles.ctnText, currentPage === 1 && styles.ctnSelect]}>
                <TextCM>1</TextCM>
              </TouchableOpacity>
              {currentPage > 3 && <TextCM>...</TextCM>}
            </>
          )}

          {createPaginationArray().map(numb => (
            <TouchableOpacity
              key={numb}
              hitSlop={SizeDP(15)}
              onPress={() => selectPageNumber(numb)}
              style={[
                styles.ctnText,
                currentPage === numb && styles.ctnSelect,
              ]}>
              <TextCM>{numb}</TextCM>
            </TouchableOpacity>
          ))}
          {currentPage < totalPages.length - 1 && (
            <>
              {currentPage < totalPages.length - 2 && <TextCM>...</TextCM>}
              <TouchableOpacity
                hitSlop={SizeDP(15)}
                style={[
                  styles.ctnText,
                  currentPage === totalPages.length && styles.ctnSelect,
                ]}
                onPress={() => selectPageNumber(totalPages.length)}>
                <TextCM>{totalPages.length}</TextCM>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <>
          {createPaginationArray().map(numb => (
            <TouchableOpacity
              key={numb}
              hitSlop={SizeDP(15)}
              onPress={() => selectPageNumber(numb)}
              style={[
                styles.ctnText,
                currentPage === numb && styles.ctnSelect,
              ]}>
              <TextCM>{numb}</TextCM>
            </TouchableOpacity>
          ))}
        </>
      )}
      <TouchableOpacity
        onPress={next}
        style={[styles.ctnText, {transform: [{rotate: '-90deg'}]}]}
        hitSlop={SizeDP(15)}>
        <IconArrowGrey width={SizeDP(16)} height={SizeDP(16)} />
      </TouchableOpacity>
    </View>
  );
};

export default PagingCM;

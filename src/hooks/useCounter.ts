import {useState} from 'react';

interface Props {
  initialValue: number;
  min: number;
  max: number;
}

const useCounter = ({
  initialValue,
  min,
  max,
}: Props): [number, () => void, () => void, (data: number) => void] => {
  const [counter, setCounter] = useState<number>(initialValue);

  const increase = () => {
    setCounter(prevCounter => Math.min(prevCounter + 1, max));
  };

  const decrease = () => {
    setCounter(prevCounter => Math.max(prevCounter - 1, min));
  };

  const setCountData = (data: number) => {
    setCounter(data);
  };

  return [counter, increase, decrease, setCountData];
};

export default useCounter;

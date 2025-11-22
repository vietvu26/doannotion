export enum RepeatType {
  end = 0,
  repeat = 1,
}

export enum TimeRepeat {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export const listTimeRepeat = [
  {
    value: TimeRepeat.DAILY,
    label: 'Hàng ngày',
  },
  {
    value: TimeRepeat.WEEKLY,
    label: 'Hàng tuần',
  },
  {
    value: TimeRepeat.MONTHLY,
    label: 'Hàng tháng',
  },
];

export const listRepeatType = [
  {
    value: RepeatType.end,
    label: 'Kết thúc vào ngày',
  },
  {
    value: RepeatType.repeat,
    label: 'Lặp lại số lần',
  },
];


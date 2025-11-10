import {Dimensions, PixelRatio} from 'react-native';

export enum TYPE_SCREEN {
  mobile = 500,
  tablet_h = 1000,
  tablet_v = 1100,
}

export interface IScreen {
  width: number;
  height: number;
}

export const {height: ScreenHeight, width: ScreenWidth} =
  Dimensions.get('screen');
// use when Left/Right/Width
export const SizeDP = (widthSize: number) => {
  return PixelRatio.roundToNearestPixel(widthSize);
};

const FontSize = {
  // Font size
  /** font size 10px */
  FontTiniest: SizeDP(10),
  FontTinier: SizeDP(11),
  /** font size 12px */
  FontTiny: SizeDP(12),
  FontSmallest: SizeDP(13),
  /** font size 14px */
  FontSmall: SizeDP(14),
  /** font size 16px */
  FontBase: SizeDP(16),
  FontMediumPlus: SizeDP(17),
  /** font size 18px */
  FontLarge: SizeDP(18),
  FontBigger: SizeDP(20),
  FontBigBigger: SizeDP(22),
  FontBiggest: SizeDP(24),
  FontHuge: SizeDP(26),
  FontLarge3x: SizeDP(28),
  FontHuger: SizeDP(30),
  FontHugest: SizeDP(32),
  FontGreat: SizeDP(34),
  FontMidGreater: SizeDP(36),
  FontGreater: SizeDP(38),
  FontGreatest: SizeDP(60),
};

export default FontSize;

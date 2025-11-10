import {Icon} from '@ui-kitten/components';
import TextCM from '../../../components/Text';

const handleHead = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>H1</TextCM>
);
const handleHeadH2 = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>H2</TextCM>
);

const handleHeadH3 = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>H3</TextCM>
);

const handleSetBold = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>B</TextCM>
);

const handleSetItalic = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>I</TextCM>
);

const handleSetUnderline = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>U</TextCM>
);

const handleBullet = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>Bullets</TextCM>
);

const handleOrder = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>Order</TextCM>
);

const handleLink = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>L</TextCM>
);

const handleUndo = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>Un</TextCM>
);

const handleRedo = ({tintColor}: any) => (
  <TextCM style={{color: tintColor}}>Re</TextCM>
);

export {
  handleHead,
  handleHeadH2,
  handleHeadH3,
  handleSetBold,
  handleSetItalic,
  handleSetUnderline,
  handleBullet,
  handleLink,
  handleUndo,
  handleRedo,
  handleOrder,
};

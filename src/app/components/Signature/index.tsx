import {Modal, TextInput, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import TextCM from '../Text';
import {Color, Font} from '../../../constants';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';
import {useEffect, useRef, useState} from 'react';
import {Input, Toggle} from '@ui-kitten/components';
import {captureRef} from 'react-native-view-shot';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (dataUrl: string | null) => void;
};

const ModalSignature = ({visible, onClose, onSelect}: Props) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState('');
  const signatureRef = useRef<View>(null);
  const [hideCaret, setHideCaret] = useState(false);

  const ref = useRef<SignatureViewRef>(null);
  const whiteRef = useRef<View>(null);

  const onCheckedChange = (isChecked: boolean): void => {
    setChecked(isChecked);
  };

  const handleSaveTextSignature = async () => {
    try {
      if (!value.trim()) {
        onSelect(null);
        onClose();
        return;
      }
      if (!signatureRef.current) return;
      setHideCaret(true);

      const uri = await captureRef(signatureRef, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });
      const dataUrl = `data:image/png;base64,${uri}`;
      onSelect(dataUrl);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignature = (sig: string) => {
    setSignature(sig);
    onSelect(sig);
    onClose();
  };

  const handleSaveEmptySignature = async () => {
    try {
      if (!whiteRef.current) return;
      const uri = await captureRef(whiteRef, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });
      const dataUrl = `data:image/png;base64,${uri}`;
      onSelect(dataUrl); 
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (visible) {
      setValue('');
      setSignature(null);
      setChecked(false);
      setHideCaret(false);
    }
  }, [visible]);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TextCM style={{fontFamily: Font.InterSemiBold600}}>
              Thiết lập chữ ký
            </TextCM>
          </View>
          {checked ? (
            <View
              ref={signatureRef}
              style={styles.signText}>
              <TextInput
                multiline
                value={value}
                placeholder="Nhập chữ ký"
                onChangeText={setValue}
                style={styles.inputSign}
                caretHidden={hideCaret}
              />
            </View>
          ) : (
            <SignatureScreen
              ref={ref}
              onOK={handleSignature}
              onEmpty={handleSaveEmptySignature}
              penColor="#CA1E66"
              minWidth={3}
              maxWidth={6}
              webStyle={`
                .m-signature-pad--footer {display: none;}
                .m-signature-pad {box-shadow: none; border: none;}
                canvas {width: 100% !important; height: 300px !important;}
              `}
              style={{flex: 1, borderBottomWidth: 1, marginBottom: 20}}
            />
          )}

          <Toggle
            style={styles.toggle}
            checked={checked}
            onChange={onCheckedChange}>
            Nhập
          </Toggle>
          <View
            ref={whiteRef}
            style={styles.whiteImg}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose}>
              <TextCM style={{color: Color.primary01}}>Hủy</TextCM>
            </TouchableOpacity>

            <View style={styles.footerRight}>
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => {
                  if (checked) {
                    setValue('');
                    setHideCaret(false); 
                  } else {
                    ref.current?.clearSignature();
                    setSignature(null);
                  }
                  onSelect(null);
                }}>
                <TextCM>Xóa</TextCM>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnConfirm}
                onPress={() => {
                  if (checked) {
                    if (!value.trim()) {
                      handleSaveEmptySignature(); 
                    } else {
                      handleSaveTextSignature();
                    }
                  } else {
                    ref.current?.readSignature(); 
                  }
                }}>
                <TextCM style={{color: 'white'}}>Lưu</TextCM>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSignature;

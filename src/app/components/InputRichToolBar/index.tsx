import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  useEffect,
} from 'react';
import {View, Platform, ScrollView} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {
  handleBullet,
  handleHead,
  handleHeadH2,
  handleHeadH3,
  handleLink,
  handleOrder,
  handleRedo,
  handleSetBold,
  handleSetItalic,
  handleSetUnderline,
  handleUndo,
} from './helper';
import {useTranslation} from 'react-i18next';
import styles from './styles';

type InputRichTextProps = {
  initialValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  containerStyle?: object;
  editorStyle?: object;
  toolbarStyle?: object;
  editable?: boolean;
};

export type InputRichTextRef = {
  focus: () => void;
  blur: () => void;
  getContent: () => Promise<string>;
  setContent: (html: string) => void;
};

const InputRichText = forwardRef<InputRichTextRef, InputRichTextProps>(
  (
    {
      initialValue = '',
      onChange,
      containerStyle,
      editorStyle,
      onBlur,
      toolbarStyle,
      editable = true,
    },
    ref,
  ) => {
    const {t} = useTranslation();
    const [showToolbar, setShowToolbar] = useState(false);
    const [text, setText] = useState(initialValue);
    const editorRef = useRef<RichEditor>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Update editor khi initialValue thay đổi từ bên ngoài
    useEffect(() => {
      if (initialValue !== text && editorRef.current && isInitialized) {
        editorRef.current.setContentHTML(initialValue);
        setText(initialValue);
      }
    }, [initialValue]);

    // Đánh dấu đã initialized sau khi mount
    useEffect(() => {
      setIsInitialized(true);
    }, []);

    useImperativeHandle(ref, () => ({
      focus: () => editorRef.current?.focusContentEditor?.(),
      blur: () => {
        editorRef.current?.blurContentEditor?.();        
      },
      getContent: () => {
        return new Promise<string>((resolve) => {
          // Thử lấy content từ RichEditor
          if (editorRef.current?.getContentHtml) {
            try {
              const result = editorRef.current.getContentHtml();
              // getContentHtml trả về Promise<string>
              if (result && typeof result.then === 'function') {
                result.then((html: string) => resolve(html || text)).catch(() => resolve(text));
              } else {
                // Fallback về state text nếu không phải Promise
                resolve(text);
              }
            } catch (error) {
              // Nếu có lỗi, fallback về state text
              resolve(text);
            }
          } else {
            // Fallback về state text nếu không có method
            resolve(text);
          }
        });
      },
      setContent: (html: string) => {
        editorRef.current?.setContentHTML(html);
        setText(html);
      },
    }));

    return (
      <View style={[{flex: 1}, containerStyle]}>
        {showToolbar && editable && (
          <View style={[styles.toolbarContainer, toolbarStyle]}>
            <RichToolbar
              editor={editorRef}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.heading1,
                actions.heading2,
                actions.heading3,
                actions.insertLink,
                actions.undo,
                actions.redo,
              ]}
              iconMap={
                Platform.OS === 'ios'
                  ? {
                      [actions.setBold]: handleSetBold,
                      [actions.setItalic]: handleSetItalic,
                      [actions.setUnderline]: handleSetUnderline,
                      [actions.insertBulletsList]: handleBullet,
                      [actions.insertOrderedList]: handleOrder,
                      [actions.heading1]: handleHead,
                      [actions.heading2]: handleHeadH2,
                      [actions.heading3]: handleHeadH3,
                      [actions.insertLink]: handleLink,
                      [actions.undo]: handleUndo,
                      [actions.redo]: handleRedo,
                    }
                  : {
                      [actions.heading1]: handleHead,
                      [actions.heading2]: handleHeadH2,
                      [actions.heading3]: handleHeadH3,
                    }
              }
              iconTint="#000"
              selectedIconTint="#2095F2"
              style={styles.toolbar}
            />
          </View>
        )}

        <ScrollView 
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <RichEditor
            ref={editorRef}
            initialContentHTML={text}
            style={[
              {minHeight: 300}, 
              editorStyle,
              !editable && { opacity: 0.7 }
            ]}
            editorStyle={{
              backgroundColor: 'transparent',
              contentCSSText: `font-size: 16px; line-height: 1.8; min-height: 300px; padding: 12px; ${!editable ? 'pointer-events: none; user-select: none;' : ''}`,
            }}
            placeholder='Nhâp nội dung...'
            useContainer={false}
            scrollEnabled={false}
            disabled={!editable}
            onFocus={() => {
              if (editable) {
                setShowToolbar(true);
              }
            }}
            onChange={content => {
              if (editable) {
                setText(content);
                onChange?.(content);
              }
            }}
            onBlur={() => {
              setShowToolbar(false);
              onBlur?.(text);
            }}
          />
        </ScrollView>
      </View>
    );
  },
);

export default InputRichText;

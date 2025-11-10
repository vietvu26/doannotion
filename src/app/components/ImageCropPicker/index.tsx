import ImagePicker from 'react-native-image-crop-picker';

export interface propertyTakePhoto {
  width?: number;
  height?: number;
  cropping?: boolean;
  includeBase64Enabled?: boolean;
  freeStyleCropEnabled?: boolean;
  cropperCircleOverlayEnabled?: boolean;
  useFrontCameraEnabled?: boolean;
}
const TakePhoto = (options?: propertyTakePhoto) => {
  const {
    width = 500,
    height = 500,
    cropping = false,
    includeBase64Enabled,
    freeStyleCropEnabled,
    cropperCircleOverlayEnabled,
    useFrontCameraEnabled,
  } = options || {};
  return new Promise((resolve, reject) => {
    ImagePicker.openCamera({
      width: width,
      height: height,
      cropping: cropping || false,
      includeBase64: includeBase64Enabled || false, // Mã hoá base64 image
      freeStyleCropEnabled: freeStyleCropEnabled || false, // Áp dụng vùng hình chữ nhật tùy chỉnh để cắt xén
      cropperCircleOverlay: cropperCircleOverlayEnabled || false, // Bật hoặc tắt mặt nạ cắt hình tròn.
      useFrontCamera: useFrontCameraEnabled || false, // Mặt định camera quay trước
    })
      .then(image => {
        const localUrlImage = image;
        resolve(localUrlImage);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export interface propertyChoosePhoto {
  width?: number;
  height?: number;
  cropping?: boolean;
  multipleEnabled?: boolean;
  includeBase64Enabled?: boolean;
  cropperCircleOverlayEnabled?: boolean;
  freeStyleCropEnabled?: boolean;
  compressImageQuality?: number; // Quality từ 0 đến 1 (0.7 = 70%)
}
const ChoosePhoto = (options?: propertyChoosePhoto) => {
  const {
    width = 500,
    height = 500,
    cropping = false,
    multipleEnabled,
    includeBase64Enabled,
    cropperCircleOverlayEnabled,
    freeStyleCropEnabled,
    compressImageQuality,
  } = options || {};
  return new Promise((resolve, reject) => {
    ImagePicker.openPicker({
      width: width,
      height: height,
      cropping: cropping || false,
      multiple: multipleEnabled || false, // Cho chọn nhiều ảnh
      includeBase64: includeBase64Enabled || false, // Mã hoá base64 image
      cropperCircleOverlay: cropperCircleOverlayEnabled || false, //Bật hoặc tắt mặt nạ cắt hình tròn.
      freeStyleCropEnabled: freeStyleCropEnabled || false, // Áp dụng vùng hình chữ nhật tùy chỉnh để cắt xén
      compressImageQuality: compressImageQuality !== undefined ? compressImageQuality : 1, // Nén ảnh với quality (0-1)
      mediaType: 'photo',
    })
      .then(image => {
        const localUrlImage = image;
        resolve(localUrlImage);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export {TakePhoto, ChoosePhoto};

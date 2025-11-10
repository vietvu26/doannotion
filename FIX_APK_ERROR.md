# Hướng dẫn Fix Lỗi "Unable to load script" khi cài APK

## Vấn đề
Khi cài APK vào máy, gặp lỗi: "Unable to load script. Make sure you're running Metro..."

## Nguyên nhân
- APK **debug** cần Metro bundler chạy trên máy dev để load JavaScript
- APK debug không chứa JavaScript bundle bên trong
- Khi cài trên máy khác, không thể kết nối với Metro bundler

## Giải pháp: Build APK Release

APK Release sẽ bundle toàn bộ JavaScript code vào APK, không cần Metro bundler.

### Cách 1: Dùng script (Khuyến nghị)

```bash
# Chạy file build-apk-release.bat
build-apk-release.bat
```

### Cách 2: Dùng lệnh thủ công

```bash
# Di chuyển vào thư mục android
cd android

# Clean build cũ
gradlew.bat clean

# Build APK Release
gradlew.bat assembleRelease
```

### File APK sẽ nằm tại:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Lưu ý quan trọng

### 1. Cấu hình API URL
Đảm bảo file `src/config/api.config.ts` có đúng IP của server:

```typescript
// Production mode - dùng IP thực của server
const PRODUCTION_API_URL = 'http://192.168.1.19:3000'; // ← Thay bằng IP thực
```

### 2. Kiểm tra kết nối
- Server backend phải đang chạy
- IP server phải đúng
- Điện thoại và máy chạy server phải cùng mạng LAN (hoặc dùng IP public)

### 3. Cài đặt APK Release
- Copy file `app-release.apk` vào điện thoại
- Trên điện thoại, bật "Cho phép cài đặt từ nguồn không xác định"
- Mở file APK và cài đặt

## So sánh APK Debug vs Release

| Loại APK | Kích thước | JavaScript Bundle | Cần Metro Bundler |
|----------|------------|-------------------|-------------------|
| Debug    | Lớn (~50-100MB) | Không có | Có (bắt buộc) |
| Release  | Nhỏ (~20-50MB) | Có sẵn | Không |

## Troubleshooting

### Lỗi: "Unable to load script"
**Nguyên nhân:** Đang dùng APK debug
**Giải pháp:** Build APK release thay vì debug

### Lỗi: "Network request failed"
**Nguyên nhân:** API URL không đúng hoặc server không chạy
**Giải pháp:** 
- Kiểm tra IP server trong `api.config.ts`
- Đảm bảo server đang chạy
- Kiểm tra firewall

### APK không cài được
**Nguyên nhân:** Chưa bật "Install from unknown sources"
**Giải pháp:** Bật trong Settings → Security

## Các bước build APK Release

1. **Cập nhật API URL** trong `src/config/api.config.ts`
2. **Build APK Release:**
   ```bash
   cd android
   gradlew.bat clean
   gradlew.bat assembleRelease
   ```
3. **Tìm file APK:**
   - `android/app/build/outputs/apk/release/app-release.apk`
4. **Cài đặt trên điện thoại:**
   - Copy APK vào điện thoại
   - Cài đặt và chạy

## Kiểm tra APK đã có JS bundle chưa

Sau khi build release, kiểm tra:
```bash
# Xem thông tin APK
aapt dump badging app-release.apk | findstr "package"
```

APK release sẽ có JavaScript bundle được bundle vào file `index.android.bundle` trong assets.

## Lưu ý

- APK release sẽ tự động bundle JS code vào APK
- Không cần Metro bundler khi chạy APK release
- APK release có thể cài trên bất kỳ máy Android nào
- Nhớ cập nhật API URL trước khi build












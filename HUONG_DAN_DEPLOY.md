# 🚀 Hướng dẫn Deploy Server - Có URL Public

## 🎯 Mục tiêu

- Server chạy **24/7** (không tắt)
- Có **URL public** để truy cập từ mọi nơi
- **Miễn phí** hoặc chi phí thấp

---

## ✅ Giải pháp: Deploy lên Render (Miễn phí, Dễ nhất)

### Bước 1: Chuẩn bị Code

Đảm bảo file `database.js` có:

```javascript
// Lấy PORT từ environment (Render tự động set)
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server running on port ${PORT}`);
});
```

### Bước 2: Push Code lên GitHub

```bash
# Nếu chưa có git
git init
git add .
git commit -m "Deploy server"

# Tạo repo trên GitHub, sau đó:
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

### Bước 3: Deploy trên Render

1. **Vào Render:**
   - https://render.com
   - Đăng ký bằng GitHub (miễn phí)

2. **Tạo Web Service:**
   - Click **"New"** → **"Web Service"**
   - Chọn GitHub repo của bạn

3. **Cấu hình:**
   ```
   Name: mobile-note-api
   Environment: Node
   Build Command: npm install
   Start Command: node database.js
   Plan: Free
   ```

4. **Click "Create Web Service"**

5. **Đợi 5-10 phút** để deploy

6. **Copy URL:**
   - URL sẽ có dạng: `https://mobile-note-api.onrender.com`
   - **Đây là URL public của bạn!**

### Bước 4: Update API URL trong App

File: `src/config/api.config.ts`

```typescript
const PRODUCTION_API_URL = 'https://mobile-note-api.onrender.com'; // ← URL của bạn
```

---

## 🔧 Xử lý Firebase Service Account

Render cần file Firebase JSON. Có 2 cách:

### Cách 1: Commit file JSON (Nhanh)

1. Đảm bảo file `notion-task-d035f-firebase-adminsdk-fbsvc-afe9d9d4d0.json` có trong repo
2. Push lên GitHub
3. Render sẽ tự động có file

### Cách 2: Dùng Environment Variable (An toàn hơn)

1. **Convert JSON thành string:**
   ```powershell
   # PowerShell
   Get-Content notion-task-d035f-firebase-adminsdk-fbsvc-afe9d9d4d0.json | Out-String
   ```
   Copy toàn bộ output

2. **Vào Render Dashboard:**
   - Chọn service của bạn
   - Vào **"Environment"** tab
   - Click **"Add Environment Variable"**
   - Key: `FIREBASE_SERVICE_ACCOUNT`
   - Value: (paste string JSON vừa copy)
   - Click **"Save Changes"**

3. **Update `database.js`** (dòng 15):
   ```javascript
   // Thay dòng này:
   var serviceAccount = require('./notion-task-d035f-firebase-adminsdk-fbsvc-afe9d9d4d0.json');
   
   // Thành:
   var serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
     ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
     : require('./notion-task-d035f-firebase-adminsdk-fbsvc-afe9d9d4d0.json');
   ```

4. **Redeploy:**
   - Vào Render Dashboard
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ Test Server

1. **Mở browser:**
   ```
   https://mobile-note-api.onrender.com/api/user
   ```

2. **Nếu thấy response** → ✅ Server đã chạy!

---

## 📱 Update Mobile App

1. **File:** `src/config/api.config.ts`
   ```typescript
   const PRODUCTION_API_URL = 'https://mobile-note-api.onrender.com';
   ```

2. **Rebuild app:**
   ```bash
   npx react-native run-android
   # hoặc
   npx react-native run-ios
   ```

---

## ⚠️ Lưu ý

### Render Free Tier:
- ✅ Chạy 24/7
- ✅ Có URL public
- ⚠️ Sleep sau 15 phút không dùng → Request đầu tiên sẽ chậm (~30 giây)
- ⚠️ Có thể upgrade lên Starter ($7/tháng) để không sleep

### Nếu muốn không sleep:
- Upgrade lên **Starter plan** ($7/tháng)
- Hoặc dùng **Railway** (có free credit)

---

## 🔄 Update Code

Mỗi khi update code:

```bash
git add .
git commit -m "Update code"
git push origin main
```

Render sẽ **tự động deploy** lại!

---

## 🆘 Troubleshooting

### Server không chạy?

1. Check **Logs** trong Render Dashboard
2. Đảm bảo `Start Command` đúng: `node database.js`
3. Check PORT đã được set: `const PORT = process.env.PORT || 3000;`

### Lỗi Firebase?

- Check file JSON đã được commit hoặc Environment Variable đã set
- Check logs trong Render Dashboard

### URL không truy cập được?

- Đợi 5-10 phút sau khi deploy
- Check service status trong Dashboard (phải là "Live")

---

## 📋 Checklist

- [ ] Code đã push lên GitHub
- [ ] Đã tạo Web Service trên Render
- [ ] Đã deploy thành công
- [ ] Đã test URL trong browser
- [ ] Đã setup Firebase (file hoặc env variable)
- [ ] Đã update `PRODUCTION_API_URL` trong app
- [ ] Đã rebuild mobile app
- [ ] Đã test trên nhiều thiết bị

---

## 🎯 Kết quả

Sau khi hoàn thành:
- ✅ Server chạy 24/7 tại: `https://mobile-note-api.onrender.com`
- ✅ Có thể truy cập từ mọi nơi
- ✅ Nhiều thiết bị có thể dùng cùng lúc
- ✅ Miễn phí (hoặc $7/tháng nếu muốn không sleep)


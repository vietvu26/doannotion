# 🚀 Deploy Server - Có URL Public 24/7

## ⚡ Quick Start (5 phút)

### Bước 1: Update database.js

Chạy script tự động:
```bash
node UPDATE_DATABASE_FOR_DEPLOY.js
```

Hoặc update thủ công:
1. **Update PORT** (dòng 70):
   ```javascript
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, function() {
       console.log(`Server running on port ${PORT}`);
   });
   ```

2. **Update Firebase** (dòng 15) - Xem file `UPDATE_DATABASE_FOR_DEPLOY.js` để biết code mới

### Bước 2: Push lên GitHub

```bash
git add .
git commit -m "Ready for deploy"
git push origin main
```

### Bước 3: Deploy trên Render

1. Vào: https://render.com
2. Sign up với GitHub
3. **New** → **Web Service**
4. Connect repo
5. Settings:
   - **Start Command:** `node database.js`
6. Click **Create**
7. Đợi 5-10 phút
8. Copy URL: `https://your-app.onrender.com`

### Bước 4: Setup Firebase (nếu dùng Environment Variable)

1. Convert JSON → String:
   ```powershell
   Get-Content notion-task-d035f-firebase-adminsdk-fbsvc-afe9d9d4d0.json | Out-String
   ```

2. Vào Render → Environment → Add:
   - Key: `FIREBASE_SERVICE_ACCOUNT`
   - Value: (paste string)

3. Redeploy

### Bước 5: Update App

File: `src/config/api.config.ts`
```typescript
const PRODUCTION_API_URL = 'https://your-app.onrender.com';
```

---

## ✅ Kết quả

- ✅ Server chạy 24/7
- ✅ URL public: `https://your-app.onrender.com`
- ✅ Nhiều thiết bị truy cập được

---

Xem `HUONG_DAN_DEPLOY.md` để biết chi tiết!


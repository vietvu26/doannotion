/**
 * Script để update database.js cho deploy
 * Chạy: node UPDATE_DATABASE_FOR_DEPLOY.js
 * 
 * Script này sẽ:
 * 1. Update PORT để hỗ trợ Render/Railway
 * 2. Update Firebase để hỗ trợ Environment Variable
 */

const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, 'database.js');

// Đọc file
let content = fs.readFileSync(databasePath, 'utf8');

// 1. Update PORT
const oldPort = "app.listen(3000, function() {\n    console.log('Node server running @ http://localhost:3000');\n});";
const newPort = "// Lấy PORT từ environment variable (cho Render/Railway) hoặc dùng 3000 (local)\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, function() {\n    console.log(`Node server running @ http://localhost:${PORT}`);\n});";

if (content.includes("app.listen(3000")) {
    content = content.replace(/app\.listen\(3000[^}]*\}\);/s, newPort);
    console.log('✅ Đã update PORT');
} else {
    console.log('⚠️  Không tìm thấy app.listen(3000) - có thể đã được update');
}

// 2. Update Firebase Service Account
const oldFirebase = "var serviceAccount = require('./notion-task-d035f-firebase-adminsdk-fbsvc-afe9d9d4d0.json');";
const newFirebase = `// Hỗ trợ Firebase từ Environment Variable (cho Render) hoặc file local
var serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Dùng Environment Variable (cho Render/Railway)
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('✅ Firebase: Using Environment Variable');
  } else {
    // Dùng file local (cho development)
    serviceAccount = require('./notion-task-d035f-firebase-adminsdk-fbsvc-afe9d9d4d0.json');
    console.log('✅ Firebase: Using local file');
  }
} catch (error) {
  console.error('❌ Error loading Firebase service account:', error.message);
  serviceAccount = null;
}`;

if (content.includes("var serviceAccount = require('./notion-task-d035f-firebase-adminsdk-fbsvc-afe9d9d4d0.json');")) {
    // Tìm và thay thế phần khởi tạo Firebase
    const firebaseInitPattern = /var firebaseInitialized = false;\s*try\s*\{[^}]*var serviceAccount = require\([^;]+\);[^}]*admin\.initializeApp\([^}]*\}\);[^}]*firebaseInitialized = true;[^}]*catch[^}]*firebaseInitialized = false;[^}]*\}/s;
    
    if (firebaseInitPattern.test(content)) {
        const newFirebaseInit = `var firebaseInitialized = false;
try {
  ${newFirebase}
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
  } else {
    firebaseInitialized = false;
  }
} catch (error) {
  console.error('Lỗi khởi tạo Firebase Admin SDK:', error.message);
  firebaseInitialized = false;
}`;
        
        content = content.replace(firebaseInitPattern, newFirebaseInit);
        console.log('✅ Đã update Firebase Service Account');
    } else {
        console.log('⚠️  Không tìm thấy pattern Firebase - cần update thủ công');
    }
} else {
    console.log('⚠️  Firebase đã được update hoặc có cấu trúc khác');
}

// Lưu file
fs.writeFileSync(databasePath, content, 'utf8');

console.log('\n✅ Hoàn thành! File database.js đã được update.');
console.log('\n📝 Next steps:');
console.log('   1. Test server local: node database.js');
console.log('   2. Push code lên GitHub');
console.log('   3. Deploy lên Render (xem HUONG_DAN_DEPLOY.md)');


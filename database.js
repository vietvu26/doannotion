var mysql = require('mysql2');
var express = require('express');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var admin = require('firebase-admin');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var app = express();

// Khởi tạo Firebase Admin SDK
var firebaseInitialized = false;
try {
  var serviceAccount = require('./notion-task-d035f-firebase-adminsdk-fbsvc-afe9d9d4d0.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  firebaseInitialized = true;
} catch (error) {
  console.error('Lỗi khởi tạo Firebase Admin SDK:', error.message);
  firebaseInitialized = false;
}

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cấu hình multer để upload file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadDir = path.join(__dirname, 'uploads', 'comment-attachments');
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique: timestamp + random + extension
    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    var ext = path.extname(file.originalname);
    cb(null, 'attachment-' + uniqueSuffix + ext);
  }
});

var upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ducvietvu26@gmail.com',
    pass: 'ikvgzswljykdhzqm'
  }
});

app.listen(3000, function() {
    console.log('Node server running @ http://localhost:3000');
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "26122003",
  database: "notion_db"
});

con.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database with ID: ' + con.threadId);
});

// API: Test gửi FCM notification
app.post('/api/test-fcm', function (req, res) {
  const { email, title, body } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email là bắt buộc'
    });
  }

  if (!firebaseInitialized) {
    return res.status(500).json({
      success: false,
      error: 'Firebase Admin SDK chưa được khởi tạo. Kiểm tra service account key.'
    });
  }

  // Lấy FCM token từ database
  const getFcmTokenSql = "SELECT fcm_token FROM user WHERE email = ? AND fcm_token IS NOT NULL AND fcm_token != ''";
  con.query(getFcmTokenSql, [email], function(err, results) {
    if (err) {
      console.error('Error getting FCM token:', err);
      return res.status(500).json({
        success: false,
        error: 'Lỗi lấy FCM token: ' + err.message
      });
    }

    if (results.length === 0 || !results[0].fcm_token) {
      return res.status(400).json({
        success: false,
        error: `User ${email} không có FCM token. Vui lòng đăng nhập lại để lưu FCM token.`
      });
    }

    const fcmToken = results[0].fcm_token;

    const message = {
      notification: {
        title: title || 'Test Notification',
        body: body || 'Đây là thông báo test từ Firebase',
      },
      data: {
        type: 'test',
        deepLink: 'mobilenote://home',
      },
      token: fcmToken,
      android: {
        priority: 'high',
      },
    };

    admin.messaging().send(message)
      .then((response) => {
        res.status(200).json({
          success: true,
          message: 'Đã gửi test notification thành công',
          messageId: response
        });
      })
      .catch((error) => {
        let errorMessage = 'Không thể gửi notification';
        if (error.code === 'messaging/invalid-registration-token') {
          errorMessage = 'FCM token không hợp lệ. User cần đăng nhập lại để lấy token mới.';
        } else if (error.code === 'messaging/registration-token-not-registered') {
          errorMessage = 'FCM token đã hết hạn. User cần đăng nhập lại.';
        } else {
          errorMessage = error.message || 'Unknown error';
        }

        res.status(500).json({
          success: false,
          error: errorMessage,
          errorCode: error.code
        });
      });
  });
});

// API: Thêm cột fcm_token vào bảng user (nếu chưa có)
app.post('/api/add-fcm-token-column', function (req, res) {
  const checkColumnSql = `
    SELECT COUNT(*) as count 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'notion_db' 
    AND TABLE_NAME = 'user' 
    AND COLUMN_NAME = 'fcm_token'
  `;
  
  con.query(checkColumnSql, function(err, results) {
    if (err) {
      console.error('Error checking fcm_token column: ' + err.stack);
      return res.status(500).json({
        success: false,
        error: 'Lỗi kiểm tra cột fcm_token'
      });
    }
    
    if (results.length > 0 && results[0].count > 0) {
      return res.status(200).json({
        success: true,
        message: 'Cột fcm_token đã tồn tại trong bảng user'
      });
    }
    
    // Cột chưa tồn tại, thêm vào
    const alterTableSql = "ALTER TABLE user ADD COLUMN fcm_token TEXT NULL";
    con.query(alterTableSql, function(alterErr) {
      if (alterErr) {
        console.error('Error adding fcm_token column: ' + alterErr.stack);
        return res.status(500).json({
          success: false,
          error: 'Lỗi thêm cột fcm_token: ' + alterErr.message
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Đã thêm cột fcm_token vào bảng user thành công'
      });
    });
  });
});

// API: Lấy tất cả users
app.get('/user', function (req, res) {
  var sql = "SELECT * FROM user";
  con.query(sql, function(err, results) {
    if (err) {
      console.error('Query error: ' + err.stack);
      res.status(500).send('Error retrieving data');
      return;
    }
    res.send(results);
  });
});

// API: Lấy thông tin user theo ID
app.get('/api/user/:id', function (req, res) {
  const userId = req.params.id;
  var sql = "SELECT id, email, phone, name, createdAt, avatar FROM user WHERE id = ?";
  con.query(sql, [userId], function(err, results) {
    if (err) {
      console.error('Query error: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Error retrieving user data' 
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      user: results[0]
    });
  });
});

// API: Cập nhật avatar của user
app.put('/api/user/:id/avatar', function (req, res) {
  const userId = req.params.id;
  const { avatar } = req.body;
  
  if (!avatar) {
    return res.status(400).json({ 
      success: false,
      error: 'Avatar data is required' 
    });
  }

  const checkUserSql = "SELECT id FROM user WHERE id = ?";
  con.query(checkUserSql, [userId], function(err, results) {
    if (err) {
      console.error('Error checking user: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Error checking user' 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    const updateSql = "UPDATE user SET avatar = ? WHERE id = ?";
    con.query(updateSql, [avatar, userId], function(err, result) {
      if (err) {
        console.error('Error updating avatar: ' + err.stack);
        if (err.code === 'ER_BAD_FIELD_ERROR') {
          const alterSql = "ALTER TABLE user ADD COLUMN avatar LONGTEXT";
          con.query(alterSql, function(alterErr) {
            if (alterErr) {
              console.error('Error adding avatar column: ' + alterErr.stack);
              return res.status(500).json({ 
                success: false,
                error: 'Error adding avatar column' 
              });
            }
            con.query(updateSql, [avatar, userId], function(retryErr, retryResult) {
              if (retryErr) {
                console.error('Error updating avatar after adding column: ' + retryErr.stack);
                return res.status(500).json({ 
                  success: false,
                  error: 'Error updating avatar' 
                });
              }
              res.status(200).json({ 
                success: true,
                message: 'Avatar updated successfully',
                avatar: avatar
              });
            });
          });
        } else if (err.code === 'ER_DATA_TOO_LONG') {
          const alterSql = "ALTER TABLE user MODIFY COLUMN avatar LONGTEXT";
          con.query(alterSql, function(alterErr) {
            if (alterErr) {
              console.error('Error altering avatar column: ' + alterErr.stack);
              return res.status(500).json({ 
                success: false,
                error: 'Error altering avatar column. Please run: ALTER TABLE user MODIFY COLUMN avatar LONGTEXT;' 
              });
            }
            con.query(updateSql, [avatar, userId], function(retryErr, retryResult) {
              if (retryErr) {
                console.error('Error updating avatar after altering column: ' + retryErr.stack);
                return res.status(500).json({ 
                  success: false,
                  error: 'Error updating avatar' 
                });
              }
              res.status(200).json({ 
                success: true,
                message: 'Avatar updated successfully',
                avatar: avatar
              });
            });
          });
        } else {
          return res.status(500).json({ 
            success: false,
            error: 'Error updating avatar: ' + err.message 
          });
        }
      } else {
        res.status(200).json({ 
          success: true,
          message: 'Avatar updated successfully',
          avatar: avatar
        });
      }
    });
  });
});

// API: Xóa avatar của user
app.delete('/api/user/:id/avatar', function (req, res) {
  const userId = req.params.id;
  const updateSql = "UPDATE user SET avatar = NULL WHERE id = ?";
  con.query(updateSql, [userId], function(err, result) {
    if (err) {
      console.error('Error removing avatar: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Error removing avatar' 
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Avatar removed successfully'
    });
  });
});

// API: Lấy tất cả notions
app.get('/notion', function (req, res) {
  var sql = "SELECT * FROM NotionFile";
  con.query(sql, function(err, results) {
    if (err) {
      console.error('Query error: ' + err.stack);
      res.status(500).send('Error retrieving data');
      return;
    }
    res.send(results);
  });
});

// API: Lấy notion theo ID (cho deeplink)
app.get('/api/notion-by-id/:notionId', function (req, res) {
  const notionId = req.params.notionId;
  
  if (!notionId) {
    return res.status(400).json({ 
      success: false,
      error: 'NotionId is required' 
    });
  }

  const notionIdNum = parseInt(notionId, 10);
  if (isNaN(notionIdNum)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid notionId format. Must be a number.' 
    });
  }

  var sql = "SELECT id, title, description, coverPhoto, content, type, authorId, icon, parentFileId, `order`, createdAt, updatedAt FROM NotionFile WHERE id = ?";
  con.query(sql, [notionIdNum], function(err, results) {
    if (err) {
      console.error('Error querying notion by ID: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Error retrieving notion data' 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Notion not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      data: results[0]
    });
  });
});

// API: Lấy notions theo authorId
app.get('/api/notion/:authorId', function (req, res) {
  const authorId = req.params.authorId;
  
  if (!authorId) {
    return res.status(400).json({ 
      success: false,
      error: 'AuthorId is required' 
    });
  }

  const authorIdNum = parseInt(authorId, 10);
  if (isNaN(authorIdNum)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid authorId format. Must be a number.' 
    });
  }

  var sql = "SELECT * FROM NotionFile WHERE authorId = ? ORDER BY `order` ASC";
  con.query(sql, [authorIdNum], function(err, results) {
    if (err) {
      console.error('Query error: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Error retrieving data: ' + err.message 
      });
    }
    res.status(200).json({ 
      success: true,
      data: results 
    });
  });
});

// API: Thêm user mới
app.post('/api/add-user', function (req, res) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  var sql = "INSERT INTO user (name, email) VALUES (?, ?)";
  con.query(sql, [name, email], function(err, result) {
    if (err) {
      console.error('Insert error: ' + err.stack);
      res.status(500).send('Error adding user');
      return;
    }
    res.status(201).send('User added successfully');
  });
});

// API: Thêm notion mới
app.post('/api/add-notion', (req, res) => {
  const { title, description, coverPhoto, content, type, authorId, icon, parentFileId } = req.body;

  if (!title || !authorId) {
    return res.status(400).json({ error: 'Missing required fields: title and authorId are required' });
  }

  const getMaxOrderSql = 'SELECT COALESCE(MAX(`order`), 0) AS maxOrder FROM NotionFile';
  con.query(getMaxOrderSql, (err, result) => {
    if (err) {
      console.error('Error fetching max order:', err.stack);
      return res.status(500).json({ error: 'Failed to fetch max order' });
    }

    const nextOrder = result[0].maxOrder + 1;

    const sql = `
      INSERT INTO NotionFile 
      (title, description, coverPhoto, content, type, authorId, icon, parentFileId, \`order\`) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      title || '',
      description || null,
      coverPhoto || null,
      content || '',
      type || '',
      authorId,
      icon || 'file-text-outline',
      parentFileId ?? null,
      nextOrder,
    ];

    con.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting notion:', err.stack);
        return res.status(500).json({ error: 'Failed to add notion' });
      }

      res.status(201).json({
        id: result.insertId,
        title,
        description: description || null,
        coverPhoto: coverPhoto || null,
        content: content || '',
        type: type || '',
        authorId,
        icon: icon || 'file-text-outline',
        parentFileId: parentFileId ?? null,
        order: nextOrder,
      });
    });
  });
});

// API: Cập nhật thứ tự (order) của notions
app.post('/api/update-order', function (req, res) {
  const { updates, authorId } = req.body;
  const updateArray = Array.isArray(req.body) ? req.body : updates;

  if (!Array.isArray(updateArray)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid data format. Expected array of {id, order} or object with updates array and authorId' 
    });
  }

  const finalAuthorId = Array.isArray(req.body) ? (req.query.authorId || req.headers['x-author-id']) : authorId;

  if (!finalAuthorId) {
    return res.status(400).json({ 
      success: false,
      error: 'AuthorId is required' 
    });
  }

  const updatePromises = updateArray.map(({ id, order }) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE NotionFile SET `order` = ? WHERE id = ? AND authorId = ?';
      con.query(sql, [order, id, finalAuthorId], function (err, result) {
        if (err) {
          console.error(`Error updating id ${id}: ` + err.stack);
          return reject(err);
        }
        resolve(result);
      });
    });
  });

  Promise.all(updatePromises)
    .then(() => res.status(200).json({ 
      success: true,
      message: 'Order updated successfully' 
    }))
    .catch((err) => res.status(500).json({ 
      success: false,
      error: 'Error updating order' 
    }));
});

// API: Xóa notion
app.delete('/api/delete-notion/:id', function (req, res) {
  const id = req.params.id;
  const sql = 'DELETE FROM NotionFile WHERE id = ?';
  con.query(sql, [id], function (err, result) {
    if (err) {
      console.error('Delete error: ' + err.stack);
      res.status(500).send('Error deleting notion');
      return;
    }
    res.status(200).send('Notion deleted successfully');
  });
});

// API: Cập nhật notion (có kiểm tra quyền edit)
app.put('/api/update-notion/:id', (req, res) => {
  const {id} = req.params;
  const {title, content, userId} = req.body; // Thêm userId để kiểm tra quyền
  
  // Kiểm tra quyền edit nếu có userId
  if (userId) {
    const notionIdNum = parseInt(id, 10);
    const userIdNum = parseInt(userId, 10);
    
    // Kiểm tra xem user có phải là author không
    const checkAuthorSql = "SELECT authorId FROM NotionFile WHERE id = ?";
    con.query(checkAuthorSql, [notionIdNum], function(err, authorResults) {
      if (err) {
        console.error('Lỗi kiểm tra author:', err);
        return res.status(500).json({
          success: false,
          error: 'Không thể kiểm tra quyền sở hữu'
        });
      }

      if (authorResults.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Không tìm thấy notion'
        });
      }

      // Nếu user là author, cho phép update
      if (authorResults[0].authorId === userIdNum) {
        const sql = 'UPDATE NotionFile SET title=?, content=?, updatedAt = NOW() WHERE id = ?';
        con.query(sql, [title, content, id], (err, result) => {
          if(err){
            console.error('Update error:', err);
            return res.status(500).json({
              success: false,
              error: 'Error update notion'
            });
          }
          res.status(200).json({
            success: true,
            message: 'Notion updated successfully'
          });
        });
        return;
      }

      // Nếu không phải author, kiểm tra permission
      const getUserEmailSql = "SELECT email FROM user WHERE id = ?";
      con.query(getUserEmailSql, [userIdNum], function(err, userResults) {
        if (err || userResults.length === 0) {
          return res.status(403).json({
            success: false,
            error: 'Không có quyền chỉnh sửa notion này'
          });
        }

        const userEmail = userResults[0].email;
        const getPermissionSql = `
          SELECT permission 
          FROM notion_user 
          WHERE notionId = ? AND userEmail = ?
        `;

        con.query(getPermissionSql, [notionIdNum, userEmail], function(err, permissionResults) {
          if (err || permissionResults.length === 0 || permissionResults[0].permission !== 'full') {
            return res.status(403).json({
              success: false,
              error: 'Bạn chỉ có quyền xem notion này, không thể chỉnh sửa'
            });
          }

          // Có quyền full, cho phép update
          const sql = 'UPDATE NotionFile SET title=?, content=?, updatedAt = NOW() WHERE id = ?';
          con.query(sql, [title, content, id], (err, result) => {
            if(err){
              console.error('Update error:', err);
              return res.status(500).json({
                success: false,
                error: 'Error update notion'
              });
            }
            res.status(200).json({
              success: true,
              message: 'Notion updated successfully'
            });
          });
        });
      });
    });
  } else {
    // Nếu không có userId, cho phép update (tương thích với code cũ)
    const sql = 'UPDATE NotionFile SET title=?, content=?, updatedAt = NOW() WHERE id = ?';
    con.query(sql, [title, content, id], (err, result) => {
      if(err){
        console.error('Update error:', err);
        return res.status(500).json({
          success: false,
          error: 'Error update notion'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Notion updated successfully'
      });
    });
  }
});

const JWT_SECRET = 'your-secret-key-change-in-production';

// API: Đăng ký - gửi OTP qua email
app.post('/api/register', function (req, res) {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ 
      success: false,
      error: 'Email và số điện thoại là bắt buộc' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Email không hợp lệ' 
    });
  }

  const phoneRegex = /^0[3-9][0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      success: false,
      error: 'Số điện thoại không hợp lệ' 
    });
  }

  const checkEmailSql = "SELECT id FROM user WHERE email = ?";
  con.query(checkEmailSql, [email], function(err, results) {
    if (err) {
      console.error('Error checking email: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Lỗi kiểm tra email' 
      });
    }

    if (results.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.' 
      });
    }

    const checkPhoneSql = "SELECT id FROM user WHERE phone = ?";
    con.query(checkPhoneSql, [phone], function(err, phoneResults) {
      if (err) {
        console.error('Error checking phone: ' + err.stack);
        return res.status(500).json({ 
          success: false,
          error: 'Lỗi kiểm tra số điện thoại' 
        });
      }

      if (phoneResults.length > 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Số điện thoại này đã được sử dụng' 
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5);

      const createTempTableSql = `
        CREATE TABLE IF NOT EXISTS signup_temp (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(20) NOT NULL,
          otp VARCHAR(6) NULL,
          otpExpiry DATETIME NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          verifiedAt DATETIME NULL,
          INDEX idx_email (email),
          INDEX idx_otpExpiry (otpExpiry)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `;
      
      con.query(createTempTableSql, function(createTableErr) {
        if (createTableErr) {
          console.error('Error creating temp table: ' + createTableErr.stack);
          return res.status(500).json({ 
            success: false,
            error: 'Lỗi khởi tạo hệ thống. Vui lòng thử lại.' 
          });
        }

        const alterTableSql = `
          ALTER TABLE signup_temp 
          MODIFY COLUMN otp VARCHAR(6) NULL,
          MODIFY COLUMN otpExpiry DATETIME NULL
        `;
        
        con.query(alterTableSql, function(alterErr) {
          if (alterErr && alterErr.code !== 'ER_BAD_FIELD_ERROR') {
            // Ignore if column already correct
          }

          const addVerifiedAtSql = `
            ALTER TABLE signup_temp 
            ADD COLUMN verifiedAt DATETIME NULL
          `;
          con.query(addVerifiedAtSql, function(addColErr) {
            if (addColErr && addColErr.code !== 'ER_DUP_FIELDNAME' && addColErr.code !== 1060) {
              // Ignore if column already exists
            }

            const deleteOldSql = "DELETE FROM signup_temp WHERE email = ?";
            con.query(deleteOldSql, [email], function(deleteErr) {
              if (deleteErr) {
                console.error('Error deleting old record: ' + deleteErr.stack);
              }

              const insertTempSql = `
                INSERT INTO signup_temp (email, phone, otp, otpExpiry) 
                VALUES (?, ?, ?, ?)
              `;
              
              con.query(insertTempSql, [email, phone, otp, expiryTime], function(insertErr) {
                if (insertErr) {
                  console.error('Error inserting temp record: ' + insertErr.stack);
                  return res.status(500).json({ 
                    success: false,
                    error: 'Lỗi tạo mã OTP. Vui lòng thử lại.' 
                  });
                }

                sendSignupVerificationEmail(email, otp);
                res.status(200).json({ 
                  success: true,
                  message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email để xác thực.',
                });
              });
            });
          });
        });
      });
    });
  });
});

// API: Hoàn tất đăng ký - tạo mật khẩu sau khi verify OTP
app.post('/api/register-complete', function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Email và mật khẩu là bắt buộc' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Email không hợp lệ' 
    });
  }

  if (password.length < 5) {
    return res.status(400).json({ 
      success: false,
      error: 'Mật khẩu phải có ít nhất 5 ký tự' 
    });
  }

  const findTempSql = "SELECT email, phone, otp FROM signup_temp WHERE email = ?";
  con.query(findTempSql, [email], function(err, tempResults) {
    if (err) {
      console.error('Error finding temp record: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Lỗi kiểm tra thông tin đăng ký' 
      });
    }

    if (tempResults.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.' 
      });
    }

    const tempRecord = tempResults[0];

    if (tempRecord.otp !== null && tempRecord.otp !== undefined && tempRecord.otp !== '') {
      return res.status(400).json({ 
        success: false,
        error: 'Vui lòng xác thực OTP trước khi tạo mật khẩu.' 
      });
    }

    const phone = tempRecord.phone;

    const checkEmailSql = "SELECT id FROM user WHERE email = ?";
    con.query(checkEmailSql, [email], function(err, results) {
      if (err) {
        console.error('Error checking email: ' + err.stack);
        return res.status(500).json({ 
          success: false,
          error: 'Lỗi kiểm tra email' 
        });
      }

      if (results.length > 0) {
        const deleteTempSql = "DELETE FROM signup_temp WHERE email = ?";
        con.query(deleteTempSql, [email], function() {});
        
        return res.status(400).json({ 
          success: false,
          error: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.' 
        });
      }

      const checkPhoneSql = "SELECT id FROM user WHERE phone = ?";
      con.query(checkPhoneSql, [phone], function(err, phoneResults) {
        if (err) {
          console.error('Error checking phone: ' + err.stack);
          return res.status(500).json({ 
            success: false,
            error: 'Lỗi kiểm tra số điện thoại' 
          });
        }

        if (phoneResults.length > 0) {
          const deleteTempSql = "DELETE FROM signup_temp WHERE email = ?";
          con.query(deleteTempSql, [email], function() {});
          
          return res.status(400).json({ 
            success: false,
            error: 'Số điện thoại này đã được sử dụng' 
          });
        }

        bcrypt.hash(password, 10, function(err, hashedPassword) {
          if (err) {
            console.error('Error hashing password: ' + err.stack);
            return res.status(500).json({ 
              success: false,
              error: 'Lỗi mã hóa mật khẩu' 
            });
          }

          const insertSql = "INSERT INTO user (name, email, phone, password, passwordSet) VALUES (?, ?, ?, ?, 1)";
          const userName = email.split('@')[0];
          con.query(insertSql, [userName, email, phone, hashedPassword], function(err, result) {
            if (err) {
              console.error('Error inserting user: ' + err.stack);
              return res.status(500).json({ 
                success: false,
                error: 'Lỗi tạo tài khoản: ' + (err.sqlMessage || err.message) 
              });
            }

            const deleteTempSql = "DELETE FROM signup_temp WHERE email = ?";
            con.query(deleteTempSql, [email], function(deleteErr) {
              if (deleteErr) {
                console.error('Error deleting temp record: ' + deleteErr.stack);
              }

              res.status(201).json({ 
                success: true,
                message: 'Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.',
                userId: result.insertId 
              });
            });
          });
        });
      });
    });
  });
});

// API: Đặt mật khẩu cho user
app.post('/api/set-password', function (req, res) {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'UserId và mật khẩu là bắt buộc' 
    });
  }

  if (password.length < 5) {
    return res.status(400).json({ 
      success: false,
      error: 'Mật khẩu phải có ít nhất 5 ký tự' 
    });
  }

  const checkUserSql = "SELECT id FROM user WHERE id = ?";
  con.query(checkUserSql, [userId], function(err, results) {
    if (err) {
      console.error('Error checking user: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Lỗi kiểm tra user' 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Không tìm thấy user' 
      });
    }

    bcrypt.hash(password, 10, function(err, hashedPassword) {
      if (err) {
        console.error('Error hashing password: ' + err.stack);
        return res.status(500).json({ 
          success: false,
          error: 'Lỗi mã hóa mật khẩu' 
        });
      }

      const updateSql = "UPDATE user SET password = ?, passwordSet = 1, passwordUpdatedAt = NOW() WHERE id = ?";
      con.query(updateSql, [hashedPassword, userId], function(err, result) {
        if (err) {
          console.error('Error updating password: ' + err.stack);
          return res.status(500).json({ 
            success: false,
            error: 'Lỗi cập nhật mật khẩu' 
          });
        }

        res.status(200).json({ 
          success: true,
          message: 'Mật khẩu đã được tạo thành công',
          userId: userId 
        });
      });
    });
  });
});

// API: Đăng nhập (cập nhật FCM token nếu có)
app.post('/api/login', function (req, res) {
  const { email, password, fcmToken } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Email và mật khẩu là bắt buộc' 
    });
  }

  const findUserSql = "SELECT id, email, phone, password, passwordSet, name FROM user WHERE email = ?";
  con.query(findUserSql, [email], function(err, results) {
    if (err) {
      console.error('Error finding user: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Lỗi đăng nhập' 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Email hoặc mật khẩu không đúng' 
      });
    }

    const user = results[0];

    if (!user.passwordSet || !user.password) {
      return res.status(401).json({ 
        success: false,
        error: 'Tài khoản chưa được kích hoạt. Vui lòng tạo mật khẩu trước.' 
      });
    }

    bcrypt.compare(password, user.password, function(err, isMatch) {
      if (err) {
        console.error('Error comparing password: ' + err.stack);
        return res.status(500).json({ 
          success: false,
          error: 'Lỗi xác thực mật khẩu' 
        });
      }

      if (!isMatch) {
        return res.status(401).json({ 
          success: false,
          error: 'Email hoặc mật khẩu không đúng' 
        });
      }

      // Cập nhật FCM token nếu có
      if (fcmToken && fcmToken.trim() !== '') {
        const updateFcmTokenSql = "UPDATE user SET fcm_token = ? WHERE id = ?";
        con.query(updateFcmTokenSql, [fcmToken, user.id], function(fcmErr) {
          if (fcmErr) {
            console.error('Lỗi cập nhật FCM token:', fcmErr);
          }
        });
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({ 
        success: true,
        message: 'Đăng nhập thành công',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name || user.email.split('@')[0]
        }
      });
    });
  });
});

// API: Cập nhật FCM token cho user
app.post('/api/update-fcm-token', function (req, res) {
  const { userId, fcmToken } = req.body;

  if (!userId || !fcmToken) {
    return res.status(400).json({
      success: false,
      error: 'userId và fcmToken là bắt buộc'
    });
  }

  const updateFcmTokenSql = "UPDATE user SET fcm_token = ? WHERE id = ?";
  con.query(updateFcmTokenSql, [fcmToken, userId], function(err, result) {
    if (err) {
      console.error('Lỗi cập nhật FCM token: ' + err.stack);
      return res.status(500).json({
        success: false,
        error: 'Không thể cập nhật FCM token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'FCM token đã được cập nhật thành công'
    });
  });
});

// API: Gửi OTP qua email
app.post('/api/send-otp-email', function (req, res) {
  const { email, otp, phone } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const mailOptions = {
    from: 'ducvietvu26@gmail.com',
    to: email,
    subject: 'Mã OTP xác thực tài khoản',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Xác thực tài khoản</h2>
        <p>Xin chào,</p>
        <p>Bạn đã đăng ký tài khoản với email <strong>${email}</strong>.</p>
        <p>Mã OTP của bạn là:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #7C3AED; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>.</p>
        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">Đây là email tự động, vui lòng không trả lời.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to send email',
        message: error.message 
      });
    } else {
      res.status(200).json({ 
        success: true,
        message: 'OTP đã được gửi đến email của bạn',
        messageId: info.messageId 
      });
    }
  });
});

// API: Quên mật khẩu - gửi OTP reset password
app.post('/api/forgot-password', function (req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false,
      error: 'Email là bắt buộc' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Email không hợp lệ' 
    });
  }

  const findUserSql = "SELECT id, email FROM user WHERE email = ?";
  con.query(findUserSql, [email], function(err, results) {
    if (err) {
      console.error('Error finding user: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Lỗi kiểm tra email' 
      });
    }

    if (results.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email chưa được đăng ký' 
      });
    }

    const user = results[0];

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15);

    const updateOtpSql = `
      UPDATE user 
      SET resetOTP = ?, resetOTPExpiry = ? 
      WHERE id = ?
    `;
    
    con.query(updateOtpSql, [otp, expiryTime, user.id], function(err, result) {
      if (err) {
        if (err.code === 'ER_BAD_FIELD_ERROR') {
          const alterTableSql = `
            ALTER TABLE user 
            ADD COLUMN resetOTP VARCHAR(6) NULL,
            ADD COLUMN resetOTPExpiry DATETIME NULL
          `;
          
          con.query(alterTableSql, function(alterErr) {
            if (alterErr) {
              console.error('Error adding columns: ' + alterErr.stack);
              return res.status(500).json({ 
                success: false,
                error: 'Error setting up password reset. Please contact support.' 
              });
            }
            
            con.query(updateOtpSql, [otp, expiryTime, user.id], function(retryErr) {
              if (retryErr) {
                console.error('Error updating OTP: ' + retryErr.stack);
                return res.status(500).json({ 
                  success: false,
                  error: 'Lỗi tạo mã OTP' 
                });
              }
              
              sendPasswordResetEmail(email, otp);
              res.status(200).json({ 
                success: true,
                message: 'Mã OTP đã được gửi đến email của bạn' 
              });
            });
          });
        } else {
          console.error('Error updating OTP: ' + err.stack);
          return res.status(500).json({ 
            success: false,
            error: 'Lỗi tạo mã OTP' 
          });
        }
      } else {
        sendPasswordResetEmail(email, otp);
        res.status(200).json({ 
          success: true,
          message: 'Mã OTP đã được gửi đến email của bạn' 
        });
      }
    });
  });
});

// API: Đặt lại mật khẩu sau khi verify OTP
app.post('/api/reset-password', function (req, res) {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ 
      success: false,
      error: 'Email, OTP và mật khẩu mới là bắt buộc' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Email không hợp lệ' 
    });
  }

  if (newPassword.length < 5) {
    return res.status(400).json({ 
      success: false,
      error: 'Mật khẩu phải có ít nhất 5 ký tự' 
    });
  }

  const findUserSql = "SELECT id, email, resetOTP, resetOTPExpiry FROM user WHERE email = ?";
  con.query(findUserSql, [email], function(err, results) {
    if (err) {
      console.error('Error finding user: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Lỗi xác thực' 
      });
    }

    if (results.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email không tồn tại' 
      });
    }

    const user = results[0];

    if (!user.resetOTP) {
      return res.status(400).json({ 
        success: false,
        error: 'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu mã mới.' 
      });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ 
        success: false,
        error: 'Mã OTP không đúng' 
      });
    }

    const now = new Date();
    const expiryTime = new Date(user.resetOTPExpiry);
    
    if (now > expiryTime) {
      return res.status(400).json({ 
        success: false,
        error: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.' 
      });
    }

    bcrypt.hash(newPassword, 10, function(hashErr, hashedPassword) {
      if (hashErr) {
        console.error('Error hashing password: ' + hashErr.stack);
        return res.status(500).json({ 
          success: false,
          error: 'Lỗi tạo mật khẩu mới' 
        });
      }

      const updatePasswordSql = `
        UPDATE user 
        SET password = ?, passwordSet = 1, resetOTP = NULL, resetOTPExpiry = NULL 
        WHERE id = ?
      `;
      
      con.query(updatePasswordSql, [hashedPassword, user.id], function(updateErr) {
        if (updateErr) {
          console.error('Error updating password: ' + updateErr.stack);
          return res.status(500).json({ 
            success: false,
            error: 'Lỗi cập nhật mật khẩu' 
          });
        }

        res.status(200).json({ 
          success: true,
          message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.' 
        });
      });
    });
  });
});

function sendPasswordResetEmail(email, otp) {
  const mailOptions = {
    from: 'ducvietvu26@gmail.com',
    to: email,
    subject: 'Mã OTP đặt lại mật khẩu',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Đặt lại mật khẩu</h2>
        <p>Xin chào,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản với email <strong>${email}</strong>.</p>
        <p>Mã OTP của bạn là:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #7C3AED; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>Mã OTP này sẽ hết hạn sau <strong>15 phút</strong>.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">Đây là email tự động, vui lòng không trả lời.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending password reset email:', error);
    }
  });
}

function sendSignupVerificationEmail(email, otp) {
  const mailOptions = {
    from: 'ducvietvu26@gmail.com',
    to: email,
    subject: 'Mã OTP xác thực đăng ký tài khoản',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Xác thực đăng ký tài khoản</h2>
        <p>Xin chào,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản với email <strong>${email}</strong>.</p>
        <p>Mã OTP xác thực của bạn là:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #7C3AED; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>.</p>
        <p>Vui lòng nhập mã OTP này để tiếp tục đăng ký tài khoản của bạn.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">Đây là email tự động, vui lòng không trả lời.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending signup verification email:', error);
    }
  });
}

// API: Xác thực OTP đăng ký
app.post('/api/verify-signup-otp', function (req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ 
      success: false,
      error: 'Email và OTP là bắt buộc' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Email không hợp lệ' 
    });
  }

  const findTempSql = "SELECT email, phone, otp, otpExpiry FROM signup_temp WHERE email = ?";
  con.query(findTempSql, [email], function(err, results) {
    if (err) {
      console.error('Error finding temp record: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Lỗi xác thực' 
      });
    }

    if (results.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.' 
      });
    }

    const tempRecord = results[0];

    if (tempRecord.otp !== otp) {
      return res.status(400).json({ 
        success: false,
        error: 'Mã OTP không đúng' 
      });
    }

    const now = new Date();
    const expiryTime = new Date(tempRecord.otpExpiry);
    
    if (now > expiryTime) {
      return res.status(400).json({ 
        success: false,
        error: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.' 
      });
    }

    const updateTempSql = `
      UPDATE signup_temp 
      SET otp = NULL, otpExpiry = NULL, verifiedAt = NOW()
      WHERE email = ?
    `;
    
    con.query(updateTempSql, [email], function(updateErr) {
      if (updateErr) {
        console.error('Error updating temp record: ' + updateErr.stack);
      }
      
      res.status(200).json({ 
        success: true,
        message: 'Xác thực email thành công. Vui lòng tạo mật khẩu.',
        email: tempRecord.email,
        phone: tempRecord.phone
      });
    });
  });
});

// API: Gửi lại OTP đăng ký
app.post('/api/resend-signup-otp', function (req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false,
      error: 'Email là bắt buộc' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Email không hợp lệ' 
    });
  }

  const findTempSql = "SELECT email, phone FROM signup_temp WHERE email = ?";
  con.query(findTempSql, [email], function(err, results) {
    if (err) {
      console.error('Error finding temp record: ' + err.stack);
      return res.status(500).json({ 
        success: false,
        error: 'Lỗi kiểm tra email' 
      });
    }

    if (results.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.' 
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);

    const updateOtpSql = `
      UPDATE signup_temp 
      SET otp = ?, otpExpiry = ? 
      WHERE email = ?
    `;
    
    con.query(updateOtpSql, [otp, expiryTime, email], function(updateErr) {
      if (updateErr) {
        console.error('Error updating OTP: ' + updateErr.stack);
        return res.status(500).json({ 
          success: false,
          error: 'Lỗi tạo mã OTP' 
        });
      }

      sendSignupVerificationEmail(email, otp);
      res.status(200).json({ 
        success: true,
        message: 'Mã OTP mới đã được gửi đến email của bạn' 
      });
    });
  });
});

// API: Mời người dùng và gửi email/FCM notification với deeplink
app.post('/api/invite-users', function (req, res) {
  const { notionId, emails, permission, inviterName, notionTitle } = req.body;

  if (!notionId || !emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'NotionId và emails là bắt buộc'
    });
  }

  // Validate emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  for (const email of emails) {
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: `Email không hợp lệ: ${email}`
      });
    }
  }

  // Tạo deeplink: mobilenote://notion/:notionId (lowercase để nhất quán)
  const deepLink = `mobilenote://notion/${notionId}`;
  const permissionText = permission === 'full' ? 'Truy cập đầy đủ' : 
                         permission === 'comment' ? 'Có thể bình luận' : 
                         'Có thể xem';
  const inviterDisplayName = inviterName || 'Ai đó';
  const notionDisplayTitle = notionTitle || 'một trang';

  // Tạo nội dung notification
  const notificationTitle = `${inviterDisplayName} đã mời bạn xem trang`;
  const notificationBody = `"${notionDisplayTitle}" với quyền ${permissionText}`;

  // Tạo bảng notion_user nếu chưa tồn tại
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS notion_user (
      id INT AUTO_INCREMENT PRIMARY KEY,
      notionId INT NOT NULL,
      userEmail VARCHAR(255) NOT NULL,
      permission ENUM('full', 'comment', 'view') NOT NULL DEFAULT 'view',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_notion_user (notionId, userEmail),
      FOREIGN KEY (notionId) REFERENCES NotionFile(id) ON DELETE CASCADE
    )
  `;
      con.query(createTableSql, function(err) {
        if (err) {
          console.error('Lỗi tạo bảng notion_user:', err);
        }
      });

  // Xử lý từng email: gửi cả email và FCM notification
  const invitePromises = emails.map((email) => {
    return new Promise((resolve, reject) => {
      // Lưu thông tin chia sẻ vào bảng notion_user
      const insertSharedSql = `
        INSERT INTO notion_user (notionId, userEmail, permission)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE permission = VALUES(permission)
      `;
      con.query(insertSharedSql, [notionId, email, permission], function(err) {
        if (err) {
          console.error(`Lỗi lưu thông tin chia sẻ cho ${email}:`, err);
        }
      });
      
      // Gửi email
      const mailOptions = {
        from: 'ducvietvu26@gmail.com',
        to: email,
        subject: `${inviterDisplayName} đã mời bạn xem "${notionDisplayTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7C3AED;">Bạn được mời xem trang</h2>
            <p>Xin chào,</p>
            <p><strong>${inviterDisplayName}</strong> đã mời bạn xem trang <strong>"${notionDisplayTitle}"</strong> với quyền <strong>${permissionText}</strong>.</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 10px 0;">Nhấn vào nút bên dưới để mở trang:</p>
              <a href="${deepLink}" style="display: inline-block; background-color: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0;">
                Mở trang
              </a>
            </div>
            <p>Hoặc sao chép và dán liên kết sau vào trình duyệt hoặc ứng dụng:</p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; font-family: monospace;">${deepLink}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">Đây là email tự động, vui lòng không trả lời.</p>
          </div>
        `
      };

      const sendEmailPromise = new Promise((emailResolve, emailReject) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            emailReject(error);
          } else {
            emailResolve(info);
          }
        });
      });

      // Gửi FCM notification nếu có token
      const sendFCMPromise = new Promise((fcmResolve) => {
        const getFcmTokenSql = "SELECT fcm_token FROM user WHERE email = ? AND fcm_token IS NOT NULL AND fcm_token != ''";
        con.query(getFcmTokenSql, [email], function(err, results) {
          if (err) {
            console.error(`Lỗi lấy FCM token cho ${email}:`, err);
            fcmResolve({ skipped: true });
            return;
          }

          if (results.length === 0 || !results[0].fcm_token) {
            fcmResolve({ skipped: true });
            return;
          }

          const fcmToken = results[0].fcm_token;
          
          if (!firebaseInitialized) {
            fcmResolve({ skipped: true, reason: 'Firebase not initialized' });
            return;
          }

          // Gửi data-only message để đảm bảo background handler được gọi
          // Background handler sẽ hiển thị notification bằng notifee
          // Foreground handler cũng sẽ nhận được và hiển thị bằng notifee
          const message = {
            data: {
              notionId: notionId.toString(),
              deepLink: deepLink,
              type: 'invite',
              title: notificationTitle, // Thêm vào data để hiển thị
              body: notificationBody,   // Thêm vào data để hiển thị
            },
            token: fcmToken,
            android: {
              priority: 'high',
            },
            apns: {
              payload: {
                aps: {
                  sound: 'default',
                  badge: 1,
                  'content-available': 1,
                },
              },
            },
          };

          admin.messaging().send(message)
            .then((response) => {
              fcmResolve({ success: true });
            })
            .catch((error) => {
              fcmResolve({ skipped: true, reason: error.message });
            });
        });
      });

      // Chờ cả email và FCM
      Promise.allSettled([sendEmailPromise, sendFCMPromise])
        .then((results) => {
          const emailResult = results[0];
          const fcmResult = results[1];
          
          if (emailResult.status === 'fulfilled') {
            resolve({
              email: email,
              emailSent: true,
              fcmSent: fcmResult.status === 'fulfilled' && fcmResult.value.success === true
            });
          } else {
            reject({
              email: email,
              error: emailResult.reason
            });
          }
        });
    });
  });

  // Gửi tất cả invitations
  Promise.allSettled(invitePromises)
    .then((results) => {
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      const fcmSent = results
        .filter(r => r.status === 'fulfilled' && r.value.fcmSent)
        .length;

      if (failed === 0) {
        res.status(200).json({
          success: true,
          message: `Đã gửi lời mời đến ${successful} người dùng${fcmSent > 0 ? ` (${fcmSent} thông báo push)` : ''}`,
          emailSent: successful,
          fcmSent: fcmSent
        });
      } else {
        res.status(207).json({
          success: true,
          message: `Đã gửi lời mời đến ${successful} người dùng${fcmSent > 0 ? ` (${fcmSent} thông báo push)` : ''}, ${failed} thất bại`,
          emailSent: successful,
          fcmSent: fcmSent,
          failed: failed
        });
      }
    })
    .catch((error) => {
      console.error('Lỗi gửi invitations:', error);
      res.status(500).json({
        success: false,
        error: 'Không thể gửi lời mời. Vui lòng thử lại.'
      });
    });
});
// API: Gửi FCM notification theo email
app.post('/api/send-notification', function (req, res) {
  const { email, title, body, notionId, deepLink } = req.body;

  if (!email || !title || !body) {
    return res.status(400).json({
      success: false,
      error: 'email, title, body là bắt buộc'
    });
  }

  // Lấy FCM token từ database theo email
  const getFcmTokenSql = "SELECT fcm_token FROM user WHERE email = ? AND fcm_token IS NOT NULL AND fcm_token != ''";
  con.query(getFcmTokenSql, [email], function(err, results) {
    if (err) {
      console.error(`Error getting FCM token for ${email}:`, err);
      return res.status(500).json({
        success: false,
        error: 'Không thể lấy FCM token'
      });
    }

    if (results.length === 0 || !results[0].fcm_token) {
      return res.status(200).json({
        success: true,
        message: 'User không có FCM token, bỏ qua notification'
      });
    }

    const fcmToken = results[0].fcm_token;
    const finalDeepLink = deepLink || (notionId ? `mobilenote://notion/${notionId}` : 'mobilenote://home');

    if (!firebaseInitialized) {
      return res.status(500).json({
        success: false,
        error: 'Firebase Admin SDK chưa được khởi tạo'
      });
    }

    // Gửi data-only FCM notification để đảm bảo background handler được gọi
    const message = {
      data: {
        notionId: notionId ? notionId.toString() : '',
        deepLink: finalDeepLink,
        type: 'invite',
        title: title, // Thêm vào data để hiển thị
        body: body,   // Thêm vào data để hiển thị
      },
      token: fcmToken,
      android: {
        priority: 'high',
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            'content-available': 1,
          },
        },
      },
    };

    admin.messaging().send(message)
      .then((response) => {
        res.status(200).json({
          success: true,
          message: 'Đã gửi thông báo thành công',
          messageId: response
        });
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          error: 'Không thể gửi thông báo: ' + (error.message || 'Unknown error')
        });
      });
  });
});
// API: Lấy các notion đã được chia sẻ với user
app.get('/api/shared-notions/:userId', function (req, res) {
  const userId = parseInt(req.params.userId);
  
  if (!userId || isNaN(userId)) {
    return res.status(400).json({
      success: false,
      error: 'UserId không hợp lệ'
    });
  }

  // Lấy email của user
  const getUserEmailSql = "SELECT email FROM user WHERE id = ?";
  con.query(getUserEmailSql, [userId], function(err, userResults) {
    if (err) {
      console.error('Lỗi lấy email user:', err);
      return res.status(500).json({
        success: false,
        error: 'Không thể lấy thông tin user'
      });
    }

    if (userResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy user'
      });
    }

    const userEmail = userResults[0].email;

    // Lấy các notion đã được chia sẻ với user này
    // Giả sử có bảng notion_user với cấu trúc: notionId, userEmail, permission
    // Nếu chưa có bảng, sẽ tạo sau. Tạm thời trả về empty array
    const getSharedNotionsSql = `
      SELECT DISTINCT nf.* 
      FROM NotionFile nf
      INNER JOIN notion_user nu ON nf.id = nu.notionId
      WHERE nu.userEmail = ? AND nu.permission IS NOT NULL
      ORDER BY nf.id DESC
    `;

    con.query(getSharedNotionsSql, [userEmail], function(err, results) {
      if (err) {
        return res.status(200).json({
          success: true,
          data: []
        });
      }

      res.status(200).json({
        success: true,
        data: results
      });
    });
  });
});

// API: Lấy permission của user với notion cụ thể
app.get('/api/notion-permission/:notionId/:userId', function (req, res) {
  const notionId = parseInt(req.params.notionId);
  const userId = parseInt(req.params.userId);
  
  if (!notionId || isNaN(notionId) || !userId || isNaN(userId)) {
    return res.status(400).json({
      success: false,
      error: 'NotionId và UserId không hợp lệ'
    });
  }

  // Lấy email của user
  const getUserEmailSql = "SELECT email FROM user WHERE id = ?";
  con.query(getUserEmailSql, [userId], function(err, userResults) {
    if (err) {
      console.error('Lỗi lấy email user:', err);
      return res.status(500).json({
        success: false,
        error: 'Không thể lấy thông tin user'
      });
    }

    if (userResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy user'
      });
    }

    const userEmail = userResults[0].email;

    // Kiểm tra xem user có phải là author của notion không
    const checkAuthorSql = "SELECT authorId FROM NotionFile WHERE id = ?";
    con.query(checkAuthorSql, [notionId], function(err, authorResults) {
      if (err) {
        console.error('Lỗi kiểm tra author:', err);
        return res.status(500).json({
          success: false,
          error: 'Không thể kiểm tra quyền sở hữu'
        });
      }

      if (authorResults.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Không tìm thấy notion'
        });
      }

      // Nếu user là author, trả về permission 'full'
      if (authorResults[0].authorId === userId) {
        return res.status(200).json({
          success: true,
          permission: 'full',
          canEdit: true
        });
      }

      // Nếu không phải author, kiểm tra trong bảng notion_user
      const getPermissionSql = `
        SELECT permission 
        FROM notion_user 
        WHERE notionId = ? AND userEmail = ?
      `;

      con.query(getPermissionSql, [notionId, userEmail], function(err, permissionResults) {
        if (err) {
          return res.status(200).json({
            success: true,
            permission: 'view',
            canEdit: false
          });
        }

        if (permissionResults.length === 0) {
          // Không có permission, trả về null (không có quyền truy cập)
          return res.status(200).json({
            success: true,
            permission: null,
            canEdit: false
          });
        }

        const permission = permissionResults[0].permission;
        const canEdit = permission === 'full';

        res.status(200).json({
          success: true,
          permission: permission,
          canEdit: canEdit
        });
      });
    });
  });
});

// API: Upload file attachment cho comment
app.post('/api/upload-comment-attachment', upload.single('file'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'Không có file được upload'
    });
  }

  // Trả về relative path, frontend sẽ tự thêm base URL
  var fileUrl = `/uploads/comment-attachments/${req.file.filename}`;
  
  res.status(200).json({
    success: true,
    fileUrl: fileUrl,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    fileType: req.file.mimetype
  });
});

// Serve static files từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API: Lưu comment (có thể kèm attachments)
app.post('/api/notion-comments', function (req, res) {
  const { notionId, userId, content, attachments } = req.body;

  if (!notionId || !userId) {
    return res.status(400).json({
      success: false,
      error: 'NotionId và UserId là bắt buộc'
    });
  }

  // Kiểm tra nếu không có content và không có attachments
  if ((!content || !content.trim()) && (!attachments || attachments.length === 0)) {
    return res.status(400).json({
      success: false,
      error: 'Content hoặc Attachments là bắt buộc'
    });
  }

  // Lấy thông tin user
  const getUserSql = "SELECT id, name, email, avatar FROM user WHERE id = ?";
  con.query(getUserSql, [userId], function(err, userResults) {
    if (err) {
      console.error('Lỗi lấy thông tin user:', err);
      return res.status(500).json({
        success: false,
        error: 'Không thể lấy thông tin user'
      });
    }

    if (userResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy user'
      });
    }

    const user = userResults[0];

    // Lưu comment vào database
    const insertCommentSql = `
      INSERT INTO notion_comment (notionId, userId, content)
      VALUES (?, ?, ?)
    `;
    
    con.query(insertCommentSql, [notionId, userId, (content || '').trim()], function(err, result) {
      if (err) {
        console.error('Lỗi lưu comment:', err);
        return res.status(500).json({
          success: false,
          error: 'Không thể lưu comment: ' + err.message
        });
      }

      const commentId = result.insertId;

      // Lưu attachments nếu có
      if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        const insertAttachmentSql = `
          INSERT INTO notion_comment_attachment (commentId, fileName, fileUrl, fileType, fileSize)
          VALUES ?
        `;
        
        const attachmentValues = attachments.map(att => [
          commentId,
          att.fileName,
          att.fileUrl,
          att.fileType,
          att.fileSize || null
        ]);
        
        con.query(insertAttachmentSql, [attachmentValues], function(err) {
          if (err) {
            console.error('Lỗi lưu attachments:', err);
          }
          fetchCommentWithAttachments(commentId, res);
        });
      } else {
        // Nếu không có attachments, lấy comment ngay
        fetchCommentWithAttachments(commentId, res);
      }
    });
  });
});

// Hàm helper để lấy comment với attachments
function fetchCommentWithAttachments(commentId, res) {
  const getCommentSql = `
    SELECT 
      nc.id,
      nc.notionId,
      nc.userId,
      nc.content,
      nc.createdAt,
      u.name as userName,
      u.email as userEmail,
      u.avatar as userAvatar
    FROM notion_comment nc
    INNER JOIN user u ON nc.userId = u.id
    WHERE nc.id = ?
  `;
  
  con.query(getCommentSql, [commentId], function(err, commentResults) {
    if (err) {
      console.error('Lỗi lấy comment:', err);
      return res.status(500).json({
        success: false,
        error: 'Không thể lấy comment vừa tạo'
      });
    }

    if (commentResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy comment vừa tạo'
      });
    }

    const comment = commentResults[0];
    
    let userName = comment.userName;
    if (!userName && comment.userEmail) {
      userName = comment.userEmail.split('@')[0];
    }
    if (!userName) {
      userName = 'User';
    }

    // Lấy attachments của comment
    const getAttachmentsSql = `
      SELECT id, fileName, fileUrl, fileType, fileSize
      FROM notion_comment_attachment
      WHERE commentId = ?
      ORDER BY createdAt ASC
    `;
    
    con.query(getAttachmentsSql, [commentId], function(err, attachmentResults) {
      if (err) {
        console.error('Lỗi lấy attachments:', err);
      }
      
      const commentAttachments = (attachmentResults || []).map(att => ({
        id: att.id,
        fileName: att.fileName,
        fileUrl: att.fileUrl,
        fileType: att.fileType,
        fileSize: att.fileSize
      }));
      
      res.status(201).json({
        success: true,
        comment: {
          id: comment.id,
          notionId: comment.notionId,
          userId: comment.userId,
          userName: userName,
          userAvatar: comment.userAvatar || null,
          content: comment.content,
          createdAt: comment.createdAt,
          attachments: commentAttachments
        }
      });
    });
  });
}

// API: Lấy danh sách comments của một notion (kèm attachments)
app.get('/api/notion-comments/:notionId', function (req, res) {
  const notionId = parseInt(req.params.notionId, 10);

  if (isNaN(notionId)) {
    return res.status(400).json({
      success: false,
      error: 'NotionId không hợp lệ'
    });
  }

  // Lấy danh sách comments
  const getCommentsSql = `
    SELECT 
      nc.id,
      nc.notionId,
      nc.userId,
      nc.content,
      nc.createdAt,
      u.name as userName,
      u.email as userEmail,
      u.avatar as userAvatar
    FROM notion_comment nc
    INNER JOIN user u ON nc.userId = u.id
    WHERE nc.notionId = ?
    ORDER BY nc.createdAt DESC
  `;
  
  con.query(getCommentsSql, [notionId], function(err, results) {
    if (err) {
      console.error('Lỗi lấy comments:', err);
      // Nếu bảng không tồn tại hoặc lỗi, trả về danh sách rỗng
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(200).json({
          success: true,
          comments: []
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Không thể lấy comments: ' + err.message
      });
    }

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        comments: []
      });
    }

    // Lấy tất cả comment IDs
    const commentIds = results.map(c => c.id);
    
    // Lấy attachments cho tất cả comments
    const getAttachmentsSql = `
      SELECT id, commentId, fileName, fileUrl, fileType, fileSize
      FROM notion_comment_attachment
      WHERE commentId IN (${commentIds.join(',')})
      ORDER BY createdAt ASC
    `;
    
    con.query(getAttachmentsSql, function(err, attachmentResults) {
      if (err) {
        console.error('Lỗi lấy attachments:', err);
      }
      
      // Tạo map attachments theo commentId
      const attachmentsMap = {};
      (attachmentResults || []).forEach(att => {
        if (!attachmentsMap[att.commentId]) {
          attachmentsMap[att.commentId] = [];
        }
        attachmentsMap[att.commentId].push({
          id: att.id,
          fileName: att.fileName,
          fileUrl: att.fileUrl,
          fileType: att.fileType,
          fileSize: att.fileSize
        });
      });

      const comments = results.map(comment => {
        let userName = comment.userName;
        if (!userName && comment.userEmail) {
          userName = comment.userEmail.split('@')[0];
        }
        if (!userName) {
          userName = 'User';
        }
        
        return {
          id: comment.id,
          notionId: comment.notionId,
          userId: comment.userId,
          userName: userName,
          userAvatar: comment.userAvatar || null,
          content: comment.content,
          createdAt: comment.createdAt,
          attachments: attachmentsMap[comment.id] || []
        };
      });

      res.status(200).json({
        success: true,
        comments: comments
      });
    });
  });
});

// API: Xóa comment (chỉ comment author hoặc notion owner mới được xóa)
app.delete('/api/notion-comments/:commentId', function (req, res) {
  const commentId = parseInt(req.params.commentId, 10);
  const { userId } = req.body; // UserId để kiểm tra quyền xóa

  if (isNaN(commentId)) {
    return res.status(400).json({
      success: false,
      error: 'CommentId không hợp lệ'
    });
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'UserId là bắt buộc để kiểm tra quyền xóa'
    });
  }

  // Kiểm tra xem comment có tồn tại và user có quyền xóa không
  const checkCommentSql = `
    SELECT nc.userId, nc.notionId, nf.authorId
    FROM notion_comment nc
    LEFT JOIN NotionFile nf ON nc.notionId = nf.id
    WHERE nc.id = ?
  `;
  
  con.query(checkCommentSql, [commentId], function(err, results) {
    if (err) {
      console.error('Lỗi kiểm tra comment:', err);
      return res.status(500).json({
        success: false,
        error: 'Không thể kiểm tra comment: ' + err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy comment'
      });
    }

    const comment = results[0];
    const userIdNum = parseInt(userId, 10);

    // Kiểm tra quyền: chỉ cho phép xóa nếu user là người tạo comment hoặc là owner của notion
    if (comment.userId !== userIdNum && comment.authorId !== userIdNum) {
      return res.status(403).json({
        success: false,
        error: 'Bạn không có quyền xóa comment này'
      });
    }

    // Xóa comment
    const deleteCommentSql = `DELETE FROM notion_comment WHERE id = ?`;
    
    con.query(deleteCommentSql, [commentId], function(err, result) {
      if (err) {
        console.error('Lỗi xóa comment:', err);
        return res.status(500).json({
          success: false,
          error: 'Không thể xóa comment: ' + err.message
        });
      }

      res.status(200).json({
        success: true,
        message: 'Đã xóa comment thành công'
      });
    });
  });
});

app.use(function(err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

app.use(function(req, res) {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found: ' + req.method + ' ' + req.path
  });
});

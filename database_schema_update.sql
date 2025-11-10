-- Cập nhật bảng User để hỗ trợ đăng ký/đăng nhập
-- Chạy file SQL này trong MySQL để cập nhật cấu trúc bảng

-- Thêm cột phone nếu chưa có
ALTER TABLE User 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20) NULL AFTER email;

-- Thêm cột password nếu chưa có
ALTER TABLE User 
ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL AFTER phone;

-- Thêm cột passwordSet (0 = chưa set, 1 = đã set)
ALTER TABLE User 
ADD COLUMN IF NOT EXISTS passwordSet TINYINT(1) DEFAULT 0 AFTER password;

-- Thêm cột passwordUpdatedAt
ALTER TABLE User 
ADD COLUMN IF NOT EXISTS passwordUpdatedAt DATETIME NULL AFTER passwordSet;

-- Thêm cột createdAt nếu chưa có
ALTER TABLE User 
ADD COLUMN IF NOT EXISTS createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Tạo index cho email để tìm kiếm nhanh hơn
CREATE INDEX IF NOT EXISTS idx_email ON User(email);

-- Tạo index cho phone để tìm kiếm nhanh hơn
CREATE INDEX IF NOT EXISTS idx_phone ON User(phone);


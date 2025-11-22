# Giải thích cơ chế setTimeout trong hệ thống Reminder

## 📋 Tổng quan

Thay vì **polling** (kiểm tra database liên tục mỗi 10 giây), hệ thống sử dụng **setTimeout** để lên lịch gửi notification đúng thời điểm. Điều này giảm đáng kể số lượng query vào database.

---

## 🔧 Các thành phần chính

### 1. **Map lưu trữ timers** (dòng 85)
```javascript
var reminderTimers = new Map();
```

**Mục đích:**
- Lưu trữ mapping giữa `reminderId` và `timeoutId` (ID của setTimeout)
- Cho phép hủy timer khi cần (ví dụ: user thay đổi reminder)

**Cấu trúc:**
```
Map {
  reminderId_1 => timeoutId_12345,
  reminderId_2 => timeoutId_12346,
  ...
}
```

---

### 2. **Function: scheduleReminder()** (dòng 160-182)

Đây là **function chính** để lên lịch reminder.

#### **Bước 1: Hủy reminder cũ (nếu có)**
```javascript
cancelReminder(reminderId);
```
- Nếu user cập nhật reminder, cần hủy timer cũ trước khi tạo mới
- Tránh gửi notification 2 lần

#### **Bước 2: Tính toán thời gian delay**
```javascript
const reminderDateTime = new Date(reminderDate);  // Thời gian cần gửi
const now = new Date();                            // Thời gian hiện tại
const delay = reminderDateTime.getTime() - now.getTime();  // Khoảng cách (milliseconds)
```

**Ví dụ:**
- Bây giờ: `2024-01-15 10:00:00`
- Reminder: `2024-01-15 14:30:00`
- Delay: `(14:30 - 10:00) = 4.5 giờ = 16,200,000 ms`

#### **Bước 3: Kiểm tra nếu đã quá hạn**
```javascript
if (delay <= 0) {
  // Gửi ngay lập tức
  sendReminderNotification(...);
  return;
}
```

#### **Bước 4: Tạo setTimeout**
```javascript
const timeoutId = setTimeout(function() {
  sendReminderNotification(reminderId, taskId, fcmToken, taskName);
}, delay);
```

**Cách hoạt động:**
- `setTimeout` nhận 2 tham số:
  1. **Callback function**: Code sẽ chạy sau khi hết delay
  2. **Delay (ms)**: Số milliseconds cần đợi
- Node.js sẽ **tự động** gọi callback sau đúng `delay` milliseconds
- **Không cần** phải query database để kiểm tra

#### **Bước 5: Lưu timeoutId vào Map**
```javascript
reminderTimers.set(reminderId, timeoutId);
```
- Lưu để có thể hủy sau này nếu cần

---

### 3. **Function: sendReminderNotification()** (dòng 88-147)

Function này được gọi **tự động** khi setTimeout hết hạn.

#### **Luồng xử lý:**

```
setTimeout hết hạn
    ↓
Gọi sendReminderNotification()
    ↓
Gửi FCM notification
    ↓
Cập nhật status trong database
    ↓
Xóa timer khỏi Map
```

**Chi tiết:**
1. Kiểm tra Firebase đã khởi tạo chưa
2. Tạo FCM message với deepLink
3. Gửi notification qua Firebase
4. **Nếu thành công:**
   - Update `status = 'sent'` trong database
   - Xóa timer khỏi Map: `reminderTimers.delete(reminderId)`
5. **Nếu thất bại:**
   - Update `status = 'failed'` trong database
   - Xóa timer khỏi Map

---

### 4. **Function: cancelReminder()** (dòng 150-157)

Hủy một reminder đã được schedule.

```javascript
function cancelReminder(reminderId) {
  const timeoutId = reminderTimers.get(reminderId);  // Lấy timeoutId từ Map
  if (timeoutId) {
    clearTimeout(timeoutId);  // Hủy setTimeout
    reminderTimers.delete(reminderId);  // Xóa khỏi Map
  }
}
```

**Khi nào cần hủy:**
- User thay đổi thời gian reminder
- User xóa reminder
- Task bị xóa

---

### 5. **Function: loadAndSchedulePendingReminders()** (dòng 185-232)

**Vấn đề:** Khi server restart, tất cả `setTimeout` sẽ bị mất!

**Giải pháp:** Load lại tất cả reminder pending từ database và schedule lại.

#### **Luồng xử lý:**

```
Server khởi động
    ↓
Database kết nối thành công
    ↓
Đợi 2 giây (để Firebase khởi tạo)
    ↓
Query database: SELECT * FROM task_reminder WHERE status = 'pending'
    ↓
Với mỗi reminder:
    - Tính delay = reminder_date - NOW()
    - Gọi scheduleReminder()
    - Tạo setTimeout mới
```

**Query SQL:**
```sql
SELECT id, task_id, user_id, reminder_date, task_name, fcm_token
FROM task_reminder
WHERE status = 'pending'
AND reminder_date > NOW()  -- Chỉ lấy reminder chưa đến hạn
ORDER BY reminder_date ASC
```

---

## 🔄 So sánh: Polling vs setTimeout

### **Polling (cách cũ):**
```
Mỗi 10 giây:
  ↓
Query database: SELECT * FROM task_reminder WHERE status = 'pending' AND reminder_date <= NOW()
  ↓
Nếu có reminder → Gửi notification
  ↓
Đợi 10 giây → Lặp lại
```

**Nhược điểm:**
- Query database liên tục (6 queries/phút)
- Có thể bỏ sót nếu reminder đến giữa 2 lần kiểm tra
- Tốn tài nguyên server

### **setTimeout (cách mới):**
```
Khi tạo reminder:
  ↓
Tính delay = reminder_date - NOW()
  ↓
Tạo setTimeout(delay)
  ↓
Node.js tự động gọi callback đúng giờ
  ↓
Gửi notification
```

**Ưu điểm:**
- **Không cần** query database liên tục
- Gửi **chính xác** đúng giờ
- Tiết kiệm tài nguyên

---

## 📊 Ví dụ thực tế

### **Scenario 1: Tạo reminder mới**

**Thời điểm:** `2024-01-15 10:00:00`  
**Reminder:** `2024-01-15 14:30:00`

**Luồng xử lý:**

1. User tạo reminder → Gọi API `/api/task/:id/schedule-reminder`
2. Lưu vào database:
   ```sql
   INSERT INTO task_reminder (task_id, reminder_date, ...) VALUES (...)
   ```
3. Lấy `reminderId = 123`
4. Gọi `scheduleReminder(123, taskId, '2024-01-15 14:30:00', ...)`
5. Tính delay:
   ```
   delay = 14:30:00 - 10:00:00 = 4.5 giờ = 16,200,000 ms
   ```
6. Tạo setTimeout:
   ```javascript
   setTimeout(() => {
     sendReminderNotification(123, ...);
   }, 16200000);
   ```
7. Lưu vào Map:
   ```javascript
   reminderTimers.set(123, timeoutId_789);
   ```

**Sau 4.5 giờ (lúc 14:30:00):**
- Node.js tự động gọi callback
- `sendReminderNotification()` được thực thi
- Gửi FCM notification
- Update database: `status = 'sent'`
- Xóa khỏi Map: `reminderTimers.delete(123)`

---

### **Scenario 2: Server restart**

**Thời điểm:** `2024-01-15 12:00:00` (server restart)

**Database có:**
- Reminder 1: `reminder_date = 2024-01-15 14:30:00`, `status = 'pending'`
- Reminder 2: `reminder_date = 2024-01-15 16:00:00`, `status = 'pending'`

**Luồng xử lý:**

1. Server khởi động → Database kết nối
2. Đợi 2 giây → Gọi `loadAndSchedulePendingReminders()`
3. Query database → Lấy 2 reminders
4. **Reminder 1:**
   - Delay = `14:30:00 - 12:00:00 = 2.5 giờ = 9,000,000 ms`
   - `scheduleReminder()` → Tạo setTimeout 9,000,000 ms
5. **Reminder 2:**
   - Delay = `16:00:00 - 12:00:00 = 4 giờ = 14,400,000 ms`
   - `scheduleReminder()` → Tạo setTimeout 14,400,000 ms
6. Map được populate lại:
   ```javascript
   reminderTimers = Map {
     1 => timeoutId_111,
     2 => timeoutId_222
   }
   ```

**Kết quả:** Tất cả reminder được schedule lại, không bị mất!

---

### **Scenario 3: User thay đổi reminder**

**Thời điểm:** `2024-01-15 11:00:00`  
**Reminder cũ:** `2024-01-15 14:30:00` (đã được schedule)  
**Reminder mới:** `2024-01-15 15:00:00`

**Luồng xử lý:**

1. User cập nhật reminder → Gọi API
2. Database UPDATE: `reminder_date = '2024-01-15 15:00:00'`
3. Gọi `scheduleReminder(reminderId, ..., '2024-01-15 15:00:00', ...)`
4. **Bước đầu tiên:** `cancelReminder(reminderId)`
   - Lấy `timeoutId` từ Map
   - `clearTimeout(timeoutId)` → Hủy timer cũ
   - Xóa khỏi Map
5. Tính delay mới: `15:00:00 - 11:00:00 = 4 giờ`
6. Tạo setTimeout mới với delay 4 giờ
7. Lưu timeoutId mới vào Map

**Kết quả:** Reminder cũ bị hủy, reminder mới được schedule!

---

## ⚠️ Lưu ý quan trọng

### 1. **Giới hạn của setTimeout**
- JavaScript `setTimeout` có giới hạn delay tối đa: **2,147,483,647 ms** (~24.8 ngày)
- Nếu reminder xa hơn 24.8 ngày, cần xử lý đặc biệt (ví dụ: schedule lại khi gần đến hạn)

### 2. **Server restart**
- Khi server restart, tất cả `setTimeout` sẽ bị mất
- **Giải pháp:** `loadAndSchedulePendingReminders()` load lại từ database
- **Quan trọng:** Phải đảm bảo function này được gọi sau khi database và Firebase đã khởi tạo

### 3. **Memory usage**
- Mỗi setTimeout chiếm một ít memory
- Map lưu trữ rất nhẹ (chỉ lưu ID)
- Với hàng nghìn reminders vẫn không vấn đề

### 4. **Timezone**
- Sử dụng `new Date()` của JavaScript (theo timezone của server)
- Đảm bảo server và database cùng timezone

---

## 🎯 Tóm tắt

**Cơ chế setTimeout hoạt động như một "đồng hồ báo thức":**

1. **Khi tạo reminder:** Tính thời gian còn lại → Đặt "báo thức" (setTimeout)
2. **Khi đến giờ:** Node.js tự động "báo thức" → Gửi notification
3. **Khi server restart:** Load lại tất cả "báo thức" từ database → Đặt lại

**Kết quả:** 
- ✅ Không cần query database liên tục
- ✅ Gửi notification chính xác đúng giờ
- ✅ Tiết kiệm tài nguyên server


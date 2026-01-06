# Hướng dẫn cấu hình IP cho Android Emulator

## Vấn đề
Android emulator không thể truy cập `localhost` hoặc `127.0.0.1` của máy host. Cần sử dụng IP thực của máy tính.

## Giải pháp

### Bước 1: Tìm IP của máy tính

**Windows:**
```powershell
ipconfig
```
Tìm `IPv4 Address` trong phần `Wireless LAN adapter Wi-Fi` hoặc `Ethernet adapter`

**Hoặc dùng lệnh nhanh:**
```powershell
ipconfig | findstr /i "IPv4"
```

### Bước 2: Cập nhật file `.env`

Trong file `frontend/.env`, đảm bảo có:
```env
EXPO_PUBLIC_API_BASE=http://192.168.1.69:8080
```

**Thay `192.168.1.69` bằng IP thực của máy bạn.**

### Bước 3: Cập nhật CORS trong backend

Trong file `backend/cmd/api/main.go`, đảm bảo CORS cho phép IP của bạn:
```go
AllowOrigins: []string{
    "http://192.168.1.69:8081",
    "http://192.168.1.69:8082", 
    "http://192.168.1.69:19006",
    // ... các origin khác
}
```

### Bước 4: Restart services

1. **Restart backend:**
   ```bash
   cd backend
   go run cmd/api/main.go
   ```

2. **Restart frontend:**
   ```bash
   cd frontend
   npm start
   ```

## Lưu ý

- **Android Emulator**: Dùng IP thực (ví dụ: `192.168.1.69`)
- **iOS Simulator**: Có thể dùng `localhost` hoặc IP thực
- **Web**: Có thể dùng `localhost` hoặc IP thực
- **Thiết bị thật**: Phải dùng IP thực và cùng mạng WiFi

## Kiểm tra IP hiện tại

Chạy lệnh này để xem IP hiện tại:
```powershell
# Windows PowerShell
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"}).IPAddress
```


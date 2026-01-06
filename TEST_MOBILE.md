# Hướng dẫn Test trên Mobile

## Cách 1: Sử dụng Expo Go (Đơn giản nhất - Khuyến nghị)

### Bước 1: Cài đặt Expo Go trên điện thoại
- **Android**: Tải từ [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: Tải từ [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Bước 2: Chạy Expo Development Server
```bash
cd frontend
npm start
# hoặc
npx expo start
```

### Bước 3: Kết nối điện thoại
- **Quét QR code**: Mở Expo Go app và quét QR code hiển thị trong terminal
- **Hoặc nhấn phím**:
  - Nhấn `a` để mở trên Android emulator (nếu có)
  - Nhấn `i` để mở trên iOS simulator (nếu có Mac)
  - Nhấn `w` để mở trên web

### Lưu ý:
- Điện thoại và máy tính phải cùng mạng WiFi
- Hoặc sử dụng tunnel mode: `npx expo start --tunnel` (chậm hơn nhưng hoạt động qua internet)

---

## Cách 2: Android Emulator

### Yêu cầu:
- Cài đặt [Android Studio](https://developer.android.com/studio)
- Tạo Android Virtual Device (AVD)

### Chạy:
```bash
cd frontend
npm run android
# hoặc
npx expo start --android
```

---

## Cách 3: iOS Simulator (Chỉ trên Mac)

### Yêu cầu:
- Mac với Xcode đã cài đặt
- iOS Simulator

### Chạy:
```bash
cd frontend
npm run ios
# hoặc
npx expo start --ios
```

---

## Cách 4: Development Build (Cho production-like testing)

Nếu Expo Go không hỗ trợ một số native modules, bạn cần build development client:

```bash
# Android
npx expo run:android

# iOS (Mac only)
npx expo run:ios
```

---

## Troubleshooting

### Lỗi kết nối:
1. Đảm bảo điện thoại và máy tính cùng mạng WiFi
2. Thử dùng tunnel: `npx expo start --tunnel`
3. Kiểm tra firewall không chặn port 8081

### Lỗi "Unable to resolve module":
- Xóa cache: `npx expo start --clear`
- Xóa node_modules và cài lại: `rm -rf node_modules && npm install`

### Lỗi trên Android Emulator:
- Đảm bảo emulator đã khởi động
- Kiểm tra Android SDK và tools đã cài đặt đầy đủ


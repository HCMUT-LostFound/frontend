import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { uploadImageToSupabase } from '../services/uploadImage';
import { useAuth } from '@clerk/clerk-expo';
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE

function parseDDMMYYYY(input: string): Date | null {
  const [dd, mm, yyyy] = input.split('/');
  if (!dd || !mm || !yyyy) return null;

  const day = Number(dd);
  const month = Number(mm) - 1;
  const year = Number(yyyy);

  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return null;

  return date;
}

const ReportMissingItem = () => {
  const router = useRouter();
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [building, setBuilding] = useState('CS1');
  const [dateLost, setDateLost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

 const availableTags = [
  // Loại đồ vật phổ biến
  'Ba lô',
  'Túi xách',
  'Ví tiền',
  'Điện thoại',
  'Laptop',
  'Tai nghe',
  'Sạc pin',
  'Bình nước',
  'Ô (dù)',
  'Chìa khóa',
  'Thẻ sinh viên',
  'Sách vở',
  'Áo khoác',
  'Mũ nón',
  'Kính mắt',

  // Màu sắc
  'Đen',
  'Trắng',
  'Xanh',
  'Đỏ',
  'Xám',
  'Nâu',
  'Hồng',

  // Chất liệu / Đặc điểm
  'Da',
  'Vải',
  'Nhựa',
  'Kim loại',

  // Vị trí (mới thêm)
  'Thư viện',
  'Thư viện Tạ Quang Bửu',
  'Căng tin',
  'Nhà ăn sinh viên',
  'Ký túc xá',
  'KTX Khu A',
  'KTX Khu B',
  'Giảng đường',
  'Tòa nhà H1',
  'Tòa nhà H2',
  'Tòa nhà H3',
  'Tòa nhà H6',
  'Sân bóng đá',
  'Sân thể thao',
  'Bể bơi',
  'Khu tự học',
  'Cổng chính',
  'Phòng thí nghiệm',
  'Hành lang',
].sort()

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần cấp quyền', 'Vui lòng cho phép truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (images.length < 5) {
        setImages([...images, result.assets[0].uri]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const { getToken } = useAuth();

  const handleSubmit = async () => {
    if (!itemName || !description || !location || !dateLost) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      setIsLoading(true);
      const uploadedUrls =
        images.length > 0
          ? await Promise.all(images.map(uri => uploadImageToSupabase(uri)))
          : [];

      const parsedDate = parseDDMMYYYY(dateLost);
      if (!parsedDate) {
        Alert.alert('Lỗi ngày', 'Vui lòng nhập ngày theo định dạng dd/mm/yyyy');
        setIsLoading(false);
        return;
      }

      const lostAtISO = parsedDate.toISOString();

      const payload = {
        type: 'lost',
        title: itemName,
        imageUrls: uploadedUrls,
        location: location,
        campus: building,
        lostAt: lostAtISO,
        tags: selectedTags,
        description: description,
      };

      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Request failed');
      }

      Alert.alert('Thành công', 'Báo cáo của bạn đã được gửi!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không gửi được báo cáo');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý chọn ngày
  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setDateLost(formatDate(currentDate));
    }
  };

  const confirmDate = () => {
    setDateLost(formatDate(date));
    setShowDatePicker(false);
  };

  const cancelDate = () => {
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Báo cáo đồ thất lạc</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
          contentInset={{ bottom: 0 }}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.formContainer}>
            {/* Description */}
            <Text style={styles.subtitle}>
              Vui lòng cung cấp thông tin chi tiết để giúp tìm lại đồ của bạn.
            </Text>

          {/* Tên món đồ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên món đồ</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Bình nước, ..."
              placeholderTextColor="#718096"
              value={itemName}
              onChangeText={setItemName}
            />
          </View>

          {/* Mô tả chi tiết */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả chi tiết</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả chi tiết màu sắc, hình dáng, tình trạng, ..."
              placeholderTextColor="#718096"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* Hình ảnh (nếu có) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hình ảnh (nếu có)</Text>

            {images.length === 0 ? (
              <TouchableOpacity style={styles.uploadBox} onPress={handleChoosePhoto}>
                <Ionicons name="cloud-upload-outline" size={40} color="#718096" />
                <Text style={styles.uploadText}>Nhấn để tải ảnh lên</Text>
                <Text style={styles.uploadSubtext}>PNG, JPG (Tối đa 5MB)</Text>
              </TouchableOpacity>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageList}>
                {images.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.uploadedImage} />
                    <TouchableOpacity
                      style={styles.removeImageBtn}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#EDF2F7" />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 5 && (
                  <TouchableOpacity style={styles.addMoreButton} onPress={handleChoosePhoto}>
                    <Ionicons name="add" size={32} color="#718096" />
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>

          {/* Vị trí nhìn thấy lần cuối */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vị trí nhìn thấy lần cuối</Text>
            <View style={styles.locationRow}>
              <TextInput
                style={[styles.input, styles.locationInput]}
                placeholder="Ví dụ: H1-101, Thư viện, ..."
                placeholderTextColor="#718096"
                value={location}
                onChangeText={setLocation}
              />
              <View style={styles.buildingDropdown}>
                <Text style={styles.buildingText}>{building}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#000000" />
              </View>
            </View>
          </View>

          {/* Thời điểm bị mất */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thời điểm bị mất</Text>
            <View style={styles.dateInputWrapper}>
              <TouchableOpacity
                style={styles.input}
                activeOpacity={0.7}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: dateLost ? '#000' : '#718096' }}>
                  {dateLost || 'Chọn ngày'}
                </Text>
              </TouchableOpacity>
              <MaterialIcons
                name="calendar-today"
                size={20}
                color="#718096"
                style={styles.calendarIcon}
              />
            </View>
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags</Text>
            <Text style={styles.tagSubtitle}>
              Thêm các thẻ tags về món đồ giúp người khác tìm kiếm dễ dàng hơn
            </Text>

            <TouchableOpacity
              style={styles.tagDropdown}
              onPress={() => setShowTagDropdown(!showTagDropdown)}
            >
              <Text style={styles.tagDropdownText}>
                {selectedTags.length > 0 ? `Đã chọn ${selectedTags.length} tags` : 'Chọn các tags phù hợp'}
              </Text>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#000000" />
            </TouchableOpacity>

            {selectedTags.length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {selectedTags.map((tag, index) => (
                  <View key={index} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {showTagDropdown && (
              <View style={styles.tagDropdownList}>
                {availableTags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tagOption}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={styles.tagOptionText}>{tag}</Text>
                    {selectedTags.includes(tag) && (
                      <Ionicons name="checkmark" size={20} color="#2B6CB0" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button - cố định ở dưới cùng */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Đang gửi...' : 'Gửi báo cáo'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal cho iOS */}
      {showDatePicker && Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
                themeVariant="light"
                accentColor="#2B6CB0"
                style={styles.datePickerStyle}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={cancelDate}>
                  <Text style={styles.modalButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={confirmDate}>
                  <Text style={[styles.modalButtonText, { color: '#2B6CB0' }]}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker cho Android */}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar"
          onChange={onChangeDate}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  tagSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EDF2F7',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#718096',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  imageList: {
    marginTop: 12,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  addMoreButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EDF2F7',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  locationInput: {
    flex: 1,
  },
  buildingDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 80,
  },
  buildingText: {
    fontSize: 14,
    color: '#000000',
  },
  dateInputWrapper: {
    position: 'relative',
  },
  calendarIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  tagDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagDropdownText: {
    fontSize: 14,
    color: '#718096',
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagChipText: {
    fontSize: 12,
    color: '#2D3748',
  },
  tagDropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  tagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  tagOptionText: {
    fontSize: 14,
    color: '#000000',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  submitButton: {
    backgroundColor: '#2B6CB0',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: 420,
    alignItems: 'center',
  },
  datePickerStyle: {
    width: '100%',
    height: 300,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  modalButton: {
    padding: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#718096',
    fontWeight: '600',
  },
});

export default ReportMissingItem;
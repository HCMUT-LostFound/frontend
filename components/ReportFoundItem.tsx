import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ReportFoundItem = () => {
  const router = useRouter();
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [building, setBuilding] = useState('CS1');
  const [dateFound, setDateFound] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const availableTags = ['Ba lô', 'Da', 'Nâu', 'Đen', 'Xanh', 'Đỏ', 'Laptop', 'Điện thoại'];

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

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần cấp quyền', 'Vui lòng cho phép truy cập camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
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

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    if (!itemName || !description || !location || !dateFound) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Thành công', 'Báo cáo của bạn đã được gửi!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Báo cáo đồ nhặt được</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Description */}
          <Text style={styles.subtitle}>
            Vui lòng cung cấp thông tin chi tiết để giúp tìm lại chủ sở hữu.
          </Text>

          {/* Thêm ảnh món đồ (Bắt buộc) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thêm ảnh món đồ (Bắt buộc)</Text>

            {images.length === 0 ? (
              <View style={styles.photoUploadBox}>
                <View style={styles.cameraIconCircle}>
                  <Ionicons name="camera" size={32} color="#2B6CB0" />
                </View>
                <Text style={styles.photoUploadText}>
                  Tải lên hình ảnh rõ ràng về món đồ bạn đã nhặt được
                </Text>
                <Text style={styles.photoUploadSubtext}>PNG, JPG (Tối đa 5MB)</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto}>
                  <Text style={styles.uploadButtonText}>Tải ảnh lên</Text>
                </TouchableOpacity>
              </View>
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
              <TextInput
                style={styles.input}
                placeholder="dd/mm/yyyy"
                placeholderTextColor="#718096"
                value={dateFound}
                onChangeText={setDateFound}
              />
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
              Thêm các thẻ tags về món đồ giúp người khác tìm kiếm dễ đẵng hơn
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

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {selectedTags.map((tag, index) => (
                  <View key={index} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Tag Dropdown List */}
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

      {/* Submit Button */}
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
  photoUploadBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EDF2F7',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  photoUploadText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  photoUploadSubtext: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#2B6CB0',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
});

export default ReportFoundItem;

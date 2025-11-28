import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const ReportMissingItem = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = () => {
    if (!itemName || !category || !dateLost || !location) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    // Handle form submission here
    console.log({
      itemName,
      category,
      dateLost,
      location,
      description,
      images,
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Your missing item has been reported successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2B6CB0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đồ vật bị mất</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Tên đồ vật */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên đồ vật <Text style={{color: 'red'}}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên đồ vật"
                value={itemName}
                onChangeText={setItemName}
                placeholderTextColor="#A0AEC0"
              />
              <Ionicons name="pencil" size={20} color="#A0AEC0" style={styles.inputIcon} />
            </View>
          </View>

          {/* Loại đồ vật */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Loại đồ vật <Text style={{color: 'red'}}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                placeholder="Chọn loại đồ vật"
                value={category}
                onChangeText={setCategory}
                placeholderTextColor="#A0AEC0"
              />
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#718096"
                style={styles.dropdownIcon}
              />
            </View>
          </View>

          {/* Ngày mất */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ngày mất <Text style={{color: 'red'}}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                placeholder="Chọn ngày mất"
                value={dateLost}
                onChangeText={setDateLost}
                placeholderTextColor="#A0AEC0"
              />
              <MaterialIcons
                name="calendar-today"
                size={20}
                color="#718096"
                style={styles.dateIcon}
              />
            </View>
          </View>

          {/* Địa điểm mất */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Địa điểm mất <Text style={{color: 'red'}}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                placeholder="Nhập địa điểm mất"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#A0AEC0"
              />
              <MaterialIcons
                name="location-on"
                size={20}
                color="#718096"
                style={styles.locationIcon}
              />
            </View>
          </View>

          {/* Mô tả */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mô tả</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Mô tả chi tiết (màu sắc, nhãn hiệu, đặc điểm nhận dạng...)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                placeholderTextColor="#A0AEC0"
              />
              <Ionicons name="pencil" size={20} color="#A0AEC0" style={[styles.inputIcon, {top: 20}]} />
            </View>
          </View>

          {/* Tải lên hình ảnh */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tải lên hình ảnh</Text>
            <Text style={styles.subLabel}>Tải lên tối đa 5 ảnh (mỗi ảnh tối đa 5MB)</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.photoContainer}
              contentContainerStyle={styles.photoContainerContent}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => {
                      const newImages = [...images];
                      newImages.splice(index, 1);
                      setImages(newImages);
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#E53E3E" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {images.length < 5 && (
                <TouchableOpacity style={styles.addPhotoButton} onPress={handleChoosePhoto}>
                  <Ionicons name="camera" size={24} color="#A0AEC0" />
                  <Text style={styles.addPhotoText}>Thêm ảnh</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
          
          {/* Phần thông tin liên hệ */}
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Thông tin liên hệ</Text>
            <Text style={styles.contactSubtitle}>Thông tin này sẽ được hiển thị công khai</Text>
            
            <View style={styles.contactItem}>
              <Ionicons name="call" size={20} color="#4A5568" />
              <Text style={styles.contactText}>+84 123 456 789</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={20} color="#4A5568" />
              <Text style={styles.contactText}>nguyenvana@gmail.com</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="location" size={20} color="#4A5568" />
              <Text style={styles.contactText}>227 Nguyễn Văn Cừ, Quận 5, TP.HCM</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Nút gửi báo cáo */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, (isLoading || !itemName || !category || !dateLost || !location) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading || !itemName || !category || !dateLost || !location}
        >
          <LinearGradient
            colors={['#3182CE', '#2B6CB0']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isLoading ? (
              <Text style={styles.submitButtonText}>Đang gửi...</Text>
            ) : (
              <Text style={styles.submitButtonText}>ĐĂNG TIN</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: -24,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 48,
  },
  pickerContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  dateIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  locationIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  photoContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  photoContainerContent: {
    paddingRight: 16,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addPhotoText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 'auto',
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    borderRadius: 8,
    height: 56,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contactInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    color: '#4A5568',
    fontSize: 14,
  },
});

export default ReportMissingItem;

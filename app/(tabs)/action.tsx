import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ActionScreen() {
  const router = useRouter();

  const handleLostPress = () => {
    router.push('/report-missing');
  };

  const handleFoundPress = () => {
    router.push('/report-found');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Image 
          source={require('../../assets/images/logo.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Chào mừng bạn đến với</Text>
        <Text style={styles.appName}>HCMUT Lost and Found</Text>
        <Text style={styles.headerSubtitle}>Hãy chọn một trong các tùy chọn bên dưới để bắt đầu</Text> */}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.lostButton]}
          onPress={handleLostPress}
        >
          <View style={styles.buttonContent}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(43, 108, 176, 0.1)' }]}>
              <MaterialIcons name="search" size={32} color="#2B6CB0" />
            </View>
            <Text style={styles.buttonTitle}>Tôi bị mất đồ</Text>
            <Text style={styles.buttonDescription}>
              Đăng tìm đồ bị mất và tăng cơ hội tìm lại
            </Text>
            <View style={styles.arrowContainer}>
              <MaterialIcons name="arrow-forward" size={24} color="#2B6CB0" />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.foundButton]}
          onPress={handleFoundPress}
        >
          <View style={styles.buttonContent}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(49, 151, 149, 0.1)' }]}>
              <MaterialCommunityIcons name="hand-heart" size={32} color="#319795" />
            </View>
            <Text style={[styles.buttonTitle, { color: '#2C7A7B' }]}>Tôi nhặt được đồ</Text>
            <Text style={[styles.buttonDescription, { color: '#4A5568' }]}>
              Đăng tin tìm chủ nhân cho đồ vật nhặt được
            </Text>
            <View style={styles.arrowContainer}>
              <MaterialIcons name="arrow-forward" size={24} color="#319795" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    padding: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#4A5568',
    marginBottom: 4,
    textAlign: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  lostButton: {
    borderLeftWidth: 6,
    borderLeftColor: '#2B6CB0',
  },
  foundButton: {
    borderLeftWidth: 6,
    borderLeftColor: '#319795',
  },
  buttonContent: {
    width: '100%',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2B6CB0',
    marginBottom: 8,
  },
  buttonDescription: {
    fontSize: 15,
    color: '#4A5568',
    marginBottom: 16,
    lineHeight: 22,
  },
  arrowContainer: {
    alignSelf: 'flex-end',
  },
});
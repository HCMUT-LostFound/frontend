import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native';

const { width, height } = Dimensions.get('window');

const onboardingSlides = [
  {
    id: '1',
    title: 'Giúp bạn tìm lại\nđồ đã mất',
    description: 'Đăng tin thất lạc hoặc báo cáo đồ nhặt được để giúp tìm lại đồ đã mất',
    image: require('@/assets/images/logo.png'),
  },
  {
    id: '2',
    title: 'Kết nối trực tiếp',
    description: 'Liên hệ trực tiếp chủ sở hữu\nngười nhặt để xác thực và nhận\ntrả lại đồ thất lạc',
    image: require('@/assets/images/logo.png'),
  },
  {
    id: '3',
    title: 'Thông báo\nnhanh chóng',
    description: 'Thông báo tức thời giúp bạn nắm\nthông tin sớm nhất về đồ thất lạc',
    image: require('@/assets/images/logo.png'),
  },
];

export default function OnBoarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      const nextIndex = currentIndex + 1;
      slidesRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    } else {
      router.replace('/login');
    }
  };

  const skipOnboarding = () => {
    router.replace('/login');
  };

  const renderItem = ({ item }: { item: (typeof onboardingSlides)[number] }) => (
    <View style={styles.slide}>
      <View style={styles.logoContainer}>
        <Image 
          source={item.image} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.firstTitle}>{item.title}</Text>
        <Text style={styles.firstDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingSlides.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.dot, 
              currentIndex === i ? styles.activeDot : {}
            ]} 
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* {currentIndex > 0 && (
        <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      )} */}
      
      <FlatList
        data={onboardingSlides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      
      {renderDots()}
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={scrollTo}>
          <Text style={styles.primaryButtonText}>
            {currentIndex === onboardingSlides.length - 1 ? 'Tiếp tục' : 'Tiếp tục'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={skipOnboarding}>
          <Text style={styles.secondaryButtonText}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff4f8',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 180,
  },
  logoContainer: {
    width: 170,
    height: 170,
   
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  firstTitle: {
    width:410,
    height:108,
    fontSize: 40,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 16,
    textAlign: 'center',
  },
  firstDescription: {
    width:390,
    height:175,
    fontSize: 24,
    color: '#718096',
    textAlign: 'center',
    gap : 0,
    lineHeight: 26.4,
    paddingHorizontal: 0,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    
    backgroundColor: '#2B6CB0',
  },
//   skipButton: {
//     position: 'absolute',
//     top: 50,
//     right: 25,
//     zIndex: 10,
//     padding: 10,
//   },
//   skipText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '500',
//   },
  buttonsContainer: {
    width:390,
    height:147,
    gap:20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 32,
    marginBottom: 40,
  },
  primaryButton: {
    width:300,
    height:47,
    backgroundColor: '#2B6CB0',
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:0,
  },
  primaryButtonText: {
    color: '#F7FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    width:300,
    height:47,
    backgroundColor: '#CBD5E0',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2D3748',
    fontSize: 14,
    fontWeight: '500',
  },
  nextButton: {
    padding: 16,
    borderRadius: 30,
    marginHorizontal: 40,
    marginBottom: 40,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
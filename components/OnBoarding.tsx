import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, ViewToken } from 'react-native';

// Base design dimensions (giả định portrait)
const baseWidth = 430;
const baseHeight = 932;

// Function normalize để scale kích thước động
const normalize = (size: number, based: 'width' | 'height' = 'width', currentWidth: number, currentHeight: number) => {
  const scale = currentWidth / baseWidth;
  const scaleHeight = currentHeight / baseHeight;
  let baseScale = based === 'height' ? scaleHeight : scale;

  // Kiểm tra orientation: Nếu landscape (width > height), điều chỉnh scale để tránh méo
  const isLandscape = currentWidth > currentHeight;
  if (isLandscape) {
    baseScale *= 0.85; // Giảm scale nhẹ để fit landscape, nhưng focus portrait
  }

  // Scale dựa trên kích thước màn hình (cập nhật cho nhiều loại hơn)
  const isVerySmallScreen = currentWidth <= 360;
  const isSmallScreen = currentWidth > 360 && currentWidth <= 375;
  const isMediumScreen = currentWidth > 375 && currentWidth <= 414;
  const isLargeScreen = currentWidth > 414;

  if (isVerySmallScreen) {
    baseScale *= 0.75;
  } else if (isSmallScreen) {
    baseScale *= 0.82;
  } else if (isMediumScreen) {
    baseScale *= 0.91;
  } else if (isLargeScreen) {
    baseScale *= 1.05; // Tăng nhẹ cho màn lớn để tránh quá nhỏ
  }

  const newSize = size * baseScale;
  return Math.round(newSize);
};

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
    description: 'Liên hệ trực tiếp chủ sở hữu người nhặt để xác thực và nhận\ntrả lại đồ thất lạc',
    image: require('@/assets/images/logo.png'),
  },
  {
    id: '3',
    title: 'Thông báo nhanh chóng',
    description: 'Thông báo tức thời giúp bạn nắm thông tin sớm nhất về đồ thất lạc',
    image: require('@/assets/images/logo.png'),
  },
];

export default function OnBoarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();
  const { width, height } = useWindowDimensions(); // Lấy dimensions động, cập nhật khi xoay

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
    <View style={[styles.slide, { width, height }]}>
      {/* Header div */}
      <View style={[styles.headerDiv, { height: normalize(59, 'height', width, height) }]} />
      
      {/* Content div */}
      <View style={[styles.contentDiv, { 
        height: normalize(843, 'height', width, height), 
        width: normalize(390, 'width', width, height),
      }]}>
        {/* Sub-div 1 - logoDiv */}
        <View style={[styles.logoDiv, { height: normalize(300, 'height', width, height) }]}>
          <View style={[styles.logoContainer, { 
            width: normalize(170, 'width', width, height), 
            height: normalize(170, 'height', width, height) 
          }]}>
            <Image 
              source={item.image} 
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>
        </View>
        
        {/* Sub-div 2 - titleDiv */}
        <View style={[styles.titleDiv, { height: normalize(108, 'height', width, height) }]}>
          <Text style={[styles.firstTitle, { 
            fontSize: normalize(40, 'width', width, height),
            lineHeight: normalize(48, 'height', width, height),
          }]}>{item.title}</Text>
        </View>
        
        {/* Sub-div 3 - descriptionDiv */}
        <View style={[styles.descriptionDiv, { height: normalize(175, 'height', width, height) }]}>
          <Text style={[styles.firstDescription, { 
            fontSize: normalize(24, 'width', width, height),
            lineHeight: normalize(32, 'height', width, height),
            paddingHorizontal: normalize(20, 'width', width, height),
          }]}>{item.description}</Text>
        </View>
      </View>
      
      {/* Footer div */}
      <View style={[styles.footerDiv, { height: normalize(30, 'height', width, height) }]} />
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
              { 
                width: normalize(8, 'width', width, height),
                height: normalize(8, 'height', width, height),
                borderRadius: normalize(4, 'width', width, height),
                marginHorizontal: normalize(4, 'width', width, height),
              },
              currentIndex === i ? styles.activeDot : {}
            ]} 
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
      
      {/* Fixed dots container */}
      <View style={[styles.fixedDotsContainer, { bottom: normalize(240, 'height', width, height) }]}>
        {renderDots()}
      </View>
      
      {/* Fixed buttons container */}
      <View style={[styles.fixedButtonsContainer, { 
        bottom: normalize(60, 'height', width, height),
        gap: normalize(15, 'height', width, height),
      }]}>
        <TouchableOpacity style={[styles.primaryButton, { 
          width: normalize(300, 'width', width, height),
          height: normalize(47, 'height', width, height),
          borderRadius: normalize(20, 'width', width, height),
        }]} onPress={scrollTo}>
          <Text style={[styles.primaryButtonText, { fontSize: normalize(16, 'width', width, height) }]}>
            {currentIndex === onboardingSlides.length - 1 ? 'Tiếp tục' : 'Tiếp tục'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryButton, { 
          width: normalize(300, 'width', width, height),
          height: normalize(47, 'height', width, height),
          borderRadius: normalize(20, 'width', width, height),
        }]} onPress={skipOnboarding}>
          <Text style={[styles.secondaryButtonText, { fontSize: normalize(14, 'width', width, height) }]}>Bỏ qua</Text>
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
  slide: {},
  headerDiv: {},
  contentDiv: {
    alignSelf: 'center',
  },
  logoDiv: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 0,
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleDiv: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstTitle: {
    fontWeight: 'bold',
    color: '#101828',
    textAlign: 'center',
  },
  descriptionDiv: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstDescription: {
    color: '#718096',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: '#ddd',
  },
  activeDot: {
    backgroundColor: '#2B6CB0',
  },
  primaryButton: {
    backgroundColor: '#2B6CB0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#F7FAFC',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#CBD5E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#2D3748',
    fontWeight: '500',
  },
  footerDiv: {},
  fixedDotsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedButtonsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

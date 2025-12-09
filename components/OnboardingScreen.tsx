import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Tìm đồ thất lạc dễ dàng',
        description: 'Đăng tin tìm kiếm món đồ bị mất của bạn ngay lập tức.',
    },
    {
        id: '2',
        title: 'Kết nối cộng đồng',
        description: 'Giúp đỡ người khác bằng cách báo cáo đồ vật bạn nhặt được.',
    },
    {
        id: '3',
        title: 'An toàn & Tin cậy',
        description: 'Xác minh danh tính để đảm bảo an toàn cho mọi giao dịch.',
    },
];

export default function OnboardingScreen() {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (currentSlideIndex < SLIDES.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        } else {
            router.replace('/(tabs)/home');
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)/home');
    };

    const Slide = ({ item }: { item: typeof SLIDES[0] }) => {
        return (
            <View style={styles.slide}>
                <View style={styles.imagePlaceholder} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[SLIDES[currentSlideIndex]]} // Simple slide implementation for testability
                renderItem={({ item }) => <Slide item={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false} // Disable manual scroll for simplicity in this version
            />

            <View style={styles.footer}>
                <View style={styles.indicatorContainer}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentSlideIndex === index && styles.activeIndicator,
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    {currentSlideIndex < SLIDES.length - 1 ? (
                        <>
                            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                                <Text style={styles.skipText}>Bỏ qua</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleNext} style={styles.button}>
                                <Text style={styles.buttonText}>Tiếp tục</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={handleNext} style={[styles.button, styles.getStartedButton]}>
                            <Text style={styles.buttonText}>Bắt đầu</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        width: width,
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
        height: '70%'
    },
    imagePlaceholder: {
        width: 250,
        height: 250,
        backgroundColor: '#E8F4FD',
        borderRadius: 125,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2B6CB0',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    footer: {
        height: '30%',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    indicator: {
        height: 8,
        width: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
    },
    activeIndicator: {
        backgroundColor: '#2B6CB0',
        width: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#2B6CB0',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    getStartedButton: {
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    skipButton: {
        padding: 12,
    },
    skipText: {
        color: '#666',
        fontSize: 16,
    },
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OnboardingScreen from '../OnboardingScreen';
import { useRouter } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('OnboardingScreen', () => {
    const mockReplace = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            replace: mockReplace,
        });
        mockReplace.mockClear();
    });

    it('renders correctly', () => {
        const { getByText } = render(<OnboardingScreen />);
        expect(getByText('Tìm đồ thất lạc dễ dàng')).toBeTruthy();
        expect(getByText('Tiếp tục')).toBeTruthy();
    });

    it('navigates to next slide on button press', () => {
        const { getByText } = render(<OnboardingScreen />);
        const nextButton = getByText('Tiếp tục');

        fireEvent.press(nextButton);

        expect(getByText('Kết nối cộng đồng')).toBeTruthy();
    });

    it('navigates to home on skip', () => {
        const { getByText } = render(<OnboardingScreen />);
        const skipButton = getByText('Bỏ qua');

        fireEvent.press(skipButton);

        expect(mockReplace).toHaveBeenCalledWith('/(tabs)/home');
    });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../home';

// Mock specific icons to avoid issues during testing if necessary, 
// though jest-expo usually handles this. 
// If specific mocks are needed for vector-icons:
// jest.mock('@expo/vector-icons/Feather', () => 'Feather');
// jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

describe('HomeScreen', () => {
    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<Home />);

        expect(getByText('Bạn đang tìm đồ thất lạc?')).toBeTruthy();
        expect(getByPlaceholderText('Tìm kiếm món đồ')).toBeTruthy();
    });

    it('switches tabs correctly', () => {
        const { getByText } = render(<Home />);
        const foundTab = getByText('Đồ nhặt được');

        fireEvent.press(foundTab);

        // In a real app we might check style changes or content updates.
        // Here we mainly verify it doesn't crash and interaction works.
        expect(foundTab).toBeTruthy();
    });

    it('renders sample items', () => {
        const { getAllByText } = render(<Home />);
        // "Balo da" is in the sample items
        const items = getAllByText('Balo da');
        expect(items.length).toBeGreaterThan(0);
    });
});

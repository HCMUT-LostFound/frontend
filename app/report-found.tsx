import { Stack } from 'expo-router';
import { View } from 'react-native';
import ReportFoundItem from '../components/ReportFoundItem';

export default function ReportFoundScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Report Found Item',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <View style={{ flex: 1, backgroundColor: '#F7FAFC' }}>
        <ReportFoundItem />
      </View>
    </>
  );
}

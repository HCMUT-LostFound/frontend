import { Stack } from 'expo-router';
import { View } from 'react-native';
import ReportMissingItem from '../components/ReportMissingItem';

export default function ReportMissingScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Report Missing Item',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <View style={{ flex: 1, backgroundColor: '#F7FAFC' }}>
        <ReportMissingItem />
      </View>
    </>
  );
}

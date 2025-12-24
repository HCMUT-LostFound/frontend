import { Stack } from 'expo-router';
import { View } from 'react-native';
import ReportMissingItem from '../components/ReportMissingItem';

export default function ReportMissingScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#F7FAFC' }}>
        <ReportMissingItem />
      </View>
    </>
  );
}

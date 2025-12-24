import { StyleSheet, View } from 'react-native';

export default function ActionScreen() {
  // This screen is just a placeholder
  // The actual action modal is handled by ActionModalContext
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
});
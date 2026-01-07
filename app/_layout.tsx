import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { Stack, Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AuthSync from "@/components/AuthSync";
import { ProfileProvider } from "@/contexts/profileContext";
import * as Sentry from '@sentry/react-native';
import { useDomainGuard } from "@/hooks/useDomainGuard"

Sentry.init({
  dsn: 'https://405fee4d9671113875fb839afd371d19@o4510499923427328.ingest.us.sentry.io/4510658692775936',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay (để tìm điểm rời bỏ - drop-off points)
  replaysSessionSampleRate: 0.1,   // Thu thập 10% phiên để xem video hành vi
  replaysOnErrorSampleRate: 1,     // Thu thập 100% khi có lỗi

  integrations: [
    // Mobile Replay - giúp xem lại video hành vi người dùng (tìm điểm rời bỏ)
    Sentry.mobileReplayIntegration(),

    // Feedback - thu thập phản hồi người dùng (điểm hài lòng, gợi ý)
    Sentry.feedbackIntegration(),

    // Theo dõi navigation và performance để biết user flow và thời lượng phiên
    Sentry.reactNativeTracingIntegration(),
  ],

  // Performance Monitoring - thu thập thời lượng phiên và hiệu suất
  tracesSampleRate: 1.0,            // Thu thập 100% dữ liệu hiệu suất

  // Enable automatic session tracking
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000, // Track session mỗi 30s

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    }
    catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    }
    catch (err) {
      return;
    }
  }
}

function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null

  if (!isSignedIn) {
    return <Redirect href="/login" />
  }

  return null
}
function DomainGate() {
  useDomainGuard()
  return null
}
export default Sentry.wrap(function RootLayout() {
  // useDomainGuard()
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <DomainGate />
      <AuthSync />
      <AuthGate />
      <ProfileProvider>
        <SignedIn>
          <Stack screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SignedIn>
        <SignedOut>
          <Stack screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
          </Stack>
        </SignedOut>
      </ProfileProvider>
    </ClerkProvider>
  );
});
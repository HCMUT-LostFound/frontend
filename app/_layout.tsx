import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { Stack, Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AuthSync from "@/components/AuthSync";
import { ProfileProvider } from "@/contexts/profileContext";
import * as Sentry from '@sentry/react-native';
import { useDomainGuard } from "@/hooks/useDomainGuard"

// Initialize Sentry with error handling
try {
  Sentry.init({
    dsn: 'https://405fee4d9671113875fb839afd371d19@o4510499923427328.ingest.us.sentry.io/4510658692775936',

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Enable Logs
    enableLogs: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

    tracesSampleRate: 1.0,

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
  });
} catch (error) {
  console.error('Failed to initialize Sentry:', error);
}

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
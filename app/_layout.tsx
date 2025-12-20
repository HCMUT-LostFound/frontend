import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { Stack, Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AuthSync from "@/components/AuthSync";
import { ProfileProvider } from "@/contexts/profileContext";

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

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
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
}

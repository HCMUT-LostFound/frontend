import OnBoarding from '@/components/OnBoarding';
import React from 'react';
import { useAuth } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { Redirect } from 'expo-router'
export default function Index() {
  // return <OnBoarding />;
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href="/(tabs)/home" />
  }

  return <Redirect href="/login" />
}

import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import { useAuth, useSSO } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React, { useCallback } from 'react'
import { Button, View } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
    useWarmUpBrowser()

    const { startSSOFlow } = useSSO()
    const { getToken, isSignedIn } = useAuth()
    const { signOut } = useAuth()
    const onPress = useCallback(async () => {
        try {
            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                // For web, defaults to current path
                // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
                // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
                redirectUrl: AuthSession.makeRedirectUri(),
            })

            // If sign in was successful, set the active session
            if (createdSessionId) {
                setActive!({
                    session: createdSessionId,
                    // Check for session tasks and navigate to custom UI to help users resolve them
                    // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
                    navigate: async ({ session }) => {
                        if (session?.currentTask) {
                            console.log(session?.currentTask)
                            router.push('/')
                            return
                        }
                        // const token = await getToken()

                        // if (!token) {
                        //     console.error("No Clerk token")
                        //     return
                        // }
                        
                        // await fetch('http://10.0.212.196/api/me', {
                        //     headers: {
                        //     Authorization: `Bearer ${token}`,
                        //     },
                        // })

                        router.push('/(tabs)/home')
                    },
                })
            } else {
                // If there is no `createdSessionId`,
                // there are missing requirements, such as MFA
                // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
            }
        } catch (err) {
            // See https://clerk.com/docs/guides/development/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }, [])

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Button title="Sign in with Google" onPress={onPress} />
            <Button
  title="Logout (DEV)"
  onPress={async () => {
    await signOut()
    console.log('Signed out')
  }}
/>
        </View>
    )
}

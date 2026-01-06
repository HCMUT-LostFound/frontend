import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import { useAuth, useSSO, useUser } from '@clerk/clerk-expo'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import * as AuthSession from 'expo-auth-session'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React, { useCallback, useEffect } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'


WebBrowser.maybeCompleteAuthSession()

// Base design dimensions (giả định portrait)
const baseWidth = 430
const baseHeight = 932

// Function normalize để scale kích thước động
const normalize = (size: number, based: 'width' | 'height' = 'width', currentWidth: number, currentHeight: number) => {
  const scale = currentWidth / baseWidth
  const scaleHeight = currentHeight / baseHeight
  let baseScale = based === 'height' ? scaleHeight : scale

  // Kiểm tra orientation: Nếu landscape (width > height), điều chỉnh scale để tránh méo
  const isLandscape = currentWidth > currentHeight
  if (isLandscape) {
    baseScale *= 0.85 // Giảm scale nhẹ để fit landscape, nhưng focus portrait
  }

  // Scale dựa trên kích thước màn hình (cập nhật cho nhiều loại hơn)
  const isVerySmallScreen = currentWidth <= 360
  const isSmallScreen = currentWidth > 360 && currentWidth <= 375
  const isMediumScreen = currentWidth > 375 && currentWidth <= 414
  const isLargeScreen = currentWidth > 414

  if (isVerySmallScreen) {
    baseScale *= 0.75
  } else if (isSmallScreen) {
    baseScale *= 0.82
  } else if (isMediumScreen) {
    baseScale *= 0.91
  } else if (isLargeScreen) {
    baseScale *= 1.05 // Tăng nhẹ cho màn lớn để tránh quá nhỏ
  }

  const newSize = size * baseScale
  return Math.round(newSize)
}

export default function LoginScreen() {
  useWarmUpBrowser()

  const { startSSOFlow } = useSSO()
  const { getToken, isSignedIn } = useAuth()
  const { signOut } = useAuth()
  const { width, height } = useWindowDimensions() // Lấy dimensions động, cập nhật khi xoay
  const { user } = useUser()
  const ALLOWED_DOMAINS = ['hcmut.edu.vn']
  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId })
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])


  useEffect(() => {
    if (!isSignedIn || !user) return

    const email = user.primaryEmailAddress?.emailAddress
    const domain = email?.split('@')[1]

    if (!email || !domain || !ALLOWED_DOMAINS.includes(domain)) {
      signOut()
      return
    }

    router.replace('/home')
  }, [isSignedIn, user])


  return (
    <View style={styles.container}>
      <View style={[styles.headerDiv, { height: normalize(59, 'height', width, height) }]} />
      <View style={[styles.contentDiv, {
        height: normalize(843, 'height', width, height),
        width: normalize(390, 'width', width, height), // Scale width động
        gap: normalize(20, 'height', width, height),
      }]}>
        <View style={[styles.logoDiv, { height: normalize(300, 'height', width, height) }]}>
          <View style={[styles.logoContainer, {
            width: normalize(170, 'width', width, height),
            height: normalize(170, 'height', width, height)
          }]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={[styles.welcomeDiv, { height: normalize(64, 'height', width, height) }]}>
          <Text style={[styles.welcomeText, { fontSize: normalize(40, 'width', width, height) }]}>Chào mừng bạn</Text>
        </View>
        <View style={[styles.subtitleDiv, { height: normalize(46, 'height', width, height) }]}>
          <Text style={[styles.subtitleText, { fontSize: normalize(24, 'width', width, height) }]}>Đăng nhập để tiếp tục</Text>
        </View>
        <View style={[styles.googleButtonDiv, { height: normalize(60, 'height', width, height) }]}>
          <TouchableOpacity style={[styles.googleButton, {
            width: normalize(390, 'width', width, height), // Scale button width
            height: normalize(60, 'height', width, height),
            borderRadius: normalize(20, 'width', width, height),
          }]} onPress={onPress}>
            <FontAwesome6 name="google" size={normalize(24, 'width', width, height)} color="#F7FAFC" />
            <Text style={[styles.googleButtonText, { fontSize: normalize(24, 'width', width, height) }]}>  Đăng nhập bằng Google</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={async () => {
              await signOut()
              console.log('Signed out')
            }}
          >
            <Text style={[, { fontSize: normalize(20, 'width', width, height) }]}>Logout (DEV)</Text>
          </TouchableOpacity> */}
        </View>
        <View style={[styles.emailInfoDiv, { height: normalize(80, 'height', width, height) }]}>
          <Text style={[styles.emailInfoText, {
            fontSize: normalize(20, 'width', width, height),
            width: normalize(307, 'width', width, height),
          }]}>Sử dụng mail <Text style={styles.underline}>hcmut.edu.vn</Text> để đăng nhập</Text>
        </View>
        <View style={[styles.termsDiv, { height: normalize(153, 'height', width, height) }]}>
          <Text style={[styles.termsText, {
            fontSize: normalize(15, 'width', width, height),
            fontWeight: '500',
            paddingHorizontal: normalize(20, 'width', width, height),
            lineHeight: normalize(24, 'height', width, height),
          }]}>Bằng việc đăng nhập, bạn đồng ý với Điều khoản Dịch vụ và Chính sách bảo mật của chúng tôi</Text>
        </View>
      </View>
      <View style={[styles.footerDiv, { height: normalize(30, 'height', width, height) }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff4f8',
  },
  headerDiv: {},
  contentDiv: {
    alignSelf: 'center',
  },
  logoDiv: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeDiv: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitleDiv: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleText: {
    color: '#718096',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  googleButtonDiv: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#2B6CB0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#F7FAFC',
    fontWeight: '500',
  },
  emailInfoDiv: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailInfoText: {
    fontWeight: '500',
    color: '#718096',
    textAlign: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  termsDiv: {
    justifyContent: 'flex-end',
    alignItems: 'center',

  },
  termsText: {
    color: '#718096',
    textAlign: 'center',
  },
  footerDiv: {},
})

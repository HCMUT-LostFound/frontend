import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { Alert } from 'react-native'

const ALLOWED_DOMAINS = ['hcmut.edu.vn']

export function useDomainGuard() {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()

  useEffect(() => {
    if (!isLoaded || !user) return

    const email = user.primaryEmailAddress?.emailAddress
    if (!email) return

    const domain = email.split('@')[1]
    if (!ALLOWED_DOMAINS.includes(domain)) {
      Alert.alert(
        'Không được phép',
        'Vui lòng đăng nhập bằng email @hcmut.edu.vn',
      )
      signOut()
    }
  }, [user, isLoaded])
}

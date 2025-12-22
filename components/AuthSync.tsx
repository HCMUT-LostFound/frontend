import { useAuth, useUser } from '@clerk/clerk-expo'
import { useEffect, useRef } from 'react'
import {jwtDecode} from 'jwt-decode'

const API_BASE = process.env.EXPO_PUBLIC_API_BASE

type JwtPayload = {
  sub: string
}

export default function AuthSync() {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const { user } = useUser()

  const lastSyncedUserId = useRef<string | null>(null)
  const syncing = useRef(false)

  useEffect(() => {
    if (!isSignedIn || !user?.id || !isLoaded) return
    if (syncing.current) return
    if (lastSyncedUserId.current === user.id) return
    const sync = async () => {
      syncing.current = true

      const token = await getToken()
      if (!token) {
        syncing.current = false
        return
      }
      console.log('[AuthSync] token =', token)
      const res = await fetch(`${API_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        lastSyncedUserId.current = user.id
        console.log('[AuthSync] Synced user', user.id)
      } else {
        console.log('[AuthSync] Backend status', res.status)
      }

      syncing.current = false
    }

    sync()
  }, [isSignedIn, isLoaded, user?.id])

  return null
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

import { useAuth, useUser } from '@clerk/clerk-expo'
import { useEffect, useRef } from 'react'
import {jwtDecode} from 'jwt-decode'

const API_BASE = 'http://10.0.212.196:8080'

type JwtPayload = {
  sub: string
}

export default function AuthSync() {
  const { isSignedIn, getToken } = useAuth()
  const { user } = useUser()

  const lastSyncedUserId = useRef<string | null>(null)
  const syncing = useRef(false)

  useEffect(() => {
    if (!isSignedIn || !user?.id) return
    if (syncing.current) return

    const sync = async () => {
      syncing.current = true

      let token: string | null = null

      // 🔁 retry + verify token belongs to user
      for (let i = 0; i < 6; i++) {
        token = await getToken()
        if (!token) {
          await delay(300)
          continue
        }

        const payload = jwtDecode<JwtPayload>(token)
        if (payload.sub === user.id) break

        token = null
        await delay(300)
      }

      if (!token) {
        console.log('[AuthSync] Token does not match user.id')
        syncing.current = false
        return
      }

      if (lastSyncedUserId.current === user.id) {
        syncing.current = false
        return
      }

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
  }, [isSignedIn, user?.id])

  return null
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

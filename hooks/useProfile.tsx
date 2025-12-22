import { useAuth } from '@clerk/clerk-expo'
import { useEffect, useState } from 'react'

const API_BASE = process.env.EXPO_PUBLIC_API_BASE

export function useProfile() {
  const { getToken } = useAuth()
  const [profile, setProfile] = useState<{ fullName: string; avatarUrl: string } | null>(null)

  useEffect(() => {
    const load = async () => {
      const token = await getToken()
      if (!token) return
      console.log("Token:", token)
      const res = await fetch(`${API_BASE}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setProfile(data)
    }

    load()
  }, [])

  return profile
}

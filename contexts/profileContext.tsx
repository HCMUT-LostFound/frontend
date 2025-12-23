import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo'

type Profile = {
    fullName: string
    avatarUrl: string
}

type ProfileContextType = {
    profile: Profile | null
    loading: boolean
}

const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    loading: true,
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { user: clerkUser } = useUser()

    const initialProfile = clerkUser
        ? {
            fullName: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
            avatarUrl: clerkUser.imageUrl,
        }
        : null
    const { getToken } = useAuth()
    const [profile, setProfile] = useState<Profile | null>(initialProfile)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProfile = async () => {
            const token = await getToken()
            if (!token) return

            const res = await fetch('http://10.0.212.196:8080/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()
            setProfile(data)
            setLoading(false)
        }

        loadProfile()
    }, [])

    return (
        <ProfileContext.Provider value={{ profile, loading }}>
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    return useContext(ProfileContext)
}

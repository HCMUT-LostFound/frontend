// lib/api.ts
export async function fetchWithAuth(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text)
  }

  return res.json()
}

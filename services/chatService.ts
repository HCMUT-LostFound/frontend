// services/chatService.ts
const API_BASE = process.env.EXPO_PUBLIC_API_BASE

export interface Chat {
  id: string
  itemId: string
  itemTitle?: string
  itemImage?: string
  otherUser?: {
    id: string
    fullName: string
    avatarUrl: string
  }
  lastMessage?: {
    id: string
    content: string
    createdAt: string
  }
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  content: string
  createdAt: string
  sender?: {
    id: string
    fullName: string
    avatarUrl: string
  }
}

export async function fetchChats(token: string): Promise<Chat[]> {
  const res = await fetch(`${API_BASE}/api/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Fetch chats failed: ${res.status} - ${text}`)
  }
  return res.json()
}

export async function createOrGetChat(token: string, itemId: string): Promise<Chat> {
  const res = await fetch(`${API_BASE}/api/chats`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itemId }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Create chat failed: ${res.status} - ${text}`)
  }
  return res.json()
}

export async function fetchMessages(
  token: string,
  chatId: string,
  afterMessageId?: string
): Promise<ChatMessage[]> {
  let url = `${API_BASE}/api/chats/${chatId}/messages`
  if (afterMessageId) {
    url += `?after=${afterMessageId}`
  }
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Fetch messages failed: ${res.status} - ${text}`)
  }
  return res.json()
}

export async function sendMessage(
  token: string,
  chatId: string,
  content: string
): Promise<ChatMessage> {
  const res = await fetch(`${API_BASE}/api/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Send message failed: ${res.status} - ${text}`)
  }
  return res.json()
}


import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@clerk/clerk-expo'
import { useFocusEffect } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import { fetchChats, fetchMessages, sendMessage, Chat, ChatMessage } from '@/services/chatService'

export default function ChatScreen() {
  const params = useLocalSearchParams<{ chatId?: string }>()
  const [searchText, setSearchText] = useState('')
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasLoadedChatsRef = useRef(false)
  const { getToken } = useAuth()

  // Load chats list
  const loadChats = useCallback(async () => {
    // Prevent concurrent calls
    if (loading) return
    
    try {
      setLoading(true)
      const token = await getToken()
      if (!token) {
        setLoading(false)
        return
      }
      const data = await fetchChats(token)
      setChats(data)
      
      // Auto-select chat if chatId is provided in params (only once)
      if (params.chatId) {
        setSelectedChat(prev => {
          if (prev) return prev // Don't change if already selected
          const chatToSelect = data.find(c => c.id === params.chatId)
          return chatToSelect || null
        })
      }
    } catch (err) {
      console.error('Load chats error:', err)
    } finally {
      setLoading(false)
    }
  }, [getToken, params.chatId, loading])

  // Load messages for selected chat
  const loadMessages = useCallback(async (chatId: string, afterMessageId?: string) => {
    try {
      const token = await getToken()
      if (!token) return
      const data = await fetchMessages(token, chatId, afterMessageId)
      if (afterMessageId) {
        // Append new messages (avoid duplicates)
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const newMessages = data.filter(m => !existingIds.has(m.id))
          return [...prev, ...newMessages]
        })
      } else {
        // Replace all messages
        setMessages(data)
      }
      // Auto scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    } catch (err) {
      console.error('Load messages error:', err)
    }
  }, [getToken])

  // Start polling for new messages
  useEffect(() => {
    if (!selectedChat) {
      // Stop polling when no chat selected
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      return
    }

    // Load initial messages
    loadMessages(selectedChat.id)
    
    // Start polling every 2s (reduced from 0.5s to avoid too many requests)
    let isPolling = false
    const intervalId = setInterval(() => {
      // Prevent concurrent polling
      if (isPolling) return
      isPolling = true
      
      getToken().then(token => {
        if (!token || !selectedChat) {
          isPolling = false
          return
        }
        
        setMessages(currentMessages => {
          const lastMessageId = currentMessages.length > 0 ? currentMessages[currentMessages.length - 1].id : undefined
          
          fetchMessages(token, selectedChat.id, lastMessageId).then(newMessages => {
            if (newMessages.length > 0) {
              setMessages(prev => {
                const existingIds = new Set(prev.map(m => m.id))
                const uniqueNew = newMessages.filter(m => !existingIds.has(m.id))
                if (uniqueNew.length > 0) {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                  }, 100)
                  return [...prev, ...uniqueNew]
                }
                return prev
              })
            }
            isPolling = false
          }).catch(() => {
            isPolling = false
          })
          
          return currentMessages
        })
      })
    }, 2000) // Changed from 500ms to 2000ms
    
    pollingIntervalRef.current = intervalId
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      pollingIntervalRef.current = null
    }
  }, [selectedChat?.id, getToken, loadMessages])

  // Load chats when screen is focused (only when not selected chat)
  // Use a ref to track if we've loaded chats to avoid multiple calls
  useFocusEffect(
    useCallback(() => {
      if (!selectedChat && !loading) {
        // Only load if not already loading and not in a chat
        if (!hasLoadedChatsRef.current) {
          loadChats()
          hasLoadedChatsRef.current = true
        }
      }
      // Reset flag when leaving chat view
      if (selectedChat) {
        hasLoadedChatsRef.current = false
      }
      // Cleanup on unmount
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      }
    }, [loadChats, selectedChat, loading])
  )

  // Handle send message
  const handleSendMessage = async () => {
    if (!selectedChat || !messageText.trim() || sending) return
    
    setSending(true)
    try {
      const token = await getToken()
      if (!token) return
      
      const newMessage = await sendMessage(token, selectedChat.id, messageText.trim())
      setMessageText('')
      
      // Add message to list immediately
      setMessages(prev => [...prev, newMessage])
      
      // Reload chats to update last message (only if not in a chat view)
      if (!selectedChat) {
        loadChats()
      }
      
      // Auto scroll
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    } catch (err) {
      console.error('Send message error:', err)
    } finally {
      setSending(false)
    }
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    } else if (days < 7) {
      return date.toLocaleDateString('vi-VN', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    }
  }

  // Filter chats by search
  const filteredChats = chats.filter(chat => {
    if (!searchText.trim()) return true
    const searchLower = searchText.toLowerCase()
    return (
      chat.otherUser?.fullName.toLowerCase().includes(searchLower) ||
      chat.itemTitle?.toLowerCase().includes(searchLower) ||
      chat.lastMessage?.content.toLowerCase().includes(searchLower)
    )
  })

  // Get current user ID (we'll get it from auth)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  useEffect(() => {
    getToken().then(token => {
      if (token) {
        // Decode token to get user ID (simplified - in real app use proper JWT decode)
        fetch(`${process.env.EXPO_PUBLIC_API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setCurrentUserId(data.id))
        .catch(() => {})
      }
    })
  }, [getToken])

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          {/* Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            {selectedChat.otherUser?.avatarUrl ? (
              <Image 
                source={{ uri: selectedChat.otherUser.avatarUrl }} 
                style={styles.avatarCircle}
              />
            ) : (
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={28} color="#999" />
              </View>
            )}
            <Text style={styles.chatHeaderName}>
              {selectedChat.otherUser?.fullName || 'Người dùng'}
            </Text>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer} 
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {/* Item Info */}
            {selectedChat.itemImage && (
              <View style={styles.itemInfoContainer}>
                <Image 
                  source={{ uri: selectedChat.itemImage }} 
                  style={styles.itemInfoImage} 
                />
                <Text style={styles.itemInfoText}>
                  Bắt đầu cuộc trò chuyện về <Text style={styles.itemInfoBold}>
                    {selectedChat.itemTitle || 'món đồ này'}
                  </Text>
                </Text>
              </View>
            )}

            {/* Messages */}
            {messages.map((message) => {
              const isMe = message.senderId === currentUserId
              return (
                <View key={message.id} style={styles.messageItem}>
                  <View style={styles.messageHeader}>
                    {message.sender?.avatarUrl ? (
                      <Image 
                        source={{ uri: message.sender.avatarUrl }} 
                        style={styles.avatarSmall}
                      />
                    ) : (
                      <View style={styles.avatarSmall}>
                        <Ionicons name="person" size={20} color="#999" />
                      </View>
                    )}
                    <Text style={styles.messageSender}>
                      {isMe ? 'Bạn' : (message.sender?.fullName || 'Người dùng')}
                    </Text>
                    <Text style={styles.messageTime}>{formatTime(message.createdAt)}</Text>
                  </View>
                  <Text style={styles.messageContent}>{message.content}</Text>
                </View>
              )
            })}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Nhập tin nhắn ..."
              placeholderTextColor="#999"
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={handleSendMessage}
              editable={!sending}
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || sending}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={messageText.trim() && !sending ? "#1E90FF" : "#999"} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Tin Nhắn</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm cuộc trò chuyện"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Conversation List */}
        <View style={styles.conversationList}>
          {loading ? (
            <Text style={styles.emptyText}>Đang tải...</Text>
          ) : filteredChats.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào.</Text>
          ) : (
            filteredChats.map((chat) => (
              <TouchableOpacity 
                key={chat.id} 
                style={styles.conversationItem}
                onPress={() => setSelectedChat(chat)}
              >
                {chat.otherUser?.avatarUrl ? (
                  <Image 
                    source={{ uri: chat.otherUser.avatarUrl }} 
                    style={styles.conversationImage}
                  />
                ) : (
                  <View style={styles.conversationImage}>
                    <Ionicons name="person" size={30} color="#999" />
                  </View>
                )}
                <View style={styles.conversationInfo}>
                  <Text style={styles.conversationName}>
                    {chat.otherUser?.fullName || 'Người dùng'}
                  </Text>
                  <Text style={styles.conversationMessage} numberOfLines={1}>
                    {chat.lastMessage?.content || 'Chưa có tin nhắn'}
                  </Text>
                </View>
                <Text style={styles.conversationTime}>
                  {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : ''}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  keyboardAvoid: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B6CB0',
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  conversationList: {
    gap: 0,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  conversationImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 15,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B6CB0',
    marginBottom: 4,
  },
  conversationMessage: {
    fontSize: 14,
    color: '#666',
  },
  conversationTime: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 14,
  },
  // Chat Detail Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 10,
  },
  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B6CB0',
  },
  messagesContainer: {
    flex: 1,
    paddingTop: 10,
  },
  itemInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  itemInfoImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  itemInfoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  itemInfoBold: {
    fontWeight: 'bold',
    color: '#2B6CB0',
  },
  messageItem: {
    marginBottom: 20,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarSmall: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B6CB0',
    marginRight: 10,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageContent: {
    fontSize: 14,
    color: '#333',
    marginLeft: 45,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  messageInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
})

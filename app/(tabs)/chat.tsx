import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'

interface Conversation {
  id: string
  name: string
  lastMessage: string
  time: string
  image: string
  isMe?: boolean
  itemImage?: string
  itemName?: string
}

interface Message {
  id: string
  sender: string
  content: string
  time: string
  isMe: boolean
}

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    lastMessage: 'Chào bạn',
    time: '11:42',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
    itemImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
    itemName: 'Balo da',
  },
  {
    id: '2',
    name: 'Lê Văn B',
    lastMessage: 'Bạn: Mình nhặt được ở C6',
    time: '12/11',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
    isMe: true,
    itemImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
    itemName: 'Balo da',
  },
]

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'Lê Văn B',
    content: 'Chào bạn, tôi thấy bạn nhặt được cái ba lô màu nâu đúng không',
    time: '20/10/2025 10:15',
    isMe: false,
  },
  {
    id: '2',
    sender: 'Bạn',
    content: 'Đúng rồi. Giờ mình đang ở H1.',
    time: '20/10/2025 10:15',
    isMe: true,
  },
]

export default function Chat() {
  const [searchText, setSearchText] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState('')

  if (selectedConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          {/* Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedConversation(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={28} color="#999" />
            </View>
            <Text style={styles.chatHeaderName}>{selectedConversation.name}</Text>
          </View>

          <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
            {/* Item Info */}
            <View style={styles.itemInfoContainer}>
              <Image source={{ uri: selectedConversation.itemImage }} style={styles.itemInfoImage} />
              <Text style={styles.itemInfoText}>
                Bắt đầu cuộc trò chuyện về <Text style={styles.itemInfoBold}>{selectedConversation.itemName}</Text>
              </Text>
            </View>

            {/* Messages */}
            {SAMPLE_MESSAGES.map((message) => (
              <View key={message.id} style={styles.messageItem}>
                <View style={styles.messageHeader}>
                  <View style={styles.avatarSmall}>
                    <Ionicons name="person" size={20} color="#999" />
                  </View>
                  <Text style={styles.messageSender}>{message.sender}</Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
                <Text style={styles.messageContent}>{message.content}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Nhập tin nhắn ..."
              placeholderTextColor="#999"
              value={messageText}
              onChangeText={setMessageText}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={24} color="#1E90FF" />
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
          {SAMPLE_CONVERSATIONS.map((conversation) => (
            <TouchableOpacity 
              key={conversation.id} 
              style={styles.conversationItem}
              onPress={() => setSelectedConversation(conversation)}
            >
              <Image source={{ uri: conversation.image }} style={styles.conversationImage} />
              <View style={styles.conversationInfo}>
                <Text style={styles.conversationName}>{conversation.name}</Text>
                <Text style={styles.conversationMessage} numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
              </View>
              <Text style={styles.conversationTime}>{conversation.time}</Text>
            </TouchableOpacity>
          ))}
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
    color: '#1E1E1E',
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
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 15,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
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
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
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
    color: '#1E1E1E',
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
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E1E1E',
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
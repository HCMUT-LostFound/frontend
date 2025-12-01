import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type TabType = 'message' | 'lost' | 'found'

interface NotificationItem {
  id: string
  title: string
  description: string
  type: TabType
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'Tin nhắn mới', description: 'Bạn có tin nhắn mới từ Nguyễn Văn A', type: 'message' },
  { id: '2', title: 'Tin nhắn mới', description: 'Bạn có tin nhắn mới từ Nguyễn Văn A', type: 'message' },
  { id: '3', title: 'Tin nhắn mới', description: 'Bạn có tin nhắn mới từ Nguyễn Văn A', type: 'message' },
  { id: '4', title: 'Tin nhắn mới', description: 'Bạn có tin nhắn mới từ Nguyễn Văn A', type: 'message' },
  { id: '5', title: 'Có đồ vật bị mất', description: 'Bấm vào để xem thêm', type: 'lost' },
  { id: '6', title: 'Có đồ vật bị mất', description: 'Bấm vào để xem thêm', type: 'lost' },
  { id: '7', title: 'Có đồ vật được tìm thấy!', description: 'Bấm vào để xem thêm', type: 'found' },
  { id: '8', title: 'Có đồ vật được tìm thấy!', description: 'Bấm vào để xem thêm', type: 'found' },
]

export default function Notification() {
  const [activeTab, setActiveTab] = useState<TabType>('message')

  const filteredNotifications = SAMPLE_NOTIFICATIONS.filter(n => n.type === activeTab)

  const renderIcon = (type: TabType) => {
    switch (type) {
      case 'message':
        return (
          <View style={styles.iconCircle}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
          </View>
        )
      case 'lost':
        return (
          <View style={styles.iconCircle}>
            <Text style={styles.questionMark}>?</Text>
          </View>
        )
      case 'found':
        return (
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </View>
        )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Thông báo</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'message' && styles.activeTab]}
          onPress={() => setActiveTab('message')}
        >
          <Text style={[styles.tabText, activeTab === 'message' && styles.activeTabText]}>
            Tin nhắn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lost' && styles.activeTab]}
          onPress={() => setActiveTab('lost')}
        >
          <Text style={[styles.tabText, activeTab === 'lost' && styles.activeTabText]}>
            Đồ mất
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'found' && styles.activeTab]}
          onPress={() => setActiveTab('found')}
        >
          <Text style={[styles.tabText, activeTab === 'found' && styles.activeTabText]}>
            Đồ nhặt
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainer}>
        {filteredNotifications.map((notification) => (
          <TouchableOpacity key={notification.id} style={styles.notificationItem}>
            {renderIcon(notification.type)}
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationDescription}>{notification.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginTop: 20,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 10,
  },
  tab: {
    width: '32%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2B6CB0',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
  },
  activeTabText: {
    color: '#2B6CB0',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2B6CB0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  questionMark: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
  },
})
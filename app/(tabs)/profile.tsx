import Ionicons from '@expo/vector-icons/Ionicons'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import React, { useState } from 'react'
import {
  Image,
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@clerk/clerk-expo'

const API_BASE = process.env.EXPO_PUBLIC_API_BASE

type TabType = 'lost' | 'found'

interface Item {
  id: string
  title: string
  type: TabType
  imageUrls: string[] | null
  lostAt: string | null
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('lost')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'found' | 'return'>('found')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const profile = useProfile()
  const { signOut, isLoaded, isSignedIn, getToken } = useAuth()

  const fetchMyItems = async () => {
    try {
      const token = await getToken()
      if (!token) return

      const res = await fetch(`${API_BASE}/api/items/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        console.error('Failed to fetch my items')
        return
      }

      const data: Item[] = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (!isLoaded || !isSignedIn) return
      setLoading(true)
      fetchMyItems()
    }, [isLoaded, isSignedIn])
  )

  const currentItems = items.filter((item) => item.type === activeTab)

  const handleConfirm = async () => {
    if (!selectedItemId) return

    try {
      const token = await getToken()
      if (!token) return

      const res = await fetch(`${API_BASE}/api/items/${selectedItemId}/confirm`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('Confirm failed:', text)
        return
      }

      // Thành công → đóng modal và reload danh sách
      setShowModal(false)
      setSelectedItemId(null)
      fetchMyItems()
    } catch (err) {
      console.error(err)
    }
  }

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemCard}>
      <Image
        source={{
          uri: item.imageUrls?.[0] ?? 'https://via.placeholder.com/100',
        }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.title}</Text>
        <Text style={styles.itemDate}>
          {activeTab === 'lost'
            ? `Ngày báo mất: ${item.lostAt ? new Date(item.lostAt).toLocaleDateString('vi-VN') : '—'}`
            : `Ngày nhặt được: ${item.lostAt ? new Date(item.lostAt).toLocaleDateString('vi-VN') : '—'}`
          }
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedItemId(item.id)
            setModalType(activeTab === 'lost' ? 'found' : 'return')
            setShowModal(true)
          }}
        >
          <Text style={styles.actionButtonText}>
            {activeTab === 'lost' ? 'Đã tìm thấy' : 'Đã trả lại'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header cố định */}
      <Text style={styles.title}>Hồ sơ</Text>

      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            ) : (
              <Ionicons name="person" size={40} color="#999" />
            )}
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{profile?.fullName ?? 'User'}</Text>
            <TouchableOpacity>
              <Ionicons name="pencil" size={16} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              try {
                await signOut()
              } catch (err) {
                console.error('Logout error:', err)
              }
            }}
          >
            <Text style={styles.logoutText}>Đăng xuất</Text>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab cố định */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lost' && styles.activeTab]}
          onPress={() => setActiveTab('lost')}
        >
          <Text style={[styles.tabText, activeTab === 'lost' && styles.activeTabText]}>
            Đồ bị mất
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'found' && styles.activeTab]}
          onPress={() => setActiveTab('found')}
        >
          <Text style={[styles.tabText, activeTab === 'found' && styles.activeTabText]}>
            Đồ nhặt được
          </Text>
        </TouchableOpacity>
      </View>

      {/* Item List */}
      {loading ? (
        <Text style={styles.emptyText}>Đang tải dữ liệu...</Text>
      ) : currentItems.length === 0 ? (
        <Text style={styles.emptyText}>
          {activeTab === 'lost' ? 'Hiện không có đồ bị mất' : 'Hiện không có đồ nhặt được'}
        </Text>
      ) : (
        <FlatList
          data={currentItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          style={{ flex: 1 }}
        />
      )}

      {/* Modal xác nhận */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận</Text>
            <Text style={styles.modalMessage}>
              {modalType === 'found'
                ? 'Bạn có chắc chắn đã tìm thấy món đồ này?'
                : 'Bạn có chắc chắn đã trả lại món đồ này?'}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2B6CB0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B6CB0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
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
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  itemCard: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 20,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 14,
    color: '#2B6CB0',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#2B6CB0',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#2B6CB0',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
})
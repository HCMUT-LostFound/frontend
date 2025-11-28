import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type TabType = 'lost' | 'found'

interface Item {
  id: string
  name: string
  date: string
  image: string
  type: TabType
}

const SAMPLE_LOST_ITEMS: Item[] = [
  { id: '1', name: 'Balo da', date: '26/10/2025', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200', type: 'lost' },
  { id: '2', name: 'Balo da', date: '26/10/2025', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200', type: 'lost' },
  { id: '3', name: 'Balo da', date: '26/10/2025', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200', type: 'lost' },
]

const SAMPLE_FOUND_ITEMS: Item[] = [
  { id: '4', name: 'Balo da', date: '26/10/2025', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200', type: 'found' },
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('lost')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'found' | 'return'>('found')
  const [lostItems, setLostItems] = useState(SAMPLE_LOST_ITEMS)
  const [foundItems, setFoundItems] = useState(SAMPLE_FOUND_ITEMS)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const handleButtonPress = (itemId: string, type: 'found' | 'return') => {
    setSelectedItemId(itemId)
    setModalType(type)
    setShowModal(true)
  }

  const handleConfirm = () => {
    if (selectedItemId) {
      if (modalType === 'found') {
        setLostItems(prev => prev.filter(item => item.id !== selectedItemId))
      } else {
        setFoundItems(prev => prev.filter(item => item.id !== selectedItemId))
      }
    }
    setShowModal(false)
    setSelectedItemId(null)
  }

  const currentItems = activeTab === 'lost' ? lostItems : foundItems

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Hồ sơ</Text>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#999" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>Nguyễn Văn A</Text>
            <TouchableOpacity>
              <Ionicons name="pencil" size={16} color="#333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainer}>
        {currentItems.length === 0 ? (
          <Text style={styles.emptyText}>
            {activeTab === 'lost' ? 'Hiện không có đồ bị mất' : 'Hiện không có đồ nhặt được'}
          </Text>
        ) : (
          currentItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDate}>
                  {activeTab === 'lost' ? `Ngày báo mất: ${item.date}` : `Ngày nhặt được: ${item.date}`}
                </Text>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleButtonPress(item.id, activeTab === 'lost' ? 'found' : 'return')}
                >
                  <Text style={styles.actionButtonText}>
                    {activeTab === 'lost' ? 'Đã tìm thấy' : 'Đã trả lại'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showModal}
        transparent={true}
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
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginTop: 20,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
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
  listContainer: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
  itemCard: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#2B6CB0',
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
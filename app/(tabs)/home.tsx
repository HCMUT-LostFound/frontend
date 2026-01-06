import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState, useCallback } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@clerk/clerk-expo'
import { useFocusEffect } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { createOrGetChat } from '@/services/chatService'

const API_BASE = process.env.EXPO_PUBLIC_API_BASE

async function fetchPublicItems(token: string) {
  const res = await fetch(`${API_BASE}/api/items`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Fetch failed: ${res.status} - ${text}`)
  }
  return res.json()
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost')
  const [searchText, setSearchText] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Filter states
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)

  // Detail modal states
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)

  const { getToken } = useAuth()
  const router = useRouter()

  const handleChatWithUser = async (itemId: string) => {
    try {
      const token = await getToken()
      if (!token) return
      
      const chat = await createOrGetChat(token, itemId)
      setIsDetailModalVisible(false)
      // Navigate to chat tab with chat ID
      router.push({
        pathname: '/(tabs)/chat',
        params: { chatId: chat.id }
      })
    } catch (err) {
      console.error('Create chat error:', err)
    }
  }

  const loadItems = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      if (!token) return
      const data = await fetchPublicItems(token)
      // console.log(data)
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }

    // Delay giả lập loading
    // await new Promise(resolve => setTimeout(resolve, 800))

    // setItems(items)
    // setLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      loadItems()
    }, [])
  )

  // ===== TAG CATEGORIES ===== (giữ nguyên như cũ)
  const tagCategories = [
    {
      title: 'Loại đồ vật',
      data: [
        'Ba lô', 'Túi xách', 'Ví tiền', 'Điện thoại', 'Laptop', 'Tai nghe',
        'Sạc pin', 'Bình nước', 'Ô (dù)', 'Chìa khóa', 'Thẻ sinh viên',
        'Sách vở', 'Áo khoác', 'Mũ nón', 'Kính mắt',
      ],
    },
    {
      title: 'Màu sắc',
      data: ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Xám', 'Nâu', 'Hồng'],
    },
    {
      title: 'Chất liệu / Đặc điểm',
      data: ['Da', 'Vải', 'Nhựa', 'Kim loại'],
    },
    {
      title: 'Địa điểm',
      data: [
        'Thư viện', 'Thư viện Tạ Quang Bửu', 'Căng tin', 'Nhà ăn sinh viên',
        'Ký túc xá', 'KTX Khu A', 'KTX Khu B', 'Giảng đường', 'Tòa nhà H1',
        'Tòa nhà H2', 'Tòa nhà H3', 'Tòa nhà H6', 'Sân bóng đá',
        'Nhà học thể dục', 'Cổng phụ', 'Khu tự học', 'Cổng chính',
        'Phòng thí nghiệm', 'Hành lang',
      ],
    },
  ]

  const filteredItems = items
    .filter(item => item.type === activeTab)
    .filter(item => {
      if (selectedTags.length === 0) return true
      const itemTags = item.tags ?? []
      return selectedTags.some(tag => itemTags.includes(tag))
    })
    .filter(item =>
      searchText === '' ||
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.location.toLowerCase().includes(searchText.toLowerCase())
    )

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const clearFilter = () => setSelectedTags([])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo, Title, Search, Tabs giữ nguyên */}
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} />
        </View>

        <Text style={styles.title}>Bạn đang tìm đồ thất lạc?</Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm món đồ"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Feather name="sliders" size={20} color="#666" />
            {selectedTags.length > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{selectedTags.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {['lost', 'found'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'lost' ? 'Đồ bị mất' : 'Đồ nhặt được'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Items List */}
        <View style={styles.itemList}>
          {filteredItems.length === 0 ? (
            <Text style={styles.emptyText}>Không tìm thấy món đồ nào.</Text>
          ) : (
            filteredItems.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSelectedItem(item)
                  setIsDetailModalVisible(true)
                }}
                activeOpacity={0.7}
              >
                <View style={styles.itemCard}>
                  {/* Phần trên: Hình + Thông tin */}
                  <View style={styles.cardTop}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: item.imageUrls?.[0] ?? 'https://via.placeholder.com/127',
                        }}
                        style={styles.itemImage}
                      />
                    </View>

                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode="tail">
                        {item.title}
                      </Text>

                      <View style={styles.itemRow}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.itemText}>
                          {item.location}{item.campus ? ` (${item.campus})` : ''}
                        </Text>
                      </View>

                      <View style={styles.itemRow}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.itemText}>
                          {item.lostAt
                            ? new Date(item.lostAt).toLocaleDateString('vi-VN')
                            : '—'}
                        </Text>
                      </View>

                      {/* User info */}
                      {item.user && (
                        <View style={styles.itemRow}>
                          <Ionicons name="person-outline" size={16} color="#666" />
                          <Text style={styles.itemText} numberOfLines={1}>
                            {item.user.fullName || 'Người dùng'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Phần dưới: Tags - tự động wrap và tăng chiều cao */}
                  <View style={styles.tagsContainer}>
                    {(item.tags ?? []).map((tag: string) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* FILTER MODAL giữ nguyên */}
      <Modal visible={isFilterModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setIsFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Lọc theo thẻ</Text>
                  <Ionicons
                    name="close"
                    size={24}
                    color="#666"
                    onPress={() => setIsFilterModalVisible(false)}
                  />
                </View>

                {selectedTags.length > 0 && (
                  <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
                    <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
                  </TouchableOpacity>
                )}

                <ScrollView showsVerticalScrollIndicator={false}>
                  {tagCategories.map(category => (
                    <View key={category.title} style={styles.categorySection}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <View style={styles.categoryTags}>
                        {category.data.map(tag => {
                          const selected = selectedTags.includes(tag)
                          return (
                            <TouchableOpacity
                              key={tag}
                              style={[
                                styles.filterTag,
                                selected && styles.filterTagSelected,
                              ]}
                              onPress={() => toggleTag(tag)}
                            >
                              <Text
                                style={[
                                  styles.filterTagText,
                                  selected && styles.filterTagTextSelected,
                                ]}
                              >
                                {tag}
                              </Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => setIsFilterModalVisible(false)}
                >
                  <Text style={styles.applyButtonText}>
                    Xác nhận ({selectedTags.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* DETAIL MODAL - Popup chi tiết đồ vật */}
      <Modal visible={isDetailModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsDetailModalVisible(false)}>
          <View style={styles.detailOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.detailContent}>
                {/* Close button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsDetailModalVisible(false)}
                >
                  <Ionicons name="close-circle" size={32} color="#666" />
                </TouchableOpacity>

                {/* Item image */}
                <Image
                  source={{
                    uri: selectedItem?.imageUrls?.[0] ?? 'https://via.placeholder.com/350',
                  }}
                  style={styles.detailImage}
                />

                {/* Title */}
                <Text style={styles.detailTitle}>{selectedItem?.title}</Text>

                {/* Reporter info with chat icon */}
                <View style={styles.detailSection}>
                  <View style={styles.detailIconCircle}>
                    <Ionicons name="person" size={28} color="#718096" />
                  </View>
                  <View style={[styles.detailTextBlock, { flex: 1 }]}>
                    <Text style={styles.detailLabel}>
                      {selectedItem?.type === 'lost' ? 'Người báo mất' : 'Người nhặt được'}
                    </Text>
                    <View style={styles.userInfoRow}>
                      {selectedItem?.user?.avatarUrl ? (
                        <Image 
                          source={{ uri: selectedItem.user.avatarUrl }} 
                          style={styles.userAvatar}
                        />
                      ) : null}
                      <Text style={styles.detailValue}>
                        {selectedItem?.user?.fullName ?? "-"}
                      </Text>
                    </View>
                  </View>
                  {selectedItem?.id && (
                    <TouchableOpacity
                      style={styles.chatIconButton}
                      onPress={() => handleChatWithUser(selectedItem.id)}
                    >
                      <Ionicons name="chatbubble-ellipses" size={24} color="#2B6CB0" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Description */}
                <Text style={styles.detailDescription}>{selectedItem?.description}</Text>

                {/* Location */}
                <View style={styles.detailSection}>
                  <View style={styles.detailIconCircle}>
                    <Ionicons name="location-outline" size={28} color="#718096" />
                  </View>
                  <View style={styles.detailTextBlock}>
                    <Text style={styles.detailLabel}>Địa điểm</Text>
                    <Text style={styles.detailValue}>
                      {selectedItem
                        ? `${selectedItem.location}, ${selectedItem.campus}`
                        : '—'}
                    </Text>

                  </View>
                </View>

                {/* Time */}
                <View style={styles.detailSection}>
                  <View style={styles.detailIconCircle}>
                    <Ionicons name="calendar-outline" size={28} color="#718096" />
                  </View>
                  <View style={styles.detailTextBlock}>
                    <Text style={styles.detailLabel}>Thời gian</Text>
                    <Text style={styles.detailValue}>
                      {selectedItem?.lostAt
                        ? new Date(selectedItem.lostAt).toLocaleDateString('vi-VN')
                        : '—'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff4f8', paddingHorizontal: 20 },
  logoContainer: { alignItems: 'center', marginVertical: 20 },
  logoImage: { width: 150, height: 150, resizeMode: 'contain' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E1E1E', marginBottom: 20 },
  searchContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tab: { width: '48%', paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#2B6CB0' },
  tabText: { fontSize: 14, color: '#666', fontWeight: '500' },
  activeTabText: { color: '#2B6CB0', fontWeight: '600' },
  itemList: { gap: 15, paddingBottom: 20 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },

  // ===== CARD MỚI - ĐÃ CẬP NHẬT =====
  itemCard: {
    width: 390,
    minHeight: 201, // tối thiểu như thiết kế ban đầu
    backgroundColor: '#eff4f8',
    borderRadius: 12,
    overflow: 'hidden',
    borderBottomWidth: 2,   // đường kẻ ngang đậm hơn ở dưới cùng
    borderBottomColor: '#DDDDDD',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 8,
  },
  cardTop: {
    width: 390,
    height: 152,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 127,
    height: 127,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 127,
    height: 127,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
    height: 127,
    marginLeft: 25,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#171923',
    lineHeight: 24,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemText: {
    fontSize: 16,
    color: '#171923',
    marginLeft: 6,
  },
  tagsContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignContent: 'flex-start',
  },
  tag: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#E8F4FD',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2B6CB0',
  },
  chatButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#2B6CB0',
  },
  tagText: {
    fontSize: 16,
    color: '#718096',
    fontWeight: '500',
  },

  // Modal styles giữ nguyên...
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E1E1E' },
  clearButton: { alignSelf: 'flex-end', marginBottom: 10 },
  clearButtonText: { color: '#2B6CB0', fontSize: 14 },
  categorySection: { marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: '600', color: '#1E1E1E', marginBottom: 10 },
  categoryTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterTagSelected: { backgroundColor: '#2B6CB0' },
  filterTagText: { color: '#666', fontSize: 14 },
  filterTagTextSelected: { color: '#fff', fontWeight: '600' },
  applyButton: {
    backgroundColor: '#2B6CB0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // ===== DETAIL MODAL STYLES =====
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 20,
  },
  detailSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EAF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailTextBlock: {
    flex: 1,
    paddingTop: 4,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  chatIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#EBF8FF',
    marginLeft: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  detailDescription: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 20,
  },
})
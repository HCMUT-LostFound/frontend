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

  const { getToken } = useAuth()

  const loadItems = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      if (!token) return
      const data = await fetchPublicItems(token)
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadItems()
    }, [])
  )

  // ===== TAG CATEGORIES =====
  const tagCategories = [
    {
      title: 'Loại đồ vật',
      data: [
        'Ba lô',
        'Túi xách',
        'Ví tiền',
        'Điện thoại',
        'Laptop',
        'Tai nghe',
        'Sạc pin',
        'Bình nước',
        'Ô (dù)',
        'Chìa khóa',
        'Thẻ sinh viên',
        'Sách vở',
        'Áo khoác',
        'Mũ nón',
        'Kính mắt',
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
        'Thư viện',
        'Thư viện Tạ Quang Bửu',
        'Căng tin',
        'Nhà ăn sinh viên',
        'Ký túc xá',
        'KTX Khu A',
        'KTX Khu B',
        'Giảng đường',
        'Tòa nhà H1',
        'Tòa nhà H2',
        'Tòa nhà H3',
        'Tòa nhà H6',
        'Sân bóng đá',
        'Nhà học thể dục',
        'Cổng phụ',
        'Khu tự học',
        'Cổng chính',
        'Phòng thí nghiệm',
        'Hành lang',
      ],
    },
  ]

  // ===== FILTER LOGIC =====
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
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
          />
        </View>

        <Text style={styles.title}>Bạn đang tìm đồ thất lạc?</Text>

        {/* Search */}
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

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['lost', 'found'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === 'lost' ? 'Đồ bị mất' : 'Đồ nhặt được'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Items */}
        <View style={styles.itemList}>
          {filteredItems.length === 0 ? (
            <Text style={styles.emptyText}>Không tìm thấy món đồ nào.</Text>
          ) : (
            filteredItems.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <Image
                  source={{
                    uri: item.imageUrls?.[0] ?? 'https://via.placeholder.com/100',
                  }}
                  style={styles.itemImage}
                />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>

                  <View style={styles.itemRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.itemText}>
                      {item.location} ({item.campus})
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
                </View>

                <View style={styles.tagsContainer}>
                  {(item.tags ?? []).map((tag: string) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* FILTER MODAL */}
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
                    onPress={() => setIsFilterModalVisible(false)}
                  />
                </View>

                {selectedTags.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearFilter}
                  >
                    <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
                  </TouchableOpacity>
                )}

                <ScrollView>
                  {tagCategories.map(category => (
                    <View key={category.title} style={styles.categorySection}>
                      <Text style={styles.categoryTitle}>
                        {category.title}
                      </Text>
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
                                  selected &&
                                    styles.filterTagTextSelected,
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
    </SafeAreaView>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eff4f8', paddingHorizontal: 20 },
  logoContainer: { alignItems: 'center', marginVertical: 20 },
  logoImage: { width: 150, height: 150 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  searchContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  searchInput: { flex: 1, marginLeft: 10 },
  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  filterBadgeText: { color: '#fff', fontSize: 12 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tab: { width: '48%', paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#2B6CB0' },
  tabText: { color: '#666' },
  activeTabText: { color: '#2B6CB0', fontWeight: '600' },
  itemList: { gap: 15 },
  emptyText: { textAlign: 'center', marginTop: 40 },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemImage: { width: 100, height: 100, borderRadius: 10 },
  itemInfo: { marginLeft: 10 },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemText: { marginLeft: 5 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  tagText: { fontSize: 12 },
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  clearButton: { alignSelf: 'flex-end', marginBottom: 10 },
  clearButtonText: { color: '#2B6CB0' },
  categorySection: { marginBottom: 20 },
  categoryTitle: { fontWeight: '600', marginBottom: 10 },
  categoryTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterTagSelected: { backgroundColor: '#2B6CB0' },
  filterTagText: { color: '#666' },
  filterTagTextSelected: { color: '#fff', fontWeight: '600' },
  applyButton: {
    backgroundColor: '#2B6CB0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: { color: '#fff', fontWeight: '600' },
})

import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SAMPLE_ITEMS = [
  {
    id: '1',
    title: 'Balo da',
    location: 'CS2, H1-304',
    date: '26/10/2025',
    tags: ['Ba lô', 'Da', 'Nâu'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
  },
  {
    id: '2',
    title: 'Balo da',
    location: 'CS2, H1-304',
    date: '26/10/2025',
    tags: ['Ba lô', 'Da', 'Nâu'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
  },
  {
    id: '3',
    title: 'Balo da',
    location: 'CS2, H1-304',
    date: '26/10/2025',
    tags: ['Ba lô', 'Da', 'Nâu'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200',
  },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost')
  const [searchText, setSearchText] = useState('')

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Bạn đang tìm đồ thất lạc?</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm món đồ"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={20} color="#666" />
          </TouchableOpacity>
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
        <View style={styles.itemList}>
          {SAMPLE_ITEMS.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.itemRow}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.itemText}>{item.location}</Text>
                </View>
                <View style={styles.itemRow}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.itemText}>{item.date}</Text>
                </View>
              </View>
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff4f8',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F4FD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  logoImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
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
  filterButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E3A8A',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
  },
  activeTabText: {
    color: '#1E3A8A',
    fontWeight: '600',
  },
  itemList: {
    gap: 15,
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    gap: 8,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
})
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, Pressable, Alert, ScrollView, StatusBar, Modal, FlatList, View, TouchableOpacity } from 'react-native'
import FormInput from '../components/FormInput'
import ImageUploader from '../components/ImageUploader'
import { COLORS } from '../constants'
import { MotiView } from 'moti'
import { NavigationBar } from '@zoontek/react-native-navigation-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getProductByUid, updateProduct, getCategories } from '../database/db'
import { Check } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

const EditProductScreen: React.FC = () => {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { uid } = route.params || {}

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!uid) return
      try {
        const p: any = await getProductByUid(uid)
        if (!p) return
        if (!mounted) return
        setName(p.name || '')
        setDescription(p.description || '')
        setPrice(p.price || '')
        setCategory(p.category || '')
        setStock(String(p.stock ?? ''))
        let imgs = p.images
        if (typeof imgs === 'string') {
          try { imgs = JSON.parse(imgs) } catch { imgs = imgs ? [imgs] : [] }
        }
        if (imgs && Array.isArray(imgs) && imgs.length > 0) setSelectedImage(imgs[0])
      } catch (err) {
        console.warn('load product error', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [uid])

  useEffect(() => {
    let mounted = true
    const loadCategories = async () => {
      try {
        const res: any = await getCategories()
        let rows: any[] = []
        if (!res) rows = []
        else if (Array.isArray(res)) rows = res
        else if (res._array) rows = res._array
        else if (res.rows && Array.isArray(res.rows)) rows = res.rows
        else if (res.rows && typeof res.rows.length === 'number') {
          const arr: any[] = []
          for (let i = 0; i < res.rows.length; i++) {
            if (typeof res.rows.item === 'function') arr.push(res.rows.item(i))
            else arr.push(res.rows[i])
          }
          rows = arr
        } else if (res.rows) rows = res.rows
        if (mounted) setCategories(rows.map((r: any) => ({ id: r.id ?? r._id ?? r.name, name: String(r.name) })))
      } catch (err) {
        console.warn('loadCategories error', err)
      }
    }
    loadCategories()
    return () => { mounted = false }
  }, [])

  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter product name')
      return
    }

    let imagesForDb: any = null
    try {
      if (!selectedImage) imagesForDb = null
      else if (Array.isArray(selectedImage)) {
        imagesForDb = selectedImage.map((it: any) => (typeof it === 'string' ? it : it?.uri ?? it))
      } else if (typeof selectedImage === 'string') {
        imagesForDb = [selectedImage]
      } else if (selectedImage?.uri) {
        imagesForDb = [selectedImage.uri]
      } else {
        imagesForDb = [selectedImage]
      }
    } catch {
      imagesForDb = null
    }

    try {
      await updateProduct(uid, { name, description, price, category, stock: Number(stock) || 0, images: imagesForDb })
      Alert.alert('Saved', 'Product updated')
      navigation.goBack()
    } catch (err: any) {
      console.warn('updateProduct error', err)
      Alert.alert('Error', err?.message || 'Failed to update product')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.primaryDarkGrey}
        barStyle="light-content"
        translucent={false}
      />

      <NavigationBar backgroundColor={COLORS.primaryGrey} barStyle='default' />
      <ScrollView contentContainerStyle={styles.content}>
        <MotiView from={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 320 }} style={styles.fullWidth}>
          <Text style={styles.title}>Edit Product</Text>

          <Text style={styles.sectionLabel}>Image</Text>
          <ImageUploader selected={selectedImage} onChange={(img) => setSelectedImage(img)} />

          <FormInput label="Name" value={name} placeholder="Product name" onChangeText={setName} />
          <FormInput label="Description" value={description} placeholder="Short description" onChangeText={setDescription} multiline />
          <FormInput label="Price" value={price} placeholder="$0.00" onChangeText={setPrice} keyboardType="numeric" />
          <Text style={styles.sectionLabel}>Category</Text>
          <Pressable style={styles.selector} onPress={() => setCategoryModalVisible(true)}>
            <Text style={styles.selectorText}>{category || 'Select a category'}</Text>
          </Pressable>

          <Modal visible={categoryModalVisible} transparent animationType="slide" onRequestClose={() => setCategoryModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select category</Text>
                <FlatList
                  data={categories}
                  keyExtractor={item => String(item.id)}
                  renderItem={({ item }) => (
                      <Pressable
                        style={[styles.categoryRow, item.name === category ? styles.categoryRowSelected : null]}
                        onPress={() => {
                          setCategory(item.name)
                          setCategoryModalVisible(false)
                        }}
                      >
                        <View style={styles.categoryRowInner}>
                          <Text style={styles.categoryRowText}>{item.name}</Text>
                          {item.name === category ? <Check color={COLORS.primaryColor} size={18} /> : null}
                        </View>
                      </Pressable>
                    )}
                  ListEmptyComponent={<Text style={styles.emptyText}>No categories yet</Text>}
                />

                <TouchableOpacity onPress={() => setCategoryModalVisible(false)} style={styles.modalClose}>
                  <Text style={styles.saveText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <FormInput label="Stock" value={stock} placeholder="0" onChangeText={setStock} keyboardType="numeric" />

          <Pressable style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveText}>Update Product</Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkGrey,
  },
  content: { padding: 16 },
  title: {
    color: COLORS.primaryWhite,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    fontSize: 13,
  },
  fullWidth: { width: '100%' },
  saveButton: {
    marginTop: 18,
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: COLORS.primaryWhite,
    fontWeight: '600',
    fontSize: 16,
  },
  selector: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.primaryGrey,
    borderRadius: 10,
    marginBottom: 8,
  },
  selectorText: {
    color: COLORS.primaryVeryWhite,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.primaryGrey,
    padding: 16,
    borderRadius: 12,
  },
  modalTitle: {
    color: COLORS.primaryVeryWhite,
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '700',
  },
  categoryRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  categoryRowSelected: {
    backgroundColor: 'rgba(255,255,255,0.02)'
  },
  categoryRowInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryRowText: {
    color: COLORS.primaryVeryWhite,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    padding: 12,
    textAlign: 'center',
  },
  modalClose: {
    marginTop: 12,
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
})
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Pressable, Alert, ScrollView, StatusBar, Dimensions, Modal, FlatList, View, TouchableOpacity } from 'react-native'
import FormInput from '../components/FormInput'
import ImageUploader from '../components/ImageUploader'
import { ProductData, COLORS } from '../constants'
import { MotiView } from 'moti'
import { NavigationBar } from '@zoontek/react-native-navigation-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { addProduct, getCategories } from '../database/db'
import { useNavigation } from '@react-navigation/native'
const { width } = Dimensions.get('window')
const AddProductScreen: React.FC = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [selectedImage, setSelectedImage] = useState<any>(ProductData[0]?.images ?? null)
  const [categories, setCategories] = useState<any[]>([])
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)

  const navigation = useNavigation<any>()

  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter product name')
      return
    }
    const uid = Math.random().toString(36).slice(2, 9)
    
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

    const newProduct = {
      uid,
      name,
      description,
      price: price || '$0.00',
      category: category || 'Uncategorized',
      stock: Number(stock) || 0,
      images: imagesForDb,
    }

    try {
      await addProduct(newProduct)
      Alert.alert('Saved', `${name} saved to database.`)
     
      setName('')
      setDescription('')
      setPrice('')
      setCategory('')
      setStock('')
      
      navigation.navigate('Inventory')
    } catch (err: any) {
      console.warn('addProduct error', err)
      Alert.alert('Error', err?.message || 'Failed to save product')
    }
  }

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
        if (mounted) setCategories(rows.map((r: any) => ({ id: r.id ?? r._id ?? r.uid ?? r.name, name: String(r.name) })))
      } catch (err) {
        console.warn('loadCategories error', err)
      }
    }
    loadCategories()
    return () => { mounted = false }
  }, [])

  

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
          <Text style={styles.title}>Add Product</Text>

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
                      style={styles.categoryRow}
                      onPress={() => {
                        setCategory(item.name)
                        setCategoryModalVisible(false)
                      }}
                    >
                      <Text style={styles.categoryRowText}>{item.name}</Text>
                    </Pressable>
                  )}
                  ListEmptyComponent={<Text style={styles.emptyText}>No categories yet</Text>}
                />

                <Pressable style={styles.modalClose} onPress={() => setCategoryModalVisible(false)}>
                  <Text style={styles.saveText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <FormInput label="Stock" value={stock} placeholder="0" onChangeText={setStock} keyboardType="numeric" />

          <TouchableOpacity onPress={onSave} style={styles.saveButton} >
            <Text style={styles.saveText}>Save Product</Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkGrey,
    marginBottom: width * 0.13,
    paddingBottom: width * 0.05,
  },
  content: {
    padding: 16,
  },
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
  fullWidth: {
    width: '100%',
  },
  imageListContent: {
    paddingVertical: 8,
  },
  thumbWrapper: {
    width: 88,
    height: 88,
    marginRight: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  thumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbSelected: {
    borderColor: COLORS.primaryColor,
    borderWidth: 2,
  },
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

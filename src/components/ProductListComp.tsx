import { FlatList, StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Logo, COLORS, FONT_FAMILY } from '../constants'
import { MotiImage, MotiView } from 'moti'
import { getProducts } from '../database/db'
import { useIsFocused } from '@react-navigation/native'
import { Trash2, Edit } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { deleteProduct } from '../database/db'

const ProductListComp = () => {
  const [products, setProducts] = useState<any[]>([])
  const focused = useIsFocused()
  const navigation = useNavigation<any>()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res: any = await getProducts()
        
        let rows: any[] = []
        if (!res) rows = []
        else if (Array.isArray(res)) rows = res
        else if (res._array) rows = res._array
        else if (res.rows && Array.isArray(res.rows)) rows = res.rows
        else if (res.rows && typeof res.rows.length === 'number') {
          // rows may be an object with item(i)
          const arr: any[] = []
          for (let i = 0; i < res.rows.length; i++) {
            if (typeof res.rows.item === 'function') arr.push(res.rows.item(i))
            else arr.push(res.rows[i])
          }
          rows = arr
        } else if (res.rows) rows = res.rows

        if (mounted) setProducts(rows)
      } catch (err) {
        console.warn('getProducts error', err)
        if (mounted) setProducts([])
      }
    }
    load()
    return () => { mounted = false }
  }, [focused])

  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products available</Text>
      </View>
    )
  }

  const RenderItem = ({ item, index }: any) => {
    try {
      
      let images: any = item.images
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images)
        } catch {
          
          images = images ? [images] : []
        }
      }
     
      if (images && !Array.isArray(images)) {
        images = [images]
      }
      const imageSource = Array.isArray(images) && images.length > 0 ? { uri: images[0] } : item.images || Logo.favicon
      return (
        <MotiView key={item.uid ?? item.id ?? index} style={styles.row}>
          <View style={styles.leftRow}>
            <View style={styles.imageWrapper}>
              <MotiImage
                source={imageSource}
                style={styles.imageStyle}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
              />
            </View>
            <MotiView
              from={{ opacity: 0, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 100 }}
              style={styles.meta}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.stock}>{String(item.stock ?? '0')} in stock</Text>
              <Text style={styles.category}>{item.category}</Text>
            </MotiView>
          </View>

          <View style={styles.actionsRight}>
            <Text style={styles.priceText}>${item.price ?? item.price}</Text>
            <View style={styles.actionButtons}>
              <Pressable
                style={styles.iconBtn}
                onPress={() => {
                  // navigate to edit screen
                  navigation.navigate('EditProduct', { uid: item.uid })
                }}
              >
                <Edit color={COLORS.primaryWhite} size={16} />
              </Pressable>

              <Pressable
                style={[styles.iconBtn, styles.deleteBtn]}
                onPress={() => {
                  Alert.alert('Delete', `Delete ${item.name}?`, [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deleteProduct(item.uid)
                          
                          const res: any = await getProducts()
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
                          setProducts(rows)
                        } catch (err) {
                          console.warn('deleteProduct error', err)
                          Alert.alert('Error', 'Failed to delete product')
                        }
                      }
                    }
                  ])
                }}
              >
                <Trash2 color={COLORS.primaryWhite} size={16} />
              </Pressable>
            </View>
          </View>
        </MotiView>
      )
    } catch (err) {
      console.warn('ProductList renderItem error', err)
      return null
    }
  }

  return (
    <View>
      <FlatList
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
        data={products}
        keyExtractor={item => (item.uid ?? String(item.id) ?? String(Math.random()))}
        renderItem={RenderItem}
      />
    </View>
  )
}

export default ProductListComp

const styles = StyleSheet.create({
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  imageWrapper:{
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    elevation:4,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.primaryVeryWhite,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.primaryGrey,
    borderRadius: 12,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  meta: {
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    color: COLORS.primaryVeryWhite,
    fontWeight: '600',
    fontFamily: FONT_FAMILY.dmsans_bold,
  },
  stock: {
    color: COLORS.primaryLightGrey1,
    fontSize: 14,
    fontFamily: FONT_FAMILY.dmsans_regular,
  },
  category: {
    color: COLORS.primaryLightGrey1,
    fontSize: 12,
    fontFamily: FONT_FAMILY.dmsans_regular,
  },
  priceWrapper:{
    minWidth: 70,
    alignItems: 'flex-end',
  },
  priceText:{
    color: COLORS.primaryVeryWhite,
    fontWeight: '700',
  }
  ,
  actionsRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  deleteBtn: {
    backgroundColor: COLORS.primaryColor
  }
})
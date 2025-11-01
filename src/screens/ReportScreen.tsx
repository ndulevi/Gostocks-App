import React, { useEffect, useState } from 'react'
import { StyleSheet, Text,  ScrollView, View, Image, Dimensions } from 'react-native'
import { COLORS } from '../constants'
import { MotiView } from 'moti'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getProducts } from '../database/db'
import { useIsFocused } from '@react-navigation/native'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width - 32

const ReportScreen: React.FC = () => {
  const [products, setProducts] = useState<any[]>([])
  const focused = useIsFocused()

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Inventory Report</Text>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {products.map((p) => {
          // normalize images to array and pick first
          let imgs: any = p.images
          if (typeof imgs === 'string') {
            try { imgs = JSON.parse(imgs) } catch { imgs = imgs ? [imgs] : [] }
          }
          if (imgs && !Array.isArray(imgs)) imgs = [imgs]
          const imageSource = Array.isArray(imgs) && imgs.length > 0 ? { uri: imgs[0] } : undefined

          return (
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 320 }}
              key={p.uid ?? p.id}
              style={styles.cardWrapper}
            >
              <View style={styles.card}>
                {imageSource ? <Image source={imageSource} style={styles.image} /> : <View style={[styles.image, styles.placeholderImage]} />}

                <View style={styles.info}>
                  <Text style={styles.name}>{p.name}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryText}>{p.category}</Text>
                    </View>

                    <View style={styles.stockWrap}>
                      <Text style={[styles.stockText, p.stock >= 10 ? styles.inStock : styles.lowStock]}>
                        {p.stock} left
                      </Text>
                    </View>
                  </View>

                  <Text numberOfLines={2} style={styles.desc}>{p.description}</Text>
                </View>
              </View>
            </MotiView>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReportScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkGrey,
  },
  header: {
    color: COLORS.primaryWhite,
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  scroll: {
    padding: 16,
    paddingBottom: 36,
  },
  cardWrapper: {
    marginBottom: 14,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.primaryGrey,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.primaryWhite,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: COLORS.primaryWhite,
    fontSize: 12,
  },
  stockWrap: {
    marginLeft: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inStock: {
    color: COLORS.primaryAccent,
  },
  lowStock: {
    color: '#FFB02E',
  },
  desc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 4,
  },
  placeholderImage: {
    backgroundColor: 'rgba(255,255,255,0.03)'
  }
})
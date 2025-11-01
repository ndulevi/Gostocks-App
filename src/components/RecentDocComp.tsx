import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Logo, COLORS, FONT_FAMILY } from '../constants'
import { MotiImage, MotiView } from 'moti'
import { TrendingDown, TrendingUp } from 'lucide-react-native'
import { getProducts } from '../database/db'
import { useIsFocused } from '@react-navigation/native'

const RecentDocComp = () => {
    const [items, setItems] = useState<any[]>([])
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

                
                const recent = rows.slice(0, 5)
                if (mounted) setItems(recent)
            } catch (err) {
                console.warn('load recent docs error', err)
                if (mounted) setItems([])
            }
        }
        if (focused) load()
        return () => { mounted = false }
    }, [focused])

   
    if (!items || items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={{ color: '#fff' }}>No recent documents</Text>
            </View>
        )
    }

    const RenderItem = ({ item, index }: any) => {
        try {
            
            let images: any = item.images
            if (typeof images === 'string') {
                try { images = JSON.parse(images) } catch { images = images ? [images] : [] }
            }
            if (images && !Array.isArray(images)) images = [images]
            const imageSource = Array.isArray(images) && images.length > 0 ? { uri: images[0] } : Logo.favicon
            return (
                <MotiView 
                key={item._id ?? index} 
                style={styles.row}
                from={{ opacity: 0, scale: 0 }}
                animate={{opacity:1, scale: 1}}
                transition={{ type: 'spring', duration: 1000 }}
                >
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
                    <MotiView
                        from={{ opacity: 0, translateY: 15 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 150 }}
                        style={styles.iconWrapper}
                    >
                        {Number(item.stock ?? 0) < 100 ? (
                            <TrendingDown size={24} color="red" />
                        ) : (
                            <TrendingUp size={24} color="green" />
                        )}
                    </MotiView>
                </MotiView>
            )
        } catch (err) {
            console.warn('RecentDoc renderItem error', err)
            return null
        }
    }

    return (
        <View>
            <FlatList
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
                data={items}
                keyExtractor={item => (item.uid ?? String(item.id) ?? String(Math.random()))}
                renderItem={RenderItem}
            />
        </View>
    )
}

export default RecentDocComp

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
        iconWrapper:{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.primaryLightGrey,
            alignItems: 'center',
            justifyContent: 'center',
        },
})
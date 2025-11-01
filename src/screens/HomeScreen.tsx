import { Dimensions, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONT_FAMILY } from '../constants'
import { NavigationBar } from '@zoontek/react-native-navigation-bar'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import HeaderComp from '../components/HeaderComp'
import SearchComp from '../components/SearchComp'
import SectionComp from '../components/SectionComp'
import { getProducts } from '../database/db'
import { useIsFocused } from '@react-navigation/native'
import RecentDocComp from '../components/RecentDocComp'

const {width} = Dimensions.get('window')
const HomeScreen = ({ navigation }: any) => {
  const [outAmount, setOutAmount] = useState('0')
  const [outLabel, setOutLabel] = useState('All in stock')
  const [lowAmount, setLowAmount] = useState('100+')
  const [lowLabel, setLowLabel] = useState('Each products')
  const [totalAmount, setTotalAmount] = useState('0')
  const focused = useIsFocused()

  useEffect(() => {
    changeNavigationBarColor('black', true); 
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(COLORS.primaryDarkGrey, true)
      const navBar: any = NavigationBar
      if (typeof navBar.setBackgroundColor === 'function') {
        navBar.setBackgroundColor(COLORS.primaryDarkGrey, true)
      } else {
        console.warn('NavigationBar.setBackgroundColor not available in this version of @zoontek/react-native-navigation-bar')
      }
    }
    }, []);

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

        const total = rows.length
        const outCount = rows.filter((p: any) => Number(p.stock ?? 0) === 0).length
        const lowCount = rows.filter((p: any) => Number(p.stock ?? 0) <= 100).length

        if (!mounted) return
        setTotalAmount(String(total))
        if (outCount > 0) {
          setOutAmount(String(outCount))
          setOutLabel('Out of Stock')
        } else {
          setOutAmount('0')
          setOutLabel('All in stock')
        }

        if (lowCount > 0) {
          setLowAmount(String(lowCount))
          setLowLabel('Low Stock')
        } else {
          setLowAmount('0')
          setLowLabel('All Sufficient')
        }
      } catch (err) {
        console.warn('load home stats error', err)
      }
    }
    if (focused) load()
    return () => { mounted = false }
  }, [focused])
  return (
    
    <SafeAreaView style={[styles.container,]}>
      <StatusBar
        backgroundColor={COLORS.primaryDarkGrey}
        barStyle="light-content"
        translucent={false}
      />

  <NavigationBar backgroundColor={COLORS.primaryGrey} barStyle='default' />
   <HeaderComp navigation={navigation} />
      <ScrollView>
      <View>
       
        
          <SearchComp/>
        <View style={styles.SectionCompContainer}>
          <SectionComp
            name='PackageOpen'
            Amount={outAmount}
            label={outLabel}
          />
          <SectionComp
            name='PackageMinus'
            Amount={lowAmount}
            label={lowLabel}
          />
          <SectionComp
            name='Boxes'
            Amount={totalAmount}
            label={'Total Product'}
          />
        </View>
        <View style={styles.documentHeader}>
          <Text style={styles.recentText}>Recent Documents</Text>
          <TouchableOpacity
          onPress={()=>{

          }}
          >
            <Text style={styles.viewText}>View All</Text>
          </TouchableOpacity>
        </View>
        <RecentDocComp/>
        
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: COLORS.primaryDarkGrey,
    marginBottom: width * 0.13,
  },
  SectionCompContainer:{
    flexDirection:'row', 
    justifyContent:'space-between', 
    paddingHorizontal:16,
    gap: 12,
    marginBottom: width * 0.05,
  },
  documentHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:16,
    alignItems:'center',
  },
  recentText:{
    color: COLORS.primaryWhite,
    fontSize: 18,
    fontFamily: FONT_FAMILY.dmsans_bold,
  },
  viewText:{
    color: COLORS.primaryWhite,
    fontSize: 14,
    fontFamily: FONT_FAMILY.dmsans_regular,
  },

 
})
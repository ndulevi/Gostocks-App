import { ScrollView, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationBar } from '@zoontek/react-native-navigation-bar'
import { COLORS } from '../constants'
import SearchComp from '../components/SearchComp'
import ProductListComp from '../components/ProductListComp'

const InventoryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.primaryDarkGrey}
        barStyle="light-content"
        translucent={false}
      />

      <NavigationBar backgroundColor={COLORS.primaryGrey} barStyle='default' />
      <ScrollView>
        <SearchComp/>
        <ProductListComp />
      </ScrollView>
    </SafeAreaView>
  )
}

export default InventoryScreen

const styles = StyleSheet.create({
  container:{
  flex: 1,
  backgroundColor: COLORS.primaryDarkGrey,
  }
})
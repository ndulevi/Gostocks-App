import React from 'react'
import { StyleSheet, Text } from 'react-native'
import SettingRow from '../components/SettingRow'
import { COLORS } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MotiView } from 'moti'


const SettingScreen: React.FC = ({navigation} : any) => {

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.primaryDarkGrey }]}>
      <Text style={styles.header}>Settings</Text>

      <MotiView 
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100 }}
      style={styles.list}>
        <SettingRow
          label="Customers"
          onPress={() => navigation.navigate('Customers')}
        />

        <SettingRow
          label="Categories"
          onPress={() => navigation.navigate('CategoryList')}
        />
      </MotiView>
    </SafeAreaView>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  header: {
    color: COLORS.primaryWhite,
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  list: {
    marginTop: 8,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
})
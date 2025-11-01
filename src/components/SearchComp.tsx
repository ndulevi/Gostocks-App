import { Dimensions, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AlignHorizontalDistributeCenter, Search } from 'lucide-react-native'
import { COLORS } from '../constants'

const {width, height} = Dimensions.get('window')

const SearchComp = () => {
  const [value, setValue] = useState('')
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Search size={20} color={COLORS.primaryVeryWhite} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor={COLORS.primaryVeryWhite}
          value={value}
          onChangeText={setValue}
          style={styles.input}
          returnKeyType="search"
        />
      </View>
       <TouchableOpacity style={styles.filterIcon}>
        <AlignHorizontalDistributeCenter size={24} color={COLORS.primaryVeryWhite} />
       </TouchableOpacity>
    </View>
  )
}

export default SearchComp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginTop: width * 0.08,
    marginBottom: width * 0.10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryGrey,
    paddingHorizontal: 12,
    borderRadius: 25,
    height: 50,
    width: '85%',
    
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.primaryVeryWhite,
    paddingVertical: 0,
  },
  filterIcon:{
    backgroundColor: COLORS.primaryGrey,
    padding: 10,
    borderRadius: 25,
  }
})
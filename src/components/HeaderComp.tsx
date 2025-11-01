import { Image, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { PackagePlus } from 'lucide-react-native'
import { COLORS } from '../constants'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { MainTabParamList } from '../types'
import { useNavigation } from '@react-navigation/native';

type MainTabProp = BottomTabNavigationProp<MainTabParamList, 'AddProduct'>;

const HeaderComp = () => {
  const navigation = useNavigation<MainTabProp>();

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.logoBackground}
        onPress={()=>{
        navigation.navigate('Settings')
        }}
        >
            <Image 
                source={require('../assets/images/profile.jpeg')} 
                style={[styles.logo]}
            />
        </Pressable>
      <View style={styles.left}>
        
        
        <Pressable 
        style={styles.logoBackground}
    onPress={()=>{
      navigation.navigate('AddProduct')
    }}
        >
            <PackagePlus size={26} color={COLORS.primaryWhite} />
        </Pressable>
      </View>
      
    </View>
  )
}

export default HeaderComp

const styles = StyleSheet.create({
    container:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 18,
    resizeMode: 'contain',
  },
  logoBackground:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
    left:{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center',
    },
})
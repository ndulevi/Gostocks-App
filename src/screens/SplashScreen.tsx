import { ImageBackground, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { useEffect } from 'react'
import { MotiImage, MotiText, MotiView } from 'moti'
import { COLORS, FONT_FAMILY, Logo } from '../constants'
import { RootNavParamList } from '../types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigatorProp } from '@react-navigation/native-stack'
import changeNavigationBarColor from 'react-native-navigation-bar-color'


type NativeStackProp = NativeStackNavigatorProp<RootNavParamList, 'Login'>

const SplashScreen = () => {
  useEffect(() => {
    changeNavigationBarColor('black', true); 
    }, []);
  const navigation = useNavigation<NativeStackProp>();
  setTimeout(()=>{
    navigation.navigate('Login');
  }, 2000)
  return (
    <ImageBackground
     source={Logo.backgroungImage}
     style={styles.background}
     resizeMode="cover"
    >
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 1000 }}
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        >
          <MotiImage 
            source={Logo.image} 
            style={styles.logo}
          />
          <MotiText style={styles.logoText}>GOSTOCKS</MotiText>
        </MotiView>
      </View>
    </ImageBackground>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  background:{
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    width: 90,
    height: 70,
    marginBottom: 10,
  },
  logoText:{
    fontSize: 30,
    fontFamily: FONT_FAMILY.dmsans_bold,
    color: COLORS.primaryVeryWhite,
  }
})
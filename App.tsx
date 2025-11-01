import 'react-native-reanimated'
import 'react-native-gesture-handler'
import {  StyleSheet} from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNativeStackNavigation from './src/navigations/RootNativeStackNavigation';
import { initDB } from './src/database/db'
const App = () => {
  useEffect(() => {
  initDB();
  // StatusBar.setBackgroundColor(COLORS.primaryDarkGrey, true)
}, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <RootNativeStackNavigation/>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App

const styles = StyleSheet.create({
  container:{
    flex: 1,
  }
})
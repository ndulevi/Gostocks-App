import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootNavParamList } from '../types';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import MainTabNav from './MainTabNav';
import Customers from '../screens/Customers';
import CategoryList from '../screens/CategoryListNew';
import AddCategory from '../screens/AddCategory';
import EditProductScreen from '../screens/EditProductScreen';

const Stack = createNativeStackNavigator<RootNavParamList>();

const RootNativeStackNavigation = () => {
  return (
     <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTab" component={MainTabNav} />
      <Stack.Screen name="Customers" component={Customers} />
  <Stack.Screen name="CategoryList" component={CategoryList} />
  <Stack.Screen name="AddCategory" component={AddCategory} />
  <Stack.Screen name="EditProduct" component={EditProductScreen} />
    </Stack.Navigator>
  )
}

export default RootNativeStackNavigation

const styles = StyleSheet.create({})
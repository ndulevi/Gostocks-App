import { StyleSheet} from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MainTabParamList } from '../types'
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ReportScreen from '../screens/ReportScreen';
import SettingScreen from '../screens/SettingScreen';
import TabBarComp from '../components/TabBarComp';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNav = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}
     tabBar={(props) => 
     <TabBarComp 
      onChange={()=> { }}
        data={[
          {lable: "Home", name: 'Warehouse', route: 'Home' },
          {lable: "Inventory", name: 'FileBox', route: 'Inventory' },
          {lable: "AddProduct", name: 'PackagePlus', route: 'AddProduct' },
          {lable: "Report", name: 'ChartNoAxesCombined', route: 'Report' },
          {lable: "Settings", name: 'Settings', route: 'Settings' },
        ]}
      {...props}/>}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="AddProduct" component={AddProductScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  )
}

export default MainTabNav

const styles = StyleSheet.create({})
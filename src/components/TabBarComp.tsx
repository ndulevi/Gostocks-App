import { Dimensions, Pressable, StyleSheet, TouchableOpacity, View} from 'react-native'
import React from 'react'
import { MotiView } from 'moti'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { icons } from 'lucide-react-native'
import { COLORS } from '../constants'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Animated, { FadeInRight, FadeOutRight, LinearTransition } from 'react-native-reanimated'
 const { width } = Dimensions.get('window');
type  iconName = keyof typeof icons
type iconProps ={
  name: iconName;
  color: string;
  size?: number;
}
function Icon({ name, color, size = 20} : iconProps) {
  const IconComponent = icons[name]

  return <IconComponent color={color} size={size} />
}
type dataItem ={
  lable: string;
  route: string;
  name: iconName;
}
type CustomTabBar = BottomTabBarProps & {
  data: dataItem[],
  onChange: (index: any) => void;
}
const TabBarComp: React.FC<CustomTabBar> = ({data, onChange, state}) => {
    // const {bottom} = useSafeAreaInsets()
    const {width} = Dimensions.get('window')
    const navigation = useNavigation();
  return (
    <>
    <MotiView
    // from={{ opacity: 0, scale: 0}}
    //   animate={{ opacity: 1, scale: 0}}
    //   transition={{
    //     type: 'spring',
    //     damping: 80,
    //     stiffness: 100,
    //   }}
    style={[styles.container, ]}
    >
     {data.map((item, index)=>{
        const isSelected = state.index === index
        const isAddProduct = item.route === 'AddProduct';
        if (!isAddProduct) {
        return(
            <MotiView
            key={index}
            layout={LinearTransition.springify().damping(80).stiffness(200)}
            animate={styles.itemview }
            >
            <Pressable
            onPress={()=>{
                onChange?.(index)
                navigation.navigate('MainTab', {screen: item.route})
            }}
            style={[styles.itemButton]}
            >   
                <View style={[isSelected ? styles.iconSelected : styles.iconDefault]}>
                  <Icon name={item.name} color={

                     isSelected
                    ? COLORS.primaryColor
                    : COLORS.primaryVeryWhite
                    }
                    />
                </View>
                
                  
                    <Animated.Text
                    style={[styles.text, {color: isSelected ? COLORS.primaryColor : COLORS.primaryVeryWhite}]}
                      exiting={FadeOutRight.springify().damping(80).stiffness(200)}
                      entering={FadeInRight.springify().damping(80).stiffness(200)}
                      >
                        {item.lable}
                    </Animated.Text>
                  
                
                  
                
            </Pressable>
            </MotiView>
        );
      }
     })}
    </MotiView>
    <TouchableOpacity
      onPress={() => {
        const addIndex = data.findIndex((d) => d.route === 'AddProduct');
        onChange?.(addIndex);
        navigation.navigate('MainTab', { screen: 'AddProduct' });
      }}
      style={styles.addButtonWrapper}
    >
      <View style={styles.addButtonContainer}>
        <Icon name="PackagePlus" color={COLORS.primaryVeryWhite} size={30} />
      </View>
    </TouchableOpacity>
    </>
  );
};

export default TabBarComp

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primaryGrey,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    zIndex: 1, // keep it under the Add button
  },

  itemview: {
    marginBottom: width * 0.025,
  },

  itemButton: {
    borderRadius: 50,
    flexDirection: 'column',
    alignItems: 'center',
  },

  text: {
    fontSize: 15,
    fontWeight: '500',
  },

  iconSelected: {
    shadowColor: COLORS.primaryColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  iconDefault: {},


  addButtonWrapper: {
    position: 'absolute',
    bottom: 50, 
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 20, 
  },

  addButtonContainer: {
    backgroundColor: COLORS.primaryColor,
    borderRadius: 40,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: COLORS.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  addButtonIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

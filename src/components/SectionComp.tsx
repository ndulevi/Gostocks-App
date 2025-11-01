import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MotiView } from 'moti'
import { icons } from 'lucide-react-native'
import { COLORS, FONT_FAMILY } from '../constants'
 
const {width} = Dimensions.get('window')

type iconName = keyof typeof icons
type iconProps ={
  name: iconName;
  color: string;
  size?: number;
}
function Icon({ name, color, size = 20} : iconProps) {
    const IconComponent = icons[name];
    return <IconComponent color={color} size={size} />
}

type dataItem ={
    Amount: string;
    label: string;
    name: iconName;
}
const SectionComp: React.FC<dataItem> = ({Amount, label, name}) => {
  return (
    <MotiView
    from={{opacity: 0, scaleX: 0, scaleY: 0}}
    animate={{opacity: 1, scaleX: 1, scaleY: 1}}
    transition={{
        type: 'spring',
        damping: 80,
        stiffness: 100,
    }}
    style={styles.container}
    >
        <View style={styles.iconWrapper}>
            <Icon name={name} color={COLORS.primaryColor} size={20} />
        </View>
        <Text style={styles.amountText}>{Amount}</Text>
        <Text style={styles.lableText}>{label}</Text>
    </MotiView>
  )
}

export default SectionComp

const styles = StyleSheet.create({
    container:{
    backgroundColor: COLORS.primaryGrey,
    padding: 16,
    width: width * 0.27, 
    flex: 1,
    borderRadius: 16,
    gap: 8,
    justifyContent: 'center',
    alignItems: 'flex-start'
    },
    iconWrapper:{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryLightGrey,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    amountText:{
        color: COLORS.primaryWhite,
        fontSize: 16,
        fontFamily: FONT_FAMILY.dmsans_bold
    },
    lableText:{
        color: COLORS.primaryLightGrey1,
        fontSize: 13,
        fontFamily: FONT_FAMILY.dmsans_regular
    }
})
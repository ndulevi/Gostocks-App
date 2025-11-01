import React from 'react'
import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import { MotiView } from 'moti'
import { COLORS, FONT_FAMILY } from '../constants'

type Props = {
  label?: string
  value: string
  placeholder?: string
  onChangeText: (text: string) => void
  keyboardType?: 'default' | 'numeric' | 'email-address'
  multiline?: boolean
  style?: ViewStyle
  rightComponent?: React.ReactNode
}

const FormInput: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  style,
  rightComponent,
}) => {
  return (
    <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }} style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={'rgba(255,255,255,0.35)'}
          onChangeText={onChangeText}
          style={[styles.input, multiline && styles.multiline]}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
        />
        {rightComponent ? <View style={styles.right}>{rightComponent}</View> : null}
      </View>
    </MotiView>
  )
}

export default FormInput

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  label: {
    color: COLORS.primaryWhite,
    marginBottom: 6,
    fontSize: 15,
    fontFamily: FONT_FAMILY.dmsans_bold,
  },
  row: {
    backgroundColor: COLORS.primaryGrey,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: COLORS.primaryWhite,
    flex: 1,
    fontSize: 15,
    fontFamily: FONT_FAMILY.dmsans_bold,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  right: {
    marginLeft: 8,
  },
})

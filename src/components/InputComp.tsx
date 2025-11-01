import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../constants';

const InputComp = ({
  label,
  icon: Icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
}) => {
  // ✅ Hook always declared
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isActive = value && value.length > 0;

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { borderColor: isActive ? COLORS.primaryColor : '#ddd' },
        ]}
      >
        {Icon && <Icon color={COLORS.primaryDarkGrey} size={20} style={styles.icon} />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(prev => !prev)}
            style={styles.eyeButton}
          >
            {isPasswordVisible ? (
              <Eye color={COLORS.primaryDarkGrey} size={20} />
            ) : (
              <EyeOff color={COLORS.primaryDarkGrey} size={20} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputComp;

const styles = StyleSheet.create({
  wrapper: { marginBottom: 30 },
  label: { fontSize: 14, color: COLORS.primaryDarkGrey, marginBottom: 5, fontFamily: FONT_FAMILY.dmsans_bold },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 55,
    borderBottomWidth: 1.5,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, color: COLORS.primaryBlack, fontSize: 16 },
  eyeButton: { paddingHorizontal: 4 },
});

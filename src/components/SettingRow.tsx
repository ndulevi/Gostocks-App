import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../constants';

type Props = {
  label: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
};

const SettingRow: React.FC<Props> = ({ label, onPress, rightComponent, style }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, style, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.right}>
        {rightComponent ?? <ChevronRight color={COLORS.primaryWhite} size={18} />}
      </View>
    </Pressable>
  );
};

export default SettingRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  label: {
    color: COLORS.primaryWhite,
    fontSize: 16,
    fontFamily: FONT_FAMILY.dmsans_bold,
  },
  right: {
    marginLeft: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});

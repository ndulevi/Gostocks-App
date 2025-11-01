// components/AnimatedButton.tsx
import React from 'react';
import { Text, TouchableWithoutFeedback, StyleSheet, TextStyle } from 'react-native';
import { MotiView } from 'moti';
import { COLORS, FONT_FAMILY } from '../constants';
import { Loader2 } from 'lucide-react-native';

interface AnimatedButtonProps {
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  width?: string | number;
  height?: number;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ButtonComp: React.FC<AnimatedButtonProps> = ({
  label,
  onPress,
  backgroundColor = COLORS.primaryColor,
  textColor = COLORS.primaryWhite,
  width = '100%',
  height = 55,
  loading = false,
  disabled = false,
  icon
}) => {
  return (
    <TouchableWithoutFeedback onPress={!disabled && !loading ? onPress : undefined}>
      <MotiView
        from={{opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: disabled || loading ? 1 : 0.97 }}
        transition={{ type: 'timing', duration: 150 }}
        style={[
          styles.button,
          { backgroundColor, width, height, opacity: disabled ? 0.7 : 1 },
        ]}
      >
        {loading ? (
          <Loader2 size={24} color={textColor} style={{ marginRight: 8 }} />
        ) : (
          icon && <>{icon}</>
        )}
        <Text style={[styles.text, { color: textColor }]}>{loading ? 'Loading...' : label}</Text>
      </MotiView>
    </TouchableWithoutFeedback>
  );
};

export default ButtonComp;

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  text: {
    fontFamily: FONT_FAMILY.dmsans_bold,
    fontSize: 16,
    letterSpacing: 0.5,
  } as TextStyle,
});

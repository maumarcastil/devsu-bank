import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/theme-store';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'filled';
}

export function Input({ variant = 'default', style, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.inputBackground,
          color: colors.text,
        },
        variant === 'filled' && { backgroundColor: colors.surface },
        style,
      ]}
      placeholderTextColor={colors.textMuted}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});

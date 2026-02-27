import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/theme-store';

interface AppTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'text' | 'muted' | 'success' | 'error' | 'warning';
}

export function Text({ variant = 'body', color = 'text', style, ...props }: AppTextProps) {
  const { colors } = useTheme();

  const colorMap = {
    primary: colors.primary,
    text: colors.text,
    muted: colors.textMuted,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  };

  const variantStyles = {
    title: { fontSize: 24, fontWeight: '700' as const },
    subtitle: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 14, fontWeight: '400' as const },
    label: { fontSize: 12, fontWeight: '500' as const },
  };

  return <RNText style={[variantStyles[variant], { color: colorMap[color] }, style]} {...props} />;
}

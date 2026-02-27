import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/theme-store';

interface CardProps extends ViewProps {
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({ padding = 'medium', style, children, ...props }: CardProps) {
  const { colors } = useTheme();

  const paddingMap = {
    none: 0,
    small: 8,
    medium: 16,
    large: 24,
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          padding: paddingMap[padding],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
});

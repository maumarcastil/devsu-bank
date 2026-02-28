import { DimensionValue, StyleSheet, View } from 'react-native';
import { useTheme } from '@/stores/theme-store';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  marginTop?: number;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  marginTop = 0,
}: SkeletonProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          marginTop,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

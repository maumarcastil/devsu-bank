import { useState } from 'react';
import { Pressable, StyleSheet, Platform, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text } from './text';
import { useTheme } from '../../stores/theme-store';

interface DatePickerInputProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  editable?: boolean;
  minimumDate?: Date;
}

function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseStringToDate(dateString: string): Date {
  if (!dateString) return new Date();
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  editable = true,
  minimumDate,
}: DatePickerInputProps) {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(formatDateToString(selectedDate));
    }
  };

  const handlePress = () => {
    if (editable) {
      setShowPicker(true);
    }
  };

  const handleDismiss = () => {
    setShowPicker(false);
  };

  return (
    <View>
      <Pressable
        onPress={handlePress}
        style={[
          styles.input,
          {
            backgroundColor: editable ? colors.surface : colors.inputBackground,
            borderColor: colors.border,
          },
          !editable && styles.inputDisabled,
        ]}
        disabled={!editable}
      >
        <Text style={{ color: value ? colors.text : colors.textMuted }}>
          {value || placeholder}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={parseStringToDate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minimumDate}
        />
      )}

      {Platform.OS === 'ios' && showPicker && (
        <Pressable style={styles.doneButton} onPress={handleDismiss}>
          <Text style={{ color: '#007AFF', fontWeight: '600' }}>Done</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  doneButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
});

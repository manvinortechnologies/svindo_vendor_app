// CalendarModal.tsx
import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {Calendar} from 'react-native-calendars';

type Props = {
  visible: boolean;
  initialDate?: string;
  onClose: () => void;
  onSelect: (date: string) => void;   // ← YYYY-MM-DD
};

export default function CalendarModal({
  visible,
  initialDate,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable style={s.card}>
          <Calendar
            current={initialDate}
            minDate={new Date().toISOString().split('T')[0]} // disables all dates before today
            onDayPress={day => {
              onSelect(day.dateString); // ← already “YYYY‑MM‑DD”
              onClose();
            }}
            markedDates={
              initialDate
                ? {[initialDate]: {selected: true, selectedColor: '#d00'}}
                : undefined
            }
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center'},
  card: {width: '90%', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', elevation: 6},
});

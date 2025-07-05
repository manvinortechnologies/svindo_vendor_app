import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomSwitch from './CustomSwitch'; // Path to your switch component

interface SettingItemProps {
  title: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

const SettingItem = ({ title, value, onToggle }: SettingItemProps) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.label}>{title}</Text>
      <CustomSwitch value={value} onValueChange={onToggle} />
    </View>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

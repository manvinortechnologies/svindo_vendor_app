import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  rightIcons?: ReactNode[]; // Array of optional right-side icons
}

const Headerwithback: React.FC<HeaderProps> = ({ title, rightIcons = [] }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="chevron-left" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightIconsContainer}>
        {rightIcons.map((icon, index) => (
          <View key={index} style={styles.rightIcon}>
            {icon}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -16 }],
    backgroundColor: '#FCA311',
    borderRadius: 20,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  rightIconsContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ translateY: -10 }],
  },
  rightIcon: {
    marginLeft: 10,
  },
});

export default Headerwithback;

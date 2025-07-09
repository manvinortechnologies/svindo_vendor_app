    import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomHeaderProps {
  title: string;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  rightIcon,
  containerStyle,
}) => {
     const navigation = useNavigation();
  return (
    <View style={[styles.header, containerStyle]}>
      {/* Left: Back Button */}
      <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Center: Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right: Optional */}
      <View style={styles.rightContainer}>
        {rightIcon}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    backgroundColor: '#FCA511',
    borderRadius: 20,
    padding: 6,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18   ,
    fontWeight:  '800',
    color: '#000',
    // marginRight: 40, // gives room so title stays center if rightIcon exists
  },
  rightContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
});

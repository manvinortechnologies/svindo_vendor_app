import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

interface LoadingProps {
  visible: boolean;
}
const getRandomColor = () => {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A8'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Loading: React.FC<LoadingProps> = ({ visible }) => {
 const [color, setColor] = useState(getRandomColor());
  useEffect(() => {
    const interval = setInterval(() => {
      setColor(getRandomColor());
    }, 1000); // Change color every 800ms

    return () => clearInterval(interval);
  }, []);
    return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={color} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
  StyleProp,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Or any icon lib
import Modal from "react-native-modal";
interface CustomModalProps {
  visible: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  modalStyle?: StyleProp<ViewStyle>;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  children,
  onClose,
  modalStyle,
}) => {
  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={onClose}
    >
      <View style={[styles.modalContainer, modalStyle]}>
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    paddingTop: 40,
    maxHeight: Dimensions.get("window").height * 0.8,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#FCA311",
  },
});

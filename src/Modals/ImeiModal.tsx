import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

interface ImeiModalProps {
  visible: boolean;
  onClose: () => void;
  imeiList: string[];
  setImeiList: (list: string[]) => void;
}

const ImeiModal: React.FC<ImeiModalProps> = ({
  visible,
  onClose,
  imeiList,
  setImeiList,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() !== "") {
      setImeiList([...imeiList, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    const updatedList = [...imeiList];
    updatedList.splice(index, 1);
    setImeiList(updatedList);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add IMEI / Serial No</Text>

          {/* Input + Add Button */}
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Enter serial number"
              placeholderTextColor="#888"
              value={inputValue}
              onChangeText={setInputValue}
              style={styles.textInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Add +</Text>
            </TouchableOpacity>
          </View>

          {/* List of added IMEIs */}
          <FlatList
            data={imeiList}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <Text style={styles.itemText}>
                  {index + 1}. {item}
                </Text>
                <TouchableOpacity onPress={() => handleRemove(index)}>
                  <Icon name="close" size={20} color="#FF5C5C" />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImeiModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#FFF8EB",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#FCA311",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#444",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});

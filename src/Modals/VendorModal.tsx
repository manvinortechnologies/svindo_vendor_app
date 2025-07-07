import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Vendor } from '../type/Vendor';

interface VendorModalProps {
  visible: boolean;
  vendors?: Vendor[] | null;
  selectedVendor: Vendor | null;
  onSelect: (vendor: Vendor) => void;
  onClose: () => void;
}

const VendorModal: React.FC<VendorModalProps> = ({
  visible,
  vendors,
  selectedVendor,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Select Vendor</Text>
          <FlatList
            data={vendors || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedVendor?.id === item.id;
              return (
                <TouchableOpacity
                  style={[
                    styles.vendorItem,
                    isSelected && styles.selectedVendor,
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={[
                      styles.vendorName,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
             ListEmptyComponent={() => (
    <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
      No vendors available.
    </Text>
  )}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VendorModal;

const THEME_COLOR = '#FCA311';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 15,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#000",
    textAlign: 'center',
  },
  vendorItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  selectedVendor: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 5,
    borderLeftColor: THEME_COLOR,
  },
  vendorName: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: "#333",
    fontWeight: 'bold',
  },
  closeBtn: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "red",
    borderRadius: 6,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

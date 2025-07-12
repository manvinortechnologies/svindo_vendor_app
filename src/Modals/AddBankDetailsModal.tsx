import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { InputBox } from '../CommonComponent/InputBox';

export interface BankDetails {
  name: string;
  account_holder: string;
  account_number: string;
  ifsc_code: string;
  branch: string;
}

interface AddBankDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (bankDetails: BankDetails) => void;
}

const AddBankDetailsModal: React.FC<AddBankDetailsModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const initialState: BankDetails = {
    name: '',
    account_holder: '',
    account_number: '',
    ifsc_code: '',
    branch: '',
  };

  const [bankDetails, setBankDetails] = useState<BankDetails>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof BankDetails, string>>>({});

  useEffect(() => {
    if (!visible) {
      setBankDetails(initialState);
      setErrors({});
    }
  }, [visible]);

  const validate = (): boolean => {
    let valid = true;
    let newErrors: Partial<Record<keyof BankDetails, string>> = {};

    if (!bankDetails.name.trim()) {
      newErrors.name = 'Bank name is required';
      valid = false;
    }
    if (!bankDetails.account_holder.trim()) {
      newErrors.account_holder = 'Account holder name is required';
      valid = false;
    }
    if (!bankDetails.account_number.trim()) {
      newErrors.account_number = 'Account number is required';
      valid = false;
    } else if (!/^\d{9,18}$/.test(bankDetails.account_number)) {
      newErrors.account_number = 'Enter a valid account number (9–18 digits)';
      valid = false;
    }
    if (!bankDetails.ifsc_code.trim()) {
      newErrors.ifsc_code = 'IFSC code is required';
      valid = false;
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifsc_code)) {
      newErrors.ifsc_code = 'Enter a valid IFSC code';
      valid = false;
    }
    if (!bankDetails.branch.trim()) {
      newErrors.branch = 'Branch is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (key: keyof BankDetails, value: string) => {
    setBankDetails({ ...bankDetails, [key]: value });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = () => {
    if (validate()) {
      onSubmit(bankDetails);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.header}>
                <Text style={styles.title}>Add Bank Details</Text>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {[
                {
                  key: 'name',
                  label: 'Bank Name',
                  placeholder: 'Bank Name',
                },
                {
                  key: 'account_holder',
                  label: 'Account Holder Name',
                  placeholder: 'Account Holder Name',
                },
                {
                  key: 'account_number',
                  label: 'Account Number',
                  placeholder: 'e.g. 123456789012',
                },
                {
                  key: 'ifsc_code',
                  label: 'IFSC Code',
                  placeholder: 'e.g. ABCD0001234',
                },
                {
                  key: 'branch',
                  label: 'Branch',
                  placeholder: 'Branch Name',
                },
              ].map(({ key, label, placeholder }) => (
                <View key={key} style={{ marginBottom: 10 }}>
                  <InputBox
                    label={label}
                    value={bankDetails[key as keyof BankDetails]}
                    placeholder={placeholder}
                    onChangeText={(text) => handleChange(key as keyof BankDetails, text)}
                    keyboardType={key === 'account_number' ? 'numeric' : 'default'}
                    autoCapitalize={key === 'ifsc_code' ? 'characters' : 'words'}
                    background="#fff"
                    styless={{ marginBottom: 0 }}
                  />
                  {errors[key as keyof BankDetails] && (
                    <Text style={styles.errorText}>{errors[key as keyof BankDetails]}</Text>
                  )}
                </View>
              ))}

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddBankDetailsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    marginRight: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cancelText: {
    color: '#007bff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import Headerwithback from './Headerwithback';



const Expenses = () => {
  const [isPaid, setIsPaid] = useState(true);
  const [selectedType, setSelectedType] = useState('Cash');

  const types = ['UPI', 'Cash', 'Card', 'Cheque', 'EMI', 'Netbanking'];

  return (
    <View style={styles.container}>
      <Headerwithback title="Create Expenses" />
    <ScrollView>
      {/* Expense Amount */}
      <Text style={styles.label}>Enter Expense Amount</Text>
      <TextInput placeholder="0.00" style={styles.input} keyboardType="decimal-pad" />

      {/* Expense Date */}
      <Text style={styles.label}>Expense Date</Text>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} editable={false} value="14-02-2025" />
        
        <Ionicons name="calendar" size={20} color="orange" style={styles.iconRight} />
      </View>

      {/* Category Dropdown */}
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Select Category" editable={false} />
        <Ionicons name="chevron-down" size={20} color="orange" style={styles.iconRight} />
      </View>
      <View style={styles.markpain}>
      {/* Mark as Paid */}
      <Text style={styles.label}>Mark as Paid</Text>
      <TouchableOpacity
        onPress={() => setIsPaid(!isPaid)}
        style={[
          styles.toggleButton,
          { backgroundColor: isPaid ? '#FCA311' : '#ccc' },
        ]}
      >
        <Text style={{ color: '#fff' }}>{isPaid ? 'Yes' : 'No'}</Text>
      </TouchableOpacity>
  </View>

      {/* Select Type */}
      <Text style={styles.label}>Select Type <Text style={{ color: 'red' }}>*</Text></Text>
      <View style={styles.typeRow}>
  {types.map((type) => {
    const isSelected = selectedType === type;
    return (
      <TouchableOpacity
        key={type}
        onPress={() => setSelectedType(type)}
        style={[
          styles.typeButton,
          isSelected && styles.typeButtonSelected,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {isSelected && (
            <Ionicons name="check-circle" size={16} color="#fff" />
          )}
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{type}</Text>
        </View>
      </TouchableOpacity>
    );
  })}
</View>

      {/* Payment Date */}
      <Text style={styles.label}>Payment Date</Text>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} editable={false} value="14-02-2025" />
        <Ionicons name="calendar" size={20} color="orange" style={styles.iconRight} />
      </View>

      {/* Add Bank */}
      <TouchableOpacity style={styles.addBankBtn}>
        <Ionicons name="add" size={16} color="#FCA311" />
        <Text style={styles.addBankText}>Add Bank</Text>
      </TouchableOpacity>

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        placeholder="Expense Description"
        multiline
      />

      {/* Attachments */}
      <Text style={styles.label}>Attachments</Text>
      <View style={styles.attachmentRow}>
        <TouchableOpacity style={styles.attachmentBtn}>
          <Ionicons name="camera" size={18} color="#000" />
          <Text style={styles.attachmentText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.attachmentBtn}>
          <Ionicons name="document" size={18} color="#000" />
          <Text style={styles.attachmentText}>Upload File</Text>
        </TouchableOpacity>
      </View>

      {/* Create Button */}
      <TouchableOpacity style={styles.createBtn}>
        <Text style={styles.createText}>Create</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
    container: {
        padding:10,
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
      },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    fontSize:16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#FFF5E9',
    width:"100%",
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width:"100%",
    marginBottom:10,
  },
  iconRight: {
    position: 'absolute',
    right: 12,
  },
  markpain:{
    flexDirection:"row",
    gap:10,
  },
  toggleButton: {
    width: 60,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 4,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 8,
    rowGap: 12,
  },
  
  typeButton: {
    width: '30%', // ~3 buttons per row with spacing
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ccc',
    color:"#fff",
  },
  typeButtonSelected: {
    backgroundColor: '#FCA311',
  },
  addBankBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  addBankText: {
    color: '#FCA311',
    fontWeight: '600',
    marginLeft: 4,
  },
  attachmentRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  attachmentBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FCA311',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    backgroundColor: '#FFF5E9',
  },
  attachmentText: {
    fontWeight: '600',
  },
  createBtn: {
    backgroundColor: '#FCA311',
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
    width: '45%',
    alignSelf: 'flex-end',   // <--- aligns button to the right
    marginRight: 10,         // <--- optional spacing from right
  },
  createText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default Expenses
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Switch, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Headerwithback from './Headerwithback';
import CustomSwitch from './CustomSwitch';

const { width } = Dimensions.get('window');

const AddSpotlightScreen = () => {
    const [boostEnabled, setBoostEnabled] = useState(false);
    const [budget, setBudget] = useState(' ');
  return (
    <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Headerwithback title={'Add Spotlight Product'} />

        <View style={{marginTop: 10}}>
            {/* Select Product */}
        <Text style={styles.label}>Select Product</Text>
        <TouchableOpacity style={styles.inputButton}>
            <Text style={styles.placeholder}>Search by Product name</Text>
            <Icon name="arrow-drop-down" size={24} color="#000" />
        </TouchableOpacity>

        {/* Discount Tag */}
        <Text style={styles.label}>Discount Tag</Text>
      <TouchableOpacity style={styles.inputButton}>
        <Text style={styles.placeholder}>Select product</Text>
        <Icon name="arrow-drop-down" size={24} color="#000" />
      </TouchableOpacity>
       
       {/* Boost Spotlight Product */}
       <View style={styles.boostRow}>
        <Text style={styles.boostText}>Boost Spotlight Product</Text>
        <CustomSwitch
          value={boostEnabled}
          onValueChange={setBoostEnabled}
        />
       </View>

       {/* Budget */}
       <Text style={styles.budgetLabel}>
        Budget (Minimum - 10 Rupees)
       </Text>
       <TextInput style={styles.inputField} placeholder='Enter Amount' placeholderTextColor="#555"
       keyboardType='numeric'
       value={budget}
       onChangeText={setBudget} 
       />

        {/* Approximate Costing */}
      <View style={styles.costBox}>
        {/* Approximate Costing Title */}
        <Text style={[styles.costText, { fontWeight: '600', color: '#FCA311' }]}>
        Approximate Costing
       </Text>

       {/* Row with per view costs */}
       <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
       }}>
    <Text>
      per view cost: <Text style={{ color: '#000', fontWeight: '600' }}>10 paisa</Text>
    </Text>
    <Text>
      per view cost: <Text style={{ color: '#000', fontWeight: '600'  }}>10 paisa</Text>
    </Text>
  </View>

  {/* Caution */}
  <Text style={[styles.cautionText, { marginTop: 8 }]}>
    Caution:
  </Text>
  <Text style={styles.cautionDescription}>
    Please follow platforms{' '}
    <Text style={{ color: '#FF0000' }}>terms & conditions</Text>{' '}
    for speedy approval of campaigns
  </Text>
      </View>


      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit for approval</Text>
      </TouchableOpacity>
        </View>
    </ScrollView>
  )
}

export default AddSpotlightScreen

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  inputButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FFEFD5',
    marginBottom: 16,
  },
  placeholder: {
    color: '#555',
    fontSize: 15,
  },
  boostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  boostText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FFEFD5',
    marginBottom: 20,
    fontSize: 15,
    color: '#000',
  },
  costBox: {
    borderWidth: 1,
    borderColor: '#C7C7C7',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 24,
  },
  costText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 6,
  },
  cautionText: {
    fontSize: 12,
    color: 'red',
    fontWeight: '600',
  },
  cautionDescription: {
  fontSize: 12,
  color: '#000',
},
  submitButton: {
    marginHorizontal: 20,
    backgroundColor: '#169729',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
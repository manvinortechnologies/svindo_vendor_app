import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Header from './Header';
import Headerwithback from './Headerwithback';

const { width } = Dimensions.get('window');

const CreateCouponScreen = () => {
  const [selectedType, setSelectedType] = useState<string>('Discount Coupon');
  const [customerIdEnabled, setCustomerIdEnabled] = useState(false);
  const [onlyFollowers, setOnlyFollowers] = useState(false);

  const couponTypes = ['Discount Coupon', 'No Return & Exchange', 'Online Pay'];

  const renderForm = () => (
    <View style={styles.form}>
      {/* Discount Amount and Discount Percentage */}
      <View style={{borderColor: '#727272', borderWidth: 1, paddingHorizontal: 8, borderRadius: 12}}>
      <View style={styles.row}>
      <View>
        <Text style={styles.sectionTitle}>Discount Amount</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#000"
          style={styles.inputHalf}
        />
      </View>
        <View>
          <Text style={styles.sectionTitle}>Discount Percentage</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#000"
          style={styles.inputHalf}
        />
        </View>
      </View>
      <Text style={{color: '#FCA311', marginTop: 10, marginBottom: 5, marginHorizontal: 10}}>Note: {'\n'} <Text style={{color: '#000'}}>Only one can be chosen.</Text></Text>
      </View>

      {/* Min Order & Max Discount */}
      <View style={{borderColor: '#727272', borderWidth: 1, paddingHorizontal: 8, borderRadius: 12, marginTop: 10, paddingVertical: 10}}>
      <View style={styles.row}>
        <View>
      <Text style={styles.sectionTitle}>Mini Order Amount</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#000"
          style={styles.inputHalf}
        />
        </View>
        <View><Text style={styles.sectionTitle}>Max Discount Amount</Text>
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#000"
          style={styles.inputHalf}
        />
        </View>
      </View>

      {/* Validity Date and Time */}
      <View style={styles.row}>
        <View>
      <Text style={styles.sectionTitle}>Validity till</Text>
        <TextInput
          placeholder="Date (DD/MM/YYYY)"
          placeholderTextColor="#000"
          style={styles.inputHalf}
        />
        </View>
        <View>
          <Text style={styles.sectionTitle}></Text>
        <TextInput
          placeholder="Time (HH:MM AM)"
          placeholderTextColor="#000"
          style={styles.inputHalf}
        />
        </View>
      </View>
      </View>

      {/* Customer ID with toggle */}
      <View style={{borderColor: '#727272', borderWidth: 1, paddingHorizontal: 8, borderRadius: 12, marginTop: 10, paddingVertical: 10}}>
      <View style={styles.toggleRow}>
        <Text style={styles.label}>Customer Id:</Text>
        <Switch
          value={customerIdEnabled}
          onValueChange={setCustomerIdEnabled}
          trackColor={{ false: '#ccc', true: '#FBBF24' }}
          thumbColor={customerIdEnabled ? '#F59E0B' : '#f4f3f4'}
        />
      </View>
      {customerIdEnabled && (
        <TextInput
          placeholder="Enter here"
          placeholderTextColor="#000"
          style={styles.inputFull}
        />
      )}
      <Text style={{color: '#FCA311', marginTop: 10, marginBottom: 5, marginHorizontal: 10}}>Note: {'\n'} <Text style={{color: '#000'}}>If Customer id is entered then the offer will be valid for only that customer.</Text>
      </Text>
      </View>

      {/* Only Followers with toggle */}
      <View style={{borderColor: '#727272', borderWidth: 1, paddingHorizontal: 8, borderRadius: 12, marginTop: 10, paddingVertical: 10}}>
      <View style={styles.toggleRow}>
        <Text style={styles.label}>Only Followers</Text>
        <Switch
          value={onlyFollowers}
          onValueChange={setOnlyFollowers}
          trackColor={{ false: '#ccc', true: '#FBBF24' }}
          thumbColor={onlyFollowers ? '#F59E0B' : '#f4f3f4'}
        />
      </View>
      <Text style={{color: '#FCA311', marginTop: 10, marginBottom: 5, marginHorizontal: 10}}>Note: {'\n'} <Text style={{color: '#000'}}>If enabled only followers will be eligible for offers.</Text>
      </Text>
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={['form']}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <>
          {/* Header */}
          
         <Headerwithback title={'Create Coupon'} />
         


          {/* Coupon Types */}
          <Text style={{color: '#727272', fontWeight: '600',marginHorizontal: 20, marginVertical: 10}}>Types</Text>
          <View style={styles.typeContainer}>
            {couponTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedType(type)}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.typeButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedType === type && styles.typeTextSelected,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      }
      renderItem={() => renderForm()}
    />
  );
};

export default CreateCouponScreen;

const styles = StyleSheet.create({
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fff'
    
  },
  typeButton: {
    borderColor: '#FBBF24',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: width / 3.4,
    alignItems: 'center',
    backgroundColor: '#FFEFD5',
  },
  typeButtonSelected: {
    backgroundColor: '#FFEFD5',
  },
  typeText: {
    color: '#727272',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 13,
  },
  typeTextSelected: {
    color: '#727272',
    fontWeight: 'bold',
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  inputHalf: {
    backgroundColor: '#FFEFD5',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    width: width / 2 - 30,
    borderColor: '#FCA311',
    borderWidth: 1
  },
  inputFull: {
    backgroundColor: '#FFEFD5',
    borderColor: '#FCA311',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    color: '#727272',
  },
  note: {
    color: '#FFEFD5',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  label: {
    fontWeight: '500',
    fontSize: 15,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#169729',
    marginVertical: 15,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

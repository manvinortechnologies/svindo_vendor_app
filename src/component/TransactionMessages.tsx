import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Headerwithback from './Headerwithback';
import CustomSwitch from './CustomSwitch';

const TransactionMessages = () => {
  const [purchaseEnabled, setPurchaseEnabled] = useState(true);
  const [quoteEnabled, setQuoteEnabled] = useState(true);
  const [creditEnabled, setCreditEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Headerwithback title="Transaction Messages" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Section Title */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>SMS Credits Details</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Till day</Text>
            <Icon name="chevron-down" size={20}/>
          </TouchableOpacity>
        </View>

        {/* Credit Boxes */}
        <View style={styles.creditsRow}>
          <View style={[styles.creditBox, { backgroundColor: '#EFE6FF' }]}>
            <Text style={styles.creditLabel}>Available</Text>
            <Text style={styles.creditValue}>2000.00</Text>
          </View>
          <View style={[styles.creditBox, { backgroundColor: '#D9FDD3' }]}>
            <Text style={styles.creditLabel}>Used</Text>
            <Text style={styles.creditValue}>1000.00</Text>
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            Note:
          </Text>
          <Text style={styles.noteText}>
            This feature is to automatically send different transactions to your customers via SMS.
          </Text>
          <Text style={styles.noteText}>
            It's a paid service, add SMS credits to avail the benefits.
          </Text>
        </View>

        {/* Switches */}
        <View style={{padding: 10, borderWidth: 1, borderColor: '#BCBCBC', borderRadius: 10}}>
            <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Enable Purchase Message</Text>
          <CustomSwitch
            value={purchaseEnabled}
            onValueChange={setPurchaseEnabled}
            
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Enable Quote Message</Text>
          <CustomSwitch
            value={quoteEnabled}
            onValueChange={setQuoteEnabled}
            
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Enable Credit reminder Message</Text>
          <CustomSwitch
            value={creditEnabled}
            onValueChange={setCreditEnabled}
            
          />
        </View>
        </View>

        {/* SMS Templates Box */}
        <View style={styles.smsBox}>
          <Text style={{ color: '#000' , fontWeight: '500'}}>SMS templates used</Text>
        </View>

        {/* Add Credit Button */}
        <TouchableOpacity style={styles.addCreditBtn}>
          <Text style={styles.addCreditText}>Add Credit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TransactionMessages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#FCA311',
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    gap: 5,
    borderWidth: 1,
    borderColor: '#C7C7C7',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 6,
  },
  filterButtonText: {
    fontSize: 12,
    color: '#000',
  },
  creditsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  creditBox: {
    flex: 0.48,
    padding: 12,
    borderRadius: 6,
  },
  creditLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  creditValue: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  noteBox: {
    borderWidth: 1,
    borderColor: '#C7C7C7',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    flex: 1,
  },
  smsBox: {
    height: 100,
    borderWidth: 1,
    borderColor: '#BCBCBC',
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 16,
    padding: 10
  },
  addCreditBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#169729',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20
  },
  addCreditText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

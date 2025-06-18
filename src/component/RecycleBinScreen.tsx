import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import Bottomnavigation from './Bottomnavigation';
import Headerwithback from './Headerwithback';



const RecycleBinScreen = () => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2025-02-01'));
  const [endDate, setEndDate] = useState(new Date('2025-02-28'));
  const [selectingStart, setSelectingStart] = useState(true);
  const [monthModalVisible, setMonthModalVisible] = useState(false);

  const showDatePicker = (start: boolean) => {
    setSelectingStart(start);
    setDatePickerVisible(true);
  };

  const handleConfirm = (date: Date) => {
    if (selectingStart) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setDatePickerVisible(false);
  };

  const handleMonthSelect = (type: 'this' | 'last') => {
    const today = new Date();
    let start, end;

    if (type === 'this') {
      start = moment().startOf('month').toDate();
      end = moment().endOf('month').toDate();
    } else {
      start = moment().subtract(1, 'months').startOf('month').toDate();
      end = moment().subtract(1, 'months').endOf('month').toDate();
    }

    setStartDate(start);
    setEndDate(end);
    setMonthModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Headerwithback
          title="Recycle Bin"
         
        />

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.mothtab}
            onPress={() => setMonthModalVisible(true)}
          >
            <Text style={styles.tabText}>Choose Month</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tab} onPress={() => showDatePicker(true)}>
            <Icon name="calendar-month-outline" size={16} color="#000" />
            <Text style={[styles.tabText, { marginLeft: 6 }]}>
              {moment(startDate).format('DD/MM/YYYY')} To {moment(endDate).format('DD/MM/YYYY')}
            </Text>
            <Icon name="chevron-down" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Icon name="filter-variant" size={18} color="#333" />
            <Text style={styles.filterText}>Filters applied</Text>
          </View>

          <View style={styles.filterTags}>
  <View style={styles.tag}>
    <Text style={styles.tagText}>✕ Txns Type: Sale & Cr Note</Text>
  </View>
  <View style={styles.tag}>
    <Text style={styles.tagText}>✕ Txns Type: Sale & Note</Text>
  </View>
</View>
        </View>

        <View style={styles.actionRow}>
  <Text style={styles.actionText}>Select</Text>
  <Text style={styles.actionText}>Delete Selected</Text>
  <Text style={styles.actionText}>Recover Selected</Text>
  <Text style={styles.actionText}>Select All</Text>
  <Text style={styles.actionText}>Delete All</Text>
  <Text style={styles.actionText}>Recover All</Text>
</View>
<View style={styles.deletedItemContainer}>
  <View style={styles.deletedItemHeader}>
   

    <View>
      <Text style={styles.deletedItemTitle}>Lorem ipsum</Text>
      <Text style={styles.deletedItemDeletedText}>
        Deleted on <Text style={{ color: 'black' }}>01/02/2025</Text> <Text style={{ fontSize: 10 }}>8:45 PM</Text>
      </Text>
    </View>
  </View>

  <View style={styles.deletedItemFooter}>
    <Text style={styles.deletedItemTotalLabel}>Total</Text>
    <Text style={styles.deletedItemTotalValue}>Rs 700</Text>

    <TouchableOpacity style={styles.saleTransactionButton}>
      <Text style={styles.saleTransactionButtonText}>Sale Transaction</Text>
    </TouchableOpacity>
  </View>
</View>
      </SafeAreaView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisible(false)}
        date={selectingStart ? startDate : endDate}
        maximumDate={new Date()}
      />

      <Modal
        transparent
        visible={monthModalVisible}
        animationType="fade"
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleMonthSelect('this')}>
              <Text style={styles.modalOption}>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMonthSelect('last')}>
              <Text style={styles.modalOption}>Last Month</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMonthModalVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Bottomnavigation />
    </View>
  );
};




const styles = StyleSheet.create({
     container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
      },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
    color: '#000',
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  pdf: {
    color: 'red',
    fontWeight: 'bold',
  },
  xls: {
    color: 'green',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal:10,
    justifyContent:"space-between"
  },
  mothtab:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderEndWidth:1,
    width:"40%",
  },

  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    
  },
  tabText: {
    fontSize: 13,
    color: '#333',
  },
  filterSection: {
    padding: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  filterText: {
    fontWeight: '600',
    color: '#333',
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping if needed
    gap: 8,
  },
  
  tag: {
    backgroundColor: '#FFF0E1',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#000',
   
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
  modalClose: {
    marginTop: 10,
    color: 'red',
  },
  deletedItemContainer: {
    backgroundColor: '#FFF7EC',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFA500',
    padding: 12,
  },
  
  deletedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  
  deletedItemTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  
  deletedItemDeletedText: {
    color: 'red',
    fontSize: 12,
  },
  
  deletedItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  deletedItemTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  
  deletedItemTotalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  
  saleTransactionButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor:"#fff",
  },
  
  saleTransactionButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#000',
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderTopWidth:1,
    marginVertical:10,
  },
  
  actionText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  
  checkboxBox: {
    marginRight: 10,
    marginTop: 2,
  },
  
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
});


export default RecycleBinScreen
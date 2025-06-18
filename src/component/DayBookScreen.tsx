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

import ReportHeader from './ReportHeader';
import Bottomnavigation from './Bottomnavigation';

const DayBookScreen = () => {
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

 

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ReportHeader
          title="Day Book "
          onBack={() => console.log('Back pressed')}
          onPdfPress={() => console.log('Download PDF')}
          onXlsPress={() => console.log('Download XLS')}
        />

        <View style={styles.tabContainer}>
          

          <TouchableOpacity style={styles.tab} onPress={() => showDatePicker(true)}>
            <Icon name="calendar-month-outline" size={16} color="#FCA311" />
            <Text style={[styles.tabText, { marginLeft: 6 }]}>
              {moment(startDate).format('DD/MM/YYYY')} To {moment(endDate).format('DD/MM/YYYY')}
            </Text>
            <Icon name="chevron-down" size={16} color="#000" />
          </TouchableOpacity>
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
});





export default DayBookScreen
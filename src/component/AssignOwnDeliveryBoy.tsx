import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Headerwithback from './Headerwithback';
import CustomSwitch from './CustomSwitch';

const AssignOwnDeliveryBoy = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previous => !previous);

  const transactions = [
    {
      id: '1',
      amount: '500',
      date: '4/27/2025',
      time: '11:00 AM',
      order: '12345',
    },
  ];

  return (
    <View style={styles.container}>
      <Headerwithback title="Manage Own Delivery Boy" />

      {/* Toggle Section */}
      <View style={styles.box}>
        <View style={styles.rowSpace}>
          <Text style={styles.sectionTitle}>Delivery orders by ourselves</Text>
          <CustomSwitch
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <Text style={styles.description}>Note:
          Enabling this setting will automatically assign a delivery boy you
          created to your orders through svindo app. The fare charges are
          calculated by your input in delivery settings.
        </Text>
        <Text style={styles.description}>
          Delivery boy is automatically assigned 15 minutes before the order is
          ready to pickup based on your order preparation time.
        </Text>
      </View>

      {/* Manage Delivery Boy Button */}
      <TouchableOpacity style={styles.manageBtn}>
        <Text style={styles.manageBtnText}>Manage Delivery Boy</Text>
      </TouchableOpacity>

      {/* Delivery Earnings */}
      <View style={styles.earningsBox}>
        <Text style={{color: '#FCA311', fontSize: 20, fontWeight: '700'}}>Delivery Earnings</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Orders Delivered</Text>
            <Text style={styles.summaryAmount}>10</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Earnings</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' , justifyContent: 'space-between'}}>
              <Text style={styles.summaryAmount}>Rs.1000.00</Text>
              <Icon
                name="wallet"
                size={24}
                color="#FCA311"
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Transactions */}
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View>
              <Text style={[styles.amountText, { color: '#005120' }]}>
                Rs. {item.amount}
              </Text>
              <Text style={styles.orderText}>Order no: {item.order}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 10 }}>
              <Text style={styles.dateText}>Date: {item.date}</Text>
              <Text style={styles.dateText}>Time: {item.time}</Text>
              {/* <Icon name="arrow-down" size={20} color="#2EAE47" /> */}
            </View>
          </View>
        )}
        style={{ marginTop: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AssignOwnDeliveryBoy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    paddingTop: 15
  },
  box: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#5A5A5A',
  },
  description: {
    fontSize: 14,
    color: '#5A5A5A',
    fontWeight: '500',
    marginTop: 4,
  },
  manageBtn: {
    width: '42%',
    alignSelf: 'flex-end',
    backgroundColor: '#169729',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  manageBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  earningsBox: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C7C7C7', padding: 10,
    borderRadius: 10
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryItem: {
    flex: 0.48,
    backgroundColor: '#FFE8C2',
    borderRadius: 8,
    padding: 12,
  },
  summaryLabel: {
    fontWeight: '700',
    color: '#000',
    fontSize: 18
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    elevation: 10,
    marginHorizontal: 10
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderText: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
    marginTop: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
  },
});

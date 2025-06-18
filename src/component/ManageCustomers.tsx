import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Headerwithback from './Headerwithback';
import Bottomnavigation from './Bottomnavigation';


const customers = [
  {
    id: '1',
    name: 'Raigun Enterprise',
    phone: '9876543210',
    email: 'Raigunenterprises@gmail.com',
    closingBalance: 'Rs 0',
    initials: 'RE',
  },
];

const ManageCustomers = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Headerwithback title="Manage Customers" />

        {/* Search and Add */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Icon name="search" size={20} color="#aaa" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customer by name or phone"
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.addText}>+ Add New Customer</Text>
          </TouchableOpacity>
        </View>

        {/* You Collect & Pay */}
        <View style={styles.summaryContainer}>
          <TouchableOpacity style={styles.summaryBox}>
            <Text style={styles.summaryText}>You Collect: ₹0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.summaryBox}>
            <Text style={styles.summaryText}>You Pay: ₹0</Text>
          </TouchableOpacity>
        </View>

        {/* Table Headers */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Name</Text>
          <Text style={styles.headerText}>Contact Info</Text>
          <Text style={styles.headerText}>Closing Balance</Text>
        </View>

        {/* Customer List */}
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.customerRow}>
              <View style={styles.nameColumn}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.initials}</Text>
                </View>
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
              <View style={styles.contactColumn}>
                <Text style={styles.contactText}>{item.phone}</Text>
                <Text style={styles.contactText}>{item.email}</Text>
              </View>
              <View>
              <Text style={styles.balanceText}>{item.closingBalance}</Text>
              </View>
            </View>
          )}
        />

        <Bottomnavigation />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 12,
    },
    searchBox: {
      
      flexDirection: 'row',
      backgroundColor: '#f3f3f3',
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
      width:"80%",

    },
    searchInput: {
      flex: 1,
      padding: 8,
      marginLeft: 6,
    },
    addText: {
      color: '#000',
      fontWeight: '600',
      fontSize: 12,
      textAlign:"right",
      width:"60%",
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    summaryBox: {
      borderWidth: 1,
      borderColor: '#FCA311',
      borderRadius: 6,
      padding: 8,
      minWidth: '40%',
      alignItems: 'center',
    },
    summaryText: {
      fontSize: 14,
      color: '#000',
      fontWeight: '500',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f3f3f3',
      paddingHorizontal: 16,
      paddingVertical: 8,
      justifyContent: 'space-between',
    },
    headerText: {
      flex: 1,
      fontWeight: '700',
      fontSize: 13,
      color: '#000',
    },
    customerRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: '#eee',
      gap:10,
      justifyContent:"space-between",
    
    },
    nameColumn: {
     
      flexDirection: 'row',
      alignItems: 'center',
    
    
    
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#FCA311',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    avatarText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 12,
    },
    nameText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#000',
     
    },
    contactColumn: {
        flex: 1,
        textAlign: 'right',
      
    },
    contactText: {
      fontSize: 12,
      color: '#333',
    },
    balanceText: {
      flex: 1,
      textAlign: 'right',
      fontWeight: '600',
      fontSize: 13,
      color: 'green',
    },
  });
  

export default ManageCustomers
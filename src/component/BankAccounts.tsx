import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Headerwithback from './Headerwithback';
import Bottomnavigation from './Bottomnavigation';


const BankAccounts = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Headerwithback title="Bank Account" />
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Add Bank Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={require('../assets/bank.png')} style={styles.icon} />
              <View>
                <Text style={styles.title}>Add your bank & UPI to Invoices</Text>
                <Text style={styles.description}>
                  Let your customers pay you directly from the invoice no fuss, no delays
                </Text>
              </View>
            </View>
          </View>

          {/* Accounts Label */}
          <Text style={styles.sectionTitle}>Accounts</Text>

          {/* Cash Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={require('../assets/money.png')} style={styles.icon} />
              <View>
                <Text style={styles.title}>Cash</Text>
                <Text style={styles.amount}>Rs 0.00</Text>
              </View>
            </View>
          </View>

          {/* Transfer Funds Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={require('../assets/transfer.png')} style={styles.icon} />
              <View>
                <Text style={styles.title}>Transfer funds</Text>
                <Text style={styles.description}>Transfer funds between internal banks</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Add New Bank Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add New Bank</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Bottomnavigation/>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      padding: 16,
    },
    card: {
      backgroundColor: '#FFF7EB',
      borderColor: '#FCA311',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    icon: {
      width: 34,
      height: 34,
      marginRight: 12,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
    },
    description: {
      fontSize: 12,
      color: '#333',
      marginTop: 2,
      width:"80%",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 8,
      color: '#000',
    },
    amount: {
      fontSize: 16,
      color: 'green',
      fontWeight: '700',
    },
    footer: {
      padding: 16,
      backgroundColor: '#fff',
    },
    button: {
      backgroundColor: '#FCA311',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent:"center",
      alignContent:"center",
      alignSelf:"center",
      width:"60%",
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
  });
  


export default BankAccounts
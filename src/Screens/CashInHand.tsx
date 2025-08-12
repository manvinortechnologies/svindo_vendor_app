import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Bottomnavigation from './Bottomnavigation';
import Headerwithback from './Headerwithback';
import api from '../services/api/api';
import Loading from '../CommonComponent/Loading';


const CashInHand = ({navigation}:any) => {
  const [cash,setCash]=useState<string>("00.00");
  const [isLoading,setIsLoading]= useState<boolean>(false);
  useEffect(()=>{
    getCash();
  },[]);
  const getCash=async()=>{
    try {
      setIsLoading(true);
      const res=await api.get("vendor/cash-balance/");
      if(res.data){
        setCash(res.data.balance)
      }
      
    } catch (error) {
      
    }finally{
      setIsLoading(false)
    }

  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Headerwithback title="Cash in hand" />

        <View style={styles.balanceCard}>
          <View style={styles.row}>
            <Image
              source={require('../assets/money.png')} // Replace with your local image
              style={styles.icon}
            />
            <View>
              <Text style={styles.label}>Current Cash Balance</Text>
              <Text style={styles.amount}>Rs {cash}</Text>
            </View>
          </View>
        </View>

       
      </SafeAreaView>
      <Loading
      visible={isLoading}
      />

      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Bank Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Adjust Cash</Text>
          </TouchableOpacity>
        </View>

      <Bottomnavigation />
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    balanceCard: {
      backgroundColor: '#FFF7EB',
      margin: 16,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FCA311',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 36,
      height: 36,
      marginRight: 12,
      resizeMode: 'contain',
    },
    label: {
      color: '#000',
      fontSize: 14,
      fontWeight: '600',
    },
    amount: {
      color: 'green',
      fontSize: 16,
      fontWeight: '700',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 30,
      paddingHorizontal: 16,
    },
    button: {
      borderWidth: 1,
      borderColor: '#FCA311',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    buttonText: {
      color: '#FCA311',
      fontSize: 14,
      fontWeight: '600',
    },
  });
  


export default CashInHand
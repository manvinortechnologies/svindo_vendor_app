import React from 'react';  
import { View, ScrollView, StyleSheet, StatusBar, Platform } from 'react-native';
import Header from './Header';
import Bottomnavigation from './Bottomnavigation';


const AdWallet = () => {
 
    
  return (
    <View style={styles.container}>
             
             <Header
        title="Ads Wallet"
        backgroundColor="#FCA311"
        textColor="#fff"
        borderBottomColor="#ccc"
        paddingTop={50}
      /> 
            <ScrollView>
                            
            </ScrollView>
        

            <Bottomnavigation/>
            
        </View>
    );
};


  const styles = StyleSheet.create({
     
      container: { flex: 1, backgroundColor: '#fff', },
   
  });
  

export default AdWallet
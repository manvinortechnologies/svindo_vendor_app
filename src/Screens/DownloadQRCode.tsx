import React from 'react';  
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import Header from './Header';
import Bottomnavigation from './Bottomnavigation';
import { Text } from 'react-native';

const DownloadQRCode = () => {
  return (
    <View style={styles.container}>
      <Header
        title="Ads Wallet"
        backgroundColor="#FCA311"
        textColor="#fff"
        borderBottomColor="#ccc"
        paddingTop={50}
      /> 

      <ScrollView contentContainerStyle={styles.barcode}>
        <Image
          source={require('../assets/qr-code.png')}
          style={styles.qrImage}
          resizeMode="contain"
        />
        <Text style={styles.text}>Edit Qr-code</Text>
      </ScrollView>

      <Bottomnavigation/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  barcode: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  qrImage: {
    width: 300,
    height: 300,
  },
  text:{
    fontSize:16,
    textAlign:"left",
    margin:10,
    fontWeight:"800"
  }
});

export default DownloadQRCode;

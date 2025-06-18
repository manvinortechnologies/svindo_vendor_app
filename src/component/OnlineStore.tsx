import React, { useState } from 'react';  
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from "react-native-vector-icons/AntDesign";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Bottomnavigation from './Bottomnavigation';
import Header from './Header';
import CustomSwitch from './CustomSwitch';


// ✅ Define the type for the navigation stack
type RootStackParamList = {
    OnlineStoreSettings: undefined;
    StoreTimings: undefined;
    StoreVerification: undefined;
    EnableSvindoGateway: undefined;
    AddPaymentGateway: undefined;
    MarketingTools : undefined;
    OnlineStore : undefined
  };

// ✅ Define the type for navigation prop
export type SecurityScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OnlineStoreSettings'>;

const OnlineStore = () => {
 const navigation = useNavigation<SecurityScreenNavigationProp>(); // ✅ Corrected navigation type
 const[isEnabled, setEnable]= useState(true);
  return (
    <View style={styles.container}>
             
             <Header
        title="Online Store Setting"
        backgroundColor="#FFF"
        textColor="#333"
        borderBottomColor="#ccc"
      /> 
            <ScrollView>
              <View style={styles.storepage}>
              <View style={styles.storecontent}>
              <Icon name="storefront-outline" size={24} color="#000" />
              <Text style={styles.mytext}>Store Page</Text>
              </View>
               <View>
                <Text>This option helps you hide/ un-hide your store and product on svindo app</Text>
                <View style={styles.switchstorecontent}>
                <Text style={styles.switchtext}>visible on svindo</Text>
               <CustomSwitch value={isEnabled} onValueChange={setEnable} 
                 activeColor="#00CF1F"
                 inactiveColor="#999"
                 borderColor="#4CAF50"/>
                 </View>
               </View>
              
           
                
               
            
              </View>
                            <View style={styles.menuContainer}>
                                    {menuItems.map((item) => (
                                        <TouchableOpacity 
                                            key={item.title} 
                                            style={styles.menuItem} 
                                            onPress={() => item.screen && navigation.navigate(item.screen)} // ✅ Corrected navigation
                                        >
                                            <Icon name={item.icon} size={24} color="#000" />
                                            <Text style={styles.menuText}>{item.title}</Text>
                                            <Icon name="chevron-right" size={24} color="#000" style={{ marginLeft: 'auto' }} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
            </ScrollView>
            {/* <Bottompopup/> */}
            <View style={styles.bottomcontainer}>
      <TouchableOpacity style={styles.option}  onPress={() => navigation.navigate('OnlineStore')}>
        <Icon name="storefront" size={20} color="#f7931e" />
        <Text style={[styles.optionText, { color: '#f7931e' }]}>Online Store</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('MarketingTools')}>
       <Icons name="setting" size={20} color="#555" />
        <Text style={styles.optionText}>Tools</Text>
      </TouchableOpacity>
    </View>

            <Bottomnavigation/>
            
        </View>
    );
};

// Menu items with navigation screens
type MenuItemType = {
    title: string;
    icon: string;
    screen?: keyof RootStackParamList;
};

// ✅ Ensure screen names match the navigation stack
const menuItems: MenuItemType[] = [
    { title: 'Enter Store working timings', icon: 'calendar-clock', screen: 'StoreTimings' },
    { title: 'Get Verification Tag for your Store', icon: 'store-check-outline', screen: 'StoreVerification' },
    { title: 'Enable svindo Payment Gateway', icon: 'credit-card-check', screen: 'EnableSvindoGateway' },
    { title: 'Add your Payment Gateway', icon: 'credit-card-plus', screen: 'AddPaymentGateway' },
  ];
  const styles = StyleSheet.create({
     
      container: { flex: 1, backgroundColor: '#fff',paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0, },
      
      menuContainer: {
        marginHorizontal: 10,
       backgroundColor: '#fff',
       
       },
         menuItem: { 
       flexDirection: 'row', 
       alignItems: 'center', 
       paddingVertical: 6, 
       paddingHorizontal: 20,
       backgroundColor: '#fff',
       borderWidth: 1,
       borderColor: '#BCBCBC',
       marginVertical:10,
       borderRadius:10,

   },
      
  
      menuText: { fontSize: 14, marginLeft: 8 , fontWeight:"600"},
      bottomNav: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, borderTopWidth: 0.5, borderTopColor: '#ccc' },
      navItem: { alignItems: 'center' },
      navText: { fontSize: 12, marginTop: 4 },
      activeText: { color: '#007bff' },
      bottomcontainer: {
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: '#fff',
          justifyContent: 'space-around',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 3,
          marginBottom:4,
          marginHorizontal:10,
        },
        option: {
          flexDirection: 'row',
          alignItems: 'center',
          textAlign:"center",
          justifyContent:"center"
        },
        optionText: {
          marginLeft: 6,
          fontSize: 14,
          color: '#333',
          fontWeight: '500',
        },
        divider: {
          width: 1,
          height: 20,
          backgroundColor: '#ccc',
          marginHorizontal: 12,
        },
        storepage:
        {
          paddingVertical: 6, 
          paddingHorizontal: 20,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#BCBCBC',
          marginVertical:10,
          borderRadius:10,
          marginHorizontal:10,
        },
        storecontent:{
          flexDirection: 'row', 
          alignItems: 'center', 
        
        },
        switchstorecontent:{
          flexDirection: 'row', 
          alignItems: 'center',
          alignSelf:"flex-end",
          paddingHorizontal:10,
        },
        switchtext:{
          paddingHorizontal:10,
          color:"#00CF1F",
          fontWeight:"600",
          fontSize:16,
        },
        mytext:{
          paddingHorizontal:5,
          fontWeight:"600",
        }
  });
  

export default OnlineStore
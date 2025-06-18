import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform, StatusBar, Image, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import NavigationButton from "./NavigationButton";


const screenWidth = Dimensions.get("window").width - 20;
interface Product {
    id: string;
    name: string;
    image: any;
  }



  const products = [
    { id: "1", name: "Product 1", description: "This is product 1", price: "10", image: require("../assets/product.png"), type: "Top Liked" },
    { id: "2", name: "Product 2", description: "This is product 2", price: "20", image: require("../assets/product.png"), type: "Top Liked" },
    { id: "3", name: "Product 3", description: "This is product 3", price: "30", image: require("../assets/product.png"), type: "Top Liked" },
    { id: "4", name: "Product 4", description: "This is product 4", price: "40", image: require("../assets/product.png"), type: "Top Rated" },
    { id: "5", name: "Product 5", description: "This is product 5", price: "50", image: require("../assets/product.png"), type: "Top Rated" },
    { id: "6", name: "Product 6", description: "This is product 6", price: "60", image: require("../assets/product.png"), type: "Top Rated" },
    { id: "7", name: "Product 7", description: "This is product 7", price: "70", image: require("../assets/product.png"), type: "Most Bought" },
    { id: "8", name: "Product 8", description: "This is product 8", price: "80", image: require("../assets/product.png"), type: "Most Bought" },
    { id: "9", name: "Product 9", description: "This is product 9", price: "90", image: require("../assets/product.png"), type: "Most Bought" },
    { id: "10", name: "Product 10", description: "This is product 9", price: "90", image: require("../assets/product.png"), type: "Low Stock" },
    { id: "11", name: "Product 11", description: "This is product 9", price: "90", image: require("../assets/product.png"), type: "Low Stock" },
    { id: "12", name: "Product 12", description: "This is product 9", price: "90", image: require("../assets/product.png"), type: "Low Stock" },
    { id: "13", name: "Product 13", description: "This is product 9", price: "90", image: require("../assets/product.png"), type: "Low Stock" },
    { id: "14", name: "Product 14", description: "This is product 9", price: "90", image: require("../assets/product.png"), type: "Low Stock" },
    { id: "15", name: "Product 15", description: "This is product 9", price: "90", image: require("../assets/product.png"), type: "Low Stock" },
  ];

const getFilteredProducts = (type: string) => {
  return products.filter(product => product.type === type).slice(0, type === "Low Stock" ? 6 : 3);
};


const DraftScreen = () => {
  return (
    <View style={styles.container}>
          {/* Search Bar */}
          <View style={styles.header}>
          <View style={styles.searchBar}>
          <Image
            source={require('../assets/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#006EB2"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Image
              source={require('../assets/mic.png')}
              style={styles.micIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.drafttext}>
          
            <Icon name="drafts" color={"#000"} size={24}/>
            <Text style={styles.drafttext}>Draft</Text>
        </View>
        </View>
        
    <ScrollView>
             <View style={styles.productcontainer}>
                    {["Top Liked", "Top Rated", "Most Bought"].map(category => (
                        <View key={category} style={styles.categoryContainer}>
                            
                            <View style={styles.productRow}>
                                {getFilteredProducts(category).map((product) => (
                                    <View key={product.id} style={styles.productCard}>
                                        <Image source={product.image} style={styles.productImage} />
                                        <View style={styles.productDetails}>
                                            <View style={styles.productTextContainer}>
                                                <Text style={styles.productName}>{product.name}</Text>
                                                <Text style={styles.productDescription}>{product.description.slice(0, 15)}...</Text>
                                            </View>
                                            <View>
                                            <Text style={styles.productPrice}>Rs {product.price}</Text>
                                            <Text style={styles.addbtn}>Add</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                         
                        </View>
                    ))}
                </View>
                <View>
               
                </View>
    </ScrollView>
     <View style={styles.proceedbtn}>
     <View style={styles.proceedcontainer}>
      <Text style={styles.proceedtext}><NavigationButton screen="Orders" label="Proceed"  color="#fff" fontWeight="bold" />
      </Text>
      </View>
       <View style={styles.barcodecontainer}>
        <Image source={require('../assets/qr_code_scanner.png')}/>
        <Text style={styles.barcodetext}>Bar-code{"\n"} scan</Text>
       </View>
     </View>
    </View>
  )
}
  

const styles = StyleSheet.create({
    container: { padding: 10, backgroundColor: "#FFF",
        flex:1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
    
       },

     

    productcontainer:{},
  categoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
     
   
},
  productCard: {
      width: screenWidth / 3 - 10,
      backgroundColor: "#fff",
      borderRadius: 10,
      padding:10,
      marginVertical: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
  },
  productImage: { width: "100%", height: 100, borderRadius: 8, resizeMode: "cover" },
 
  productDetails: { flexDirection: "row", justifyContent: "space-between", width: "100%", paddingVertical: 10 },
    productTextContainer: { flex: 1 },
    productName: { fontSize: 14, fontWeight: "bold", textAlign: "left" },
    productDescription: { fontSize: 12, textAlign: "left", color: "#555", marginHorizontal:5,},
    productPrice: { fontSize: 14, fontWeight: "bold", textAlign: "right", color: "#FCA311" },
    productRow: { flexDirection: "row", justifyContent: "space-between" ,flexWrap: "wrap" },
    addbtn:{
        borderWidth:1,
        paddingHorizontal:10,
        borderRadius:5,
    },
    drafttext:{
        fontSize:18,
        alignItems:"center",
        flexDirection:"row",
        justifyContent:"center", 
    },
           header:{ 
            flexDirection:"row",
         justifyContent:"center", 
         alignContent:"center",
        borderBottomWidth:2,
        borderColor:"#ECECEC",
        width:"100%",
        marginVertical:10,
        alignItems:"center",
       },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#006EB21C',
        paddingHorizontal: 10,
        borderRadius: 25,
        marginHorizontal: 15,
        marginBottom: 10,
        height: 40,
        width:"80%",
       
      },
    
      searchIcon: {
        width: 18,
        height: 18,
        tintColor: '#006EB2',
        marginRight: 5,
      },
    
      searchInput: {
        flex: 1,
        color: '#000',
        fontSize: 14,
      },
    
      micIcon: {
        width: 18,
        height: 18,
        tintColor: 'red',
        marginLeft: 5,
      },
      proceedbtn:{
      alignItems:"center",
       marginBottom:20,
       flexDirection:"row",
      
      },
      proceedcontainer:{
      width:"40%",
      marginLeft:"30%",
      marginBottom:-40,
      },
      barcodetext:{
        textAlign: 'center',
        color:"#FCA511",
      },

      barcodecontainer:{
      alignContent:"center",
      alignItems:"center",
      justifyContent:"center",
      marginLeft:"10%",
      backgroundColor:"#FFF7DD",
      paddingHorizontal:10,
      paddingVertical:10,
      marginBottom:10,
      borderColor:"#FCA511",
      borderWidth:1,
      

      },
      proceedtext:{
      borderWidth: 1,
        borderColor: '#FCA511',
        backgroundColor: '#FCA511',
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 5,
        borderRadius: 10,
        paddingHorizontal:40,
        paddingVertical:6,
        color:"#fff",

      }

})
export default DraftScreen
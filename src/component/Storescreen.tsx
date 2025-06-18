import {useState} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Platform,FlatList, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Header from "./Header";
import Bottomnavigation from "./Bottomnavigation";
import NavigationButton from "./NavigationButton";
import CustomSwitch from "./CustomSwitch";


const screenWidth = Dimensions.get("window").width - 20;

interface Product {
    id: string;
    name: string;
    image: any;
  }

  const orderTypes = ["Online Store", " | ", "Tools"];

  const products = [
    { id: "1", name: "Product 1",  discount:"30", description: "This is product 1", price: "10", image: require("../assets/product.png"), type: "Top Liked" },
    { id: "2", name: "Product 2", discount:"30", description: "This is product 2", price: "20", image: require("../assets/product.png"), type: "Top Liked" },
    { id: "3", name: "Product 3", discount:"30", description: "This is product 3", price: "30", image: require("../assets/product.png"), type: "Top Liked" },
    { id: "4", name: "Product 4", discount:"30", description: "This is product 4", price: "40", image: require("../assets/product.png"), type: "Top Rated" },
    { id: "5", name: "Product 5", discount:"30", description: "This is product 5", price: "50", image: require("../assets/product.png"), type: "Top Rated" },
    { id: "6", name: "Product 6", discount:"30", description: "This is product 6", price: "60", image: require("../assets/product.png"), type: "Top Rated" },
  ];

const getFilteredProducts = (type: string) => {
  return products.filter(product => product.type === type).slice(0, type === "Low Stock" ? 6 : 3);
};
  const videoData = [
    { id: 1, source: require("../assets/product/product3.png") },
    { id: 2, source: require("../assets/product/product3.png") },
    { id: 3, source: require("../assets/product/product3.png") },
    { id: 4, source: require("../assets/product/product3.png") },
  ];
  const spotlightProducts = [
    { id: 1, image: require("../assets/product/spotlight.png"), discount: "50% OFF" },
    { id: 2, image: require("../assets/product/spotlight1.png"), discount: "40% OFF" },
    { id: 3, image: require("../assets/product/spotlight3.png"), discount: "30% OFF" },
    { id: 4, image: require("../assets/product/spotlight1.png"), discount: "20% OFF" },
    { id: 5, image: require("../assets/product/spotlight.png"), discount: "10% OFF" },
    { id: 6, image: require("../assets/product/spotlight3.png"), discount: "60% OFF" },
  ];
const Storescreen = () => {
  const [disabletab, setdisable] = useState(true)
     const [selectedTab, setSelectedTab] = useState("Products");
         const [selectedType, setSelectedType] = useState("On Shop");
     
  return (
    <View style={styles.container}>
   
   <Header
        title="Store"
        backgroundColor="#FFF"
        textColor="#333"
        borderBottomColor="#ccc"
      /> 

      <ScrollView>
        {/* Top Header */}
    
        {/* Store Banner */}
        <Image source={require("../assets/product/product2.png")} style={styles.banner} />

        {/* Store Details Card */}
        <View style={styles.detailsCardContainer}>
          <View style={styles.detailsCard}>
            {/* Store Logo */}
            <View style={styles.logoContainer}>
              <Image source={require("../assets/product/storelogo.png")} style={styles.logo} />
              <Text style={styles.openLabel}>Edit Logo</Text>
              <View style={styles.storeContainer}>
              <Text style={styles.storetext}>Business Name</Text>
              <MaterialIcon name="location-on" size={28} color="#000" style={styles.actionIcon}/>
              
                 </View>
            </View>
            
            {/* Store Info */}
            <View style={styles.infoContainer}>
            <View style={styles.editbannner}>
            <Text>
                Edit <Icon name="star" size={20} color="#FCA311" />
                {"\n"}
                banner
              </Text>
                
               
              </View>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={25} color="#FCA311" />
                <Text>Location</Text>
              </View>
              {/* Follow Button and Icons */}
              <View style={styles.actionsContainer}>
                {/* <Icon name="bell-outline" size={24} color="#000" style={styles.actionIcon} /> */}
                <CustomSwitch value={disabletab} onValueChange={setdisable} 
                 activeColor="#830002"
        inactiveColor="#999"
        borderColor="#4CAF50"/>
                
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followText}>Disable</Text>
                </TouchableOpacity>
              </View>
            </View>

            
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.textheader}>About</Text>
          <Text style={styles.additionalText}>Lorem ipsum dolor sit amet consectetur. Nulla eget consequat et volutpat dolor sodales sem. Egestas pulvinar nibh amet a nunc velit amet in. Tristique ipsum enim turpis porttitor amet at volutpat. Rhoncus orci consequat sed aenean.</Text>
        </View>
        </View>
         {/* Additional Text at the Bottom */}
        

          <View style={styles.Containertitle}>
          <Text style={styles.sectionTitle}>+ Add Banners</Text>
          <Text style={styles.sectionTitle}>Max - 3</Text>
        </View>
          {/* Scrollable Banner */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
          <Image source={require("../assets/product/banner.png")} style={styles.scrollBanner} />
          <Image source={require("../assets/product/banner.png")} style={styles.scrollBanner} />
        </ScrollView>



        <View style={styles.spotlightSection}>
      
        <View style={styles.Containerspotlight}>
          <Text style={styles.sectionTitle}>+ Add Spotlight Products</Text>

          <Text style={styles.sectionTitle}>Max - 4  Max - 8</Text>
         
      
        </View>
           
                     <View style={styles.productcontainer}>
                            {["Top Liked", "Top Rated", "Most Bought"].map(category => (
                                <View key={category} style={styles.categoryContainer}>
                                    
                                    <View style={styles.productRow}>
                                        {getFilteredProducts(category).map((product) => (
                                            <View key={product.id} style={styles.productCard}>
                                                <View style={styles.stockBadgeAbove}>
                                                        <Text style={styles.stockText}>{product.discount} % OFF</Text>
                                                  </View>
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
           
    
    </View>
      
      

<View style={styles.highlightsSection}>
<View style={styles.Containertitle}>
          <Text style={styles.sectionTitle}>+ Add Posts</Text>
          <Text style={styles.sectionTitle}>Max - 4</Text>
        </View>
        
          <View style={styles.highlightCard}>
            <Image source={require("../assets/product/product2.png")} style={styles.highlightImage} />

            <View style={styles.postcontainer}>
              <Text style={styles.highlightDescription}>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur.</Text>
              
            <View style={styles.highlightControls}>
              
              <TouchableOpacity style={styles.openButton}><Text style={styles.openText}>Boost</Text></TouchableOpacity>
              <Icon name="briefcase-upload-outline" size={24} color="#000" />
            </View>
            </View>
          </View>
          
        </View>
        <View style={styles.Containerspotlight}>
          <Text style={styles.sectionTitle}>+ Add Video Posts</Text>

          <Text style={styles.sectionTitle}>Max - 4</Text>
          </View>
        <View style={styles.videoSection}>
            
  {Array.from({ length: Math.ceil(videoData.length / 2) }, (_, rowIndex) => (
    <View key={rowIndex} style={styles.videoRow}>
      {videoData.slice(rowIndex * 2, rowIndex * 2 + 2).map((video) => (
        <View key={video.id} style={styles.videoCard}>
          <Image source={video.source} style={styles.videoImage} />
          <Icon name="play-circle-outline" size={40} color="#fff" style={styles.playIcon} />
          <Icon name="cards-heart" size={24} color="red" style={styles.videoIcon} />
          <Icon name="briefcase-upload-outline" size={24} color="#000" style={styles.videoIcon1} />
        </View>
      ))}
    </View>
  ))}
</View>
<View style={[styles.highlightsSection,]}
>
<View style={styles.Containerspotlight}>
          <Text style={styles.sectionTitle}>Live Review</Text>

          <Text style={styles.sectionTitle}><Icon name="star" size={25} color="#FCA311" /> Disabled</Text>
         
      
        </View>
          <View style={styles.reviewContainer}>
          <View style={styles.starContainer}>
                <Icon name="star" size={25} color="#FCA311" />
                <Icon name="star" size={25} color="#FCA311" />
                <Icon name="star" size={25} color="#FCA311" />
                <Icon name="star" size={25} color="#FCA311" />
             
              </View>
              <View>
              <Text style={styles.reviewtext}>Very good brand to purchase T-Shirts, good quality products</Text>
                <Text style={styles.reviewuser}>Nikita</Text>
                </View>
          </View>
          </View>
          <View style={styles.fottercontainer}>
      <View style={styles.textRow}>
        <View style={styles.line} />
        <Text style={styles.title}>Keep Shopping</Text>
        <View style={styles.line} />
      </View>
      <Text style={styles.location}>@ Lacoste, Panjaguga, Hyderabad - A.P.</Text>
    </View>
      </ScrollView>
 
  <View style={styles.bottomcontainer}>
      <TouchableOpacity style={styles.option}>
        <Icon name="storefront" size={20} color="#555" />
        <Text style={styles.optionText}> <NavigationButton screen="MarketingTools" label="Online Store"  color="#FCA511" fontSize={16} fontWeight="bold"/></Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.option}>
        <Icon name="build" size={20} color="#f7931e" />
        <Text style={[styles.optionText, { color: '#f7931e' }]}><NavigationButton screen="MarketingTools" label="Tools"  color="#000" fontSize={16} /></Text>
      </TouchableOpacity>
    </View>
<Bottomnavigation/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  banner: {
    width: "100%",
    height: 800,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
    elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "black" },
  
  headerContainer: {
    position: "absolute", // Fixed at the top
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    elevation: 5, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000, // Ensures it's above other components
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  verifiedIcon: {
    marginLeft: 5,
    backgroundColor:"#006EB2",
    borderRadius:19,
  },
  openStatus: {
    fontSize: 14,
    color: "#00DC30",
    marginLeft: 5,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 15,
  },

  detailsCardContainer: {
    top:-80,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 15,
    padding: 15,
    
  },
  detailsCard: {
    width: "95%",
    

    flexDirection: "row",
    alignItems: "center",
    paddingVertical:30,
    
  },
  logoContainer: {
    width: 200,
    height: 90,
    borderRadius: 45,
  
    justifyContent: "flex-start",
    
    
    position: "absolute",
    top: -50,
    left: 15,
  },
  openLabel: {
    position: "absolute",
    bottom: 0,
    marginLeft: 10,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "rgba(211, 211, 211, 0.4)", // red with 40% opacity
    paddingHorizontal: 15,
    paddingBottom:10,
    borderEndStartRadius:10,
    
  },
  storetext:{
    
    fontWeight: "bold",
    fontSize:20,
  },
  storeContainer:{
    flexDirection: "row",
    
  },

  logo: {
    width: 100,
    height: 100,
    borderRadius: 35,
  },
  infoContainer: {
    flex: 1,
    marginTop:-10,
    justifyContent: "flex-end",
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  staractionIcon:{
    backgroundColor:"#006EB2",
    borderRadius:20,
    padding:6,
    marginLeft:5
  },

editbannner:{
  flexDirection: "row",
  justifyContent: "flex-end",
  top:-100,
  backgroundColor:"#C7C2C0",
  alignSelf:"flex-end",
  borderRadius:10,
  paddingHorizontal:10,
  paddingVertical:2,
},

  ratingContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical:5,
    alignContent:"center",
    alignItems:"center",
    gap:5,
    top:-60,
  },
  actionsContainer: {
   
    flexDirection: "row",
    alignItems:"flex-end",
    justifyContent:"flex-end",
    top:-60,
    left:15,
  },
  Containertitle:{
    marginTop:-50,
    flexDirection:"row",
    paddingHorizontal:10,
    justifyContent:"space-between",
  },
  stockBadgeAbove: {
    alignSelf:"flex-start",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginBottom:-20,
    zIndex:1,
    backgroundColor:"#FCA511",
},
stockText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
},
  followButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  followText: {
    fontWeight: "bold",
    color:"#AA0000",
  },

  actionIcon: {
    marginLeft: 10,
  },
  textContainer: {
    position:"relative",
    marginTop:-50,
    padding: 20,
  },
  textheader:{
    fontSize: 16,
    textAlign: "left",
    fontWeight:600,
  },
  additionalText: {
    fontSize: 16,
    textAlign: "left",
    color: "#000",
  },
 
  Containerspotlight:{
    flexDirection:"row",
    paddingHorizontal:10,
    justifyContent:"space-between",
    marginTop:20,
  },
  subContainerspotlight:{
    flexDirection:"row",
      
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
 
  filterButton: {
    backgroundColor: "#B9DAEE",
    paddingHorizontal:10,
    paddingVertical:2,
    borderRadius: 5,
  },
  filterText: {
    color: "#006EB2",
  },
  catalogGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  catalogCard: {
    width: 150,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  catalogImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },

  buyText: {
    color: "#fff",
    textAlign: "center",
  },
  bannerScroll: {
    
  },
  scrollBanner: {
    width: 380, // Adjust width based on content
    height: 150,
    marginHorizontal: 10, // Provides spacing between banners
    borderRadius: 10,
  },
  spotlightSection: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  productCard1: {
    width: 120, // Adjust width as per content
    marginRight: 10,
    alignItems: "center",
  },
  productImagespot: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  discountTextspotligt: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff0000",
  },
  discountBadge: { position: "absolute", top: 10, left: 10, backgroundColor: "#B9DAEE", padding: 5, borderRadius: 5 },
  discountlikeBadge: { position: "absolute", top: 10,right: 10, padding: 5, borderRadius: 5, justifyContent:"flex-end"},
  discountText: { color: "#006EB2", fontSize: 12 },

  rating: { color: "gray", fontSize: 12 },
  price: { fontWeight: "bold" },
  mrp: { textDecorationLine: "line-through", color: "gray", marginLeft: 5 },
  
  buttonContainer: { flexDirection: "row", marginTop: 10, justifyContent: "space-between" },
  buyButton: { backgroundColor: "#006EB2", padding: 10, borderRadius: 5, flex: 1, alignItems: "center", marginRight: 5, width: "48%" },
  cartButton: { padding: 10, backgroundColor: "#006EB2", borderRadius: 5, alignItems: "center", justifyContent: "center", width: "48%" },
  buttonText: { color: "white", fontWeight: "bold" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  highlightsSection: {
    paddingHorizontal: 10,
    marginTop: 40,
  },

 
  highlightCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  highlightImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  highlightControls: {
    flexDirection: "row",
    justifyContent:"flex-end",
   gap:20,
    marginVertical: 10,
  },
  openButton: {
    
    paddingVertical: 5,
 
    
  },
  openText: {
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "#006EB2",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  highlightDescription: {
    fontSize: 16,
    color: "#555",
    fontWeight:"normal"     ,
     maxWidth:"80%",
    textAlign:"left",
    padding:5,
    
  },
  postcontainer:{
   flexDirection:"row",
   justifyContent:"space-between",
  },
  videoSection: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  videoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  videoCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  videoImage: {
    width: "100%",
    height: 350,
   
  },
  playIcon: {
    position: "absolute",
    top: "40%",
    left: "40%",
  },
  videoIcon: {
    position: "absolute",
    bottom: 10,
    right: 40,
  },
  videoIcon1: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  reviewContainer:
  {
    backgroundColor:"#FFEAA5",
    paddingVertical:15,
    paddingHorizontal:40,
    borderRadius:10,
    borderColor:"#000",
    borderWidth:1,
  },
  starContainer:{
    flexDirection: "row",
    marginVertical:5,
    gap:5,
  },
  reviewuser:{
  textAlign:"right",
  fontSize:18,
  fontWeight:600,

  },
  reviewtext:{
    fontSize:16,

  },
 
  line: {
    flex: 1,
    height: 4,
    backgroundColor: "#006EB2",
    marginHorizontal: 40,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006EB2",
    textAlign: "center",
    textTransform: "uppercase",
  },
  location: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginTop: 5,
    marginBottom:20,
  },
  fottercontainer:{
    marginTop:30,
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
    },
    ButtonContainer: {
        alignItems: "center",
        marginVertical: 20,
      },
      
      typeButtonWrapper: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        paddingHorizontal:40,
        elevation: 2,
        borderColor: "#C3C3C3",
        borderWidth: 1,
    
      },
      
      typeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginHorizontal: 10,
    
      },
      
      selectedType: {
        backgroundColor: "#fff",
      },
      
      typeText: {
        color: "#333",
        fontWeight: "bold",
      },
      
      selectedTypeText: {
        color: "#ffb347",
      },
      bottomcontainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal:10,
        marginBottom:10,
      },
      option: {
        flexDirection: 'row',
        alignItems: 'center',
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
});

export default Storescreen;
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MainContainer from '../CommonComponent/MainContainer';
import CustomDropdown from '../CommonComponent/CustomDropdown';
import CustomHeader from '../CommonComponent/CustomHeader';

const campaigns = [
  {
    id: '1',
    status: 'Active',
    views: 100,
    clicks: 10,
    spend: 500,
    budget: 1000,
    start: '4/27/2025, 11:00AM',
  },
  {
    id: '2',
    status: 'Ended',
    views: 100,
    clicks: 10,
    spend: 500,
    budget: 1000,
    start: '4/27/2025, 11:00AM',
    end: '4/27/2025, 11:00AM',
  },
  {
    id: '3',
    status: 'Pending',
    budget: 1000,
  },
  {
    id: '4',
    status: 'Rejected',
    budget: 1000,
    reason:
      'Content opposes our platform policy to know in detail read terms & conditions',
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Active':
      return {borderColor: '#4CAF50', labelColor: '#4CAF50', bgColor: '#E8F5E9'};
    case 'Ended':
      return {borderColor: '#9E9E9E', labelColor: '#757575', bgColor: '#ECEFF1'};
    case 'Pending':
      return {borderColor: '#FFC107', labelColor: '#FF9800', bgColor: '#FFF8E1'};
    case 'Rejected':
      return {borderColor: '#F44336', labelColor: '#F44336', bgColor: '#FFEBEE'};
    default:
      return {};
  }
};

const BannerAds = ({navigation}:any) => {
  const renderCard = (item: any) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={[styles.card, {backgroundColor: statusStyle.bgColor, borderColor: statusStyle.borderColor}]}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, {backgroundColor: statusStyle.labelColor + '20'}]}>
            <Text style={[styles.statusText, {color: statusStyle.labelColor}]}>
              {item.status}
            </Text>
          </View>
          {(item.status === 'Active' || item.status === 'Pending') && (
            <TouchableOpacity>
              <Icon name="stop-circle" size={24} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>

        <Image
          source={require('../assets/logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />

        <Text style={styles.campaignTitle}>Campaign name: 12345</Text>
        <View style={styles.detailsRow}>
          <Text>Budget - Rs.{item.budget.toFixed(2)}</Text>
          {item.spend && <Text>Spend - Rs.{item.spend.toFixed(2)}</Text>}
        </View>
        {item.views && (
          <View style={styles.detailsRow}>
            <Text>Views - {item.views}</Text>
            <Text>Clicks - {item.clicks}</Text>
          </View>
        )}
        <Text style={styles.dateText}>Start: {item.start}</Text>
        {item.end && <Text style={styles.dateText}>End: {item.end}</Text>}
        {item.status === 'Rejected' && (
          <Text style={styles.rejectReason}>{item.reason}</Text>
        )}
      </View>
    );
  };

  return (
    <MainContainer>
         <CustomHeader
 title='Banner Ads'
 />
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Banner Ads</Text>
      </View>
 */}


      {/* Campaign Summary */}
      <View style={styles.summaryContainer}>
         <View style={{ flexDirection: 'row',
    justifyContent: 'space-between',}}>
        <Text style={{color:"#FCA311",fontSize:20,fontWeight:"600"}}>
            Campaign Details
        </Text>
        <CustomDropdown
        onSelect={()=>{}}
        placeholder='Selet day'
        options={[{id:"day",name:"Till Day"}]}
        selectedValue=''
        dropDownBoxStyle={{height:hp(5)}}
        />
    </View>

      <View style={{ flexDirection: 'row',
    justifyContent: 'space-between',}}>
      
        <View style={styles.spentActiveView}>
          <Text style={styles.summaryTitle}>Spent</Text>
          <Text style={styles.summaryValue}>Rs.2000.00</Text>
        </View>
         <View style={styles.spentActiveView}>
          <Text style={styles.summaryTitle}>Active</Text>
          <Text style={styles.summaryValue}>Rs.1000.00</Text>
        </View>
      </View>
      </View>

      {/* Campaign List */}
      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => renderCard(item)}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Banner */}
      <TouchableOpacity 
      onPress={()=>{
        navigation.navigate("AddBannerScreen");
      }}
      style={styles.addBannerBtn}>
        <Text style={styles.addBannerText}>Add Banner</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  headerTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginLeft: wp(2),
  },
  summaryContainer: {
   
    marginBottom: hp(2),
    borderWidth:0.5,
    borderRadius:10,
    borderColor:"#C7C7C7",
    padding:10,
    marginTop:hp(1)
  },
  summaryTitle: {
    color: '#000    ',
    fontWeight: '600',
    fontSize: wp(5),
  },
  summaryValue: {
   
    paddingBottom: wp(2),
    borderRadius: 6,
    marginTop: 4,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: hp(10),
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: wp(4),
    marginBottom: hp(2),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: {
    fontWeight: '600',
  },
  logo: {
    height: hp(6),
    alignSelf: 'center',
    marginVertical: hp(1),
  },
  campaignTitle: {
    fontWeight: '600',
    fontSize: wp(4),
    marginBottom: hp(1),
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateText: {
    fontSize: wp(3.2),
    color: '#555',
  },
  rejectReason: {
    marginTop: 6,
    color: '#D32F2F',
    fontSize: wp(3.4),
  },
  addBannerBtn: {
    backgroundColor: '#4CAF50',
    padding: wp(3),
    paddingHorizontal:2,
    borderRadius: 50,
    position: 'absolute',
    bottom: hp(2),
    alignSelf: 'center',
    width: '40%',
    alignItems: 'center',
    right:10
  },
  addBannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp(4),
  },
  spentActiveView:{
    width:"48%",
    backgroundColor:"#FFE8C2",
    paddingHorizontal:20,
    borderRadius:10,
    paddingVertical:10

  }
});

export default BannerAds;

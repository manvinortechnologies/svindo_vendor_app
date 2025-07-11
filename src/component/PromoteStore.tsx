import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import Headerwithback from './Headerwithback';
import CustomSwitch from './CustomSwitch';

const sampleData = [
  {
    id: '1',
    type: 'Product',
    number: '12345',
    status: 'Active',
    views: 100,
    clicks: 10,
    budget: 'Rs.1000.00',
    spend: 'Rs.500.00',
    start: '4/27/2025, 11:00am',
  },
  {
    id: '2',
    type: 'Product',
    number: '12345',
    status: 'Ended',
    views: 100,
    clicks: 10,
    budget: 'Rs.1000.00',
    spend: 'Rs.500.00',
    start: '4/27/2025, 11:00am',
  },
  {
    id: '3',
    type: 'Reel',
    number: '12345',
    status: 'Active',
    views: 100,
    clicks: 10,
    budget: 'Rs.1000.00',
    spend: 'Rs.500.00',
    start: '4/27/2025, 11:00am',
  },
  {
    id: '4',
    type: 'Post',
    number: '12345',
    status: 'Ended',
    views: 100,
    clicks: 10,
    budget: 'Rs.1000.00',
    spend: 'Rs.500.00',
    start: '4/27/2025, 11:00am',
  },
];

const PromoteStore = () => {
  const [boosted, setBoosted] = useState(false);

  return (
    <View style={styles.container}>
      <Headerwithback title={'Promote Your Store'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Store Boost Section */}
        <View style={styles.box}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.boldText}>Store Boost</Text>
              <Text style={styles.description}>
                This option helps you to boost your store visibility on svindo app. On enabling it your store logo and name will be recommended in main page and category level. It will be charged as per{' '}
                <Text style={{ color: '#FF0000', fontWeight: '500' }}>terms & conditions</Text>
              </Text>
            </View>
          </View>
         <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
             <Text style={{color: '#FCA311', marginRight: 10}}>Boosted on svindo</Text>
          <CustomSwitch
              value={boosted}
              onValueChange={() => setBoosted(!boosted)}
            />
         </View>
        </View>

        {/* Boost Spotlight Section */}
        <Text style={styles.boldText}>Boost Spotlight Product / Highlights</Text>
        <View style={styles.box}>
          <Text style={styles.description}>
            This option helps you to boost your product or reel/offer post visibility on svindo app. It will be charged as per{' '}
            <Text style={{ color: '#FF0000', fontWeight: '500' }}>terms & conditions</Text>
          </Text>
          <Text style={{fontWeight: '600', textAlign: 'center'}}>Approximate Costing</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.costing}>
            per view cost: <Text style={{fontWeight: '500'}}>10 paisa</Text> 
          </Text>
          <Text style={styles.costing}>
            per view cost: <Text style={{fontWeight: '500'}}>10 paisa</Text>
          </Text>
          </View>
        </View>

        {/* FlatList */}
        <FlatList
          data={sampleData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
  <View
    style={[
      styles.card,
      { backgroundColor: item.status === 'Active' ? '#D8FFDE' : '#FFEAEA' },
    ]}
  >
    {/* Status Badge */}
    <View style={styles.statusContainer}>
      <Text
        style={[
          styles.statusText,
          {
            color: item.status === 'Active' ? '#00B74A' : '#FF0000',
            borderColor: item.status === 'Active' ? '#00B74A' : '#FF0000',
          },
        ]}
      >
        {item.status}
      </Text>
    </View>

    {/* Content */}
    <View style={styles.cardContent}>
      <Image
        source={{ uri: 'https://via.placeholder.com/60x30.png?text=PREET' }}
        style={styles.thumbnail}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.productTitle}>
          {item.type}: {item.number}
        </Text>
        <View style={styles.rowBetweenContent}>
          <Text style={styles.metaText}>views - {item.views}</Text>
          <Text style={styles.metaText}>clicks - {item.clicks}</Text>
        </View>
        <Text style={styles.metaText}>Budget - {item.budget}</Text>
        <Text style={styles.metaText}>Spend - {item.spend}</Text>
        <Text style={styles.metaText}>Start: {item.start}</Text>
        {item.status === 'Ended' && (
          <Text style={styles.metaText}>End: {item.start}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteIcon}>⏺</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {/* Boost Button */}
        <TouchableOpacity style={styles.boostButton}>
          <Text style={styles.boostText}>Boost</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PromoteStore;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
    paddingTop: 15 
  },
  scrollContent: { padding: 16, paddingBottom: 100 },
  box: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  rowBetween: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center' 
},
  boldText: { 
    fontWeight: 'bold', marginBottom: 4 
},
  description: {
     fontSize: 12, 
     color: '#333' 
    },
  costing: { 
    fontSize: 12, 
    color: '#333', 
    marginTop: 6 
},
  card: {
  borderRadius: 10,
  padding: 10,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#ccc',
},
statusContainer: {
  marginBottom: 6,
},
statusText: {
  fontSize: 11,
  paddingVertical: 2,
  paddingHorizontal: 8,
  borderRadius: 4,
  borderWidth: 1,
  alignSelf: 'flex-start',
  overflow: 'hidden',
},
cardContent: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
thumbnail: {
  width: 60,
  height: 30,
  resizeMode: 'contain',
  borderRadius: 4,
},
productTitle: {
  fontWeight: 'bold',
  fontSize: 13,
  marginBottom: 2,
},
metaText: {
  fontSize: 12,
  color: '#333',
},
rowBetweenContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
deleteButton: {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#FF0000',
  justifyContent: 'center',
  alignItems: 'center',
},
deleteIcon: {
  color: '#fff',
  fontSize: 12,
},

  boostButton: {
    width: '30%', 
    alignSelf: 'flex-end',
    backgroundColor: '#0BAF62',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  boostText: { color: '#fff', fontWeight: '700' },
});

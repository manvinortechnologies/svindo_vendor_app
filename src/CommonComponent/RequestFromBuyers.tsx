import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const requests = [
  {
    id: '1',
    name: 'Product Name',
    description: 'Description',
    category: 'Retail',
    budget: '1000',
  },
  {
    id: '2',
    name: 'Product Name',
    description: 'Description',
    category: 'Retail',
    budget: '1000',
  },
];

const RequestFromBuyers = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>
          <Text style={styles.countText}>100+ </Text>
          Request from Buyers
        </Text>
        
      </View>

      {/* Request List */}
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.budget}>Budget - {item.budget}</Text>
          </View>
        )}
        scrollEnabled={false} // since it's inside a scroll view or screen
      />
      <TouchableOpacity style={styles.viewAll}>
          <Text style={styles.viewAllText}>View all</Text>
          <Icon name="chevron-right" size={18} color="#000" />
        </TouchableOpacity>
    </View>
  );
};

export default RequestFromBuyers;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DEDEDE', 
    marginBottom: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  countText: {
    color: '#F59E0B',
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  viewAllText: {
    fontSize: 13,
    color: '#000',
  },
  card: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#000',
  },
  category: {
    fontSize: 13,
    color: '#000',
  },
  description: {
    fontSize: 12,
    color: '#000',
    marginBottom: 2,
  },
  budget: {
    fontSize: 12,
    color: '#000',
    textAlign: 'right',
  },
});

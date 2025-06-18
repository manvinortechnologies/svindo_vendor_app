import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Platform, StatusBar } from 'react-native';
import Bottomnavigation from './Bottomnavigation';
import Headerwithback from './Headerwithback';
import { ScrollView } from 'react-native-gesture-handler';

const companiesData = [
  {
    id: '1',
    type: 'My Company',
    name: 'Raigun enterprise',
    gstin: '123jkgfhfsk',
  },
  {
    id: '2',
    type: 'My Company',
    name: 'Skyline Traders',
    gstin: 'GSTIN987654321',
  },
];

const ManageCompanies = () => {
  const [companies, setCompanies] = useState(companiesData);

  const handleDelete = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  };

  const renderCompany = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.label}>{item.type}</Text>
      <Text style={styles.companyName}>{item.name}</Text>
      <Text style={styles.gstin}>GSTIN - {item.gstin}</Text>
      <View style={styles.actionRow}>
        <Text style={styles.rename}>Rename</Text>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <Headerwithback title="Manage Companies " />
    <ScrollView>
      {/* Tabs */}
      <View style={styles.tabRow}>
        <Text style={styles.activeTab}>My Companies</Text>
        <Text style={styles.inactiveTab}>Shared With Me</Text>
      </View>

      {/* Company List */}
      <FlatList
        data={companies}
        renderItem={renderCompany}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Add Company */}
      <TouchableOpacity style={styles.addCompany}>
        <Text style={styles.addText}>＋ Add Company</Text>
      </TouchableOpacity>
      </ScrollView>
      <Bottomnavigation></Bottomnavigation>
    </View>
  );
};

export default ManageCompanies;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 20 : 0,
  },
  tabRow: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent:"space-between"
  },
  activeTab: {
    color: '#FCA311',
    fontWeight: 'bold',
    marginRight: 30,
    borderBottomWidth: 2,
    borderColor: '#FCA311',
    paddingBottom: 4,
  },
  inactiveTab: {
    color: '#ADACAC',
    fontWeight:"600"
  },
  card: {
    borderColor: '#FCA311',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFCF8',
    marginBottom: 15,
  },
  label: {
    fontWeight: '800',
    fontSize: 12,
  },
  companyName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  gstin: {
    fontWeight: '800',
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  rename: {
    fontSize: 12,
    color: '#333',
  },
  separator: {
    marginHorizontal: 4,
    color: '#aaa',
  },
  delete: {
    fontSize: 12,
    color: 'red',
  },
  addCompany: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  addText: {
    color: '#FCA311',
    fontWeight: '800',
    fontSize: 16,
  },
});

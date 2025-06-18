import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import Bottomnavigation from './Bottomnavigation';
import NavigationButton from './NavigationButton';



const AddProductScreen = () => {
  const [selectedType, setSelectedType] = useState('Product');
  const [selectedFor, setSelectedFor] = useState('Offline only');

  const types = ['Product', 'Service', 'Print'];
  const forOptions = ['Offline only', 'Both online & Offline'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.header}>Create New</Text>

          {/* Type Row */}
          <View style={styles.row}>
            <Text style={styles.label}>Type :</Text>
            <View style={styles.optionGroup}>
              {types.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    selectedType === type && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedType === type && styles.selectedText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* For Row */}
          <View style={styles.row}>
            <Text style={styles.label}>For :</Text>
            <View style={styles.optionGroup}>
              {forOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    selectedFor === option && styles.selectedOrange,
                  ]}
                  onPress={() => setSelectedFor(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedFor === option && styles.selectedText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}><NavigationButton screen="Storescreen" label="Add Variant"  color="#00630F" fontSize={16} fontWeight="bold"/></Text>
          </TouchableOpacity>
        </View>
      </View>
      <Bottomnavigation/>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    padding: 20,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    borderBottomWidth:2,
    borderColor:"#ECECEC",
    paddingBottom:10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 10,
    width: 50,
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    flex: 1,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginRight: 10,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: '#FCA311',
    borderColor: '#FCA311',
  },
  selectedOrange: {
    backgroundColor: '#FCA311',
    borderColor: '#FCA311',
  },
  optionText: {
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  
  addButton: {
    backgroundColor: '#d4f5dc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    borderWidth:1,
    borderColor:"#00630F",
  },
  
  addButtonText: {
    color: '#00630F',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AddProductScreen
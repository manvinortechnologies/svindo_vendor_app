import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // adjust if using other icon lib
import CustomSwitch from './CustomSwitch'; // adjust import path
import Headerwithback from './Headerwithback'; // adjust import path
// import { styles } from './styles'; // adjust import path

const AddProductScreen = () => {
  const [selectedType, setSelectedType] = useState('Product');
  const [selectedFor, setSelectedFor] = useState('Offline only');

  const types = ['Product', 'Service', 'Print'];
  const forOptions = ['Offline only', 'Both online & Offline'];

  // Sections always present
  const sections = [
    {
      title: 'Product Name',
      content: (
        <View style={[styles.inputBoxOptional, { borderColor: 'white', opacity: 5 }]}>
          <Text style={styles.placeholderText}>Ex: Lee White T shirt XL size</Text>
          <Icon name="chevron-down" size={18} color="#000" />
        </View>
      ),
    },
    {
      title: 'Pricing Details',
      content: (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.smallLabel}>Wholesale Price (Optional)</Text>
            <CustomSwitch value={false} onValueChange={() => {}} />
          </View>

          <View style={styles.inputBoxOptional}>
            <Text style={styles.placeholderText}>Enter here</Text>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>Purchase Price</Text>
              <View style={styles.inputBoxOptional}>
                <Text style={styles.placeholderText}>Enter here</Text>
              </View>
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>Sales Price</Text>
              <View style={styles.inputBoxOptional}>
                <Text style={styles.placeholderText}>Enter here</Text>
              </View>
            </View>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>MRP</Text>
              <View style={styles.inputBoxOptional}>
                <Text style={styles.placeholderText}>Enter here</Text>
              </View>
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>Unit</Text>
              <TouchableOpacity style={styles.inputBoxOptional}>
                <Text style={styles.placeholderText}>ex: kg</Text>
                <Icon name="chevron-down" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>HSN</Text>
              <View style={styles.inputBoxOptional}>
                <Text style={styles.placeholderText}>Enter here</Text>
              </View>
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>GST</Text>
              <TouchableOpacity style={styles.inputBoxOptional}>
                <Text style={styles.placeholderText}>ex: 5%</Text>
                <Icon name="chevron-down" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.warningText}>
            * To enable GST details please select as registered business in company settings
          </Text>
        </View>
      ),
      customHeader: (
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Pricing Details</Text>
          <View style={styles.includesRow}>
            <Text style={styles.smallLabel}>Includes Tax</Text>
            <CustomSwitch value={false} onValueChange={() => {}} />
          </View>
        </View>
      ),
    },
    {
      title: 'Stock',
      content: (
        <View style={styles.stockContainer}>
          <Text style={styles.stockNote}>
            * Disable stock to create a simple product for billing only
          </Text>

          <View style={styles.imeiRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.stockLabel}>IMEI / Serial No </Text>
              <Text style={styles.optionalText}>(Optional)</Text>
            </View>
            <TouchableOpacity style={styles.addButtonSmall}>
              <Text style={styles.addButtonTextSmall}>Add +</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.stockWarning}>
            * Stock will be calculated based on this
          </Text>

          <Text style={styles.stockLabel}>Opening Stock</Text>
          <View style={[styles.inputBoxStock, { width: '50%', marginTop: 5 }]}>
            <Text style={styles.placeholderText}>Enter here</Text>
          </View>

          <View style={styles.lowStockRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.lowStockIcon}>🔔</Text>
              <Text style={styles.lowStockText}>Low stock alert</Text>
            </View>
            <CustomSwitch value={false} onValueChange={() => {}} />
          </View>

          <Text style={styles.stockLabel}>Low Stock Quantity</Text>
          <View style={[styles.inputBoxStock, { width: '50%', marginTop: 5 }]}>
            <Text style={styles.placeholderText}>Enter here</Text>
          </View>
        </View>
      ),
    },
    {
      title: 'Optional Details',
      content: (
        <View style={styles.optionalContainer}>
          {/* Example: You can fill in your optional details content */}
          <Text style={styles.optionalLabel}>Description <Text style={styles.optionalText}>(Optional)</Text></Text>
          <View style={styles.textAreaBox}>
            <Text style={styles.placeholderText}>Enter here</Text>
          </View>
          <Text style={styles.optionalLabel}>Image <Text style={styles.optionalText}>(Optional)</Text></Text>
          <TouchableOpacity style={styles.imageBox}>
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </View>
      ),
      customHeader: (
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Optional Details</Text>
          <TouchableOpacity style={styles.includesRow}>
            <Icon name="chevron-down" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  // Dynamic sections based on selection
  const dynamicSections: any[] = [];
  if (selectedType === 'Product' && selectedFor === 'Both online & Offline') {
    dynamicSections.push(
      {
        title: 'Delivery Details',
        content: (
          <View>
            <View style={styles.toggleRow}>
              <Text style={styles.sectionTitle}>Use default</Text>
              <CustomSwitch value={true} onValueChange={() => {}} />
            </View>
            {['Instant Delivery', 'Self Pickup', 'General Delivery'].map(option => (
              <View key={option} style={styles.toggleRow}>
                <Text style={styles.smallLabel}>{option}</Text>
                <CustomSwitch value={true} onValueChange={() => {}} />
              </View>
            ))}
          </View>
        ),
      },
      {
        title: 'Policies',
        content: (
          <View>
            <View style={styles.toggleRow}>
              <Text style={styles.sectionTitle}>Use default</Text>
              <CustomSwitch value={true} onValueChange={() => {}} />
            </View>
            {[
              'Return',
              'COD',
              'Replacement',
              'Shop Exchange',
              'Shop Warranty',
              'Brand Warranty',
              'On shop orders',
            ].map(option => (
              <View key={option} style={styles.toggleRow}>
                <Text style={styles.smallLabel}>{option}</Text>
                <CustomSwitch value={true} onValueChange={() => {}} />
              </View>
            ))}
          </View>
        ),
      }
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Headerwithback title={'Enter Details'} />
      <FlatList
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
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
          </View>
        }
        data={[...sections, ...dynamicSections]}
        keyExtractor={item => item.title}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={styles.section}>
            {item.customHeader ? item.customHeader : (
              <Text style={styles.sectionTitle}>{item.title}</Text>
            )}
            {item.content}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        }
        extraData={{selectedType, selectedFor}}
      />
    </SafeAreaView>
  );
};

export default AddProductScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
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
  section: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 10,
    padding: 10
  },
  sectionTitle: {
    color: '#FCA311',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  smallLabel: {
    fontSize: 13,
    color: '#555',
    marginRight: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  placeholderText: {
    color: '#000',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  includesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputHalf: {
    flex: 0.48,
  },
  warningText: {
    fontSize: 12,
    color: 'red',
    marginTop: 8,
  },
  stockContainer: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  backgroundColor: '#fff',
},
stockNote: {
  fontSize: 12,
  color: 'red',
  marginBottom: 8,
},
imeiRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
},
stockLabel: {
  fontWeight: '600',
  fontSize: 14,
},
optionalText: {
  fontSize: 12,
  color: '#555',
  marginLeft: 4,
},
addButtonSmall: {
  backgroundColor: '#FCA311',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 4,
},
addButtonTextSmall: {
  color: '#fff',
  fontSize: 13,
  fontWeight: '600',
},
stockWarning: {
  fontSize: 12,
  color: 'red',
  marginBottom: 12,
},
inputBoxStock: {
  borderWidth: 1,
  borderColor: '#FCA311',
  borderRadius: 6,
  padding: 12,
  backgroundColor: '#fffbe6',
  marginBottom: 12,
},
lowStockRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
lowStockIcon: {
  fontSize: 16,
  marginRight: 4,
},
lowStockText: {
  fontSize: 13,
  color: '#555',
},
optionalContainer: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  backgroundColor: '#fff',
},
optionalLabel: {
  fontWeight: '600',
  fontSize: 14,
  marginBottom: 4,
},
// optionalText: {
//   fontSize: 12,
//   color: '#555',
// },
inputBoxOptional: {
  flexDirection: 'row', 
  justifyContent: 'space-between',
  borderWidth: 1,
  borderColor: '#FCA311',
  borderRadius: 6,
  padding: 12,
  backgroundColor: '#FFF8EB',
  marginBottom: 12,
},
rowBetween: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
  gap: 12,
},
colorBox: {
  width: 40,
  height: 40,
  backgroundColor: '#8B3A3A',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  marginBottom: 8
},
textAreaBox: {
  borderWidth: 1,
  borderColor: '#FCA311',
  borderRadius: 6,
  padding: 12,
  backgroundColor: '#fffbe6',
  marginBottom: 12,
  height: 80,
},
imageBox: {
  width: 80,
  height: 80,
  borderWidth: 1,
  borderColor: '#FCA311',
  borderRadius: 6,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fffbe6',
  marginBottom: 12,
},
plusIcon: {
  fontSize: 20,
  color: '#000',
},


  footer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: '#FCA311',
    paddingVertical: 12,
    borderRadius: 8,
    
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});


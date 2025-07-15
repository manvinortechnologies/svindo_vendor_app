import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Headerwithback from './Headerwithback';
import MainContainer from '../CommonComponent/MainContainer';
import { InputBox } from '../CommonComponent/InputBox';
import CustomDropdown, { DropDownOption } from '../CommonComponent/CustomDropdown';
import CustomSwitch from '../CommonComponent/CustomSwitch';
import CalendarModal from '../Modals/CalendarModal';
import Loading from '../CommonComponent/Loading';
import ModalUpdatePhoto from '../Modals/ModalUpdatePhoto';
import ImeiModal from '../Modals/ImeiModal';
import api from '../services/api/api';
const colorOptions: { name: string; id: string | number }[] = [
  { name: 'Red', id: '#FF0000' },
  { name: 'Green', id: '#00FF00' },
  { name: 'Blue', id: '#0000FF' },
  { name: 'Yellow', id: '#FFFF00' },
  { name: 'Orange', id: '#FFA500' },
  { name: 'Purple', id: '#800080' },
  { name: 'Pink', id: '#FFC0CB' },
  { name: 'Black', id: '#000000' },
  { name: 'White', id: '#FFFFFF' },
  { name: 'Gray', id: '#808080' },
  { name: 'Brown', id: '#A52A2A' },
  { name: 'Sky Blue', id: '#87CEEB' },
  { name: 'Teal', id: '#008080' },
  { name: 'Gold', id: '#FFD700' },
  { name: 'Silver', id: '#C0C0C0' },
];
const AddProductScreen = () => {
  const [selectedType, setSelectedType] = useState('Product');
  const [selectedFor, setSelectedFor] = useState('Offline only');

  const types = ['Product', 'Service', 'Print'];
  const forOptions = ['Offline only', 'Both online & Offline'];
  const [productName, setProductName] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salesPrice, setSalesPrice] = useState('');
  const [mrp, setMRP] = useState('');
  const [unit, setUnit] = useState('')
  const [hsn, setHSN] = useState('');
  const [gst, setGst] = useState("")
  const [openingStock, setOpeningStock] = useState('');
  const [lowStockQty, setLowStockQty] = useState('');
  const [brandName, setBrandName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [size, setSize] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');

  // Switches
  const [isWholesaleEnabled, setIsWholesaleEnabled] = useState(true);
  const [includesTax, setIncludesTax] = useState<boolean>(true);
  const [lowStockAlert, setLowStockAlert] = useState(false);
  const [batchSwitch, setBatchSwitch] = useState(true);
  const [expirySwitch, setExpirySwitch] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<DropDownOption>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<DropDownOption>();

  const [pickColor, setPicColor] = useState<{ name: string, id: string | number }>()

  // Delivery options
  const [deliveryOptions, setDeliveryOptions] = useState<Record<string, boolean>>({
    'Instant Delivery': false,
    'Self Pickup': false,
    'General Delivery': false,
  });

  // Policies
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({
    Return: false,
    COD: false,
    Replacement: false,
    'Shop Exchange': false,
    'Shop Warranty': false,
    'Brand Warranty': false,
    'On shop orders': false,
  });
  const [callenderModel, setCallenderModel] = useState<boolean>(false)
  const [deliveryTax, setDeliveryTax] = useState<boolean>(false)
  const [policyTax, setPolicyTax] = useState<boolean>(false)
  const [image1, setImage] = useState<any>();
  const [image1Model, setImage1Model] = useState<boolean>(false)

  const [image2, setImage2] = useState<any>();
  const [image2Model, setImage2Model] = useState<boolean>(false)

  const [image3, setImage3] = useState<any>();
  const [image3Model, setImage3Model] = useState<boolean>(false)

  const [image4, setImage4] = useState<any>();
  const [image4Model, setImage4Model] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imeiModalVisible, setImeiModalVisible] = useState(false);
  const [imeiList, setImeiList] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<DropDownOption[]>();
  const [subCategoryList, setSubCategoryList] = useState<DropDownOption[]>();
  useEffect(() => {
    getCategoryData();
    getSubategoryData();

  }, []);
  const getCategoryData = async () => {
    try {
      setIsLoading(true)
      const res = await api.get("masters/get-product-category/")
      setCategoryList(res.data);
    } catch (error) {

    } finally {
      setIsLoading(false)
    }

  }
  const getSubategoryData = async () => {
    try {
      setIsLoading(true)
      const res = await api.get("masters/get-product-subcategory/")
      setSubCategoryList(res.data);
    } catch (error) {

    } finally {
      setIsLoading(false)
    }
  }

  const onToggleChange = (key: string, value: boolean) => {
    setToggleValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleToggle = (key: string, value: boolean) => {
    setDeliveryOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handelSaveProduct = async () => {
    try {
      setIsLoading(true)
      // const galleryImages=[image2,image3,image4]
     const formData = new FormData();


formData.append('name', productName);
formData.append('product_type', selectedType.toLowerCase());
formData.append('sale_type', selectedFor === 'Both online & Offline' ? 'both' : 'offline');

if (isWholesaleEnabled) formData.append('wholesale_price', String(wholesalePrice));
formData.append('purchase_price', String(purchasePrice));
formData.append('sales_price', String(salesPrice));
formData.append('mrp', String(mrp));
if (unit) formData.append('unit', unit);
if (hsn) formData.append('hsn', hsn);
if (gst) formData.append('gst', String(gst));

  // if (imeiList && imeiList.length) {
  //   imeiList.forEach((imei, index) => {
  //     formData.append(`imei_serials[${index}]`, imei);
  //   });
  // }

formData.append('opening_stock', String(openingStock));
formData.append('stock', String(openingStock));
formData.append('low_stock_alert', String(lowStockAlert));
if (lowStockAlert && lowStockQty) {
  formData.append('low_stock_quantity', String(lowStockQty));
}

if (selectedCategory?.id) {
  formData.append('category', String(selectedCategory.id));
}
if (selectedSubCategory?.id) {
  formData.append('sub_category', String(selectedSubCategory.id));
}

if (brandName) formData.append('brand_name', brandName);
if (pickColor?.name) formData.append('color', pickColor.name);
formData.append('size', size || 'Medium');
if (batchSwitch && batchNumber) formData.append('batch_number', batchNumber);
formData.append('expiry_date', expirySwitch && expiryDate ? expiryDate : ''); // send empty string if null

if (description) formData.append('description', description);

// Delivery options
formData.append('instant_delivery', String(deliveryOptions['Instant Delivery']));
formData.append('self_pickup', String(deliveryOptions['Self Pickup']));
formData.append('general_delivery', String(deliveryOptions['General Delivery']));

// Policy options
formData.append('return_policy', String(toggleValues['Return']));
formData.append('cod', String(toggleValues['COD']));
formData.append('replacement', String(toggleValues['Replacement']));
formData.append('shop_exchange', String(toggleValues['Shop Exchange']));
formData.append('shop_warranty', String(toggleValues['Shop Warranty']));
formData.append('brand_warranty', String(toggleValues['Brand Warranty']));

// Flags
formData.append('tax_inclusive', 'true');
formData.append('is_popular', 'true');
formData.append('is_on_shop', 'true');
formData.append('is_featured', 'true');
formData.append('is_active', 'true');

// Optional: If you're uploading a product image
if (image1) {
  formData.append('image', {
    uri: image1.uri,
    name: image1.fileName || 'product.jpg',
    type: image1.type || 'image/jpeg',
  });
}

// Optional: Gallery Images
// if (galleryImages && Array.isArray(galleryImages)) {
//   galleryImages.forEach((img, index) => {
//     formData.append(`gallery_images[${index}]`, {
//       uri: img.uri,
//       name: img.fileName || `gallery_${index}.jpg`,
//       type: img.type || 'image/jpeg',
//     });
//   });
// }
console.log("formdata-->",formData)

      const res = await api.post("vendor/product/", formData,{
        headers:{
           'Content-Type': 'multipart/form-data',
        }
      })
      if(res.status==201){
        Alert.alert("Success","Product added")
      }
      console.log("--res----", res);



    } catch (error) {

    } finally {
      setIsLoading(false)
    }
  }





  const sections = [
    {
      title: 'Product Name',
      content: (
        // <TouchableOpacity style={styles.inputBoxOptional}>
        //   <Text style={styles.placeholderText}>Ex: Lee White T shirt XL size</Text>
        //   <Icon name="chevron-down" size={18} color="#000" />
        // </TouchableOpacity>
        <InputBox
          background='#FFF8EB'
          placeholder='Enter Product Name'
          onChangeText={setProductName}
          value={productName}
          autoCapitalize='sentences'

        />
      ),
    },
    {
      title: 'Pricing Details',
      content: (
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.smallLabel}>Wholesale Price (Optional)</Text>
            <CustomSwitch value={isWholesaleEnabled} onValueChange={setIsWholesaleEnabled} />
          </View>
          {/* Wholesale Price */}
          {isWholesaleEnabled && (
            <InputBox
              placeholder="Enter here"
              background='#FFF8EB'
              value={wholesalePrice}
              keyboardType='number-pad'
              onChangeText={setWholesalePrice}
            />
          )}
          {/* Purchase & Sales Price */}
          <View style={styles.priceRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>Purchase Price</Text>

              <InputBox
                placeholder="Enter here"
                background='#FFF8EB'
                value={purchasePrice}
                keyboardType='number-pad'
                onChangeText={setPurchasePrice}
              />

            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>Sales Price</Text>

              <InputBox
                placeholder="Enter here"
                background='#FFF8EB'
                value={salesPrice}
                keyboardType='number-pad'
                onChangeText={setSalesPrice}
              />
            </View>
          </View>
          {/* MRP & Unit */}
          <View style={styles.priceRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>MRP</Text>

              <InputBox
                placeholder="Enter here"
                background='#FFF8EB'
                value={mrp}
                onChangeText={setMRP}
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>Unit</Text>
              <InputBox
                placeholder="ex: Kg"
                background='#FFF8EB'
                value={unit}
                onChangeText={setUnit}
              />
            </View>
          </View>
          {/* HSN & GST */}
          <View style={styles.priceRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>HSN</Text>
              <InputBox
                placeholder="Enter here"
                background='#FFF8EB'
                value={hsn}
                onChangeText={setHSN}
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.smallLabel}>GST</Text>
              <InputBox
                placeholder="ex: 5%"
                background='#FFF8EB'
                value={gst}
                onChangeText={setGst}
              />
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
            <CustomSwitch value={includesTax} onValueChange={setIncludesTax} />
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
              <Text style={styles.stockLabel}>IMEI / Serial No</Text>
              <Text style={styles.optionalText}>(Optional)</Text>
            </View>
            <TouchableOpacity style={styles.addButtonSmall}
              onPress={() => { setImeiModalVisible(true) }}
            >
              <Text style={styles.addButtonTextSmall}>Add +</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={imeiList}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}>
                <Text style={styles.itemText}>
                  {index + 1}. {item}
                </Text>

              </View>
            )}
          />
          <Text style={styles.stockWarning}>
            * Stock will be calculated based on this
          </Text>
          <Text style={styles.stockLabel}>Opening Stock</Text>
          <View style={[{ width: '50%', marginTop: 5 }]}>

            <InputBox
              placeholder="Enter here"
              background='#FFF8EB'
              value={openingStock}
              keyboardType='number-pad'
              onChangeText={setOpeningStock}
            />
          </View>
          <View style={styles.lowStockRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.lowStockIcon}>🔔</Text>
              <Text style={styles.lowStockText}>Low stock alert</Text>
            </View>
            <CustomSwitch value={lowStockAlert} onValueChange={setLowStockAlert} />
          </View>
          {lowStockAlert && (
            <>
              <Text style={styles.stockLabel}>Low Stock Quantity</Text>
              <View style={[{ width: '50%', marginTop: 5 }]}>

                <InputBox
                  placeholder="Enter here"
                  background='#FFF8EB'
                  value={lowStockQty}
                  keyboardType='number-pad'
                  onChangeText={setLowStockQty}
                />
              </View>
            </>
          )}
        </View>
      ),
    },

    {
      title: 'Optional Details',
      content: (
        <View style={styles.optionalContainer}>
          {/* Category */}
          <Text style={styles.optionalLabel}>Category <Text style={styles.optionalText}>(Optional)</Text></Text>
          {/* <View style={styles.inputBoxOptional}> */}
          {/* <TouchableOpacity style={styles.includesRow}>
              <Icon name="chevron-down" size={18} color="#000" />
            </TouchableOpacity> */}
          <CustomDropdown
            onSelect={setSelectedCategory}
            placeholder='Select Category'
            selectedValue={selectedCategory?.name || ""}
            options={categoryList}
            dropDownBoxStyle={{
              borderWidth: 1,
              borderColor: '#FCA311',
              borderRadius: 6,
              padding: 10,
              backgroundColor: '#FFF8EB',
              marginBottom: 12,
            }}


          />

          {/* Sub Category */}
          <Text style={styles.optionalLabel}>Sub category <Text style={styles.optionalText}>(Optional)</Text></Text>
          {/* <View style={styles.inputBoxOptional}>
            <Text style={styles.placeholderText}>Select Sub category</Text>
            <TouchableOpacity style={styles.includesRow}>
              <Icon name="chevron-down" size={18} color="#000" />
            </TouchableOpacity> */}
          <CustomDropdown
            onSelect={setSelectedSubCategory}
            placeholder='Select Category'
            selectedValue={selectedSubCategory?.name || ""}
            options={subCategoryList}
            dropDownBoxStyle={{
              borderWidth: 1,
              borderColor: '#FCA311',
              borderRadius: 6,
              padding: 10,
              backgroundColor: '#FFF8EB',
              marginBottom: 12,
            }}


          />

          {/* Brand Name */}
          {selectedType !== "Print" && (
            <>
              <Text style={styles.optionalLabel}>Brand Name <Text style={styles.optionalText}>(Optional)</Text></Text>

              <InputBox
                placeholder="Enter here"
                background='#FFF8EB'
                value={brandName}
                onChangeText={setBrandName}
              />

              {/* Pick Color */}
              <Text style={styles.optionalLabel}>Pick Color <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.rowBetween}>
                <View style={[{ flex: 1, flexDirection: 'row', alignItems: "center" }]}>
                  {/* <Text style={styles.placeholderText}>Select one</Text> */}
                  {/* <TouchableOpacity style={styles.includesRow}>
                    <Icon name="chevron-down" size={18} color="#000" />
                  </TouchableOpacity> */}
                  <CustomDropdown
                    options={colorOptions}
                    onSelect={setPicColor}
                    placeholder='Select Color'
                    selectedValue={pickColor?.name || ""}
                    dropDownBoxStyle={{
                      width: "100%",
                      borderWidth: 1,
                      borderColor: '#FCA311',
                      borderRadius: 6,
                      padding: 10,
                      backgroundColor: '#FFF8EB',
                      marginBottom: 12,
                    }}


                  />
                </View>
                <View style={[styles.colorBox, { backgroundColor: pickColor?.id.toString() || "#8B3A3A" }]} />
              </View>

              {/* Select Size */}
              <Text style={styles.optionalLabel}>Select Size <Text style={styles.optionalText}>(Optional)</Text></Text>
              <InputBox
                placeholder="Enter here"
                background='#FFF8EB'
                value={size}
                onChangeText={setSize}
              />

              {/* Batch Number */}
              <View style={styles.toggleRow}>
                <Text style={styles.optionalLabel}>Batch number <Text style={styles.optionalText}>(Optional)</Text></Text>
                <CustomSwitch value={batchSwitch} onValueChange={setBatchSwitch} />
              </View>
              {batchSwitch && (

                <InputBox
                  placeholder="Enter here"
                  background='#FFF8EB'
                  value={batchNumber}
                  onChangeText={setBatchNumber}
                />
              )}

              {/* Expiry Date */}
              <View style={styles.toggleRow}>
                <Text style={styles.optionalLabel}>Expiry Date <Text style={styles.optionalText}>(Optional)</Text></Text>
                <CustomSwitch value={expirySwitch} onValueChange={setExpirySwitch} />
              </View>
              {expirySwitch && (
                <TouchableOpacity style={styles.inputBox}
                  onPress={() => {
                    setCallenderModel(true)
                  }}
                >
                  <TextInput
                    placeholder="Enter here"
                    placeholderTextColor="#888"
                    style={styles.textInput}
                    value={expiryDate}
                    editable={false}
                  />
                </TouchableOpacity>
              )}

              {/* Description */}
              <Text style={styles.optionalLabel}>Description <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.textAreaBox}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter here"
                  placeholderTextColor="#888"
                />
              </View>
            </>
          )}


          {/* Image */}
          <Text style={styles.optionalLabel}>Image <Text style={styles.optionalText}>(Optional)</Text></Text>
          <TouchableOpacity
            onPress={() => { setImage1Model(true) }}
            style={styles.imageBox}>
            {image1?.uri ?
              <Image
                source={{ uri: image1?.uri }}
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
              :
              <Text style={styles.plusIcon}>+</Text>
            }
          </TouchableOpacity>
          {selectedFor === 'Both online & Offline' && selectedType !== "Print" && (
            <>
              <Text style={[styles.optionalText, { marginBottom: 5 }]}>(Optional)</Text>
              <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <TouchableOpacity
                  onPress={() => { setImage2Model(true) }}
                  style={styles.imageBox}>
                  {image2?.uri ?
                    <Image
                      source={{ uri: image2?.uri }}
                      style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                    />
                    :
                    <Text style={styles.plusIcon}>+</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setImage3Model(true) }}
                  style={styles.imageBox}>
                  {image3?.uri ?
                    <Image
                      source={{ uri: image3?.uri }}
                      style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                    />
                    :
                    <Text style={styles.plusIcon}>+</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setImage4Model(true) }}
                  style={styles.imageBox}>
                  {image4?.uri ?
                    <Image
                      source={{ uri: image4?.uri }}
                      style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                    />
                    :
                    <Text style={styles.plusIcon}>+</Text>
                  }
                </TouchableOpacity>
              </View>
            </>
          )}


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

  const dynamicSections: any[] = [];
  if (selectedFor === 'Both online & Offline') {
    dynamicSections.push(
      {
        title: 'Delivery Details',
        content: (
          <View>
            {['Instant Delivery', 'Self Pickup', 'General Delivery'].map(option => (
              <View key={option} style={styles.toggleRow}>
                <Text style={styles.smallLabel}>{option}</Text>
                <CustomSwitch
                  value={deliveryOptions[option]}
                  onValueChange={(val) => handleToggle(option, val)}
                />
              </View>
            ))}
          </View>
        ),
        customHeader: (
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.includesRow}>
              <Text style={styles.smallLabel}>Includes Tax</Text>
              <CustomSwitch value={deliveryTax} onValueChange={setDeliveryTax} />
            </View>
          </View>
        ),
      },
      {
        title: 'Policies',
        content: (
          <View>
            {/* <View style={styles.toggleRow}>
              <Text style={styles.sectionTitle}>Use default</Text>
              <CustomSwitch value={true} onValueChange={() => {}} />
            </View> */}
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
                <CustomSwitch
                  value={toggleValues[option]}
                  onValueChange={(val) => onToggleChange(option, val)}
                />
              </View>
            ))}
          </View>
        ),
        customHeader: (
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Policies</Text>
            <View style={styles.includesRow}>
              <Text style={styles.smallLabel}>Includes Tax</Text>
              <CustomSwitch value={policyTax} onValueChange={setPolicyTax} />
            </View>
          </View>
        ),
      }
    );
  }

  return (
    <MainContainer>
      <SafeAreaView style={styles.safeArea}>
        <Headerwithback title={'Enter Details'} />

        <CalendarModal
          visible={callenderModel}
          onClose={() => { setCallenderModel(false) }}
          onSelect={(e) => {
            setExpiryDate(e)
          }}

        />

        <ImeiModal
          visible={imeiModalVisible}
          onClose={() => setImeiModalVisible(false)}
          imeiList={imeiList}
          setImeiList={setImeiList}
        />
        <Loading
          visible={isLoading}
        />
        <ModalUpdatePhoto
          isVisible={image1Model}
          onClose={() => { setImage1Model(false) }}
          onSelectedFile={(e) => {
            setImage(e)
          }}
        />
        <ModalUpdatePhoto
          isVisible={image2Model}
          onClose={() => { setImage2Model(false) }}
          onSelectedFile={(e) => {
            setImage2(e)
          }}
        />
        <ModalUpdatePhoto
          isVisible={image3Model}
          onClose={() => { setImage3Model(false) }}
          onSelectedFile={(e) => {
            setImage3(e)
          }}
        />
        <ModalUpdatePhoto
          isVisible={image4Model}
          onClose={() => { setImage4Model(false) }}
          onSelectedFile={(e) => {
            setImage4(e)
          }}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 30}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={{ paddingHorizontal: 10 }}

            >
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
              {[...sections, ...dynamicSections].map((item) => {
                if (item.title == "Stock" && selectedType !== "Product") return null;

                return (
                  <View style={styles.section}>
                    {item.customHeader ? item.customHeader : (
                      <Text style={styles.sectionTitle}>{item.title}</Text>
                    )}
                    {item.content}
                  </View>
                );
              })}

              {/* <FlatList
               keyboardShouldPersistTaps="handled"
             nestedScrollEnabled={true} // Important for Android
              data={[...sections, ...dynamicSections]}
              keyExtractor={item => item.title}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => {
                if (item.title == "Stock" && selectedType !== "Product") return null;

                return (
                  <View style={styles.section}>
                    {item.customHeader ? item.customHeader : (
                      <Text style={styles.sectionTitle}>{item.title}</Text>
                    )}
                    {item.content}
                  </View>
                );
              }}
          
            /> */}
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={() => {
                    handelSaveProduct()
                  }}
                  style={styles.addButton}>
                  <Text style={styles.addButtonText}>Save</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MainContainer>
  );
};

export default AddProductScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
    // flexWrap: 'wrap',
    gap: 10,
    flex: 1,
    // backgroundColor:'red'
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
    borderColor: '#FCA311',
    borderRadius: 6,
    padding: 1,
    backgroundColor: '#FFF8EB',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
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
    padding: 10,
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
    marginBottom: 18
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
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});


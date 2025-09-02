import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
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
  FlatList,
} from "react-native";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";

// Components
import Headerwithback from "./Headerwithback";
import MainContainer from "../CommonComponent/MainContainer";
import { InputBox } from "../CommonComponent/InputBox";
import CustomDropdown, {
  DropDownOption,
} from "../CommonComponent/CustomDropdown";
import CustomSwitch from "../CommonComponent/CustomSwitch";
import CalendarModal from "../Modals/CalendarModal";
import Loading from "../CommonComponent/Loading";
import ModalUpdatePhoto from "../Modals/ModalUpdatePhoto";
import ImeiModal from "../Modals/ImeiModal";
import api from "../services/api/api";

// Constants
const PRODUCT_TYPES = ["product", "service", "print"];
const FOR_OPTIONS = ["offline", "both"];
const FOOD_TYPES = ["veg", "non_veg"];
const COLOR_OPTIONS = [
  { name: "Red", id: "Red" },
  { name: "Green", id: "Green" },
  { name: "Blue", id: "Blue" },
  { name: "Yellow", id: "Yellow" },
  { name: "Orange", id: "Orange" },
  { name: "Purple", id: "Purple" },
  { name: "Pink", id: "Pink" },
  { name: "Black", id: "Black" },
  { name: "White", id: "White" },
  { name: "Gray", id: "Gray" },
  { name: "Brown", id: "Brown" },
  { name: "Sky Blue", id: "Sky Blue" },
  { name: "Teal", id: "Teal" },
  { name: "Gold", id: "Gold" },
  { name: "Silver", id: "Silver" },
  { name: "Multicolor", id: "Multicolor" },
];

// Validation Schema
const getValidationSchema = (selectedType: string, selectedFor: string) =>
  Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    sales_price: Yup.string().required("Sales price is required"),
    unit: Yup.string().required("Unit is required"),
    category: Yup.number().nullable().required("Category is required"),
    sub_category:
      selectedFor === "both"
        ? Yup.number().nullable().required("Sub category is required")
        : Yup.mixed().notRequired(),
    opening_stock:
      selectedType === "product"
        ? Yup.number().when("is_stock_enabled", {
            is: true,
            then: (schema) => schema.required("Opening stock is required"),
            otherwise: (schema) => schema.notRequired(),
          })
        : Yup.number().notRequired(),
    low_stock_quantity: Yup.number().when("low_stock_alert", {
      is: true,
      then: (schema) => schema.required("Low stock quantity is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    batch_number: Yup.string().when("batchSwitch", {
      is: true,
      then: (schema) => schema.required("Batch number is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    expiry_date: Yup.string().when("expirySwitch", {
      is: true,
      then: (schema) => schema.required("Expiry date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    description: Yup.string().required("Description is required"),
    image1: Yup.mixed().required("At least one image is required"),
    food_type: Yup.string().when("product_type", {
      is: "food",
      then: (schema) => schema.required("Food type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    print_variants: Yup.array().when("product_type", {
      is: "print",
      then: (schema) => schema.min(1, "At least one print variant is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    customize_print_variants: Yup.array().when(
      ["product_type", "is_customize"],
      {
        is: (product_type: string, is_customize: boolean) =>
          product_type === "print" && is_customize,
        then: (schema) =>
          schema.min(1, "At least one customize variant is required"),
        otherwise: (schema) => schema.notRequired(),
      }
    ),
  });

// Initial Form Values
const getInitialValues = {
  name: "",
  wholesale_price: "",
  purchase_price: "",
  sales_price: "",
  mrp: "",
  unit: "",
  hsn: "",
  gst: "",
  opening_stock: "",
  low_stock_quantity: "",
  is_stock_enabled: true,
  low_stock_alert: false,
  brand_name: "",
  batch_number: "",
  size: "",
  expiry_date: "",
  description: "",
  color: "",
  category: null,
  sub_category: null,
  image1: null,
  image2: null,
  image3: null,
  image4: null,
  instant_delivery: false,
  self_pickup: false,
  general_delivery: false,
  is_on_shop: false,
  return_policy: false,
  cod: false,
  replacement: false,
  shop_exchange: false,
  shop_warranty: false,
  brand_warranty: false,
  tax_inclusive: true,
  is_customize: false,
  is_popular: false,
  is_featured: false,
  food_type: "veg",
  selectedAddons: [],
  print_variants: [],
  customize_print_variants: [],
};

type FormValues = typeof getInitialValues;

// Sub Components
const TypeSelector = ({ types, selectedType, onSelect, disabled = {} }) => (
  <View style={styles.row}>
    <Text style={styles.label}>Type :</Text>
    <View style={styles.optionGroup}>
      {types.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.optionButton,
            selectedType === type && styles.selectedButton,
            disabled[type] && styles.disabledButton,
          ]}
          onPress={() => onSelect(type)}
          disabled={disabled[type]}
        >
          <Text
            style={[
              styles.optionText,
              selectedType === type && styles.selectedText,
            ]}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const ForSelector = ({ options, selectedFor, onSelect, selectedType }) => (
  <View style={styles.row}>
    <Text style={styles.label}>For :</Text>
    <View style={styles.optionGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedFor === option && styles.selectedOrange,
            option === "offline" &&
              selectedType === "print" &&
              styles.disabledButton,
          ]}
          onPress={() => onSelect(option)}
          disabled={option === "offline" && selectedType === "print"}
        >
          <Text
            style={[
              styles.optionText,
              selectedFor === option && styles.selectedText,
            ]}
          >
            {option === "offline" ? "Offline only" : "Both online & Offline"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const SectionHeader = ({
  title,
  showSwitch,
  switchValue,
  onSwitchChange,
  showAddButton,
  onAddPress,
}) => (
  <View style={styles.headerRow}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {showSwitch && (
      <CustomSwitch value={switchValue} onValueChange={onSwitchChange} />
    )}
    {showAddButton && (
      <TouchableOpacity style={styles.addButtonSmall} onPress={onAddPress}>
        <Text style={styles.addButtonTextSmall}>Add +</Text>
      </TouchableOpacity>
    )}
  </View>
);

const FormField = ({ label, error, children, required = false }) => (
  <View style={{ marginBottom: 12 }}>
    {label && (
      <Text style={styles.smallLabel}>
        {label} {required && "*"}
      </Text>
    )}
    {children}
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const ToggleRow = ({ label, value, onValueChange }) => (
  <View style={styles.toggleRow}>
    <Text style={styles.smallLabel}>{label}</Text>
    <CustomSwitch value={value} onValueChange={onValueChange} />
  </View>
);

const ImageUploader = ({ images, onImagePress, selectedFor }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Images</Text>
    <TouchableOpacity
      onPress={() => onImagePress("image1")}
      style={styles.imageBox}
    >
      {images.image1?.uri ? (
        <Image
          source={{ uri: images.image1?.uri }}
          style={styles.imagePreview}
        />
      ) : (
        <Text style={styles.plusIcon}>+</Text>
      )}
    </TouchableOpacity>

    {selectedFor === "both" && (
      <View style={styles.imageRow}>
        {["image2", "image3", "image4"].map((imageKey, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => onImagePress(imageKey)}
            style={styles.imageBox}
          >
            {images[imageKey]?.uri ? (
              <Image
                source={{ uri: images[imageKey]?.uri }}
                style={styles.imagePreview}
              />
            ) : (
              <Text style={styles.plusIcon}>+</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

const PrintVariant = ({ variant, index, onUpdate, onRemove, variantData }) => (
  <View style={styles.variantContainer}>
    <View style={styles.variantHeader}>
      <Text style={styles.variantTitle}>Variant {index + 1}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.priceRow}>
      <View style={styles.inputHalf}>
        <FormField label="Paper">
          <CustomDropdown
            options={variantData?.paper_choices?.map((p) => ({
              ...p,
              name: p.label,
              id: p.value,
            }))}
            placeholder="Select Paper"
            onSelect={(val) => onUpdate("paper", val.id)}
            selectedValue={variant.paper || ""}
            dropDownBoxStyle={styles.dropdownStyle}
          />
        </FormField>
      </View>
      <View style={styles.inputHalf}>
        <FormField label="Color Type">
          <CustomDropdown
            options={variantData?.color_type_choices?.map((p) => ({
              ...p,
              name: p.label,
              id: p.value,
            }))}
            placeholder="Select Color Type"
            onSelect={(val) => onUpdate("color_type", val.id)}
            selectedValue={variant.color_type || ""}
            dropDownBoxStyle={styles.dropdownStyle}
          />
        </FormField>
      </View>
    </View>

    <View style={styles.priceRow}>
      <View style={styles.inputHalf}>
        <FormField label="Sides">
          <CustomDropdown
            options={variantData?.sided_choices?.map((p) => ({
              ...p,
              name: p.label,
              id: p.value,
            }))}
            placeholder="Select Sides"
            onSelect={(val) => onUpdate("sided", val.id)}
            selectedValue={variant.sided || ""}
            dropDownBoxStyle={styles.dropdownStyle}
          />
        </FormField>
      </View>
      <View style={styles.inputHalf}>
        <FormField label="Price per page">
          <InputBox
            placeholder="Enter price"
            background="#FFF8EB"
            value={variant.price}
            keyboardType="number-pad"
            onChangeText={(text) => onUpdate("price", text)}
          />
        </FormField>
      </View>
    </View>

    <View style={styles.priceRow}>
      <View style={styles.inputHalf}>
        <FormField label="Minimum Quantity">
          <InputBox
            placeholder="Min qty"
            background="#FFF8EB"
            value={variant.min_quantity}
            keyboardType="number-pad"
            onChangeText={(text) => onUpdate("min_quantity", text)}
          />
        </FormField>
      </View>
      <View style={styles.inputHalf}>
        <FormField label="Maximum Quantity">
          <InputBox
            placeholder="Max qty"
            background="#FFF8EB"
            value={variant.max_quantity}
            keyboardType="number-pad"
            onChangeText={(text) => onUpdate("max_quantity", text)}
          />
        </FormField>
      </View>
    </View>
  </View>
);

// Main Component
const AddProductScreen = () => {
  const formikRef = useRef<FormikProps<FormValues> | null>(null);

  // State Management
  const [selectedType, setSelectedType] = useState("product");
  const [selectedFor, setSelectedFor] = useState("offline");
  const [isLoading, setIsLoading] = useState(false);
  const [callenderModel, setCallenderModel] = useState(false);
  const [activeImageModal, setActiveImageModal] = useState(null);
  const [imeiModalVisible, setImeiModalVisible] = useState(false);
  const [imeiList, setImeiList] = useState<string[]>([]);

  // Data States
  const [categoryList, setCategoryList] = useState<DropDownOption[]>();
  const [subCategoryList, setSubCategoryList] = useState<DropDownOption[]>();
  const [addonData, setAddonData] = useState([]);
  const [variantData, setVariantData] = useState([]);

  // Switch States
  const [isWholesaleEnabled, setIsWholesaleEnabled] = useState(true);
  const [batchSwitch, setBatchSwitch] = useState(false);
  const [expirySwitch, setExpirySwitch] = useState(false);
  const [foodSwitch, setFoodSwitch] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [categoryRes, subCategoryRes, addonRes, variantRes] =
        await Promise.all([
          api.get("masters/get-product-category/"),
          api.get("masters/get-product-subcategory/"),
          api.get("vendor/addon/"),
          api.get("vendor/print-variant/choices/"),
        ]);

      setCategoryList(categoryRes.data);
      setSubCategoryList(subCategoryRes.data);
      setAddonData(addonRes.data);
      setVariantData(variantRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (values) => {
    try {
      setIsLoading(true);
      const payload = {
        product_type: selectedType,
        sale_type: selectedFor,
        food_type: selectedType === "food" ? values.food_type : null,
        name: values.name,
        category: values.category,
        sub_category: values.sub_category,
        wholesale_price: values.wholesale_price || null,
        purchase_price: values.purchase_price || null,
        sales_price: values.sales_price,
        mrp: values.mrp || null,
        unit: values.unit,
        hsn: values.hsn || null,
        gst: values.gst || null,
        opening_stock: values.opening_stock || null,
        low_stock_alert: values.low_stock_alert,
        low_stock_quantity: values.low_stock_quantity || null,
        stock: values.opening_stock || null,
        brand_name: values.brand_name || null,
        color: values.color || null,
        size: values.size || null,
        batch_number: values.batch_number || null,
        expiry_date: values.expiry_date || null,
        description: values.description,
        is_customize: values.is_customize,
        instant_delivery: values.instant_delivery,
        self_pickup: values.self_pickup,
        general_delivery: values.general_delivery,
        is_on_shop: values.is_on_shop,
        return_policy: values.return_policy,
        cod: values.cod,
        replacement: values.replacement,
        shop_exchange: values.shop_exchange,
        shop_warranty: values.shop_warranty,
        brand_warranty: values.brand_warranty,
        is_food: selectedType === "food",
        tax_inclusive: values.tax_inclusive,
        is_popular: values.is_popular || false,
        is_featured: values.is_featured || false,
        is_active: true,
        image1: values.image1,
        image2: values.image2,
        image3: values.image3,
        image4: values.image4,
        addons:
          values.selectedAddons?.map((addon) => ({ addon: addon.id })) || [],
        print_variants:
          selectedType === "print" ? values.print_variants || [] : [],
        customize_print_variants:
          selectedType === "print" && values.is_customize
            ? values.customize_print_variants || []
            : [],
      };

      const res = await api.post("vendor/product/", payload);
      if (res.status === 201) {
        Alert.alert("Success", "Product added successfully");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper Functions
  const addPrintVariant = (setFieldValue, values) => {
    const newVariant = {
      paper: "",
      color_type: "",
      sided: "",
      min_quantity: "",
      max_quantity: "",
      price: "",
    };
    setFieldValue("print_variants", [
      ...(values.print_variants || []),
      newVariant,
    ]);
  };

  const addCustomizeVariant = (setFieldValue, values) => {
    const newVariant = { size: "", price: "" };
    setFieldValue("customize_print_variants", [
      ...(values.customize_print_variants || []),
      newVariant,
    ]);
  };

  const removePrintVariant = (setFieldValue, values, index) => {
    const updatedVariants = values.print_variants.filter((_, i) => i !== index);
    setFieldValue("print_variants", updatedVariants);
  };

  const removeCustomizeVariant = (setFieldValue, values, index) => {
    const updatedVariants = values.customize_print_variants.filter(
      (_, i) => i !== index
    );
    setFieldValue("customize_print_variants", updatedVariants);
  };

  const addSelectedAddons = (setFieldValue, values) => {
    const newVariant = { id: "", name: "" };
    setFieldValue("selectedAddons", [
      ...(values.selectedAddons || []),
      newVariant,
    ]);
  };

  const removeSelectedAddons = (setFieldValue, values, index) => {
    const updatedVariants = values.selectedAddons.filter((_, i) => i !== index);
    setFieldValue("selectedAddons", updatedVariants);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    if (type === "print") setSelectedFor("both");
  };

  useEffect(() => {
    formikRef.current?.resetForm();
  }, [selectedType]);

  useEffect(() => {
    formikRef.current?.setFieldValue(
      "opening_stock",
      imeiList.length.toString()
    );
  }, [imeiList]);

  return (
    <MainContainer>
      <SafeAreaView style={styles.safeArea}>
        <Headerwithback title="Enter Details" />
        <Loading visible={isLoading} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 30}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={{ paddingHorizontal: 10 }}
              keyboardShouldPersistTaps="always"
            >
              <View style={{ padding: 16 }}>
                <TypeSelector
                  types={PRODUCT_TYPES}
                  selectedType={selectedType}
                  onSelect={handleTypeSelect}
                />
                <ForSelector
                  options={FOR_OPTIONS}
                  selectedFor={selectedFor}
                  selectedType={selectedType}
                  onSelect={setSelectedFor}
                />
              </View>

              <Formik<FormValues>
                innerRef={formikRef}
                enableReinitialize
                initialValues={getInitialValues}
                validationSchema={getValidationSchema(
                  selectedType,
                  selectedFor
                )}
                onSubmit={handleSaveProduct}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <>
                    {/* Modals */}
                    <CalendarModal
                      visible={callenderModel}
                      onClose={() => setCallenderModel(false)}
                      onSelect={(e) => setFieldValue("expiry_date", e)}
                    />
                    <ModalUpdatePhoto
                      isVisible={activeImageModal !== null}
                      onClose={() => setActiveImageModal(null)}
                      onSelectedFile={(e) => {
                        if (activeImageModal) {
                          setFieldValue(
                            activeImageModal as keyof FormValues,
                            e
                          );
                        }
                        setActiveImageModal(null);
                      }}
                    />
                    <ImeiModal
                      visible={imeiModalVisible}
                      onClose={() => setImeiModalVisible(false)}
                      imeiList={imeiList}
                      setImeiList={setImeiList}
                    />

                    {/* Product Name Section */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Product Name</Text>
                      <FormField error={touched.name && errors.name}>
                        <InputBox
                          background="#FFF8EB"
                          placeholder="Enter Product Name"
                          onChangeText={handleChange("name")}
                          value={values.name}
                          autoCapitalize="sentences"
                        />
                      </FormField>
                    </View>

                    {/* Pricing Details Section */}
                    <View style={styles.section}>
                      <View
                        style={[
                          styles.row,
                          { justifyContent: "space-between" },
                        ]}
                      >
                        <Text style={[styles.sectionTitle]}>
                          Pricing Details
                        </Text>

                        <ToggleRow
                          label="Includes Tax"
                          value={values.tax_inclusive}
                          onValueChange={(val) =>
                            setFieldValue("tax_inclusive", val)
                          }
                        />
                      </View>

                      <ToggleRow
                        label="Wholesale Price (Optional)"
                        value={isWholesaleEnabled}
                        onValueChange={setIsWholesaleEnabled}
                      />

                      {isWholesaleEnabled && (
                        <FormField>
                          <InputBox
                            placeholder="Enter here"
                            background="#FFF8EB"
                            value={values.wholesale_price}
                            keyboardType="number-pad"
                            onChangeText={handleChange("wholesale_price")}
                          />
                        </FormField>
                      )}

                      <View style={styles.priceRow}>
                        <View style={styles.inputHalf}>
                          <FormField label="Purchase Price (Optional)">
                            <InputBox
                              placeholder="Enter here"
                              background="#FFF8EB"
                              value={values.purchase_price}
                              keyboardType="number-pad"
                              onChangeText={handleChange("purchase_price")}
                            />
                          </FormField>
                        </View>
                        <View style={styles.inputHalf}>
                          <FormField
                            label={
                              selectedType === "print"
                                ? "Base Price"
                                : "Sales Price"
                            }
                            error={touched.sales_price && errors.sales_price}
                          >
                            <InputBox
                              placeholder="Enter here"
                              background="#FFF8EB"
                              value={values.sales_price}
                              keyboardType="number-pad"
                              onChangeText={handleChange("sales_price")}
                            />
                          </FormField>
                        </View>
                      </View>

                      <View style={styles.priceRow}>
                        <View style={styles.inputHalf}>
                          <FormField label="MRP">
                            <InputBox
                              placeholder="Enter here"
                              background="#FFF8EB"
                              value={values.mrp}
                              keyboardType="number-pad"
                              onChangeText={handleChange("mrp")}
                            />
                          </FormField>
                        </View>
                        <View style={styles.inputHalf}>
                          <FormField
                            label="Unit"
                            error={touched.unit && errors.unit}
                          >
                            <CustomDropdown
                              options={variantData?.unit_choices?.map((p) => ({
                                ...p,
                                name: p.label,
                                id: p.value,
                              }))}
                              placeholder="Select Unit"
                              onSelect={(val) => setFieldValue("unit", val.id)}
                              selectedValue={values.unit || ""}
                              dropDownBoxStyle={styles.dropdownStyle}
                            />
                          </FormField>
                        </View>
                      </View>

                      <View style={styles.priceRow}>
                        <View style={styles.inputHalf}>
                          <FormField label="HSN">
                            <InputBox
                              placeholder="Enter here"
                              background="#FFF8EB"
                              value={values.hsn}
                              onChangeText={handleChange("hsn")}
                            />
                          </FormField>
                        </View>
                        <View style={styles.inputHalf}>
                          <FormField label="GST">
                            <InputBox
                              placeholder="ex: 5%"
                              background="#FFF8EB"
                              value={values.gst}
                              onChangeText={handleChange("gst")}
                            />
                          </FormField>
                        </View>
                      </View>

                      <Text style={styles.warningText}>
                        * To enable GST details please select as registered
                        business in company settings
                      </Text>
                    </View>

                    {/* Stock Section (Only for Product) */}
                    {selectedType === "product" && (
                      <View style={styles.section}>
                        <SectionHeader
                          title="Stock"
                          showSwitch
                          switchValue={values.is_stock_enabled}
                          onSwitchChange={(val) =>
                            setFieldValue("is_stock_enabled", val)
                          }
                        />
                        {values.is_stock_enabled && (
                          <>
                            <Text style={styles.warningText}>
                              * Disable stock to create a simple product for
                              billing only
                            </Text>
                            <View style={styles.imeiRow}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text style={styles.stockLabel}>
                                  IMEI / Serial No
                                </Text>
                                <Text style={styles.optionalText}>
                                  (Optional)
                                </Text>
                              </View>
                              <TouchableOpacity
                                style={styles.addButtonSmall}
                                onPress={() => {
                                  setImeiModalVisible(true);
                                }}
                              >
                                <Text style={styles.addButtonTextSmall}>
                                  Add +
                                </Text>
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
                            <FormField
                              label="Opening Stock"
                              error={
                                touched.opening_stock && errors.opening_stock
                              }
                            >
                              <InputBox
                                placeholder="Enter here"
                                background="#FFF8EB"
                                value={values.opening_stock}
                                keyboardType="number-pad"
                                onChangeText={handleChange("opening_stock")}
                                editable={!imeiList.length}
                              />
                            </FormField>

                            <ToggleRow
                              label="Low stock alert"
                              value={values.low_stock_alert}
                              onValueChange={(val) =>
                                setFieldValue("low_stock_alert", val)
                              }
                            />

                            {values.low_stock_alert && (
                              <FormField
                                label="Low Stock Quantity"
                                error={
                                  touched.low_stock_quantity &&
                                  errors.low_stock_quantity
                                }
                              >
                                <InputBox
                                  placeholder="Enter here"
                                  background="#FFF8EB"
                                  value={values.low_stock_quantity}
                                  keyboardType="number-pad"
                                  onChangeText={handleChange(
                                    "low_stock_quantity"
                                  )}
                                />
                              </FormField>
                            )}
                          </>
                        )}
                      </View>
                    )}

                    {/* Category Section */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        Category & Sub Category
                      </Text>
                      <FormField
                        label="Category"
                        error={touched.category && errors.category}
                      >
                        <CustomDropdown
                          placeholder="Select Category"
                          onSelect={(opt) => setFieldValue("category", opt.id)}
                          selectedValue={
                            categoryList?.find(
                              (cat) => cat.id === values.category
                            )?.name || ""
                          }
                          options={categoryList}
                        />
                      </FormField>

                      <FormField
                        label="Sub Category"
                        error={touched.sub_category && errors.sub_category}
                      >
                        <CustomDropdown
                          onSelect={(opt) =>
                            setFieldValue("sub_category", opt.id)
                          }
                          selectedValue={
                            subCategoryList?.find(
                              (cat) => cat.id === values.sub_category
                            )?.name || ""
                          }
                          placeholder="Select Sub Category"
                          options={subCategoryList}
                        />
                      </FormField>
                    </View>

                    {/* Food Option for Service */}
                    {selectedType === "service" && (
                      <View style={styles.section}>
                        <ToggleRow
                          label="Include Food Option?"
                          value={foodSwitch}
                          onValueChange={setFoodSwitch}
                        />
                        {foodSwitch && (
                          <FormField label="Food Type">
                            <CustomDropdown
                              placeholder="Select Food Type"
                              onSelect={(opt) =>
                                setFieldValue("food_type", opt.id)
                              }
                              selectedValue={
                                [
                                  { id: "veg", name: "Veg" },
                                  { id: "non_veg", name: "Non Veg" },
                                ]?.find((cat) => cat.id === values.food_type)
                                  ?.name || ""
                              }
                              options={[
                                { id: "veg", name: "Veg" },
                                { id: "non_veg", name: "Non Veg" },
                              ]}
                            />
                          </FormField>
                        )}
                      </View>
                    )}

                    {/* Optional Details Section */}
                    {(selectedType === "product" ||
                      selectedType === "service") && (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                          Optional Details
                        </Text>

                        {selectedType !== "service" && (
                          <FormField label="Brand Name">
                            <InputBox
                              placeholder="Enter here"
                              background="#FFF8EB"
                              value={values.brand_name}
                              onChangeText={handleChange("brand_name")}
                            />
                          </FormField>
                        )}

                        <FormField label="Pick Color">
                          <CustomDropdown
                            options={COLOR_OPTIONS}
                            placeholder="Select Color"
                            onSelect={(val) => setFieldValue("color", val.id)}
                            selectedValue={values.color || ""}
                          />
                        </FormField>

                        <FormField label="Select Size">
                          <InputBox
                            placeholder="Enter here"
                            background="#FFF8EB"
                            value={values.size}
                            onChangeText={handleChange("size")}
                          />
                        </FormField>

                        {selectedType !== "service" && (
                          <>
                            <ToggleRow
                              label="Batch Number"
                              value={batchSwitch}
                              onValueChange={setBatchSwitch}
                            />
                            {batchSwitch && (
                              <FormField
                                error={
                                  touched.batch_number && errors.batch_number
                                }
                              >
                                <InputBox
                                  placeholder="Enter here"
                                  background="#FFF8EB"
                                  value={values.batch_number}
                                  onChangeText={handleChange("batch_number")}
                                />
                              </FormField>
                            )}

                            <ToggleRow
                              label="Expiry Date"
                              value={expirySwitch}
                              onValueChange={setExpirySwitch}
                            />
                          </>
                        )}

                        {expirySwitch && (
                          <FormField
                            error={touched.expiry_date && errors.expiry_date}
                          >
                            <TouchableOpacity
                              style={styles.inputBox}
                              onPress={() => setCallenderModel(true)}
                            >
                              <TextInput
                                placeholder="Enter here"
                                value={values.expiry_date}
                                editable={false}
                              />
                            </TouchableOpacity>
                          </FormField>
                        )}

                        <FormField
                          label="Description"
                          error={touched.description && errors.description}
                        >
                          <InputBox
                            placeholder="Enter here"
                            background="#FFF8EB"
                            value={values.description}
                            onChangeText={handleChange("description")}
                          />
                        </FormField>
                      </View>
                    )}

                    {/* Print Variants Section */}
                    {selectedType === "print" && (
                      <View style={styles.section}>
                        <ToggleRow
                          label="Enable Customization"
                          value={values.is_customize}
                          onValueChange={(val) => {
                            setFieldValue("is_customize", val);
                            setFieldValue("print_variants", [
                              {
                                paper: "",
                                color_type: "",
                                sided: "",
                                min_quantity: "",
                                max_quantity: "",
                                price: "",
                              },
                            ]);
                            setFieldValue("customize_print_variants", [
                              { size: "", price: "" },
                            ]);
                          }}
                        />
                        {!values.is_customize ? (
                          <>
                            <SectionHeader
                              title="Print Variants"
                              showAddButton
                              onAddPress={() =>
                                addPrintVariant(setFieldValue, values)
                              }
                            />
                            {values.print_variants?.map((variant, index) => (
                              <PrintVariant
                                key={index}
                                variant={variant}
                                index={index}
                                variantData={variantData}
                                onUpdate={(field, value) =>
                                  setFieldValue(
                                    `print_variants.${index}.${field}`,
                                    value
                                  )
                                }
                                onRemove={() =>
                                  removePrintVariant(
                                    setFieldValue,
                                    values,
                                    index
                                  )
                                }
                              />
                            ))}

                            {touched.print_variants &&
                              errors.print_variants && (
                                <Text style={styles.errorText}>
                                  {errors.print_variants}
                                </Text>
                              )}
                          </>
                        ) : (
                          <>
                            <SectionHeader
                              title="Custom Size Variants"
                              showAddButton
                              onAddPress={() =>
                                addCustomizeVariant(setFieldValue, values)
                              }
                            />

                            {values.customize_print_variants?.map(
                              (variant, index) => (
                                <View
                                  key={index}
                                  style={styles.variantContainer}
                                >
                                  <View style={styles.variantHeader}>
                                    <Text style={styles.variantTitle}>
                                      Custom Size {index + 1}
                                    </Text>
                                    <TouchableOpacity
                                      onPress={() =>
                                        removeCustomizeVariant(
                                          setFieldValue,
                                          values,
                                          index
                                        )
                                      }
                                      style={styles.removeButton}
                                    >
                                      <Text style={styles.removeButtonText}>
                                        Remove
                                      </Text>
                                    </TouchableOpacity>
                                  </View>

                                  <View style={styles.priceRow}>
                                    <View style={styles.inputHalf}>
                                      <FormField label="Size">
                                        <InputBox
                                          placeholder="e.g., 6x4 inches"
                                          background="#FFF8EB"
                                          value={variant.size}
                                          onChangeText={(text) =>
                                            setFieldValue(
                                              `customize_print_variants.${index}.size`,
                                              text
                                            )
                                          }
                                        />
                                      </FormField>
                                    </View>
                                    <View style={styles.inputHalf}>
                                      <FormField label="Price">
                                        <InputBox
                                          placeholder="Enter price"
                                          background="#FFF8EB"
                                          value={variant.price}
                                          keyboardType="number-pad"
                                          onChangeText={(text) =>
                                            setFieldValue(
                                              `customize_print_variants.${index}.price`,
                                              text
                                            )
                                          }
                                        />
                                      </FormField>
                                    </View>
                                  </View>
                                </View>
                              )
                            )}

                            {touched.customize_print_variants &&
                              errors.customize_print_variants && (
                                <Text style={styles.errorText}>
                                  {errors.customize_print_variants}
                                </Text>
                              )}
                          </>
                        )}

                        {/* Custom Size Variants */}

                        <FormField
                          label="Description"
                          error={touched.description && errors.description}
                        >
                          <InputBox
                            placeholder="Enter here"
                            background="#FFF8EB"
                            value={values.description}
                            onChangeText={handleChange("description")}
                          />
                        </FormField>
                      </View>
                    )}

                    {/* Add-ons Section */}
                    {addonData?.length > 0 &&
                      (selectedType === "print" ||
                        selectedType === "service") && (
                        <View style={styles.section}>
                          <SectionHeader
                            title="Add-ons (Optional)"
                            showAddButton
                            onAddPress={() =>
                              addSelectedAddons(setFieldValue, values)
                            }
                          />
                          {values.selectedAddons?.map((addon, index) => (
                            <View
                              style={styles.row}
                              key={`${addon.id}-${index}`}
                            >
                              <View style={{ flex: 1, marginRight: 10 }}>
                                <CustomDropdown
                                  placeholder="Select Add-on"
                                  onSelect={(opt) =>
                                    setFieldValue(
                                      `selectedAddons.${index}.id`,
                                      opt.id
                                    )
                                  }
                                  selectedValue={
                                    addonData?.find(
                                      (cat) => cat.id === addon.id
                                    )?.name || ""
                                  }
                                  options={addonData}
                                />
                              </View>
                              <TouchableOpacity
                                onPress={() =>
                                  removeSelectedAddons(
                                    setFieldValue,
                                    values,
                                    index
                                  )
                                }
                                style={styles.removeButton}
                              >
                                <Text style={styles.removeButtonText}>
                                  Remove
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}

                    {/* Images Section */}
                    <ImageUploader
                      images={values}
                      onImagePress={setActiveImageModal}
                      selectedFor={selectedFor}
                    />
                    {touched.image1 && errors.image1 && (
                      <Text style={styles.errorText}>{errors.image1}</Text>
                    )}

                    {/* Delivery Details Section */}
                    {selectedFor === "both" && (
                      <>
                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>
                            Delivery Details
                          </Text>
                          {[
                            {
                              key: "instant_delivery",
                              label: "Instant Delivery",
                            },
                            { key: "self_pickup", label: "Self Pickup" },
                            {
                              key: "general_delivery",
                              label: "General Delivery",
                            },
                            { key: "is_on_shop", label: "On Shop Orders" },
                          ].map(({ key, label }) => (
                            <ToggleRow
                              key={key}
                              label={label}
                              value={values[key]}
                              onValueChange={(val) => setFieldValue(key, val)}
                            />
                          ))}
                        </View>

                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>Policies</Text>
                          {[
                            { key: "return_policy", label: "Return Policy" },
                            { key: "cod", label: "COD" },
                            { key: "replacement", label: "Replacement" },
                            { key: "shop_exchange", label: "Shop Exchange" },
                            { key: "shop_warranty", label: "Shop Warranty" },
                            { key: "brand_warranty", label: "Brand Warranty" },
                          ].map(({ key, label }) => (
                            <ToggleRow
                              key={key}
                              label={label}
                              value={values[key]}
                              onValueChange={(val) => setFieldValue(key, val)}
                            />
                          ))}
                        </View>

                        {/* <View style={styles.section}>
                          <Text style={styles.sectionTitle}>
                            Additional Settings
                          </Text>
                          {[
                            { key: "is_popular", label: "Popular Product" },
                            { key: "is_featured", label: "Featured Product" },
                          ].map(({ key, label }) => (
                            <ToggleRow
                              key={key}
                              label={label}
                              value={values[key]}
                              onValueChange={(val) => setFieldValue(key, val)}
                            />
                          ))}
                        </View> */}
                      </>
                    )}

                    {/* Submit Button */}
                    <View style={styles.footer}>
                      <TouchableOpacity
                        onPress={handleSubmit as any}
                        style={styles.addButton}
                      >
                        <Text style={styles.addButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
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
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    marginRight: 10,
    width: 50,
    color: "#000",
  },
  optionGroup: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginRight: 10,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: "#FCA311",
    borderColor: "#FCA311",
  },
  selectedOrange: {
    backgroundColor: "#FCA311",
    borderColor: "#FCA311",
  },
  disabledButton: {
    backgroundColor: "#E7E7E7",
  },
  optionText: {
    color: "#333",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600",
  },

  imeiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  stockLabel: {
    fontWeight: "600",
    fontSize: 14,
  },
  optionalText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 4,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  stockWarning: {
    fontSize: 12,
    color: "red",
    marginBottom: 12,
  },
  section: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 10,
    padding: 10,
  },
  sectionTitle: {
    color: "#FCA311",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  smallLabel: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
    marginRight: 5,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inputHalf: {
    flex: 0.48,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#FFF8EB",
    marginBottom: 12,
  },
  imageBox: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffbe6",
    marginBottom: 12,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  plusIcon: {
    fontSize: 20,
    color: "#000",
  },
  addButtonSmall: {
    backgroundColor: "#FCA311",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addButtonTextSmall: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  addButton: {
    width: "50%",
    alignSelf: "center",
    backgroundColor: "#FCA311",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  variantContainer: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#FAFAFA",
  },
  variantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  removeButton: {
    backgroundColor: "#FF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  dropdownStyle: {
    padding: 8,
    backgroundColor: "#FFF8EB",
    borderColor: "#FCA511",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  warningText: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
  },
});

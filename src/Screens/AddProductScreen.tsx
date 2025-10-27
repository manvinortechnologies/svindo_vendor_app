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
import { HomeNavigation } from "../constants/app-routes.constants";
import { s, ScaledSheet } from "react-native-size-matters";
import { API_ROUTES } from "../constants/api-routes.constants";
import Icon from "react-native-vector-icons/Ionicons";

// Constants
const PRODUCT_TYPES = ["product", "service", "print"];
const FOR_OPTIONS = ["offline", "both"];
const FOOD_TYPES = ["veg", "non_veg"];
const COLOR_OPTIONS = [
  { name: "Red", id: "Red", color: "#FF0000" },
  { name: "Green", id: "Green", color: "#00FF00" },
  { name: "Blue", id: "Blue", color: "#0000FF" },
  { name: "Yellow", id: "Yellow", color: "#FFFF00" },
  { name: "Orange", id: "Orange", color: "#FFA500" },
  { name: "Purple", id: "Purple", color: "#800080" },
  { name: "Pink", id: "Pink", color: "#FFC0CB" },
  { name: "Black", id: "Black", color: "#000000" },
  { name: "White", id: "White", color: "#FFFFFF" },
  { name: "Gray", id: "Gray", color: "#808080" },
  { name: "Brown", id: "Brown", color: "#A52A2A" },
  { name: "Sky Blue", id: "Sky Blue", color: "#87CEEB" },
  { name: "Teal", id: "Teal", color: "#008080" },
  { name: "Gold", id: "Gold", color: "#FFD700" },
  { name: "Silver", id: "Silver", color: "#C0C0C0" },
  { name: "Multicolor", id: "Multicolor", color: "#FF69B4" },
];

// Validation Schema
const getValidationSchema = (selectedType: string) =>
  Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    sales_price: Yup.string().required("Sales price is required"),
    mrp: Yup.string().required("MRP is required"),
    unit: Yup.string().required("Unit is required"),
    category: Yup.string().required("Please select a category"),
    sub_category: Yup.string().required("Please select a sub category"),
    opening_stock:
      selectedType === "product"
        ? Yup.number().when("is_stock_enabled", {
            is: true,
            then: (schema) =>
              schema
                .required("Opening stock is required")
                .min(1, "Opening stock must be greater than 0"),
            otherwise: (schema) => schema.notRequired(),
          })
        : Yup.number().notRequired(),
    low_stock_quantity: Yup.number().when("low_stock_alert", {
      is: true,
      then: (schema) =>
        schema
          .required("Low stock quantity is required")
          .min(1, "Low stock quantity must be greater than 0"),
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
    description: Yup.string().notRequired(),
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
  category: "",
  sub_category: "",
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
const TypeSelector = ({
  types,
  selectedType,
  onSelect,
  disabled = {} as any,
}) => (
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

const ForSelector = ({
  options,
  selectedFor,
  onSelect,
  selectedType,
  disabled = {} as any,
}) => (
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
            disabled[option] && styles.disabledButton,
          ]}
          onPress={() => onSelect(option)}
          disabled={
            (option === "offline" && selectedType === "print") ||
            disabled[option]
          }
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

const ImageUploader = ({ images, onImagePress, selectedFor, error = null }) => (
  <View style={styles.section}>
    <View style={styles.headerRow}>
      <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Images</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
    <TouchableOpacity
      onPress={() => onImagePress("image1")}
      style={[styles.imageBox, error && { borderColor: "red" }]}
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

    <Text style={styles.sectionTitle}> (Optional)</Text>
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
            selectedValue={variant.paper}
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
            selectedValue={variant.color_type}
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
            selectedValue={variant.sided}
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
const AddProductScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
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
  const [sizeList, setSizeList] = useState([]);
  // Selection States
  const [selectedCategory, setSelectedCategory] =
    useState<DropDownOption | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<DropDownOption | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<DropDownOption[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<DropDownOption[]>(
    []
  );

  // Switch States
  const [isWholesaleEnabled, setIsWholesaleEnabled] = useState(true);
  const [batchSwitch, setBatchSwitch] = useState(false);
  const [expirySwitch, setExpirySwitch] = useState(false);
  const [foodSwitch, setFoodSwitch] = useState(false);
  const [useDefaultSettings, setUseDefaultSettings] = useState(false);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingProduct, setExistingProduct] = useState<any>(null);

  const [settings, setSettings] = useState<{ [key: string]: boolean }>({});
  useEffect(() => {
    fetchAllData();
    loadProductSettings();
  }, []);

  // Handle edit mode
  useEffect(() => {
    if (route.params?.productId) {
      setIsEditMode(route.params?.isEdit);
      fetchExistingProduct(route.params.productId);
    }
  }, [route.params?.isEdit, route.params?.productId]);

  // Fetch existing product data for edit mode
  const fetchExistingProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `${API_ROUTES.vendorProduct}/${productId}/`
      );
      const product = response.data;
      setExistingProduct(product);
      // Populate form with existing data
      if (formikRef.current) {
        if (!route.params?.isEdit) {
          formikRef.current.setValues({
            category: product.category || "",
            sub_category: product.sub_category || "",
          });
        } else {
          formikRef.current.setValues({
            name: product.name || "",
            description: product.description || "",
            sales_price: product.sales_price?.toString() || "",
            purchase_price: product.purchase_price?.toString() || "",
            wholesale_price: product.wholesale_price?.toString() || "",
            mrp: product.mrp?.toString() || "",
            opening_stock: product.opening_stock?.toString() || "",
            low_stock_quantity: product.low_stock_quantity?.toString() || "",
            is_stock_enabled:
              product.is_stock_enabled !== undefined
                ? product.is_stock_enabled
                : true,
            low_stock_alert: product.low_stock_alert || false,
            hsn: product.hsn || "",
            gst: product.gst?.toString() || "",
            tax_inclusive:
              product.tax_inclusive !== undefined
                ? product.tax_inclusive
                : true,
            unit: product.unit || "",
            brand_name: product.brand_name || "",
            batch_number: product.batch_number || "",
            size: product.size || "",
            expiry_date: product.expiry_date || "",
            color: product.color || "",
            image1: product.image ? { uri: product.image } : null,
            image2: product.image2 ? { uri: product.image2 } : null,
            image3: product.image3 ? { uri: product.image3 } : null,
            image4: product.image4 ? { uri: product.image4 } : null,
            instant_delivery: product.instant_delivery || false,
            self_pickup: product.self_pickup || false,
            general_delivery: product.general_delivery || false,
            is_on_shop: product.is_on_shop || false,
            return_policy: product.return_policy || false,
            cod: product.cod || false,
            replacement: product.replacement || false,
            shop_exchange: product.shop_exchange || false,
            shop_warranty: product.shop_warranty || false,
            brand_warranty: product.brand_warranty || false,
            is_customize: product.is_customize || false,
            is_popular: product.is_popular || false,
            is_featured: product.is_featured || false,
            food_type: product.food_type || "veg",
            selectedAddons: product.addons || [],
            print_variants: product.print_variants || [],
            customize_print_variants: product.customize_print_variants || [],
            category: product.category || "",
            sub_category: product.sub_category || "",
          });
        }
        // Set other states
        setSelectedType(product.product_type || "product");
        setSelectedFor(product.sale_type || "offline");
        route.params?.isEdit &&
          setIsWholesaleEnabled(!!product.wholesale_price || false);
        route.params?.isEdit && setBatchSwitch(!!product.batch_number || false);
        route.params?.isEdit && setExpirySwitch(!!product.expiry_date || false);
        route.params?.isEdit &&
          setFoodSwitch(product.food_type === "veg" || false);

        // Set addons
        if (
          product.addons &&
          Array.isArray(product.addons) &&
          addonData.length > 0
        ) {
          const addons = addonData.filter((addon) =>
            product.addons.includes(addon.id)
          );
          setSelectedAddons(addons);
        }

        // Set variants
        if (
          product.print_variants &&
          Array.isArray(product.print_variants) &&
          variantData.length > 0
        ) {
          const variants = variantData.filter((variant) =>
            product.print_variants.includes(variant.id)
          );
          setSelectedVariants(variants);
        }

        // Handle print variants data structure
        if (product.product_type === "print") {
          // Ensure print variants are properly set
          if (product.print_variants && Array.isArray(product.print_variants)) {
            formikRef.current?.setFieldValue(
              "print_variants",
              product.print_variants
            );
          }

          // Handle customize print variants
          if (
            product.customize_print_variants &&
            Array.isArray(product.customize_print_variants)
          ) {
            formikRef.current?.setFieldValue(
              "customize_print_variants",
              product.customize_print_variants
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching existing product:", error);
      Alert.alert("Error", "Failed to load product data for editing");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [categoryRes, subCategoryRes, addonRes, variantRes, sizeRes] =
        await Promise.all([
          api.get(API_ROUTES.productCategory),
          api.get(API_ROUTES.productSubCategory),
          api.get(API_ROUTES.addons),
          api.get(API_ROUTES.printVariantChoices),
          api.get(API_ROUTES.productSizes),
        ]);

      setCategoryList(categoryRes.data);
      setSubCategoryList(subCategoryRes.data);
      setAddonData(addonRes.data);
      setVariantData(variantRes.data);
      setSizeList(sizeRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (values) => {
    try {
      setIsLoading(true);
      // Create FormData
      const formData = new FormData();

      // Add basic fields
      if (route.params?.productId && !isEditMode) {
        formData.append("parent", route.params.productId);
      }
      formData.append("product_type", selectedType);
      formData.append("sale_type", selectedFor);

      if (selectedType === "food" && values.food_type) {
        formData.append("food_type", values.food_type);
      }

      formData.append("name", values.name);

      if (values.category) {
        formData.append("category", values.category);
      }
      if (values.sub_category) {
        formData.append("sub_category", values.sub_category);
      }

      if (values.wholesale_price) {
        formData.append("wholesale_price", values.wholesale_price?.toString());
      }
      if (values.purchase_price) {
        formData.append("purchase_price", values.purchase_price?.toString());
      }

      formData.append("sales_price", values.sales_price?.toString());

      if (values.mrp) {
        formData.append("mrp", values.mrp?.toString());
      }

      formData.append("unit", values.unit);

      if (values.hsn) {
        formData.append("hsn", values.hsn);
      }
      if (values.gst) {
        formData.append("gst", values.gst?.toString());
      }

      if (values.opening_stock) {
        formData.append("opening_stock", values.opening_stock?.toString());
        formData.append("stock", values.opening_stock?.toString());
      }

      formData.append(
        "low_stock_alert",
        values.low_stock_alert?.toString() || "false"
      );

      if (values.low_stock_quantity) {
        formData.append(
          "low_stock_quantity",
          values.low_stock_quantity?.toString() || "0"
        );
      }

      if (values.brand_name) {
        formData.append("brand_name", values.brand_name);
      }
      if (values.color) {
        formData.append("color", values.color);
      }
      if (values.size) {
        formData.append("size", values.size);
      }
      if (values.batch_number) {
        formData.append("batch_number", values.batch_number);
      }
      if (values.expiry_date) {
        formData.append("expiry_date", values.expiry_date);
      }

      formData.append("description", values.description || "");
      selectedType === "print" &&
        formData.append("is_customize", values.is_customize?.toString());
      formData.append("instant_delivery", values.instant_delivery?.toString());
      formData.append("self_pickup", values.self_pickup?.toString());
      formData.append("general_delivery", values.general_delivery?.toString());
      formData.append("is_on_shop", values.is_on_shop?.toString());
      formData.append("return_policy", values.return_policy?.toString());
      formData.append("cod", values.cod?.toString());
      formData.append("replacement", values.replacement?.toString());
      formData.append("shop_exchange", values.shop_exchange?.toString());
      formData.append("shop_warranty", values.shop_warranty?.toString());
      formData.append("brand_warranty", values.brand_warranty?.toString());
      formData.append("is_food", (selectedType === "food")?.toString());
      formData.append(
        "tax_inclusive",
        values.tax_inclusive?.toString() || "false"
      );
      formData.append("is_popular", (values.is_popular || false)?.toString());
      formData.append("is_featured", (values.is_featured || false)?.toString());
      formData.append("is_active", "true");

      // Add images
      if (values.image1 && values.image1.uri) {
        formData.append("image", {
          uri: values.image1.uri,
          type: "image/jpeg",
          name: "image1.jpg",
        });
      }
      if (values.image2 && values.image2.uri) {
        formData.append("image2", {
          uri: values.image2.uri,
          type: "image/jpeg",
          name: "image2.jpg",
        });
      }
      if (values.image3 && values.image3.uri) {
        formData.append("image3", {
          uri: values.image3.uri,
          type: "image/jpeg",
          name: "image3.jpg",
        });
      }
      if (values.image4 && values.image4.uri) {
        formData.append("image4", {
          uri: values.image4.uri,
          type: "image/jpeg",
          name: "image4.jpg",
        });
      }

      // Add addons
      if (values.selectedAddons && values.selectedAddons.length > 0) {
        values.selectedAddons.forEach((addon, index) => {
          Object.keys(addon).forEach((key) => {
            formData.append(`addons[${index}][${key}]`, addon[key]);
          });
        });
      }

      // Add print variants
      if (
        selectedType === "print" &&
        !values.is_customize &&
        values.print_variants &&
        values.print_variants.length > 0
      ) {
        const printVariants = existingProduct
          ? values.print_variants.map(({ product, ...rest }) => rest)
          : values.print_variants;
        formData.append(`print_variants`, JSON.stringify(printVariants));
      }

      // Add customize print variants
      if (
        selectedType === "print" &&
        values.is_customize &&
        values.customize_print_variants &&
        values.customize_print_variants.length > 0
      ) {
        const customizePrintVariants = existingProduct
          ? values.customize_print_variants.map(({ product, ...rest }) => rest)
          : values.customize_print_variants;
        formData.append(
          `customize_print_variants`,
          JSON.stringify(customizePrintVariants)
        );
      }

      let res;
      if (isEditMode && route.params?.productId) {
        // Update existing product
        res = await api.put(
          `${API_ROUTES.vendorProduct}/${route.params.productId}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new product
        res = await api.post(API_ROUTES.vendorProduct, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigation.replace(HomeNavigation.PRODUCT_ADDED_SUCCESS, {
        // productId: res.data.id,
        productName: values.name,
        productDescription: values.description,
        productImage: values.image1?.uri,
        stock: values.opening_stock,
        payload: res.data,
      });
      // }
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

  const loadProductSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(API_ROUTES.getProductSettings);
      const data = res?.data || {};
      setSettings(data);
    } catch (error) {
      console.error("Failed to load product settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isEditMode) {
      formikRef.current?.resetForm();
      loadProductSettings();
    }
  }, [selectedType, isEditMode]);

  // Update form values when settings change
  useEffect(() => {
    if (formikRef.current && Object.keys(settings).length > 0) {
      // Set default values for delivery details and policies based on settings
      const updates: Partial<FormValues> = {};

      // Set delivery details based on settings
      updates.instant_delivery = settings.instant_delivery || false;
      updates.self_pickup = settings.self_pickup || false;
      updates.general_delivery = settings.general_delivery || false;
      updates.is_on_shop = settings.shop_orders || false;

      // Set policies based on settings
      updates.return_policy = settings.return_policy || false;
      updates.cod = settings.cod || false;
      updates.replacement = settings.replacement || false;
      updates.shop_exchange = settings.shop_exchange || false;
      updates.shop_warranty = settings.shop_warranty || false;
      updates.brand_warranty = settings.brand_warranty || false;

      // Only update if there are changes and we're not in edit mode
      if (!isEditMode && Object.keys(updates).length > 0) {
        formikRef.current.setValues((prev) => ({ ...prev, ...updates }));
      }
    }
  }, [settings, isEditMode]);

  useEffect(() => {
    if (useDefaultSettings) {
      formikRef.current?.setValues((prev) => ({ ...prev, ...settings }));
    }
  }, [useDefaultSettings]);

  useEffect(() => {
    formikRef.current?.setFieldValue(
      "opening_stock",
      imeiList.length.toString()
    );
  }, [imeiList]);

  // Set category and subcategory when lists are loaded in edit mode
  useEffect(() => {
    if (isEditMode && existingProduct && categoryList && subCategoryList) {
      if (existingProduct.category) {
        const category = categoryList.find(
          (cat) => cat.id === existingProduct.category
        );
        if (category) formikRef.current?.setFieldValue("category", category.id);
      }

      if (existingProduct.subcategory) {
        const subCategory = subCategoryList.find(
          (sub) => sub.id === existingProduct.subcategory
        );
        if (subCategory)
          formikRef.current?.setFieldValue("sub_category", subCategory.id);
      }
    }
  }, [isEditMode, existingProduct, categoryList, subCategoryList]);

  // Reinitialize form when existing product data changes
  useEffect(() => {
    if (isEditMode && existingProduct && formikRef.current) {
      // Force form reinitialization
      formikRef.current.resetForm();
      // Set values again to ensure they're properly loaded
      setTimeout(() => {
        if (formikRef.current) {
          formikRef.current.setValues({
            name: existingProduct.name || "",
            description: existingProduct.description || "",
            sales_price: existingProduct.sales_price?.toString() || "",
            purchase_price: existingProduct.purchase_price?.toString() || "",
            wholesale_price: existingProduct.wholesale_price?.toString() || "",
            mrp: existingProduct.mrp?.toString() || "",
            opening_stock: existingProduct.opening_stock?.toString() || "",
            low_stock_quantity:
              existingProduct.low_stock_quantity?.toString() || "",
            is_stock_enabled:
              existingProduct.is_stock_enabled !== undefined
                ? existingProduct.is_stock_enabled
                : true,
            low_stock_alert: existingProduct.low_stock_alert || false,
            hsn: existingProduct.hsn || "",
            gst: existingProduct.gst?.toString() || "",
            tax_inclusive:
              existingProduct.tax_inclusive !== undefined
                ? existingProduct.tax_inclusive
                : true,
            unit: existingProduct.unit || "",
            brand_name: existingProduct.brand_name || "",
            batch_number: existingProduct.batch_number || "",
            size: existingProduct.size || "",
            expiry_date: existingProduct.expiry_date || "",
            color: existingProduct.color || "",
            image1: existingProduct.image
              ? { uri: existingProduct.image }
              : null,
            image2: existingProduct.image2
              ? { uri: existingProduct.image2 }
              : null,
            image3: existingProduct.image3
              ? { uri: existingProduct.image3 }
              : null,
            image4: existingProduct.image4
              ? { uri: existingProduct.image4 }
              : null,
            instant_delivery: existingProduct.instant_delivery || false,
            self_pickup: existingProduct.self_pickup || false,
            general_delivery: existingProduct.general_delivery || false,
            is_on_shop: existingProduct.is_on_shop || false,
            return_policy: existingProduct.return_policy || false,
            cod: existingProduct.cod || false,
            replacement: existingProduct.replacement || false,
            shop_exchange: existingProduct.shop_exchange || false,
            shop_warranty: existingProduct.shop_warranty || false,
            brand_warranty: existingProduct.brand_warranty || false,
            is_customize: existingProduct.is_customize || false,
            is_popular: existingProduct.is_popular || false,
            is_featured: existingProduct.is_featured || false,
            food_type: existingProduct.food_type || "veg",
            selectedAddons: existingProduct.addons || [],
            print_variants: existingProduct.print_variants || [],
            customize_print_variants:
              existingProduct.customize_print_variants || [],
            category: existingProduct.category || "",
            sub_category: existingProduct.sub_category || "",
          });
        }
      }, 100);
    }
  }, [isEditMode, existingProduct]);

  return (
    <MainContainer>
      <SafeAreaView style={styles.safeArea}>
        <Headerwithback
          title={isEditMode ? "Edit Product" : "Enter Details"}
          rightIcons={[
            <TouchableOpacity
              onPress={() => navigation.navigate(HomeNavigation.PRODUCTSETTING)}
            >
              <Icon name="settings" size={s(22)} color="#FCA311" />
            </TouchableOpacity>,
          ]}
        />
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
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              scrollEventThrottle={16}
            >
              <View style={{ padding: 16 }}>
                <TypeSelector
                  types={PRODUCT_TYPES}
                  selectedType={selectedType}
                  onSelect={handleTypeSelect}
                  disabled={
                    route.params?.productId && !isEditMode
                      ? { print: true, service: true }
                      : {}
                  }
                />
                <ForSelector
                  options={FOR_OPTIONS}
                  selectedFor={selectedFor}
                  selectedType={selectedType}
                  onSelect={setSelectedFor}
                  disabled={
                    route.params?.productId && !isEditMode
                      ? { offline: true, both: true }
                      : {}
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    { alignSelf: "flex-end" },
                    useDefaultSettings && styles.selectedButton,
                  ]}
                  onPress={() => setUseDefaultSettings(!useDefaultSettings)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      useDefaultSettings && styles.selectedText,
                    ]}
                  >
                    Use Default Settings
                  </Text>
                </TouchableOpacity>
              </View>

              <Formik<FormValues>
                innerRef={formikRef}
                enableReinitialize
                initialValues={getInitialValues}
                validationSchema={getValidationSchema(selectedType)}
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
                      initialDate={values.expiry_date}
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
                          label={
                            values.tax_inclusive
                              ? "Inclusive of Tax"
                              : "Exclusive of Tax"
                          }
                          value={values.tax_inclusive}
                          onValueChange={(val) =>
                            setFieldValue("tax_inclusive", val)
                          }
                        />
                      </View>

                      {/* 2-Column Grid Layout */}
                      <View style={styles.pricingGrid}>
                        {/* Wholesale Price Toggle - Full Width */}
                        {selectedType !== "print" && (
                          <View style={styles.gridItemFullWidth}>
                            <ToggleRow
                              label="Wholesale Price (Optional)"
                              value={isWholesaleEnabled}
                              onValueChange={setIsWholesaleEnabled}
                            />
                          </View>
                        )}

                        {/* Wholesale Price Input - Full Width */}
                        {selectedType !== "print" && isWholesaleEnabled && (
                          <View style={styles.gridItemFullWidth}>
                            <FormField>
                              <InputBox
                                placeholder="Enter here"
                                background="#FFF8EB"
                                value={values.wholesale_price}
                                keyboardType="number-pad"
                                onChangeText={handleChange("wholesale_price")}
                              />
                            </FormField>
                          </View>
                        )}

                        {/* Purchase Price - Left Column */}
                        {selectedType !== "print" && (
                          <View style={styles.gridItemHalf}>
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
                        )}

                        {/* Sales Price/Base Price - Right Column */}
                        <View style={styles.gridItemHalf}>
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

                        {/* MRP - Left Column */}
                        {selectedType !== "print" && (
                          <View style={styles.gridItemHalf}>
                            <FormField
                              label="MRP"
                              error={touched.mrp && errors.mrp}
                            >
                              <InputBox
                                placeholder="Enter here"
                                background="#FFF8EB"
                                value={values.mrp}
                                keyboardType="number-pad"
                                onChangeText={handleChange("mrp")}
                              />
                            </FormField>
                          </View>
                        )}

                        {/* Unit - Right Column */}
                        <View style={styles.gridItemHalf}>
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
                              selectedValue={values.unit}
                              dropDownBoxStyle={styles.dropdownStyle}
                            />
                          </FormField>
                        </View>

                        {/* HSN - Left Column */}
                        <View style={styles.gridItemHalf}>
                          <FormField label="HSN">
                            <InputBox
                              placeholder="Enter here"
                              background="#FFF8EB"
                              value={values.hsn}
                              onChangeText={handleChange("hsn")}
                            />
                          </FormField>
                        </View>

                        {/* GST % - Right Column */}
                        <View style={styles.gridItemHalf}>
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
                                disabled={
                                  useDefaultSettings && settings.imei_serial_no
                                }
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
                        required={true}
                      >
                        <CustomDropdown
                          placeholder="Select Category"
                          onSelect={(opt) => {
                            setFieldValue("category", opt.id);
                            // Clear subcategory when category changes
                            setFieldValue("sub_category", "");
                          }}
                          selectedValue={values.category}
                          options={categoryList}
                          disabled={!isEditMode && !!route.params?.productId}
                        />
                      </FormField>

                      <FormField
                        label="Sub Category"
                        error={touched.sub_category && errors.sub_category}
                        required={true}
                      >
                        <CustomDropdown
                          onSelect={(opt) => {
                            setFieldValue("sub_category", opt.id);
                          }}
                          selectedValue={values.sub_category}
                          placeholder="Select Sub Category"
                          options={subCategoryList?.filter(
                            (sub: any) => sub.category === values.category
                          )}
                          disabled={!isEditMode && !!route.params?.productId}
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
                              selectedValue={values.food_type}
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

                        {selectedType !== "service" && (
                          <FormField label="Pick Color">
                            <View style={styles.colorPickerContainer}>
                              <View style={styles.colorDropdownWrapper}>
                                <CustomDropdown
                                  options={COLOR_OPTIONS}
                                  placeholder="Select Color"
                                  onSelect={(val) =>
                                    setFieldValue("color", val.id)
                                  }
                                  selectedValue={values.color || ""}
                                />
                              </View>
                              <View
                                style={[
                                  styles.colorIndicator,
                                  {
                                    backgroundColor:
                                      (
                                        values?.color || "#E5E5E5"
                                      )?.toLowerCase() || "#E5E5E5",
                                  },
                                ]}
                              />
                            </View>
                          </FormField>
                        )}

                        {selectedType !== "service" && (
                          <FormField label="Select Size">
                            <CustomDropdown
                              options={sizeList}
                              placeholder="Select Size"
                              onSelect={(val) => setFieldValue("size", val.id)}
                              selectedValue={values.size || ""}
                            />
                          </FormField>
                        )}

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
                                  value={values.batch_number || ""}
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
                            numberOfLines={5}
                            multiline={true}
                            textInputStyle={styles.descriptionInput}
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
                            numberOfLines={4}
                            multiline={true}
                            textInputStyle={styles.descriptionInput}
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
                                  selectedValue={addon.id}
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
                      error={touched.image1 && errors.image1}
                    />

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
                              settingKey: "instant_delivery",
                            },
                            {
                              key: "self_pickup",
                              label: "Self Pickup",
                              settingKey: "self_pickup",
                            },
                            {
                              key: "general_delivery",
                              label: "General Delivery",
                              settingKey: "general_delivery",
                            },
                            {
                              key: "is_on_shop",
                              label: "On Shop Orders",
                              settingKey: "shop_orders",
                            },
                          ].map(({ key, label, settingKey }) => {
                            // Check if this setting is enabled in product settings
                            const isSettingEnabled =
                              settings[settingKey] !== false;

                            // if (!isSettingEnabled) return null;

                            return (
                              <ToggleRow
                                key={key}
                                label={label}
                                value={values[key]}
                                onValueChange={(val) => setFieldValue(key, val)}
                              />
                            );
                          })}
                        </View>

                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>Policies</Text>
                          {[
                            {
                              key: "return_policy",
                              label: "Return Policy",
                              settingKey: "return_policy",
                            },
                            {
                              key: "cod",
                              label: "COD",
                              settingKey: "cod",
                            },
                            {
                              key: "replacement",
                              label: "Replacement",
                              settingKey: "replacement",
                            },
                            {
                              key: "shop_exchange",
                              label: "Shop Exchange",
                              settingKey: "shop_exchange",
                            },
                            {
                              key: "shop_warranty",
                              label: "Shop Warranty",
                              settingKey: "shop_warranty",
                            },
                            {
                              key: "brand_warranty",
                              label: "Brand Warranty",
                              settingKey: "brand_warranty",
                            },
                          ].map(({ key, label, settingKey }) => {
                            // Check if this setting is enabled in product settings
                            const isSettingEnabled =
                              settings[settingKey] !== false;

                            return (
                              <ToggleRow
                                key={key}
                                label={label}
                                value={values[key]}
                                onValueChange={(val) => setFieldValue(key, val)}
                              />
                            );
                          })}
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
                        <Text style={styles.addButtonText}>
                          {isEditMode ? "Update" : "Save"}
                        </Text>
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

const styles = ScaledSheet.create({
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
    fontSize: "14@s",
    marginRight: "10@s",
    width: "50@s",
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
    // marginRight: 10,
    // marginBottom: 8,
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
    fontSize: "10@s",
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
    fontSize: "12@s",
    color: "#000",
  },
  optionalText: {
    fontSize: "10@s",
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
    fontSize: "14@s",
    color: "#333",
  },
  stockWarning: {
    fontSize: "10@s",
    color: "red",
    marginBottom: 12,
  },
  section: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 10,
    padding: 10,
    overflow: "visible", // Allow dropdown to extend beyond section bounds
  },
  sectionTitle: {
    color: "#FCA311",
    fontSize: "14@s",
    fontWeight: "700",
    marginBottom: 12,
  },
  smallLabel: {
    fontSize: "11@s",
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
  // Grid Layout Styles
  pricingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItemHalf: {
    width: "48%",
    marginBottom: 12,
  },
  gridItemFullWidth: {
    width: "100%",
    marginBottom: 12,
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
    width: "80@s",
    height: "80@s",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffbe6",
    marginBottom: 12,
    overflow: "hidden",
    padding: "4@s",
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
    fontSize: "20@s",
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
    fontSize: "11@s",
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
    fontSize: "14@s",
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
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  colorPickerContainer: {
    flexDirection: "row",
    // alignItems: "center",
    gap: 10,
  },
  colorDropdownWrapper: {
    flex: 1,
  },
  colorIndicator: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

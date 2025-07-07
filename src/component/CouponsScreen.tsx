import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import MainContainer from '../CommonComponent/MainContainer';
import Headerwithback from './Headerwithback';
import CustomSwitch from '../CommonComponent/CustomSwitch';
import api from '../services/api/api'; // Your API service
import { Coupon } from '../type/Coupan';



const CouponsScreen = () => {
  const [deliveryDiscountEnabled, setDeliveryDiscountEnabled] = useState(true);
  const [percentage, setPercentage] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getAllCoupons();
  }, []);

  const getAllCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('vendor/coupon/'); // Replace with your actual endpoint
      if (Array.isArray(response.data)) {
        setCoupons(response.data);
      }
    } catch (error) {
      console.log('Error fetching coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const renderCoupon = ({ item }: { item: Coupon }) => {
    const discountText = item.discount_percentage
      ? `Discount: ${item.discount_percentage}%`
      : `Discount: ₹${item.discount_amount}`;

    return (
      <View style={styles.couponCard}>
        <View style={styles.couponRow}>
          {/* Left: Image */}
          <View style={styles.imageContainer}>
            {item.is_active && <Text style={styles.activeBadge}>Active</Text>}
            <Image
              source={
                item.image
                  ? { uri: item.image }
                  : require('../assets/logo.png')
              }
              style={styles.couponImage}
              resizeMode="contain"
            />
          </View>

          {/* Right: Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.couponText}>Title: {item.title}</Text>
            {item.description && (
              <Text style={styles.couponText}>Note: {item.description}</Text>
            )}
            <Text style={styles.couponText}>{discountText}</Text>

            {item.min_purchase && (
              <Text style={styles.couponText}>
                Min Order: ₹{item.min_purchase} Max Discount: ₹
                {item.max_discount}
              </Text>
            )}
            <Text style={styles.couponText}>
              Start: {formatDate(item.start_date)}
            </Text>
            <Text style={styles.couponText}>
              End: {formatDate(item.end_date)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <MainContainer>
      <Headerwithback title="Coupons / Discounts" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Delivery Discount Section */}
        <View style={styles.discountBox}>
          <View style={styles.discountHeader}>
            <Text style={styles.discountTitle}>Delivery Discounts</Text>
            <CustomSwitch
              value={deliveryDiscountEnabled}
              onValueChange={setDeliveryDiscountEnabled}
            />
          </View>
          <Text style={styles.discountText}>
            This option helps you to boost your sales on svindo app by
            providing delivery discount to customers. Enter the percentage of
            total bill amount you want to provide as a delivery discount to your
            customer.
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5"
              value={percentage}
              onChangeText={setPercentage}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Ex: 100"
              value={minOrderValue}
              onChangeText={setMinOrderValue}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
          </View>
        </View>

        {/* Coupons */}
        <Text style={styles.sectionTitle}>Active Coupons</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FCA311" />
        ) : (
          <FlatList
            data={coupons}
            keyExtractor={item => item.id.toString()}
            renderItem={renderCoupon}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>Add Coupon</Text>
      </TouchableOpacity>
    </MainContainer>
  );
};

export default CouponsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  discountBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  discountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountText: {
    fontSize: 13,
    color: '#555',
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FCA311',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 10,
  },
  couponCard: {
    backgroundColor: '#C2FFCB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  couponRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imageContainer: {
    width: '30%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  detailsContainer: {
    width: '70%',
    paddingLeft: 8,
  },
  couponImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  activeBadge: {
    backgroundColor: '#b2f0b2',
    color: 'green',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  couponText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },
  addBtn: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#1A9443',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 5,
    zIndex: 999,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View, Text, Modal, FlatList, TextInput,
  TouchableOpacity, Image, StyleSheet, SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api/api';
import Loading from '../CommonComponent/Loading';

interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  image: string;
}

const ProductSelectionModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [searchText, setSearchText] = useState('');
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading,setIsLoading]=useState<boolean>(false)

  useEffect(() => {
    if (visible) {
      fetchProducts();
    }
  }, [visible]);

  const fetchProducts = async () => {
    try {
        setIsLoading(true)
      const res = await api.get('master/product/'); // Replace with your API URL
      const data = res.data?.map((item: any) => ({
        id: item.id,
        name: item.name || item.product_name,
        desc: item.description || '',
        price: item.price || 0,
        image: item.image || 'https://via.placeholder.com/150',
      }));
      setProductList(data);
    } catch (error) {
      console.error('Failed to load products', error);
    }finally{
        setIsLoading(false)
    }
  };

  const increment = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrement = (id: number) => {
    setCart((prev: any) => {
      const newCount = (prev[id] || 1) - 1;
      const updated = { ...prev };
      if (newCount <= 0) {
        delete updated[id];
      } else {
        updated[id] = newCount;
      }
      return updated;
    });
  };

  const filteredProducts = productList.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: Product }) => {
    const quantity = cart[item.id] || 0;
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
        <View style={styles.bottomRow}>
          {quantity === 0 ? (
            <TouchableOpacity style={styles.addButton} onPress={() => increment(item.id)}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyRow}>
              <TouchableOpacity onPress={() => decrement(item.id)}>
                <Text style={styles.qtyBtn}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={() => increment(item.id)}>
                <Text style={styles.qtyBtn}>+</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.price}>₹ {item.price}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="arrow-back" size={24} />
          </TouchableOpacity>
          <TextInput
            placeholder="Search Product/Service"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <FlatList
          data={filteredProducts}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />

        <View style={styles.footer}>
          <View style={styles.scanRow}>
            <TouchableOpacity style={styles.scanBtn}>
              <Icon name="qr-code-scanner" size={20} color="#fff" />
              <Text style={styles.scanText}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addProductBtn}>
              <Text style={styles.addProductText}>Add Product</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.proceedBtn}>
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </View>
        <Loading
        visible={isLoading}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default ProductSelectionModal;

// Keep your same styles from the previous code


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#F3F3F3',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
  },
  list: {
    paddingBottom: 130,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    padding: 8,
  },
  image: {
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    marginVertical: 4,
  },
  desc: {
    fontSize: 12,
    color: '#777',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtyBtn: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 6,
  },
  qtyText: {
    color: '#fff',
    marginHorizontal: 4,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FF9900',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  scanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 6,
  },
  scanText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  addProductBtn: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 6,
  },
  addProductText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  proceedBtn: {
    backgroundColor: '#A5F5B0',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    width:"50%",
    alignSelf:'center'
  },
  proceedText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

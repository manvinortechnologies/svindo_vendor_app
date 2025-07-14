import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Headerwithback from './Headerwithback';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RootStackParamList = {
    ShowNotification: undefined;
    SendNotifications:undefined
  };

interface Campaign {
  id: string;
  status: string;
  bgColor: string;
  title: string;
  views: number;
  clicks: number;
  startDate?: string;
  endDate?: string;
  reason?: string;
}

const campaigns: Campaign[] = [
  {
    id: '1',
    status: 'Active',
    bgColor: '#D9FDD3',
    title: 'Campaign name: 12345',
    views: 100,
    clicks: 10,
    startDate: '4/27/2025, 11:00AM',
  },
  {
    id: '2',
    status: 'Ended',
    bgColor: '#EFE6FF',
    title: 'Campaign name: 12345',
    views: 100,
    clicks: 10,
    startDate: '4/27/2025, 11:00AM',
    endDate: '4/27/2025, 11:00AM',
  },
  {
    id: '3',
    status: 'Pending',
    bgColor: '#FFEAB6',
    title: 'Campaign name: 12345',
    views: 100,
    clicks: 10,
  },
  {
    id: '4',
    status: 'Rejected',
    bgColor: '#FFE1E1',
    title: 'Campaign name: 12345',
    views: 100,
    clicks: 10,
    reason:
      'Content opposes our platform policy. To know in detail, read terms & conditions.',
  },
];

export type SecurityScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SendNotifications'>;

const ShowNotification: React.FC = () => {
    const navigation = useNavigation<SecurityScreenNavigationProp>();
  const renderItem = ({ item }: { item: Campaign }) => (
    <View style={[styles.card, { backgroundColor: item.bgColor }]}>
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <TouchableOpacity>
          <Icon name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>

      <Image
        style={styles.image}
        resizeMode="contain"
        source={require('../assets/logo.png')}
      />

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.info}>Views: {item.views}</Text>
      <Text style={styles.info}>Clicks: {item.clicks}</Text>
      {item.startDate ? (
        <Text style={styles.date}>Start: {item.startDate}</Text>
      ) : null}
      {item.endDate ? (
        <Text style={styles.date}>End: {item.endDate}</Text>
      ) : null}
      {item.reason ? (
        <Text style={{color: '#FF0000'}}>Reason:
        <Text style={styles.reason}> {item.reason}</Text></Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Headerwithback title="Notifications" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.topBox}>
            <Text style={styles.topTitle}>Sent</Text>
            <Text style={styles.topSubtitle}>this month</Text>
            <Text style={styles.topCount}>1 notification</Text>
          </View>
          <View style={styles.topBox}>
            <Text style={styles.topTitle}>Available</Text>
            <Text style={styles.topSubtitle}>per month</Text>
            <Text style={styles.topCount}>3 more</Text>
          </View>
        </View>

        <FlatList
          data={campaigns}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </ScrollView>

      <TouchableOpacity style={styles.sendBtn} onPress={() => navigation.navigate('SendNotifications')}>
        <Text style={styles.sendText}>Send Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShowNotification;

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'Active':
      return { backgroundColor: '#4CAF50' };
    case 'Ended':
      return { backgroundColor: '#9C27B0' };
    case 'Pending':
      return { backgroundColor: '#FFC107' };
    case 'Rejected':
      return { backgroundColor: '#F44336' };
    default:
      return { backgroundColor: '#ccc' };
  }
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' , paddingTop: 15
  },
  content: {
     padding: 16 
    },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topBox: {
    flex: 0.48,
    backgroundColor: '#FFE8C2',
    padding: 10,
    borderRadius: 6,
  },
  topTitle: { fontWeight: 'bold', color: '#333' },
  topSubtitle: { fontSize: 12, color: '#888' },
  topCount: { marginTop: 8, fontWeight: 'bold', color: '#000' },
  card: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: { fontSize: 12, color: '#fff' },
  image: {
    height: 50,
    width: '100%',
    marginVertical: 8,
  },
  title: { fontWeight: 'bold', marginBottom: 4 },
  info: { fontSize: 12, color: '#000', fontWeight: '500' },
  date: { fontSize: 12, color: '#000' },
  reason: { fontSize: 12, color: '#000', fontWeight: '500', marginTop: 4 },
  sendBtn: {
    position: 'absolute',
    bottom: 20,
    right: 5,
    backgroundColor: '#169729',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

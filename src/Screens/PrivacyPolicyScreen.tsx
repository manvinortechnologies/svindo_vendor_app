import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Headerwithback from './Headerwithback'; // custom header component
import Icon from 'react-native-vector-icons/Feather'; // for optional search icon

const handleSearch = () => {

}

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      {/* Content */}
      <Headerwithback title="Privacy & Policy"   rightIcons={[
              <TouchableOpacity onPress={handleSearch} key="search">
                <Icon name="search" size={20} color="#000" />
              </TouchableOpacity>,
              
            ]}/>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Introduction</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>We</Text> value your privacy and are committed to protecting your personal data.
          This Privacy Policy outlines how we collect, use, and safeguard your information.
        </Text>

        <Text style={styles.heading}>Information We Collect</Text>
        <Text style={styles.bullet}>• Personal Information (name, email, address, phone number)</Text>
        <Text style={styles.bullet}>• Payment Information</Text>
        <Text style={styles.bullet}>• Browsing and Usage Data</Text>

        <Text style={styles.heading}>How We Use Your Information</Text>
        <Text style={styles.paragraph}><Text style={styles.bold}>Your information helps us:</Text></Text>
        <Text style={styles.bullet}>• Process transactions and deliver orders</Text>
        <Text style={styles.bullet}>• Improve our services and customer experience</Text>
        <Text style={styles.bullet}>• Send promotional offers and updates (with your consent)</Text>

        <Text style={styles.heading}>Data Protection</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>We</Text> implement security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
        </Text>

        <Text style={styles.heading}>Third-Party Disclosure</Text>
        <Text style={styles.paragraph}>
          We do not sell, trade, or share your personal information with third parties without your consent, except as required by law.
        </Text>

        <Text style={styles.heading}>Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, update, or delete your personal information. Contact us for any privacy-related concerns.
        </Text>

        <Text style={styles.heading}>Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy periodically. We encourage you to review it regularly for any changes.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {  backgroundColor: "#FFF",
            flex:1,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 40 : 0,
        
           },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  bullet: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    lineHeight: 20,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default PrivacyPolicyScreen;

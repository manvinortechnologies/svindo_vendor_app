import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Switch, SafeAreaView, Dimensions } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Headerwithback from './Headerwithback';
import CustomSwitch from './CustomSwitch';

const screenWidth = Dimensions.get('window').width;

const VerificationPaymentsScreen = () => {
    const sections = [
        {
            content: (
                <View style={{flexDirection: 'row', justifyContent: 'center', gap: 40}}>
                    <View style={{alignItems: 'center'}}>
                        <Icon name="checkmark-circle-outline" size={24} color="#000" />

                        <Text style={styles.notVerified}>Not Verified</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Icon name="logo-usd" size={24} />
                    <Text style={styles.notVerified}>Payment inactive</Text>
                    </View>
                </View>
            )
        },
        {
            key: "status",
            content: (
                <View style={styles.sectionContent}>
                    <Text style={{color: '#000', fontWeight: '500', marginBottom: 8}}>Note:</Text>
                    <Text style={styles.note}>
                        To get verification, please contact service support team through section. After verification the business cannot change.
                    </Text>
                    <Text style={[styles.note, {marginTop: 8}]}>
                        After verification the bussiness cannot change this details.
                    </Text>
                </View>
            )
        },
        {
            key: 'basicDetails',
            title: 'Basic Details',
            content: (
                <View style={styles.sectionContent}>
                    {[
                        "Business Name",
                        "Brand Name",
                        "Mobile Number",
                        "Email Id",
                        "Business Category",
                        "Trade Type",
                        "Address",
                        "Emergency Mobile Number",
                    ].map((label, index) => (
                        <View key={index} style={styles.inputWrapper}>
                            <Text style={{ marginBottom: 5, fontWeight: '500'}}>{label}</Text>
                            <TextInput placeholder="Enter here" placeholderTextColor="#999"
                            style={styles.input}
                            />
                        </View>    
                    ))}
                    <View style={styles.inputWrapper}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.locationText}>Location</Text>
                        <Icon name="map-marker" size={18} color="#FCA311" style={{justifyContent: 'flex-end'}} />
                        </View>
                        <TouchableOpacity style={styles.locationInput}>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        },
        {
           key: "gstStatus",
           title: "GST Registration Status",
           content: (
            <>
            <View style={styles.inputWrapper}>
                <TouchableOpacity style={styles.locationInput}>
                    <Text style={{fontSize: 12}}>No (Default)</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.note}>
                    Note: If your business is GST registered please verify it. 
                    If not please register for UID from GST portal to start selling at state level and verify your UID here to active payments. Only GSTIN registered businesses will be shown at national level.
                </Text>
                <Text style={[styles.note, {marginTop: 10}]}>
                    Click <Text style={{color: 'blue'}}>here</Text> for further info.
                </Text>
            </View>
            </>
           ) 
        },
        {
      key: "gstVerification",
      title: "GSTIN / UID & PAN Verification",
      content: (
        <View style={styles.sectionContent}>
            <Text style={{ marginBottom: 5, fontWeight: '500'}}>Legal Name</Text>
            <TextInput placeholder="Enter here" placeholderTextColor="#999"
            style={styles.input}
            />
          {["GSTIN", "UID", "PAN"].map((item, index) => (
            <View key={index} style={styles.verificationBlock}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>{item}</Text>
                <CustomSwitch value={false} onValueChange={() => {}} />
              </View>
              <TextInput
                placeholder={`Enter ${item}`}
                placeholderTextColor="#999"
                style={styles.input}
              />
              <Text style={[styles.note, {marginVertical: 5}]}>
                Note: To verify {item} details, a one time OTP will be sent to mobile number and email address of the primary {item} holder. OTP is valid for limited time.
              </Text>
              <TouchableOpacity style={styles.otpButton}>
                <Text style={styles.otpButtonText}>Generate OTP</Text>
              </TouchableOpacity>
              
            </View>
          ))}
        </View>
      ),
        },
        {
  key: "fssaiSection",
  title: "I sell Food Products",
  content: (
    <View style={styles.sectionContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.label}>Fssai number</Text>
        <CustomSwitch value={false} onValueChange={() => {}} />
      </View>
      <TextInput
        placeholder="Enter number"
        placeholderTextColor="#999"
        style={styles.input}
      />
      <Text style={[styles.note, {marginVertical: 5}]}>
        Note: To verify Fssai details, a one time OTP will be sent to mobile number and email address of the primary Fssai holder. OTP is valid for limited time.
      </Text>
      <TouchableOpacity style={styles.otpButton}>
        <Text style={styles.otpButtonText}>Generate OTP</Text>
      </TouchableOpacity>
    </View>
  )
},
{
  key: "bankDetails",
  title: "Bank Details",
  content: (
    <View style={styles.sectionContent}>
      {[
        "Account Holder Name",
        "Bank IFSC code",
        "Bank Name",
        "Account Number",
        "Re-enter Account Number"
      ].map((label, index) => (
        <View key={index} style={styles.inputWrapper}>
          <Text style={{ marginBottom: 5, fontWeight: '500'}}>{label}</Text>
          <TextInput
            placeholder="Enter here"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>
      ))}
      <Text style={[styles.note, {marginVertical: 5}]}>
        Note: To verify Account details, a one time OTP will be sent to mobile number and email address of the primary Account holder. OTP is valid for limited time.
      </Text>
      <TouchableOpacity style={styles.otpButton}>
        <Text style={styles.otpButtonText}>Verify Account</Text>
      </TouchableOpacity>
    </View>
  )
}, 
{
  key: "activeAreaPincodes",
  title: "Business Active Area pin codes",
  content: (
    <View style={styles.sectionContent}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextInput
          placeholder="Ex: 518001"
          placeholderTextColor="#999"
          style={[styles.input, { flex: 1, marginRight: 8 }]}
        />
        <TouchableOpacity style={styles.otpButton}>
          <Text style={styles.otpButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 13, fontWeight: '500', marginBottom: 5 }}>
        Your active area Pincodes are :
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
        {["518001", "518002"].map((pincode, index) => (
          <Text
            key={index}
            style={{ color: '#163881', marginRight: 15, fontSize: 13, fontWeight: '600' }}
          >
            {pincode}
          </Text>
        ))}
      </View>
      <Text style={[styles.note, { color: 'red', fontWeight: '600', marginBottom: 5 }]}>
        Note:
      </Text>
      <Text style={[styles.note, {marginBottom: 10}]}>
        The pin codes you enter will be used to
      </Text>
      <Text style={[styles.note, {marginBottom: 10}]}>
         Mapped as active area for instant delivery.
      </Text>
      <Text style={[styles.note, {marginBottom: 10}]}>
        Active / Visible area for your product / services for unverified vendor.
      </Text>
      <Text style={[styles.note, {marginBottom: 10}]}>
        Area of visibility of your shop page in svindo app and website.
      </Text>
      <Text style={[styles.note, {marginBottom: 10}]}>
        Ads you run will be targeted to this area.
      </Text>
    </View>
  )
}


    ];

    const renderItem = ({ item }: any) => (
        <View style={styles.sectionContainer}>
            {item.title && <Text style={styles.sectionTitle}>{item.title}</Text>}
            {item.content}
        </View>
    );
  return (
    <SafeAreaView style={styles.container}>
        <Headerwithback title={'Verification & Payments'} />
        <FlatList data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.key ?? index.toString()}
        contentContainerStyle={styles.listContainer}
        />
    </SafeAreaView>
  )
}

export default VerificationPaymentsScreen

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingTop: 15 },
    listContainer: {
    padding: 16,
    
  },
  sectionContainer: {
    // borderWidth: 1,
    // borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FCA311",
    marginBottom: 10,
  },
  notVerified: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  paymentInactive: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  sectionContent: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  note: {
    fontSize: 12,
    color: "#666666",
    fontWeight: '500'
  },
  inputWrapper: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#FFF8EB",
    fontSize: 14,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA311",
    borderRadius: 6,
    padding: 16,
    backgroundColor: "#FFF8EB",
  },
  locationText: {
    color: "#000",
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  smallText: {
    fontSize: 14,
    color: "#000",
  },
  verificationBlock: {
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  otpButton: {
    width: '50%',
    alignSelf: 'center',
    backgroundColor: "#FCA311",
    paddingVertical: 10,
    borderRadius: 6,
    // marginTop: 8,
    elevation: 10
  },
  otpButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
})
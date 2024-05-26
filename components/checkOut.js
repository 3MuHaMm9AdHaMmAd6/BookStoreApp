import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Icon, ListItem, Button } from 'react-native-elements';

const OrderPlacement = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);

  const location = "123 Main St, City, Country";
  const paymentOptions = [
    { name: 'Credit Card', icon: 'credit-card' },
    { name: 'PayPal', icon: 'paypal' },
    { name: 'Cash on Delivery', icon: 'money' },
  ];

  const handlePaymentSelection = (paymentOption) => {
    setSelectedPayment(paymentOption);
    setIsPaymentDropdownOpen(false);
    console.log('Selected payment option:', paymentOption);
    // Implement your logic here for handling the selected payment option
  };

  const handleAddLocation = () => {
    console.log('Add location');
    // Implement your logic here for adding location
  };

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <View style={styles.section}>
          <Text style={styles.title}>Order Location:</Text>
          <Text style={styles.content}>{location}</Text>
        </View>
        <Button
          title="Add Location"
          onPress={handleAddLocation}
          buttonStyle={styles.button}
        />
      </Card>
      <Card containerStyle={styles.card}>
        <View style={styles.section}>
          <Text style={styles.title}>Select Payment Option:</Text>
          <ListItem
            containerStyle={styles.dropdownContainer}
            bottomDivider
            onPress={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
          >
            <ListItem.Content>
              <ListItem.Title style={styles.dropdownTitle}>
                {selectedPayment ? selectedPayment.name : 'Select Payment'}
              </ListItem.Title>
            </ListItem.Content>
            <Icon
              name={isPaymentDropdownOpen ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color="#007bff"
            />
          </ListItem>
          {isPaymentDropdownOpen && (
            paymentOptions.map((option, index) => (
              <ListItem
                key={index}
                containerStyle={styles.dropdownContainer}
                onPress={() => handlePaymentSelection(option)}
              >
                <Icon
                  name={option.icon}
                  type="font-awesome"
                  color="#007bff"
                />
                <ListItem.Content>
                  <ListItem.Title>{option.name}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))
          )}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#f0f0f0',
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
  dropdownContainer: {
    paddingHorizontal: 0,
  },
  dropdownTitle: {
    fontSize: 16,
    color: '#007bff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
  },
});

export default OrderPlacement;

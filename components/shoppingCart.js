import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Alert } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { createClient } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from "../firebase";

const supabase = createClient("https://ihqbpatulpvokpwjbgob.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocWJwYXR1bHB2b2twd2piZ29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4OTYyMDYsImV4cCI6MjAzMDQ3MjIwNn0.s_psosWhIQCyzg94OIAL8N_psHpJX9f2-cpnAGA2Ajs");

const ShoppingCart = ({ route }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
      setLoading(false); // Set loading to false once email is fetched
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userEmail) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.deleteOption}>
            <Pressable style={styles.cartButton} onPress={removeFromCart}>
              <MaterialIcons name="delete" size={30} color="#333" />
            </Pressable>
          </View>
        ),
      });
      fetchCartItems();
    }
  }, [userEmail]);

  const removeFromCart = async () => {
    // Confirmation dialog
    Alert.alert(
      'Remove Items from Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            const { error } = await supabase
              .from('cart')
              .delete()
              .eq('email', userEmail);

            if (error) {
              console.error('Error removing items from cart:', error.message);
              return;
            }

            // If removal is successful, fetch updated cart items
            fetchCartItems();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const fetchBooksId = async () => {
    const { data: bookIds, error } = await supabase
      .from('cart')
      .select('book_id')
      .eq('email', userEmail);

    if (error) {
      console.error('Error fetching book IDs:', error.message);
      return [];
    }

    return bookIds.map(item => item.book_id);
  };

  const fetchAuthorsAndTitles = async (bookIds) => {
    const { data: bookData, error } = await supabase
      .from('books')
      .select('title, author')
      .in('book_id', bookIds);

    if (error) {
      console.error('Error fetching book authors and titles:', error.message);
      return [];
    }

    return bookData;
  };

  const fetchBookPrices = async (bookIds) => {
    const { data: bookPrices, error } = await supabase
      .from('book_prices')
      .select('price')
      .in('book_id', bookIds);

    if (error) {
      console.error('Error fetching book prices:', error.message);
      return [];
    }

    return bookPrices;
  };

  const fetchCartItems = async () => {
    try {
      const bookIds = await fetchBooksId();
      const bookData = await fetchAuthorsAndTitles(bookIds);
      const bookPrices = await fetchBookPrices(bookIds);

      const items = bookData.map((book, index) => ({
        id: bookIds[index], // Set id as the book_no fetched from the cart table
        title: book.title,
        author: book.author,
        price: bookPrices[index]?.price || 0,
      }));

      setCartItems(items);
      calculateTotalPrice(items);
    } catch (error) {
      console.error('Error fetching cart items:', error.message);
    }
  };

  const calculateTotalPrice = items => {
    const totalPrice = items.reduce((total, item) => total + item.price, 0);
    setTotalPrice(totalPrice);
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log('Checkout button pressed');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <View style={styles.cartContainer}>
          <Icon name="shopping-cart" type="font-awesome" />
          <Text style={styles.cartTitle}>Shopping Cart</Text>
        </View>
        {cartItems.map(item => (
          <Card key={item.id} containerStyle={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemText}>Author: {item.author}</Text>
            <Text style={styles.itemText}>Price: ${item.price}</Text>
          </Card>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${totalPrice}</Text>
        </View>
        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#D8BFD8',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteOption: {
    marginRight: 20,
  },
  card: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#FFFFFf',
  },
  cartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemCard: {
    marginBottom: 10,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
    marginTop: 5,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShoppingCart;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { createClient } from "@supabase/supabase-js";
import { auth } from "../firebase";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import MaterialCommunityIcons from Expo



const supabase = createClient("https://ihqbpatulpvokpwjbgob.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocWJwYXR1bHB2b2twd2piZ29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4OTYyMDYsImV4cCI6MjAzMDQ3MjIwNn0.s_psosWhIQCyzg94OIAL8N_psHpJX9f2-cpnAGA2Ajs");

const getBookPrice = async (bookId) => {
    try {
        const { data, error } = await supabase
            .from('book_prices')
            .select('price')
            .eq('book_id', bookId)
            .single();

        if (error) {
            console.error('Error fetching book price:', error.message);
            return null;
        }

        return data.price;
    } catch (error) {
        console.error('Error fetching book price:', error.message);
        return null;
    }
};

const insertIntoCart = async (uid, email, book_id) => {
    try {
        const { data, error } = await supabase
            .from('cart')
            .insert([{ uid, email, book_id }])
            .single();

        if (error) {
            throw error;
        }

        console.log('Data inserted into cart:', data);
    } catch (error) {
        console.error('Error inserting data into cart:', error.message);
    }
};

const getBookDescription = async (bookId) => {
    try {
        const { data, error } = await supabase
            .from('book_descriptions')
            .select('description')
            .eq('book_id', bookId)
            .single();

        if (error) {
            console.error('Error fetching book description:', error.message);
            return null;
        }

        return data.description;
    } catch (error) {
        console.error('Error fetching book description:', error.message);
        return null;
    }
};

const ImageCard = ({ imageUri }) => {
    return (
        <View style={styles.imageCard}>
            <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
    );
};

const DescriptionCard = ({ description }) => {
    return (
        <View style={styles.descriptionCard}>
            <Text style={styles.heading}>Description</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const DetailsCard = ({ title, author, publication }) => {
    return (
        <View style={styles.detailsCard}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.cardItem}>
                <Text style={styles.heading}>{`\u2022`} Author</Text>
                <Text style={styles.text}>{author}</Text>
            </View>
            <View style={styles.cardItem}>
                <Text style={styles.heading}>{`\u2022`} Publication</Text>
                <Text style={styles.text}>{publication}</Text>
            </View>
        </View>
    );
};

const PriceCard = ({ price }) => {
    return (
        <View style={styles.priceCard}>
            <Text style={styles.price}>Price: {price ? `₹${price}` : 'Loading...'}</Text>
        </View>
    );
};

const PreviewScreen = ({ route }) => {
    const { bookId, title, publication, author, imageUri } = route.params;
    console.log("Received Params: ", { bookId, title, publication, author, imageUri }); // Logging received params
    const navigation = useNavigation();
    const [description, setDescription] = useState(null);
    const [price, setPrice] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable style={styles.cartButton} onPress={clcikOnShoppingCart}>
                    <Icon name="shopping-cart" size={30} color="#333" />
                </Pressable>
            ),
        })
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // Here, user.uid contains the UID of the currently logged-in user
                setUserId(user.uid); // Set the user ID
                setUserEmail(user.email); // Set the user email
                console.log(user.email);
            } else {
                setUserId(null); // No user is logged in
                setUserEmail(null); // No user is logged in
            }
        });

        // Clean up subscription on unmount
        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchBookDetails = async () => {
            const bookDescription = await getBookDescription(bookId);
            setDescription(bookDescription);

            const bookPrice = await getBookPrice(bookId);
            setPrice(bookPrice);
        };

        fetchBookDetails();
    }, [bookId]);

    const handleAddToCart = () => {
        // Implement your logic to add the book to the cart here
        console.log('Book added to cart');
        insertIntoCart(userId, userEmail, bookId);
        // Show alert
        Alert.alert(
            'Success',
            'Item added to the cart',
            [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                    style: 'cancel',
                },
            ],
            {
                cancelable: false,
                // Add custom component to display an icon
                customView: (
                    <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color="green"
                        style={{ marginRight: 10 }}
                    />
                ),
            }
        );
    };

    const clcikOnShoppingCart = () => {
        navigation.navigate('ShoppingCart');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.centered}>
                <ImageCard imageUri={imageUri} />
                <DetailsCard title={title} author={author} publication={publication} />
                <DescriptionCard description={description} />
                <PriceCard price={price} />
                <Pressable style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#D8BFD8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cartButton: {
        padding: 10,
        marginRight: 14,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageCard: {
        marginTop: 30,
        paddingTop: 20,
        paddingBottom: 20,
        width: 370,
        height: 400,
        borderRadius: 10,
        alignItems: 'center', // Center the image horizontally
        justifyContent: 'center', // Center the image vertically
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: "#FFFF"
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
        borderRadius: 20,
        resizeMode: 'contain',
    },
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 365,
    },
    descriptionCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 365,
    },
    priceCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 365,
    },
    cardItem: {
        marginBottom: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
        textAlign: 'left', // Center text horizontally
    },
    text: {
        fontSize: 16,
        textAlign: 'center', // Center text horizontally
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#555',
        textAlign: 'justify'
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center', // Center text horizontally
    },
    addToCartButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 20,
    },
    addToCartButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
});

export default PreviewScreen;

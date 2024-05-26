import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Dimensions, Image, Pressable } from 'react-native';
import { createClient } from "@supabase/supabase-js";
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import Icon from 'react-native-vector-icons/Ionicons';
const supabase = createClient("https://ihqbpatulpvokpwjbgob.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocWJwYXR1bHB2b2twd2piZ29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4OTYyMDYsImV4cCI6MjAzMDQ3MjIwNn0.s_psosWhIQCyzg94OIAL8N_psHpJX9f2-cpnAGA2Ajs");


 const { width } = Dimensions.get('window'); // Corrected here

 const itemWidth = (width - 40) / 2 - 10;

const booksToDisplay = [
  "1984",
  "Pride and Prejudice",
  "The Catcher in the Rye",
  "The Great Gatsby",
  "The Hobbit",
  "To Kill a Mockingbird",
  "To The Lighthouse"
];

const SearchPage = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation(); // Initialize the navigation object


  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase.from('books').select('*');
      if (error) {
        console.error('Error fetching books:', error.message);
      } else {
        // Fetch image URLs concurrently with book details
        const booksWithImages = await Promise.all(data.map(async book => {
          const { data: image_url, error: imageError } = await supabase.storage.from("BooksImage").getPublicUrl(`coverPageOfTheBook/${book.title}`);
          if (imageError) {
            console.error('Error fetching image:', imageError.message);
            return { ...book, imageUrl: null };
          } else {
            console.log(image_url);
            return { ...book, imageUrl: image_url.publicUrl };
          }
        }));

        // Filter the fetched books based on the titles in booksToDisplay array
        const filteredBooks = booksWithImages.filter(book => booksToDisplay.includes(book.title));
        setBooks(filteredBooks);
      }
    }
    fetchBooks();
  }, []);

  const handleBookPress = (book) => {
    // Navigate to PreviewScreen and pass the book details as params
    navigation.navigate('Preview', {
      bookId: book.book_id,
      title: book.title,
      publication: book.publication_house,
      author: book.author,
      imageUri: book.imageUrl // Pass the imageUri as navigation param
    });
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity style={[styles.card, { width: itemWidth }]} onPress={() => handleBookPress(item)}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={[styles.image, { width: itemWidth, height: itemWidth * 1.5 }]} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.authorHeading}>Author:</Text>
      <Text style={styles.authorName}>{item.author}</Text>
      <Text style={styles.publisherHeading}>Publisher:</Text>
      <Text style={styles.publisherName}>{item.publication_house}</Text>
    </TouchableOpacity>
  );

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="search" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search by book title"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      </View>
      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={item => item.book_id.toString()} // Ensure key is string
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9', // Light gray background
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff', // White background
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    height: 40,
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  flatListContainer: {
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Dark gray text color
    textAlign: 'center',
  },
  authorHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666', // Gray text color
    marginBottom: 2, // Add margin bottom to separate from the author name
  },
  authorName: {
    fontSize: 16,
    color: '#666', // Gray text color
    textAlign: 'center', // Center-align the author name
    marginBottom: 5, // Add margin bottom to separate from the publisher heading
  },
  publisherHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666', // Gray text color
    marginBottom: 2, // Add margin bottom to separate from the publisher name
  },
  publisherName: {
    fontSize: 16,
    color: '#666', // Gray text color
    textAlign: 'center', // Center-align the publisher name
  },
});

export default SearchPage;

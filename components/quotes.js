import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Icon } from 'react-native-elements'; // Import Icon from react-native-elements
import { createClient } from '@supabase/supabase-js';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import Material Community Icons from Expo


const supabase = createClient("https://ihqbpatulpvokpwjbgob.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocWJwYXR1bHB2b2twd2piZ29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4OTYyMDYsImV4cCI6MjAzMDQ3MjIwNn0.s_psosWhIQCyzg94OIAL8N_psHpJX9f2-cpnAGA2Ajs");

const QuoteDisplay = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('quote, author');

      if (error) {
        console.error('Error fetching quotes:', error.message);
        return;
      }

      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Card containerStyle={styles.cardHeading}>
          <View style={styles.headingContainer}>
          <MaterialCommunityIcons name="format-quote-open" size={64}  color="#007bff" /> 
            <Text style={styles.headingText}>Quotes</Text>
          </View>
        </Card>

        {/* Quotes */}
        {quotes.map((quote, index) => (
          <Card key={index} containerStyle={styles.card}>
            <Text style={styles.quoteText}>"{quote.quote}"</Text>
            <Text style={styles.authorText}>- {quote.author}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8BFD8',
  },
  contentContainer: {
    flexGrow: 1,
    marginTop: 40,
    marginBottom: 100
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  card: {
    width: '90%',
    marginTop: 30,

    borderRadius: 10,
    padding: 20,
    backgroundColor: '#FFFFFf',
    elevation: 3,
    alignSelf: 'center', // Align cards to center horizontally
  },
  cardHeading: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFf',
    elevation: 3,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  authorText: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 10,
    fontWeight: 'bold'
  },
});

export default QuoteDisplay;

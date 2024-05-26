import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import Material Community Icons from Expo
import SearchPage from './components/searchBooks';
import PreviewScreen from './components/previewBook';
import AuthScreen from './components/loginSignUp';
import SignInComponent from './components/loginSignUp';
import ShoppingCart from './components/shoppingCart';
import QuoteDisplay from './components/quotes';
import PassageQuestionAnswer from './components/askQuestion';
import OrderPlacement from './components/checkOut.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BuyingABook = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Search" component={SearchPage} options={{ title: 'Search Books' }} />
      <Stack.Screen name="Preview" component={PreviewScreen} options={{ title: 'Book Preview' }} />
      <Stack.Screen name="ShoppingCart" component={ShoppingCart} options={{ title: 'Shopping cart' }} />
    </Stack.Navigator>
  );
};

const RestOfTheApp = () => 
{
    return(
<Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { height: 50, marginBottom: 3, padding: 5} // Adjust the height and marginBottom as needed
          }}
        >
          <Tab.Screen
            name="BuyingABook"
            component={BuyingABook}
            options={{
              title: 'Buy a Book',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="book-outline" size={size} color={color} /> // Icon for buying a book
              ),
            }}
          />
          <Tab.Screen
            name="QuoteDisplay"
            component={QuoteDisplay}
            options={{
              title: 'Quotes',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="format-quote-open" size={size} color={color} /> // Icon for quotes
              ),
            }}
          />
          <Tab.Screen
            name="PassageQuestionAnswer"
            component={PassageQuestionAnswer}
            options={{
              title: 'Ask Question',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="help-circle-outline" size={size} color={color} /> // Icon for asking a question
              ),
            }}
          />
        </Tab.Navigator>
    )
}

const WholeApp = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown: false,}}>
      <Stack.Screen name="signIn" component={SignInComponent} options={{ title: '' }} />
      <Stack.Screen name="rest" component={RestOfTheApp} options={{ title: '' }} />
    </Stack.Navigator>
  );
};



export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <WholeApp/>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

// App.js
import 'react-native-gesture-handler'; // must be at the top
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import { useFonts } from 'expo-font';
import OnboardingScreen from './screens/OnboardingScreen';
import SplashScreen from './screens/SplashScreen';
import LottieAnimation from './screens/LottieAnimation';
import ChatScreen from './screens/ChatScreen';
import StatusSelectionScreen from './screens/StatusSelectionScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Black': require('./assets/fonts/Poppins-Black.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-ExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
    'Muli-Black': require('./assets/fonts/Muli-Black.ttf'),
  });

  if (!fontsLoaded) return null; // wait until fonts are loaded

  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash" //Splash
        screenOptions={{
          headerShown: false, // hide default headers
        }}
      >
        <Stack.Screen name='Splash' component={SplashScreen}/>
        <Stack.Screen name="Onboarding" component={OnboardingScreen}/>
        {/* <Stack.Screen name='Lottie' component={LottieAnimation}/> */}
        <Stack.Screen name='Status' component={StatusSelectionScreen}/>
        <Stack.Screen name='Chat' component={ChatScreen}/>
        
        
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

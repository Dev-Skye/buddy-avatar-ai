import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image, StatusBar, useWindowDimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';   // 👈 import expo-av

export default function SplashScreen({ navigation }) {

  const {width, height} = useWindowDimensions();
  const isLargeScreen = width > 768;
  const animX = useRef(new Animated.Value(-300)).current; // Lottie slide-in
  const imageX = useRef(new Animated.Value(200)).current; // image starts offscreen right
  const imageOpacity = useRef(new Animated.Value(0)).current; // fade-in
  const floatAnim = useRef(new Animated.Value(0)).current; // up-down float

  useEffect(() => {
    // Play sound once when screen loads
    const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sound/sound.wav')   // 👈 make sure this file exists
        );
        await sound.playAsync();
      } catch (error) {
        console.log('Error playing splash sound:', error);
      }
    };
    playSound();

    // Animate Lottie in from left
    Animated.timing(animX, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Animate image fade-in + slide-in from right
    Animated.parallel([
      Animated.timing(imageX, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Floating animation for 4 seconds
      const floatSequence = Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: isLargeScreen ? -height * 0.01 : -height * 0.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: isLargeScreen ? height * 0.01 : height * 0.02,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);
      Animated.loop(floatSequence, { iterations: 2 }).start();
    });

    // Navigate after 7 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding'); //Onboarding
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="dark-content" />
      
      <Animated.View style={{ transform: [{ translateX: animX }] }}>
        <LottieView
          source={require('../assets/lottie/message.json')}
          autoPlay
          loop
          style={{ width: isLargeScreen ? 0.9 : width * 0.5, height: isLargeScreen ? 0.9 : height * 0.2 }}
        />
      </Animated.View>

      <Animated.View
        style={{
          opacity: imageOpacity,
          transform: [
            { translateX: imageX },
            { translateY: floatAnim },
          ],
          marginTop: -height * 0.05,
        }}
      >
        <Image
          source={require('../assets/images/logoc.png')}
          style={{width: width * 0.3,
                  height: height * 0.06,
                  marginTop: height * 0.03}}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e1e9ff',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

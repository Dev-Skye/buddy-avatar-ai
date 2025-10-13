import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, useWindowDimensions, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';


export default function LottieAnimation({navigation}) {
  // Size of each animation
  
  const { width, height } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const animSize = isLargeScreen ? 140 : width * 0.30;
  const gap = 10; // space between animations in final grid

  // Initial positions (off-screen corners)
  const anim1 = useRef(new Animated.ValueXY({ x: -animSize, y: -animSize })).current; // top-left
  const anim2 = useRef(new Animated.ValueXY({ x: width / 2, y: height /2 - animSize- gap})).current; // top-right
 // const anim2 = useRef(new Animated.ValueXY({ x: width + animSize, y: -animSize })).current; // top-right
  const anim3 = useRef(new Animated.ValueXY({ x: -animSize, y: height + animSize })).current; // bottom-left
  const anim4 = useRef(new Animated.ValueXY({ x: width + animSize, y: height + animSize })).current; // bottom-right

  // Final positions (2x2 grid around center)
  const centerX = width / 2 - animSize / 2;
  const centerY = height / 2 - animSize / 2;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(anim1, { toValue: { x: centerX - animSize - gap / 2, y: centerY - animSize - gap / 2 }, duration: 500, useNativeDriver: false }),
      Animated.delay(100),
      Animated.timing(anim2, { toValue: { x: centerX + gap / 2, y: centerY - animSize - gap / 2 }, duration: 500, useNativeDriver: false }),
      Animated.delay(100),
      Animated.timing(anim3, { toValue: { x: centerX - animSize - gap / 2, y: centerY + gap / 2 }, duration: 500, useNativeDriver: false }),
      Animated.delay(100),
      Animated.timing(anim4, { toValue: { x: centerX + gap / 2, y: centerY + gap / 2 }, duration: 500, useNativeDriver: false }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
        <View style={[styles.animContainer, {marginLeft: isLargeScreen ? 0 : 45}]}>
            <Animated.View style={{ position: 'absolute', transform: anim1.getTranslateTransform(), marginLeft: isLargeScreen ? 0 : 35 }}>
                <LottieView source={require('../assets/lottie/laughing.json')} autoPlay loop style={{ width: animSize * 1.1, height: animSize * 0.88 }} />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', transform: anim2.getTranslateTransform(), marginLeft: isLargeScreen ? 0 : 15  }}>
                <LottieView source={require('../assets/lottie/heart.json')} autoPlay loop style={{ width:  animSize * 0.75, height: animSize * 0.75 }} />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', transform: anim3.getTranslateTransform() }}>
                <LottieView source={require('../assets/lottie/head.json')} autoPlay loop style={{ width: animSize * 1.8, height: animSize * 1.8}} />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', transform: anim4.getTranslateTransform() }}>
                <LottieView source={require('../assets/lottie/cool.json')} autoPlay loop style={{ width: animSize * 1.05, height: animSize * 1.05}} />
            </Animated.View>
        </View>
      

        <View style={styles.textContainer}>
            <Text style={styles.text}>Share Your Feelings!</Text>
        <Text style={styles.text2}>When you need a personal companion who reads your emotions, listens and cares for you.  
            I am always here to lift you up. Let's talk, laugh and try something new!</Text>
                
                    
                    <View style={{height: 50, width: 350, marginTop: 40, marginLeft: 50}}>
                        <TouchableOpacity onPress={() => navigation.navigate("Status")}>
                            {/* Chat */}
                            <View style={{height: 55, width: 300, borderRadius: 50, backgroundColor: '#ffbb00ff', marginTop: 5,}}>
                                <Text style={{marginTop: 15, textAlign: 'center', fontSize: 18, fontFamily: 'Poppins-Bold'}}>Let's Talk</Text>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
        </View>
        

    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
       // backgroundColor: '#300364e4',
        backgroundColor: '#070865ff',
        justifyContent: 'center'
    },
   text:{
        marginTop: 40,
        fontSize: 30,
        fontFamily: 'Poppins-ExtraBold',
        color: '#fff',
        marginBottom: -7
    },
    text2:{
        marginBottom: 10,
        textAlign:'center',
        fontSize: 13,
        fontFamily: 'Poppins-Light',
        fontWeight: 100,
        color: '#fff',  
    },
    animContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 100,
    marginTop: -100 // move down slightly if needed
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start', // text below animations
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 150,
  },
})
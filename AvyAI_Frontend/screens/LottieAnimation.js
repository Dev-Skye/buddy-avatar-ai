// import React, { useEffect, useRef } from 'react';
// import { View, Text, Animated, useWindowDimensions, StyleSheet, TouchableOpacity } from 'react-native';
// import LottieView from 'lottie-react-native';


// export default function LottieAnimation({navigation}) {
  

//   // Size of each animation
//   const { width, height } = useWindowDimensions();

//   const isLargeScreen = width > 768;
//   const animSize = width * 0.5;



//   return (
//     <View style={styles.container}>
//         {/* 2x2 Grid */}
//       <View style={styles.gridContainer}>
//         <View style={styles.row}>
//           <LottieView
//             source={require('../assets/lottie/laughing.json')}
//             autoPlay
//             loop
//             style={{ width: animSize, height: animSize}}
//             resizeMode="cover"
//           />
//           <LottieView
//             source={require('../assets/lottie/heart.json')}
//             autoPlay
//             loop
//             style={{ width: animSize, height: animSize}}
//             resizeMode="cover"
//           />
//         </View>

//         <View style={[styles.row, { marginTop: 1 }]}>
//           <LottieView
//             source={require('../assets/lottie/head.json')}
//             autoPlay
//             loop
//             style={{ width: animSize, height: animSize,}}
//             resizeMode="cover"
//           />
//           <LottieView
//             source={require('../assets/lottie/cool.json')}
//             autoPlay
//             loop
//             style={{ width: animSize, height: animSize}}
//             resizeMode="cover"
//           />
//         </View>
//       </View>

//       {/* Text Container */}
//         <View style={styles.textContainer}>
//             <Text style={{marginTop: isLargeScreen ? 20 : 40, fontSize: 30, fontFamily: 'Poppins-ExtraBold', color: '#fff', marginBottom: -7}}>Share Your Feelings!</Text>
//         <Text style={{marginBottom: 10, textAlign:'center', fontSize: isLargeScreen ? 17 : 13, width: isLargeScreen ? "35%" : "80%", fontFamily: 'Poppins-Light', fontWeight: 100, color: '#fff'}}>
//             When you need a personal companion who reads your emotions, listens and cares for you.  
//             I am always here to lift you up. Let's talk, laugh and try something new!</Text>
                
                    
//                     <View style={{height: 50, width: 350, marginTop: 40, marginLeft: 50}}>
//                         <TouchableOpacity onPress={() => navigation.navigate("Status")}>
//                             {/* Chat */}
//                             <View style={{height: 55, width: 300, borderRadius: 50, backgroundColor: '#ffbb00ff', marginTop: isLargeScreen ? 0 : 5,}}>
//                                 <Text style={{marginTop: 15, textAlign: 'center', fontSize: 18, fontFamily: 'Poppins-Bold'}}>Let's Talk</Text>
//                             </View>
//                         </TouchableOpacity>
                        
//                     </View>
//         </View>
        

//     </View>
//   );
// }


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//        // backgroundColor: '#300364e4',
//         backgroundColor: '#070865ff',
//         justifyContent: 'center'
//     },
   
//     text2:{
//         marginBottom: 10,
//         textAlign:'center',
//         fontSize: 13,
//         fontFamily: 'Poppins-Light',
//         fontWeight: 100,
//         color: '#fff',  
//         width: '80%',
//     },
//     gridContainer: {
//     marginTop: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
    
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'center'
//   },

//   textContainer: {
//     justifyContent: 'flex-start', // text below animations
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     marginTop: 50,
//   },
// })
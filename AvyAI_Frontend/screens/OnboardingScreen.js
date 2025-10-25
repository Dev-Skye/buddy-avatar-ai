import React, {useRef, useEffect} from "react";
import {View, Text,Image, StyleSheet, Animated, TouchableOpacity, useWindowDimensions} from 'react-native';
import LottieView from "lottie-react-native";
import {Ionicons} from "@expo/vector-icons";

export default function OnboardingScreen({navigation}){

 const {width, height} = useWindowDimensions();
 const isLargeScreen = width > 768;
    
 return(
    <View style={styles.container}>
            <View>
                <Image
                source={require('../assets/images/avatarshort.png')}
                style={{height: isLargeScreen ? height * 0.7 : height * 0.7,
                        width: isLargeScreen ? width * 0.4 : width * 0.7,
                        marginTop: -height * 0.03,}}
                resizeMode="cover"
            />
            </View>
            

            <Text style={{marginTop: isLargeScreen ? -height * 0.05 : -height * 0.05, fontFamily: 'Poppins-Black', fontSize: isLargeScreen ? 50 : 40, marginBottom: -19,color: '#fff'}}>
                Hi, I am Buddy!</Text>
            <Text style={{marginBottom: isLargeScreen ? height * 0.02 : height * 0.1, fontSize: isLargeScreen ? 23 : 20, fontFamily: 'Poppins-Medium', color: '#fff', marginTop: isLargeScreen ? height * 0.01 : 5}}>
                Your Digital Friend</Text>
    
            <TouchableOpacity onPress={() => navigation.navigate("Status")}>
                {/* //Lottie  */}
                <View style={{height: 70, width: 70, borderRadius: 50, backgroundColor: '#fff', marginTop: isLargeScreen ? height * 0.01 : -height * 0.03}}>
                <Ionicons name="arrow-forward" size={20} color='#000' style={{paddingTop: 25, paddingLeft: 25}}/>
                </View>
            </TouchableOpacity>
        
    </View>
 )   
}

const AVATAR_SIZE= 150;


const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#070865ff',
        //backgroundColor: '#070865ff'
    },
    baseText:{
        color: '#fff',
        fontSize: 15,
    },
    
    text2:{
        
    
    },
    emoji:{
        position: 'absolute'
    },
    topRight:{
        top: '20%',
        left: '69%'
    },
    bottomLeft:{
        top: '60%',
        left: '18%'
    }

})
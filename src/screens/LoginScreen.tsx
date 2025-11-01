import { Alert, Dimensions, ImageBackground, StatusBar, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY, Logo } from '../constants'
import { MotiImage, MotiText, MotiView } from 'moti'
import InputComp from '../components/InputComp';
import { Key, Mail, Send } from 'lucide-react-native';
import ButtonComp from '../components/ButtonComp';
import { loginUser } from '../backend/userProcessor';
import CustomAlert from '../components/CustomAlert';
const {width, height} = Dimensions.get('window');



const LoginScreen = ({navigation}: any) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const [alertVisible, setAlertVisible] = useState(false);
   const [alertTitle, setAlertTitle] = useState('');
   const [alertMessage, setAlertMessage] = useState('');
   const [isSuccess, setIsSuccess] = useState(false);

   const handleLogin = async () => {
      try {
        const res = await loginUser(email, password);
        if (res.success) {
          setAlertTitle('Login Successful');
          setAlertMessage('Welcome back!');
          setIsSuccess(true);
        } else {
          setAlertTitle('Login Failed');
          setAlertMessage(res.message || 'Please check your credentials.');
          setIsSuccess(false);
        }
        setAlertVisible(true);
      } catch (error) {
        setAlertTitle('Error');
        setAlertMessage('An unexpected error occurred.');
        setIsSuccess(false);
        setAlertVisible(true);
      }
    };


   const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (isSuccess) {
      navigation.replace('MainTab');
    }
   };
  return (

   
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDarkGrey} />
      <MotiView style={styles.imageContainer}>
        <ImageBackground
        source={require('../assets/images/welcome.jpg')}
        resizeMode='cover'
        style={styles.backgroungImage}
        imageStyle={styles.ImageStyle}
        >
          <MotiView style={styles.overlayhere}>
            <View style={styles.logoContainer}>
              <MotiImage
                source={Logo.favicon}
                style={styles.image}
                />
            </View>
            <MotiText  style={styles.welcomeText}>Welcome Back!</MotiText>
          </MotiView>
        </ImageBackground>
      </MotiView>
      <MotiView style={styles.formContainer}>
        <InputComp
        icon={Mail}
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder={"enter your email"}
        secureTextEntry={false}
        keyboardType='email-address'
        />
        <InputComp
        icon={Key}
        label="Enter Password"
        value={password}
        onChangeText={setPassword}
        placeholder={"Password"}
        secureTextEntry={true}
        keyboardType='password'
        />
        <ButtonComp
        label="Login"
        onPress={handleLogin}
        backgroundColor={COLORS.primaryColor}
        icon={<Send color="white" size={20} style={{ marginRight: 8 }} />}
        loading={false}
        />
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          confirmText="OK"
          onConfirm={handleAlertConfirm}
        />
      </MotiView>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  imageContainer:{
    flex: 0.5,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    marginBottom: height*(-0.10)
  },
  formContainer:{
    flex: 0.5,
    backgroundColor: COLORS.primaryWhite,
    borderTopLeftRadius: 50,
    paddingHorizontal: width*0.05,
    paddingVertical: height*0.06
  },
  backgroungImage:{
    width: '100%',
    height: height*0.50,
    justifyContent: 'center',
  },
  ImageStyle:{
    borderBottomRightRadius: 50,
  },
  overlayhere:{
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(64, 0, 0, 0.8)',
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',

  },
  logoContainer:{
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 50,
    marginBottom: height*0.02,
    marginTop: height*0.12,
  },
  image:{
    width: 50,
    height: 30,
  },
  welcomeText:{
    fontSize: 25,
    fontFamily: FONT_FAMILY.dmsans_bold,
    color: COLORS.primaryLightGrey1,
  },
})
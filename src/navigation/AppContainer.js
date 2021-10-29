import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  StatusBar,
  useWindowDimensions,
  Animated,
} from "react-native";

import {
  NavigationContainer,
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


import SplashScreen from "../SplashScreen";
import Login from "../pages/Login";
import Main from "../pages/Main";
import Constants from "../utils/Constants";
// import Utils from "../utils/Utils";

import QRScanView from '../pages/QRScan';
import ForgotPassword from "../pages/ForgotPassword";
import PlateRecognizer from "../pages/MainTabPanel/PlateRecognizer";
import DLScanPage from "../pages/DLScanPage";
import NotesScreen from "../pages/Notes";



const Stack = createStackNavigator();


export default function AppContainer(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" headerMode="none">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          initialParams={{ item: 12123 }}
          options={{}}
        />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="main" component={Main} />
        <Stack.Screen name="qr-scan" component={QRScanView} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="plate-scan" component={PlateRecognizer} />
        <Stack.Screen name="dl-scan" component={DLScanPage} />
        <Stack.Screen name="notes" component={NotesScreen} />
        {/* <Stack.Screen name="Main" component={DrawerNav} options={{ title: 'Hi Here' }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

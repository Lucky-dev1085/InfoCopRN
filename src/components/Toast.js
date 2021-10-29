import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { ThemeProvider, Image, Button } from "react-native-elements";
import { BallIndicator } from "react-native-indicators";
import PropTypes from "prop-types";
import Constants from "../utils/Constants";
const WINDOW_WIDTH = Dimensions.get("window").width;

const Toast = ({ isShow = false, msg  }) => {

  if (!isShow) {
    return null;
  }
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        justifyContent:'flex-start',
        alignItems:'center',
        width: Constants.WINDOW_WIDTH,
        height: Constants.WINDOW_HEIGHT,
        backgroundColor: "#0000",
        zIndex: 9999999,
        paddingHorizontal:20,
      }}
    >
      <View
        style={{
          backgroundColor:'#000a',
          marginTop: 200,
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{color:Constants.white, fontSize:15}}>{msg}</Text>
      </View>
    </View>
  );
};

Toast.propTypes = {
  isShow: PropTypes.bool,
  msg: PropTypes.string,
};

Toast.defaultProps = {
  isShow: false,
  msg: "포토스터",
};

export default Toast;

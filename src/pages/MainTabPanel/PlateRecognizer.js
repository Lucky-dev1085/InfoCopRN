// if you want to contact with me, 
// use skype

//my skype id is live:6873665ab5a941b4


import React, { useState } from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Constants from '../../utils/Constants';
import Camera, {
  Aspect,
  CaptureQuality,
  TorchMode,
} from 'react-native-openalpr';
import Icon from 'react-native-vector-icons/AntDesign';

const IconClose = <Icon name="close" size={24} color="white" />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
      flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

const PlateRecognizer: () => React$Node = props => {

  const onPlateRecognized = ({plate, confidence}) => {
    props.route.params.onGoBack(plate);
    props.navigation.goBack();
  };

  return (
    <>
    <View style={styles.container}>
      <Camera
        style={styles.preview}
        aspect={Aspect.fill}
        captureQuality={CaptureQuality.medium}
        country="us"
        onPlateRecognized={onPlateRecognized}
        plateOutlineColor="#ff0000"
        showPlateOutline
        zoom={0}
        torchMode={TorchMode.off}
        touchToFocus
      />
      <View style={[styles.overlay]}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 10,
            top: 20,
            width: 40,
            height: 40,
          }}
          onPress={() => {
            props.navigation.goBack();
          }}>
          {IconClose}
        </TouchableOpacity>
        <View style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: "center",
          opacity: 0,
        }}>
          <TouchableOpacity
          disabled
          style={{
            width: 100,
            height: 50,
            backgroundColor: Constants.blackTrans,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
            borderWidth:0.8,
            borderColor:'white',
          }}>
            <Text style={{fontSize: 18, color: "white"}}>{"Done"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </>
  );
};

export default PlateRecognizer;
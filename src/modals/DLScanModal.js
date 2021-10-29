import React, {useEffect, useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
  useWindowDimensions,
  Animated,
  BackHandler,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../utils/Constants';
import HeaderBar, {DotsIcon, MenuIcon, BackIcon} from '../components/HeaderBar';

import SettingsModal from './SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';
// import {BarCodeScanner} from 'expo-barcode-scanner';

import BarcodeScanner from '@paraboly/react-native-barcode-scanner';

const IconClose = <Icon name="close" size={24} color="white" />;
const IconCheck = <Icon name="check" size={24} color="white" />;


const DLBarCodeRateWH = 1896/534

export default function DLScanModal({isShow, onTapClose, onResult}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (isShow == true) {
      setScanned(false);
    }
  }, [isShow]);

  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({type, data}) => {
    setScanned(true);
    if (onResult) {
      try {
        console.log(
          'LINE  46 > DLScanModal > handleBarCodeScanned: ',
          type,
          data,
        );
        let OLN = '';
        let OLS = '';
        let indexOfOLN = data.indexOf('1ZF');
        console.log('indexOfOLN >> ', indexOfOLN);
        if (indexOfOLN != -1) {
          let indexOfReturn = data.indexOf('\n', indexOfOLN);
          console.log('indexOfOLN >> indexOfReturn >  ', indexOfReturn);
          OLN = data.substring(indexOfOLN + 3, indexOfReturn);
        }

        let indexOfOLS = data.indexOf('DAJ');
        if (indexOfOLS != -1) {
          let indexOfReturn = data.indexOf('\n', indexOfOLS);
          console.log('indexOfOLS >> indexOfReturn >  ', indexOfReturn);
          OLS = data.substring(indexOfOLS + 3, indexOfReturn);
        }
        OLN = OLN.trim();
        OLS = OLS.trim();

        console.log('OLN > ', OLN);
        console.log('OLS > ', OLS);

        onResult(OLN, OLS);
      } catch (ex) {
        Alert.alert(
          'InfoCop',
          'Some errors are occurred while processing scan result. Please try again.',
        );
        setScanned(false);
      }
    }
  };

  if (hasPermission === null) {
    return (
      <Text style={{color: 'white'}}>Requesting for camera permission</Text>
    );
  }
  if (hasPermission === false) {
    return <Text style={{color: 'white'}}>No access to camera</Text>;
  }

  return (
    <Modal animationType="fade" transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          backgroundColor: Constants.blackTrans,
        }}>
        <View
          style={{
            flex: 1,
            width: Constants.WINDOW_WIDTH,
            height: Constants.WINDOW_HEIGHT,
            borderColor:'blue',
            borderWidth:1,
          }}>
          <BarCodeScanner
            barCodeTypes={[
              BarCodeScanner.Constants.BarCodeType.pdf417,
              BarCodeScanner.Constants.BarCodeType.qr,
              BarCodeScanner.Constants.BarCodeType.ean8,
              BarCodeScanner.Constants.BarCodeType.ean13,
            ]}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          >
            <View style={{
              borderColor:'red',
              borderWidth:1,
              width: Constants.WINDOW_WIDTH * 0.7,              
              height: Constants.WINDOW_WIDTH * 0.7 / DLBarCodeRateWH
            }}>
            </View>
          </BarCodeScanner>

          {/* <BarcodeScanner
            style={{
              width: Constants.WINDOW_WIDTH,
              height: Constants.WINDOW_HEIGHT,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onBarcodeRecognized={(event)=>{
              console.log('event >>> ', JSON.stringify(event, null, 4))
              Alert.alert('', JSON.stringify(event))
            }}
            >
            <View
              style={{
                width: 100,
                height: 50,
                borderColor: 'red',
                borderWidth: 1,
              }}></View>
          </BarcodeScanner> */}

          {scanned && (
            <TouchableOpacity
              title={'Tap to Scan Again'}
              onPress={() => setScanned(false)}
            />
          )}
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: 10,
          }}
          onPress={() => {
            if (onTapClose) {
              onTapClose();
            }
          }}>
          {IconClose}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.white,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  imgGradBack: {
    resizeMode: 'cover',
    padding: 20,
    alignItems: 'stretch',
  },
  InputText: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: Constants.white,
    marginVertical: 5,
    fontSize: 15,
  },
  labelText: {
    fontSize: 14,
    color: 'white',
    marginVertical: 10,
  },
  btnText: {
    fontSize: 16,
    color: 'white',
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mainButton: {
    height: 45,
    borderRadius: 25,
    backgroundColor: Constants.blackTrans,
    borderWidth: 1,
    borderColor: 'white',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

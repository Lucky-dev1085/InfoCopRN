import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from '../../utils/Constants';
import { DotsIcon, MenuIcon, BackIcon } from '../../components/HeaderBar';

import SettingsModal from '../../modals/SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';
import { TextInput } from 'react-native-gesture-handler';
import ReqPanel from './ReqPanel';

import PickerModal from '../../components/PickerModal';
import SharedUtility from '../../utils/SharedUtility';
import API_Manager from '../../utils/API_Manager';

import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { PlateRunResModel } from '../../utils/models';
import { color } from 'react-native-reanimated';
import { WebView } from 'react-native-webview';

const IconClose = <Icon name="close" size={24} color="white" />;
const IconEdit = <Icon name="edit" size={24} color="white" />;
const IconCopy = <Icon name="copy1" size={24} color="white" />;

const DefImage = require('../../../assets/images/defaultimg.png');

class ResponseView extends React.Component {
  apiManager = new API_Manager();

  constructor(props) {
    super(props);

    this.state = {
      resObj: props.resObj,
    };

    // resobj :  imgPhoto: null,
    // tvKey: null,
    // tvResp: null,
    // webViewPercentMatch: null,
    // webViewRes: null,
  }

  componentDidMount() { }

  getCurrentLocation = () => {
    return new Promise(async (resolve, reject) => {
      let hasLocationPermission = false;
      try {
        let result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            hasLocationPermission = true;
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }

        let resultCoarse = await check(
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        );
        switch (resultCoarse) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            hasLocationPermission = true;
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      } catch (error) { }

      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            resolve(position);
          },
          (error) => {
            console.log('getCurrentPosition : error: ', error);
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        Alert.alert(
          'InfoCop',
          'It is needed to allow location permission to get your current location.',
        );
        resolve(null);
      }
    });
  };

  render() {
    // const {resObj} = this.state;
    // console.log('LINE 121 ->  ResponseView : ', resObj);

    return (
        <View style={styles.container}>
          {this.props.resObj != null && <View style={{flex: 1, alignItems: "stretch"}}>
            <View
              style={{
                flexDirection: 'row',
                width: Constants.WINDOW_WIDTH * 0.9,
              }}>
              <Image
                source={this.props.resObj?.imgPhoto || DefImage}
                style={{
                  width: Constants.WINDOW_WIDTH * 0.3,
                  height: Constants.WINDOW_WIDTH * 0.3,
                  resizeMode: 'cover',
                }}
              />
              {/* <Text
                style={{
                  width: Constants.WINDOW_WIDTH * 0.6,

                  padding: 10,
                  color: 'white',

                }}>

                {this.props.resObj?.tvKey}

              </Text> */}
              <WebView
              style={{
                width: Constants.WINDOW_WIDTH * 0.6,
                backgroundColor: '#00000000',
                padding: 10,
                // color: 'white',

              }}
              pointerEvents = 'none'
                source={{
                  html: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>' + this.props.resObj?.tvKey + '</p></body></html>'
                }}
              />
            </View>

            <Text
              style={{
                width: Constants.WINDOW_WIDTH * 0.9,
                color: 'white',
                paddingVertical: 10,

              }}>
              {this.props.resObj?.tvResp}
            </Text>

            {/* {this.props.resObj?.webViewPercentMatch && (
              <View style={{flex: 1}}>
              <WebView
                source={{
                  html: this.props.resObj?.webViewPercentMatch.html,
                  baseUrl: this.props.resObj?.webViewPercentMatch.baseUrl,
                }}
              />
              </View>
            )} */}
            {this.props.resObj?.webViewRes && (
              <View style={{flex: 1}}>
              <WebView
                source={{
                  html: this.props.resObj?.webViewRes.html,
                  baseUrl: this.props.resObj?.webViewRes.baseUrl,
                }}
              />
              </View>
            )}

          </View>}
        </View>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  const route = useRoute();
  return <ResponseView {...props} navigation={navigation} route={route} />;
}

const styles = StyleSheet.create({
  container: {
    width: Constants.WINDOW_WIDTH * 0.9,
    alignItems: 'stretch',
    paddingTop: 10,
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: 'white',
  },
  mainBtn: {
    backgroundColor: Constants.blackTrans,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
  InputText: {
    height: 40,
    color: 'white',
    backgroundColor: Constants.transparent,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
    fontSize: 15,
  },

  mainBtnTitle: {
    color: Constants.white,
    fontSize: 18,
  },
});

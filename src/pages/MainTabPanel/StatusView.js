import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import PickerModal from '../../components/PickerModal';
import API_Manager from '../../utils/API_Manager';

import Geolocation from 'react-native-geolocation-service';
import {
  check,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';

const IconDownArrow = <Icon name="caretdown" size={15} color="white" />;

class StatusView extends React.Component {
  apiManager = new API_Manager();
  _RIN = '';
  GlblDMVResp = null; //PlateRunRes_DMVRspModel

  NTS = '';
  CSN = '';

  constructor(props) {
    super(props);
    this.apiManager = new API_Manager();
    this.state = {
      userId: '',
      unit: '',
      zone: '',
      time: '',
      status: '',

      isShowStatus: false
    };
  }

  componentDidMount() {
    showPageLoader(true);
    this.apiManager.GetUserStatus((response) => {
      showPageLoader(false);
      // alert(JSON.stringify(response))
      if (response != null && response.length > 0 && response[0].UserID != null) {
        let _response = response[0];
        this.setState({
          userId: _response.UserID == '' ? 'NA' : _response.UserID,
          unit: _response.Unit == '' ? 'NA' : _response.Unit,
          zone: _response.Zone == '' ? 'NA' : _response.Zone,
          time: _response.Time == '' ? 'NA' : _response.Time,
          status: _response.Status == '' ? 'NA' : _response.Status,
        });
      }
    });
  }

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
      } catch (error) {}

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
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        Alert.alert('Location Error', 'It is needed to get location, please allow and try again.', [
          {
            text:'Cancel',
            style:'cancel'
          },
          {
            text:'Ok',
            style:'default',
            onPress:()=>{
              if (Platform.OS == 'ios') {        

                requestMultiple([            
                  PERMISSIONS.IOS.LOCATION_ALWAYS
                ]).then((statues) => {
                  console.log('PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION: >> ', statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]);
                  
                });
              } else {
              
      
                requestMultiple([            
                  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
                ]).then((statues) => {
                  console.log('PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION: >> ', statues[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
                  console.log('PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION: >> ', statues[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]);
                  
                });
              }
            }

          },
          
        ])
       
        resolve(null);
      }
    });
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.label}>USER STATUS</Text>
          <View style={styles.line} />
          <View style={styles.subContainer}>
            <Text style={styles.label}>USERID</Text>
            <Text style={styles.labelValue}>{this.state.userId}</Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.label}>UNIT</Text>
            <Text style={styles.labelValue}>{this.state.unit}</Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.label}>ZONE IN</Text>
            <Text style={styles.labelValue}>{this.state.zone}</Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.label}>TIME</Text>
            <Text style={styles.labelValue}>{this.state.time}</Text>
          </View>
          <View style={styles.subContainer}>
            <Text style={styles.label}>STATUS</Text>
            <TouchableOpacity 
            style = {{
              width: 200,
              height: 32,
              borderBottomColor: "white",
              borderBottomWidth: 1,
            }}
            onPress = {() => {
              this.setState({isShowStatus: true});
            }}>
            <Text style={styles.labelValue}>{this.state.status}</Text>
            <View style={{position: 'absolute', right: 5, top: 5}}>
              {IconDownArrow}
            </View>
            </TouchableOpacity>
          </View>


        <PickerModal
          pickList={['ENROUTE', 'ARRIVED', 'AVAILABLE', 'BREAK', 'VEHICLE STOP', 'ASSIST']}
          selectedIndex={0}
          onTapSelect={async (index, val) => {
            this.setState({
              status: val,
              isShowStatus: false,
            });
            showPageLoader(true);
            let position = await this.getCurrentLocation();
            if (position != null) {
              this.apiManager.UpdateUserStatus(val + '', this.state.zone, position.coords.latitude + '' + position.coords.longitude, (response) => {
                showPageLoader(false);
              });
            } else {
              Alert.alert("Cannot update your status, please try again");
            }
          }}
          onTapClose={() => {
            this.setState({isShowStatus: false});
          }}
          isShow={this.state.isShowStatus}
        />

        </View>
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  const route = useRoute();
  return <StatusView {...props} navigation={navigation} route={route} />;
}

const styles = StyleSheet.create({
  container: {
    width: Constants.WINDOW_WIDTH * 0.9,
    alignItems: 'stretch',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  subContainer: {
    flexDirection: 'row',
    height: 50,
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    width: 120,
  },
  labelValue: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../../utils/Constants';
import {DotsIcon, MenuIcon, BackIcon} from '../../components/HeaderBar';

import SettingsModal from '../../modals/SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  ForceTouchGestureHandler,
  ScrollView,
  TextInput,
} from 'react-native-gesture-handler';
import ReqPanel from './ReqPanel';

import PickerModal from '../../components/PickerModal';
import SharedUtility from '../../utils/SharedUtility';
import API_Manager from '../../utils/API_Manager';
import WebView from 'react-native-webview';
import { Keyboard } from 'react-native';

class HAZMATView extends React.Component {
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

      searchText: '',
      data: '',
    };
  }

  componentDidMount() {
    // showPageLoader(true);
    // this.apiManager.GetHazmat('2018', (response) => {
    //   showPageLoader(false);
    //   alert(JSON.stringify(response))
    //   // if (response != null && response.length > 0 && response[0].UserID != null) {
    //   //   let _response = response[0];
    //   //   this.setState({
    //   //     userId: _response.UserID == '' ? 'NA' : _response.UserID,
    //   //     unit: _response.Unit == '' ? 'NA' : _response.Unit,
    //   //     zone: _response.Zone == '' ? 'NA' : _response.Zone,
    //   //     time: _response.Time == '' ? 'NA' : _response.Time,
    //   //     status: _response.Status == '' ? 'NA' : _response.Status,
    //   //   });
    //   // }
    // });
  }

  getHazmat = () => {
    showPageLoader(true);
    Keyboard.dismiss()
    this.apiManager.GetHazmat(this.state.searchText + '', (response) => {
      showPageLoader(false);
      //   alert(JSON.stringify(response))

      this.setState({
        data: JSON.stringify(response)
      });

      // if (response != null && response.length > 0 && response[0].UserID != null) {
      //   let _response = response[0];
      //   this.setState({
      //     userId: _response.UserID == '' ? 'NA' : _response.UserID,
      //     unit: _response.Unit == '' ? 'NA' : _response.Unit,
      //     zone: _response.Zone == '' ? 'NA' : _response.Zone,
      //     time: _response.Time == '' ? 'NA' : _response.Time,
      //     status: _response.Status == '' ? 'NA' : _response.Status,
      //   });
      // }
    });
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.label}>Info Cop Mobile</Text>
          <View
            style={{
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                height: 35,
                flex: 1,
                backgroundColor: 'white',
                paddingHorizontal: 15,
                paddingVertical: 0,
              }}
              placeholder="Search"
              value={this.state.searchText}
              onChangeText={(value) => {
                this.setState({
                  searchText: value,
                });
              }}
            />
            <TouchableOpacity
              style={{
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                if (this.state.searchText == '') {
                  alert('Please enter text');
                } else {
                  this.getHazmat();
                }
              }}>
              <Text
                style={{
                  marginHorizontal: 10,
                  color: 'white',
                }}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
            }}>
            {/* <ScrollView
              style={{
                flex: 1,
                backgroundColor: 'white',
              }}> */}
              <WebView style = {{
                  padding: 10,
                  flex: 1,
                  height: '100%',
                  width: '100%'
              }}
              source = {{ html: this.state.data }} />
              {/* <Text
                style={{
                  padding: 10,
                  flex: 1,
                }}>
                {this.state.data}
              </Text> */}
            {/* </ScrollView> */}
          </View>
        </View>
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  const route = useRoute();
  return <HAZMATView {...props} navigation={navigation} route={route} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: Constants.WINDOW_WIDTH * 0.9,
    width: '100%',
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

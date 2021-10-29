import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from '../../utils/Constants';
import { DotsIcon, MenuIcon, BackIcon } from '../../components/HeaderBar';

import SettingsModal from '../../modals/SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  ForceTouchGestureHandler,
  TextInput,
} from 'react-native-gesture-handler';
import ReqPanel from './ReqPanel';

import PickerModal from '../../components/PickerModal';
import SharedUtility from '../../utils/SharedUtility';
import API_Manager from '../../utils/API_Manager';

class LicenceResultView extends React.Component {
  apiManager = new API_Manager();

  constructor(props) {
    super(props);
    this.apiManager = new API_Manager();
    this.state = {
      image: props.licenceImage,
      value: props.licenceValue,
      // zone: '',
      // time: '',
      // status: '',
    };
  }

  componentDidMount() {
    // showPageLoader(true);
    // this.apiManager.GetUserStatus((response) => {
    //   showPageLoader(false);
    //   // alert(JSON.stringify(response))
    //   if (response != null && response.length > 0 && response[0].UserID != null) {
    //     let _response = response[0];
    //     this.setState({
    //       userId: _response.UserID == '' ? 'NA' : _response.UserID,
    //       unit: _response.Unit == '' ? 'NA' : _response.Unit,
    //       zone: _response.Zone == '' ? 'NA' : _response.Zone,
    //       time: _response.Time == '' ? 'NA' : _response.Time,
    //       status: _response.Status == '' ? 'NA' : _response.Status,
    //     });
    //   }
    // });
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <View style={{
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'row'
          }}>
            <View style = {{
              height: 35,
              flex: 1
            }} 
            onPress = {() => {
              this.props.closeLicenceView()
            }} >
              <Text style = {{
                color: 'white'
              }}>Data</Text>
            </View>
            <TouchableOpacity style = {{
              height: 35,
              // width: 70
              marginRight: 10
            }} 
            onPress = {() => {
              this.props.closeLicenceView()
            }} >
              <Text style = {{
                color: 'white'
              }}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
          <View style={styles.subContainer}>
            {/* <Text style={styles.label}>Value</Text> */}
            <Text style={styles.labelValue}>{this.state.value}</Text>
          </View>
          <Image style={{
            width: '90%',
            height: 180,
            resizeMode: 'contain',
            marginBottom: 20,
            marginTop: 20
          }}
            source={{ uri: 'file://' + this.state.image }} />
        </View>
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  const route = useRoute();
  return <LicenceResultView {...props} navigation={navigation} route={route} />;
}

const styles = StyleSheet.create({
  container: {
    width: Constants.WINDOW_WIDTH,
    height: Constants.WINDOW_HEIGHT,
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
    width: 80,
    height: 50
  },
  labelValue: {
    fontSize: 14,
    width: '70%',
    fontWeight: '600',
    color: 'white',
  },
});

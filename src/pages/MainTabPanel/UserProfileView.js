import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  ToastAndroid,
  AlertIOS
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from '../../utils/Constants';
import { DotsIcon, MenuIcon, BackIcon } from '../../components/HeaderBar';
import MaskInput, { Masks } from 'react-native-mask-input';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

import {
  ScrollView,
  TextInput,
} from 'react-native-gesture-handler';
import ReqPanel from './ReqPanel';

import SharedUtility from '../../utils/SharedUtility';
import API_Manager from '../../utils/API_Manager';

import Utils from '../../utils/Utils';
import InputModal from '../../components/InputModal';

class UserProfileView extends React.Component {

  apiManager = new API_Manager();

  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      department: '',
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      errEmail: '',
      errPhone: ''
    };


  }

  componentDidMount() {
    this.GetUserProfile();
  }

  GetUserProfile = () => {
    showPageLoader(true);
    const { initDataAAVC } = this.props;
    if (initDataAAVC == null) {
      this.props.onCancel();
      return;
    }

    let params = {
      'EmpID': initDataAAVC.UID,
      'DeviceCodeName': 'TESTKM6',
      'Dept': 'DEMO',
      'CallType': '8',
      // 'CurrentPassword': this.state.password + '',
      // 'CurrentPIN': this.PIN + ''
    }

    console.log("getuserprofile ------ ", params);

    this.apiManager.GetUserProfile(params, (response) => {
      showPageLoader(false);

      if (response.Result) {
        this.setState({
          userId: response.EmpID,
          department: response.Dept,
          firstName: response.FirstName,
          lastName: response.LastName,
          middleName: response.MiddleName,
          email: response.EmailID,
          phone: response.CellPhone
        })
      } else {
        this.props.onCancel();
        return;
      }
    })
  };

  emailValidation() {
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!this.state.email || regex.test(this.state.email) === false) {
      this.setState({
        errEmail: "Email is not valid"
      });
      return false;
    }
    return true;
  }

  phoneValidation = () => {
    if (!this.state.phone || this.state.phone.length != 12) {
      this.setState({
        errPhone: "Phone Number is not valid"
      });
      return false;
    }
    return true;
  }

  isValidAllFields = () => {

    const { firstName, lastName, middleName } = this.state;
    if (!firstName || !lastName || !middleName) {
      Alert.alert('Mandatory fields are missing', 'Please enter first name, last name, dob, sex, plate state');
      return false;
    }

    return true;
  };

  onSaveProfile = async () => {
    if (!this.emailValidation() && !this.phoneValidation()) {
      return;
    }

    showPageLoader(true);

    const { initDataAAVC } = this.props;
    if (initDataAAVC == null) {
      this.props.onCancel();
      return;
    }

    let params = {
      'EmpID': initDataAAVC.UID,
      'DeviceCodeName': 'TESTKM6',
      'Dept': 'DEMO',
      'CallType': '9',
      'FirstName': this.state.firstName,
      'MiddleName': this.state.middleName,
      'LastName': this.state.lastName,
      'EmailID': this.state.email,
      'CellPhone': this.state.phone
    }

    console.log("saveuserprofile ------ ", params);

    this.apiManager.SaveUserProfile(params, (response) => {
      showPageLoader(false);

      if (response.Result) {
        if (Platform.OS === 'android') {
          ToastAndroid.show("User Profile Saved.", ToastAndroid.SHORT)
        } else {
          AlertIOS.alert("User Profile Saved.");
        }

        this.props.onMoveToResponse(response);
      } else {
        Alert.alert(
          JSON.stringify(response),
          '',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]
        );
        return;
      }
    })
  };

  onCancel = () => {
    this.setState({
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: ''
    });

    this.props.onCancel();
  };

  render() {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.container}>
          <View style={styles.disableContainer}>
            <Text style={styles.label}>User ID</Text>
            <Text style={styles.label}>{this.state.userId}</Text>
          </View>
          <View style={styles.disableContainer}>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.label}>{this.state.department}</Text>
          </View>

          <Text style={styles.label}>First Name</Text>
          <TextInput
            ref={'fNameRef'}
            style={styles.InputText}
            value={this.state.firstName}
            keyboardType={'default'}
            autoCapitalize="characters"
            onChangeText={(text) => {
              this.setState({ firstName: text });
            }}
            placeholder={''}
            onSubmitEditing={() => { this.refs.mNameRef.focus() }}
          />
          <Text style={styles.label}>Middle Name</Text>
          <TextInput
            ref={'mNameRef'}
            style={styles.InputText}
            value={this.state.middleName}
            keyboardType={'default'}
            autoCapitalize="characters"
            onChangeText={(text) => {
              this.setState({ middleName: text });
            }}
            placeholder={''}
            onSubmitEditing={() => { this.refs.lNameRef.focus() }}
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            ref={'lNameRef'}
            style={styles.InputText}
            value={this.state.lastName}
            keyboardType={'default'}
            autoCapitalize="characters"
            onChangeText={(text) => {
              this.setState({ lastName: text });
            }}
            placeholder={''}
            onSubmitEditing={() => { this.refs.emailRef.focus() }}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            ref={'emailRef'}
            style={styles.InputText}
            value={this.state.email}
            keyboardType={'default'}
            autoCapitalize="characters"
            onChangeText={(text) => {
              this.setState({ email: text });
            }}
            placeholder={''}
            onSubmitEditing={() => { this.refs.phoneRef.focus() }}
          />
          {(this.state.errEmail != '') && (
            <Text style={styles.errText}>{this.state.errEmail}</Text>
          )}

          <Text style={styles.label}>Phone</Text>
          {/* <PhoneInput
            ref={'phoneRef'}
            style={styles.InputText}
            placeholder=""
            value={this.state.phone}
            onChange={(text) => {
              this.setState({ phone: text })
            }}
            error={this.state.phone ? (isValidPhoneNumber(this.state.phone) ? undefined : 'Invalid phone number') : 'Phone number required'} /> */}
          {/* <TextInput
            ref={'phoneRef'}
            style={styles.InputText}
            value={this.state.phone}
            keyboardType={'default'}
            autoCapitalize="characters"
            onChangeText={(text) => {
              this.setState({ phone: text });
            }}
            placeholder={''}
            onSubmitEditing={() => { }}
          /> */}
          <MaskInput
            ref={'phoneRef'}
            value={this.state.phone}
            placeholder={""}
            placeholderTextColor={"white"}
            style={styles.InputText}
            onChangeText={(masked, unmasked, obfuscated) => {
              console.log(masked, unmasked);
              this.setState({ phone: unmasked });
            }}
            keyboardType={"number-pad"}
            mask={[
              /\d/, // that's because I want it to be a digit (0-9)
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ]} />
          {(this.state.errPhone != '') && (
            <Text style={styles.errText}>{this.state.errPhone}</Text>
          )}

          <TouchableOpacity style={styles.mainBtn} onPress={() => { this.onSaveProfile(); }}>
            <Text style={styles.mainBtnTitle}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainBtn} onPress={() => { this.onCancel(); }}>
            <Text style={styles.mainBtnTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  const route = useRoute();
  return <UserProfileView {...props} navigation={navigation} route={route} />;
}

const styles = StyleSheet.create({
  container: {
    width: Constants.WINDOW_WIDTH * 0.9,
    marginLeft: Constants.WINDOW_WIDTH * 0.05,
    alignItems: 'stretch',
    paddingTop: 20
  },
  disableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  label: {
    fontSize: 13,
    color: 'white',
    marginTop: 5,
  },
  errText: {
    fontSize: 12,
    color: 'red'
  },
  mainBtn: {
    backgroundColor: Constants.blackTrans,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
    borderWidth: 0.8,
    borderColor: 'white',
  },
  mainBtnTitle: {
    color: Constants.white,
    fontSize: 18,
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
  dobContainer: {
    flexDirection: 'row',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  dobInput: {
    flex: 1,
    color: 'white',
    backgroundColor: Constants.transparent,
    fontSize: 15,
  },
});

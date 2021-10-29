import React from 'react';
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

import SettingsModal from '../modals/SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';

const IconClose = <Icon name="close" size={24} color="white" />;
const IconCheck = <Icon name="check" size={24} color="white" />;

export default class DisclaimerModal extends React.Component {

constructor(props){
    super(props)

}

  render() {
      const { showDisclaimerModal, onTapClose} = this.props
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDisclaimerModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: Constants.darkBlue,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 0,
            paddingBottom: 50,
            paddingHorizontal: 0,
            elevation: 5,
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.2,
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: Constants.blackTrans,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 15}}>
              **** WARNING ****
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                marginTop: 20,
                textAlign: 'center',
              }}>
              BY ACCESSING AND USING THIS RESTRICTED GOVERNMENT COMPUTER SYSTEM
              YOU ARE CONSENTING TO SYSTEM MONITORING FOR LAW ENFORCEMENT AND
              OTHER PURPOSES, UNAUTHORIZED USE OF. OR ACCESS TO THIS DEVICE MAY
              SUBJECT YOU TO CRIMINAL PROSECUTION AND PENALTIES
            </Text>
            <TouchableOpacity
              style={{
                width: Constants.WINDOW_WIDTH * 0.6,
               ...styles.mainButton
              }}
              onPress={() => {
                  if(onTapClose){
                    onTapClose();
                  }
         
              }}>
              <Text style={styles.btnText}> I Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
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
      borderRadius:20,
      paddingHorizontal:10,
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
    mainButton:{
      height: 45,
      borderRadius: 25,
      backgroundColor: Constants.blackTrans,
      borderWidth:1,
      borderColor:'white',
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });
  
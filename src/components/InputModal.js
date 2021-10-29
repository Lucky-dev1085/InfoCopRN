import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {BallIndicator} from 'react-native-indicators';
import PropTypes from 'prop-types';
import Constants from '../utils/Constants';

import Icon from 'react-native-vector-icons/AntDesign';
import {FlatList} from 'react-native-gesture-handler';

const WINDOW_WIDTH = Dimensions.get('window').width;

const IconClose = <Icon name="close" size={24} color={Constants.lightBlue} />;
const IconEdit = <Icon name="edit" size={24} color="white" />;
const IconCopy = <Icon name="copy1" size={24} color="white" />;

const InputModal = ({defVal, onTapOk, onTapClose, title, isShow = false}) => {
  const [val, setVal] = useState(defVal);

  if (!isShow) {
    return null;
  }

  return (
    <Modal animationType={'fade'} transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: Constants.WINDOW_WIDTH,
          height: Constants.WINDOW_HEIGHT,
          backgroundColor: 'rgba(13,13,13,0.4)',
        }}>
        <View
          style={{
            width: Constants.WINDOW_WIDTH * 0.85,
            paddingVertical:10,
            backgroundColor: 'white',
            zIndex: 9999999,
            borderRadius: 10,
            paddingHorizontal: 20,
            alignItems: 'stretch',
            justifyContent:'center'
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 10,
              right: 0,
              width: 40,
              height: 40,
            }}
            onPress={() => {
              onTapClose();
            }}>
            {IconClose}
          </TouchableOpacity>
          <Text style={styles.label}>{title}</Text>
          <TextInput
            style={styles.InputText}
            value={val}
            onChangeText={(text) => {
              setVal(text);
            }}
            placeholder={''}
            onSubmitEditing={() => {
              onTapOk(val);
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginVertical:5,
            }}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                onTapClose();
              }}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => {
                onTapOk(val);
                
              }}>
              <Text style={styles.btnLabel}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// PickerModal.propTypes = {
//   isPageLoader: PropTypes.bool,
// };

// PickerModal.defaultProps = {
//   isPageLoader: false,
// };

export default InputModal;

const styles = StyleSheet.create({
  container: {
    width: Constants.WINDOW_WIDTH * 0.9,
    alignItems: 'stretch',
    paddingTop: 10,
  },
  label: {
    fontSize: 13,
    color: Constants.lightBlue,
    marginTop: 5,
  },
  btnLabel: {
    fontSize: 13,
    color: Constants.lightBlue,
  },
  cancelLabel: {
    fontSize: 13,
    color: 'gray',
  },
  mainButton: {
    backgroundColor: Constants.transparent,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Constants.lightBlue,
    marginLeft: 10,
    width: 100,
  },
  cancelButton: {
    backgroundColor: Constants.transparent,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 100,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'gray',
  },
  InputText: {
    height: 40,    
    color:'black',
    backgroundColor: Constants.transparent,
    borderBottomColor: 'gray',
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

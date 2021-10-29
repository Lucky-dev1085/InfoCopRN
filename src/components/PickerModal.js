import React from 'react';
import {
  StyleSheet,
  Text,
  View,
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

const IconClose = <Icon name="close" size={24} color="white" />;
const IconEdit = <Icon name="edit" size={24} color="white" />;
const IconCopy = <Icon name="copy1" size={24} color="white" />;

const PickerModal = ({
  pickList,
  selectedIndex,
  onTapSelect,
  onTapClose,
  isShow = false,
}) => {
  if (!isShow) {
    return null;
  }

  let data = [];
  pickList.forEach((one, index) => {
    data.push({id: index, val: one});
  });

  let height = data.length * 40;

  if(height > Constants.WINDOW_HEIGHT * 0.7){
    height = Constants.WINDOW_HEIGHT * 0.7
  }else{

  }

  return (
    <Modal 
      animationType={'fade'} 
      transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: Constants.WINDOW_WIDTH,
          height: Constants.WINDOW_HEIGHT,
          backgroundColor: 'rgba(13,13,13,0.4)',
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            width: 40,
            height: 40,
          }}
          onPress={() => {
            onTapClose();
          }}>
          {IconClose}
        </TouchableOpacity>
        <View
          style={{
            width: Constants.WINDOW_WIDTH * 0.7,
            height: height,
            backgroundColor: 'white',
            zIndex: 9999999,
            borderRadius:10,
            
          }}>
          <FlatList
            style={{flex:1}}
            data={data}
            renderItem={({item, index, sep}) => {
              return (
                <TouchableOpacity
                  style={{    
                    width: '90%',
                    height: 40,
                    alignSelf:'center',
                    justifyContent: 'center',
                    alignItems:'center',
                    borderBottomWidth:0.4,
                    borderBottomColor:'gray',
                  
                  }}
                  onPress={()=>{
                      onTapSelect(index, item.val)
                  }}
                  >
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign:'center'
                    }}>
                    {item.val}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => "key_"+item.id}
          />
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

export default PickerModal;

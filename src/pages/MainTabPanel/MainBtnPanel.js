import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../../utils/Constants';
import {DotsIcon, MenuIcon, BackIcon} from '../../components/HeaderBar';

import SettingsModal from '../../modals/SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';
import {FlatList} from 'react-native-gesture-handler';
import SharedUtility from '../../utils/SharedUtility';

const IconEdit = <Icon name="edit" size={24} color="white" />;
const IconCopy = <Icon name="copy1" size={24} color="white" />;

const IconCheck = <Icon name="check" size={15} color="white" />;


export const btnTitles = [
  'PLATE',
  'PLATE SCAN',
  'NAME',
  'VIN',
  'DL #',
  'DL SCAN',
  'HISTORY',
  // 'FACIAL',
  'STATUS',
  'HAZMAT',
  'User Profile',
  'Day/Night',
  'Reset Password'
];

export const imagesBtn = [
  {
    id: 0,
    src: require('../../../assets/images/circle_plate.png'),
    title: 'PLATE',
  },
  {
    id: 1,
    src: require('../../../assets/images/plate_reader.png'),
    title: 'PLATE SCAN',
  },
  {
    id: 2,
    src: require('../../../assets/images/circle_name.png'),
    title: 'NAME',
  },
  {id: 3, src: require('../../../assets/images/circle_vin.png'), title: 'VIN'},
  {id: 4, src: require('../../../assets/images/circle_dl.png'), title: 'DL #'},
  {
    id: 5,
    src: require('../../../assets/images/circle_dl_scan.png'),
    title: 'DL SCAN',
  },
  {
    id: 6,
    src: require('../../../assets/images/circle_history.png'),
    title: 'HISTORY',
  },
  // {
  //   id: 7,
  //   src: require('../../../assets/images/circle_facial.png'),
  //   title: 'FACIAL',
  // },
  {
    id: 8,
    src: require('../../../assets/images/circle_status.png'),
    title: 'STATUS',
  },
  {
    id: 9,
    src: require('../../../assets/images/circle_hazmat.png'),
    title: 'HAZMAT',
  },
  {
    id: 12,
    src: require('../../../assets/images/circle_user_profile.png'),
    title: 'User Profile',
  },
  {
    id: 10,
    src: require('../../../assets/images/circle_day.png'),
    title: 'Day/Night',
  },
  {
    id: 11,
    src: require('../../../assets/images/reset-password.png'),
    title: 'Reset Password',
  },
];

export default function MainBtnPanel({onTapButtonItem, onTapLock, defORI}) {

  const [isNJ, setIsNJ] = useState(defORI == "NJ" || !defORI)
  const [isNY, setIsNY] = useState(defORI == "NY")

  useEffect(() => {
    SharedUtility.ORI = isNJ ? "NJ" : "NY"    
    return () => {      
    }
  }, [isNJ, isNY])

  const renderItem = (item, index) => {
    const widthItem = (Constants.WINDOW_WIDTH - 80) / 3;
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 10,
        }}
        onPress={() => {
          onTapButtonItem(index, imagesBtn[index].title);
        }}>
        <Image
          style={{
            width: widthItem,
            height: widthItem,
            borderWidth: 2,
            borderColor: 'white',
            borderRadius: widthItem / 2,
            marginBottom: 5,
            resizeMode: 'cover',
          }}
          source={imagesBtn[index].src}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 15,
          }}>
          {btnTitles[index]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          height: 40,
          paddingHorizontal: 10,
          alignItems: 'center',
          backgroundColor: Constants.transparent,
          marginVertical: 10,
          borderBottomColor: Constants.lightBlue,
          borderBottomWidth: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 40,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity
            style={{width:70, flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              setIsNJ(true)
              setIsNY(false)
            }}>
            <View
              style={{
                borderColor: 'white',
                borderWidth: 1,
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              {isNJ ? IconCheck : null}
            </View>
            <Text style={styles.labelText}>NJ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width:70, flexDirection: 'row', alignItems: 'center', marginLeft:2}}
            onPress={() => {             
              setIsNJ(false)
              setIsNY(true)             
            }}>
            <View
              style={{
                borderColor: 'white',
                borderWidth: 1,
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              {isNY ? IconCheck : null}
            </View>
            <Text style={styles.labelText}>NY</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            right: 0,
            bottom: 5,
            justifyContent: 'flex-end',
          }}
          onPress={() => {
            onTapLock();
          }}>
          <Image
            source={require('../../../assets/images/padlock.png')}
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity> */}
      </View>

      <FlatList
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{alignItems: 'center'}}
        renderItem={({item, index, separators}) => {
          return renderItem(item, index);
        }}
        keyExtractor={(item) => {
          return item.id;
        }}
        numColumns={3}
        data={imagesBtn}
        style={{
          flex: 1,
        }}></FlatList>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Constants.WINDOW_WIDTH * 0.9,
    alignItems: 'stretch',
    paddingTop: 10,
  },
  mainBtn: {
    backgroundColor: Constants.blackTrans,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
  mainBtnTitle: {
    color: Constants.white,
    fontSize: 18,
  },
  labelText: {
    fontSize: 14,
    color: 'white',
    marginHorizontal: 2,
  },
});

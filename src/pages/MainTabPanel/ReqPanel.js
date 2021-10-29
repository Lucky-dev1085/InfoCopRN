import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../../utils/Constants';
import {DotsIcon, MenuIcon, BackIcon} from '../../components/HeaderBar';

import SettingsModal from '../../modals/SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';

const IconEdit = <Icon name="edit" size={24} color="white" />;
const IconCopy = <Icon name="copy1" size={24} color="white" />;


export default function ReqPanel({isHideRand, isHideFull, isHideClear, onTapFull, onTapRand, onTapClear}) {
  let navigation = useNavigation();
  let route = useRoute();

  return (
    <>
      <View style={styles.container}>
        {!isHideRand && (
          <TouchableOpacity style={styles.mainBtn} onPress={() => {onTapRand()}}>
            <Text style={styles.mainBtnTitle}>RANDOM</Text>
          </TouchableOpacity>
        )}
        {!isHideFull && (
          <TouchableOpacity style={styles.mainBtn} onPress={() => {onTapFull()}}>
            <Text style={styles.mainBtnTitle}>FULL</Text>
          </TouchableOpacity>
        )}
        {!isHideClear && (
          <TouchableOpacity style={styles.mainBtn} onPress={() => {onTapClear()}}>
            <Text style={styles.mainBtnTitle}>CLEAR</Text>
          </TouchableOpacity>
        )}
      </View>
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
    borderWidth:0.8,
    borderColor:'white',
  },
  mainBtnTitle: {
    color: Constants.white,
    fontSize: 18,
  },
});

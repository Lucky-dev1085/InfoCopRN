import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../../utils/Constants';

import SettingsModal from '../../modals/SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';

import PickerModal from '../../components/PickerModal';
import SharedUtility from '../../utils/SharedUtility';
import API_Manager from '../../utils/API_Manager';

const IconClose = <Icon name="close" size={24} color="white" />;
const IconEdit = <Icon name="edit" size={24} color="white" />;
const IconCopy = <Icon name="copy1" size={24} color="white" />;

class ALPRScanView extends React.Component {
  // apiManager = new API_Manager();

  constructor(props) {
    super(props);

    this.state = {
      plate: 'Scan a plate',
    };
  }

  componentDidMount() {}

  onPlateRecognized = ({plate, confidence}) => {
    this.setState({
      plate,
    });
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={{color: 'white', marginTop: 50, width: '90%'}}>
              Imense SDK will be integrated here. Waiting purchase license and
              sdk from Imense.com
            </Text>
          </View>
        </View>
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  const route = useRoute();
  return <ALPRScanView {...props} navigation={navigation} route={route} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
  },
  textContainer: {
    alignItems:'center',
    
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
});

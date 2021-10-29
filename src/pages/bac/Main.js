import React, {useState, useEffect} from 'react';
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
  Modal,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../utils/Constants';
import HeaderBar, {DotsIcon, MenuIcon, BackIcon} from '../components/HeaderBar';

import SettingsModal from '../modals/SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';
import GlobalUtil from '../utils/GlobalUtil';
import API_Manager from '../utils/API_Manager';

import MainSegBar from '../components/MainSegBar';
import VersionNumber from 'react-native-version-number';

import MainBtnPanel from './MainTabPanel/MainBtnPanel';
import PlateInputView from './MainTabPanel/PlateInputView';
import ResponseView from './MainTabPanel/ResponseView';
import ALPRScanView from './MainTabPanel/ALPRScanView';
import NameView from './MainTabPanel/NameView';
import VINView from './MainTabPanel/VINView';
import DLNumberView from './MainTabPanel/DLNumberView';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import StatusView from './MainTabPanel/StatusView';
import SharedUtility from '../utils/SharedUtility';
import AAVC from './AAVC';
import { AccountModel } from '../utils/models';

const IconEdit = <Icon name="edit" size={24} color="white" />;
const IconCopy = <Icon name="copy1" size={24} color="white" />;
const IconSetting = <Icon name="edit" size={24} color="white" />;

export function MainTopHeader({
  onTapLogo,
  onTapEdit,
  onTapCopy,
  onTapSettings,
  onTapMoreMenu,
  onTapLogOff,
}) {
  const [isShowMenu, setIsShowMenu] = useState(false);

  const onTapMenuItem = (index) => {
    if (index == 0) {
      onTapLogo();
    } else if (index == 1) {
      onTapLogOff();
    }
    setIsShowMenu(false);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        paddingLeft: 10,
        height: 50,
        backgroundColor: Constants.black,
      }}>
      <TouchableOpacity
        style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          onTapLogo();
        }}>
        <Image
          source={require('../../assets/images/startlogo.png')}
          style={{width: 40, height: 40, resizeMode: 'contain'}}
        />
        <View>
          <Text style={{color: 'white', fontSize: 18, marginLeft: 10}}>
            InfoCopMobile
          </Text>
          <Text style={{color: 'white', fontSize: 12, marginLeft: 14}}>
            {VersionNumber.appVersion} - {VersionNumber.buildVersion}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => {
            onTapEdit();
          }}
          style={{paddingHorizontal: 10, paddingVertical: 10}}>
          {IconEdit}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTapCopy();
          }}
          style={{paddingHorizontal: 10, paddingVertical: 10}}>
          {IconCopy}
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => {
              onTapSettings();
            }}
            style={{paddingHorizontal: 10, paddingVertical: 10}}>
          {IconSetting}
        </TouchableOpacity>
        <TouchableOpacity
          style={{paddingHorizontal: 10, paddingVertical: 10}}
          onPress={() => {
            // onTapMoreMenu();
            setIsShowMenu(true);
          }}>
          <DotsIcon color={'white'} size={24} />
        </TouchableOpacity>
      </View>

      <Modal animationType={'fade'} transparent={true} visible={isShowMenu}>
        <View
          style={{
            flex: 1,
            width: Constants.WINDOW_WIDTH,
            height: Constants.WINDOW_HEIGHT,
            backgroundColor: 'rgba(13,13,13,0.4)',
          }}>
          <TouchableOpacity
            style={{
              width: Constants.WINDOW_WIDTH,
              height: Constants.WINDOW_HEIGHT,
            }}
            onPress={() => {
              setIsShowMenu(false);
            }}></TouchableOpacity>

          <View
            style={{
              borderRadius: 10,
              position: 'absolute',
              right: 10,
              top: 40,
              backgroundColor: 'white',
              width: 150,
            }}>
            <TouchableOpacity
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 15,
              }}
              onPress={() => {
                onTapMenuItem(0);
              }}>
              <Text>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 15,
              }}
              onPress={() => {
                onTapMenuItem(1);
              }}>
              <Text>LogOff</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.apiManager = new API_Manager();
    this.state = {
      isShowSetting: false,

      curSelMainBtnIndex: -1,
      selTabIndex: 0,
      isShowMainBtnGroup: true,

      isShowPlateView: false,
      plateResObj: null,

      selMainBtnIndex: 0,

      appBrightness: 0.5,

      isShowAAVC: false,
      aavcAccountModel: null,

      initDataAAVC: null,
    };
  }

  componentDidMount() {
    this._backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (this.state.isShowMainBtnGroup == true) {
          // BackHandler.exitApp();
          // this.props.navigation.goBack()
          return true;
        } else {
          this.setState({
            isShowPlateView: false,
            isShowMainBtnGroup: true,
            selMainBtnIndex: 0,
            selTabIndex: 0,
            isShowSetting: false,
          });
          // backButtonPressedInMain = true;
          // if (!isIOS()) {
          //   console.log("will show toast");
          //   if (toastRef?.current) {
          //     console.log("process show toast");

          //     toastRef.current.show("앱을 종료하려면 한번 더 누르세요.");
          //     setTimeout(() => {
          //       backButtonPressedInMain = false;
          //     }, 3000);
          //   }
          // }
          return true;
        }
      },
    );
  }

  componentWillUnmount() {
    this._backHandler.remove();
  }

  logOff = async () => {
    showPageLoader(true);
    let res = await this.apiManager.CheckLogOff();

    showPageLoader(false);
    // if(res){
    this.props.navigation.goBack();
    // }
  };

  onTapMainBtnGroup = async (index, title) => {
    this.setState({
      curSelMainBtnIndex: index,
    });
    console.log('selected index :', index);
    if (index == 0) {
      this.actionPlate();
    } else if (index == 1) {
      this.actionScanALPR();
    } else if (index == 2) {
      this.actionName();
    } else if (index == 3) {
      this.actionVIN();
    } else if (index == 4) {
      this.actionDL();
    } else if (index == 8) {
      this.actionStatus();
    } else if (index == 10) {
      DeviceBrightness.setBrightnessLevel(
        this.state.appBrightness > 0.6 ? 0.2 : 1,
      );
      this.setState({
        appBrightness: this.state.appBrightness > 0.6 ? 0.1 : 1,
      });
    } else if (index == 11) {
      let _am = JSON.parse(await SharedUtility.getString('am'))
      let am = new AccountModel();
      am.Pin = _am.pin;
      am.Password = _am.pwd;
      am.UserID = _am.userId;

      let dict = JSON.parse(await SharedUtility.getString('dict'));
      this.setState(
        {
          aavcAccountModel: am,
          initDataAAVC: dict,
        },
        () => {
          this.setState({
            isShowAAVC: true,
          });
        },
      );
    }
  };

  actionPlate = () => {
    this.setState({
      selMainBtnIndex: 0,
      isShowPlateView: true,
      isShowMainBtnGroup: false,
    });
  };

  actionScanALPR = () => {
    this.setState({
      selMainBtnIndex: 1,
      isShowPlateView: false,
      isShowMainBtnGroup: false,
    });
  };

  actionName = () => {
    this.setState({
      selMainBtnIndex: 2,
      isShowPlateView: true,
      isShowMainBtnGroup: false,
    });
  };

  actionVIN = () => {
    this.setState({
      selMainBtnIndex: 3,
      isShowPlateView: true,
      isShowMainBtnGroup: false,
    });
  };

  actionDL = () => {
    this.setState({
      selMainBtnIndex: 4,
      isShowPlateView: true,
      isShowMainBtnGroup: false,
    });
  };

  actionStatus = () => {
    this.setState({
      selMainBtnIndex: 8,
      isShowPlateView: false,
      isShowMainBtnGroup: false,
    });
  };

  // isWhichView(curFirstTitle) {
  //   var titles = ['Plate Number', 'VIN', 'First Name', 'DL Number'];

  //   titles.forEach((one, index) => {
  //     if (curFirstTitle == one) {
  //       return index;
  //     }
  //   });

  //   return -1;
  // }

  // changeButtonLocation(both, isOnlyFull) {
  //   this.setState({
  //     isHideRand: !both && isOnlyFull,
  //     isHideFull: !both && !isOnlyFull,
  //     isHideClear: false,
  //   });
  // }

  render() {
    return (
      <>
        <KeyboardAvoidingView
          // enabled = {Platform.OS == 'ios'}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <MainTopHeader
            onTapEdit={() => {}}
            onTapCopy={() => {}}
            onTapSettings={() => {}}
            onTapLogOff={() => {
              this.logOff();
            }}
            onTapMoreMenu={() => {
              this.setState({
                isShowMainBtnGroup: true,
                isShowPlateView: false,
              });
            }}
            onTapLogo={() => {
              this.setState({
                isShowMainBtnGroup: true,
                isShowPlateView: false,
              });
            }}
          />
          <ImageBackground
            source={require('../../assets/images/bluebg.jpg')}
            style={{
              flex: 1,
              width: Constants.WINDOW_WIDTH,
              height: Constants.WINDOW_HEIGHT,
              resizeMode: 'cover',
              alignItems: 'stretch',
              paddingHorizontal: 0,
            }}>
            {this.state.isShowMainBtnGroup && (
              <MainBtnPanel
                onTapLock={() => {}}
                onTapButtonItem={this.onTapMainBtnGroup}
              />
            )}

            {this.state.isShowMainBtnGroup == false &&
              this.state.isShowPlateView == true && (
                <>
                  <MainSegBar
                    selIndex={this.state.selTabIndex}
                    onTapSeg={(index) => {
                      this.refs.scrollRef.scrollTo({
                        x: index * Constants.WINDOW_WIDTH,
                        y: 0,
                        animated: true,
                      });
                      this.setState({selTabIndex: index});
                    }}
                  />
                  <ScrollView
                    ref={'scrollRef'}
                    horizontal={true}
                    pagingEnabled={true}
                    onMomentumScrollEnd={(event) => {
                      console.log('onMomentumScrollEnd >> ', event.nativeEvent);
                      let e = event.nativeEvent;
                      let oneW = e.layoutMeasurement.width;
                      let xOffset = e.contentOffset.x;
                      let index = Math.round(xOffset / oneW);
                      this.setState({selTabIndex: index});
                    }}
                    keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={{alignItems: 'center'}}
                    style={{
                      flex: 1,
                    }}>
                    <View
                      style={{
                        width: Constants.WINDOW_WIDTH * 3,
                        height: '100%',
                        // borderColor:'white', borderWidth:1,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <View
                        style={{
                          width: Constants.WINDOW_WIDTH,
                          alignItems: 'center',
                        }}>
                        {this.state.selMainBtnIndex == 0 && (
                          <PlateInputView
                            onMoveToResponse={(resObj) => {
                              // resobj :  imgPhoto: null,
                              // tvKey: null,
                              // tvResp: null,
                              // webViewPercentMatch: null,
                              // webViewRes: null,
                              // TODO : 1. init response view with resObj:
                              //        2. moveTabBar to response view.

                              this.setState({
                                plateResObj: resObj,
                                selTabIndex: 1,
                              });
                              this.refs.scrollRef.scrollTo({
                                x: 1 * Constants.WINDOW_WIDTH,
                                y: 0,
                                animated: true,
                              });
                            }}
                          />
                        )}

                        {this.state.selMainBtnIndex == 2 && (
                          <NameView
                            onMoveToResponse={(resObj) => {
                              // resobj :  imgPhoto: null,
                              // tvKey: null,
                              // tvResp: null,
                              // webViewPercentMatch: null,
                              // webViewRes: null,
                              // TODO : 1. init response view with resObj:
                              //        2. moveTabBar to response view.

                              this.setState({
                                plateResObj: resObj,
                                selTabIndex: 1,
                              });
                              this.refs.scrollRef.scrollTo({
                                x: 1 * Constants.WINDOW_WIDTH,
                                y: 0,
                                animated: true,
                              });
                            }}
                          />
                        )}

                        {this.state.selMainBtnIndex == 3 && (
                          <VINView
                            onMoveToResponse={(resObj) => {
                              // resobj :  imgPhoto: null,
                              // tvKey: null,
                              // tvResp: null,
                              // webViewPercentMatch: null,
                              // webViewRes: null,
                              // TODO : 1. init response view with resObj:
                              //        2. moveTabBar to response view.

                              this.setState({
                                plateResObj: resObj,
                                selTabIndex: 1,
                              });
                              this.refs.scrollRef.scrollTo({
                                x: 1 * Constants.WINDOW_WIDTH,
                                y: 0,
                                animated: true,
                              });
                            }}
                          />
                        )}

                        {this.state.selMainBtnIndex == 4 && (
                          <DLNumberView
                            initDLNumber={''}
                            onMoveToResponse={(resObj) => {
                              // resobj :  imgPhoto: null,
                              // tvKey: null,
                              // tvResp: null,
                              // webViewPercentMatch: null,
                              // webViewRes: null,
                              // TODO : 1. init response view with resObj:
                              //        2. moveTabBar to response view.

                              this.setState({
                                plateResObj: resObj,
                                selTabIndex: 1,
                              });
                              this.refs.scrollRef.scrollTo({
                                x: 1 * Constants.WINDOW_WIDTH,
                                y: 0,
                                animated: true,
                              });
                            }}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          width: Constants.WINDOW_WIDTH,
                          alignItems: 'center',
                        }}>
                        <ResponseView resObj={this.state.plateResObj} />
                      </View>
                      <View
                        style={{
                          width: Constants.WINDOW_WIDTH,
                          alignItems: 'center',
                        }}></View>
                    </View>
                  </ScrollView>
                </>
              )}

            {this.state.selMainBtnIndex == 1 &&
              this.state.isShowMainBtnGroup == false && <ALPRScanView />}

            {this.state.selMainBtnIndex == 8 &&
              this.state.isShowMainBtnGroup == false && <StatusView />}
          </ImageBackground>
        </KeyboardAvoidingView>

        <SettingsModal
          isShow={this.state.isShowSetting}
          onTapClose={() => {
            this.setState({isShowSetting: false});
          }}
        />

        <AAVC
          isShow={this.state.isShowAAVC}
          isFromMain = {true}
          aavcAccountModel={this.state.aavcAccountModel}
          initDataAAVC={this.state.initDataAAVC}
          LoginCompletionEvent={(am) => {
            // this.gotoTouchRegisterPageFromAAVC(am);
            this.setState({
              isShowAAVC: false,
            });
          }}
          OnBack={() => {
            console.log("------------------aaaaaaa")
            this.props.navigation.goBack();
          }}
          OnTapCloseAAVC={() => {
            // this.OnTapCloseAAVC();
            this.setState({
              isShowAAVC: false,
            });
          }}
        />
      </>
    );
  }
}

export default function (props) {
  let navigation = useNavigation();
  let route = useRoute();

  return <Main {...props} navigation={navigation} route={route} />;
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
  tabTitle: {
    color: Constants.white,
    fontSize: 15,
  },
  tabBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

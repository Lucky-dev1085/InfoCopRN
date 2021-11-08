import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  BackHandler,
  Share
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from '../utils/Constants';
import { DotsIcon } from '../components/HeaderBar';

import SettingsModal from '../modals/SettingsModal';
import Icon from 'react-native-vector-icons/AntDesign';
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
import { FlatList } from 'react-native-gesture-handler';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import StatusView from './MainTabPanel/StatusView';
import SharedUtility from '../utils/SharedUtility';
import AAVC from './AAVC';
import { AccountModel, PlateRunResModel } from '../utils/models';
import Utils from '../utils/Utils';
import HAZMATView from './MainTabPanel/HAZMATView';

import HistoryView from './MainTabPanel/HistoryView';
import UserProfileView from './MainTabPanel/UserProfileView';

const IconEdit = <Icon name="edit" size={24} color="white" />;
const IconCopy = <Icon name="copy1" size={24} color="white" />;
const IconSetting = <Icon name="setting" size={24} color="white" />;

export function MainTopHeader({
  onTapLogo,
  onTapEdit,
  onTapCopy,
  onTapSettings,
  onTapMoreMenu,
  onTapLogOff,
}) {
  const [isShowMenu, setIsShowMenu, isShowSetting] = useState(false);

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
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          onTapLogo();
        }}>
        <Image
          source={require('../../assets/images/startlogo.png')}
          style={{ width: 40, height: 40, resizeMode: 'contain' }}
        />
        <View>
          <Text style={{ color: 'white', fontSize: 18, marginLeft: 10 }}>
            InfoCopMobile
          </Text>
          <Text style={{ color: 'white', fontSize: 12, marginLeft: 14 }}>
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
            onTapSettings();
          }}
          style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
          {IconSetting}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTapEdit();
          }}
          style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
          {IconEdit}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onTapCopy();
          }}
          style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
          {IconCopy}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingHorizontal: 10, paddingVertical: 10 }}
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

      isHistoryView: false,

      selMainBtnIndex: 0,

      appBrightness: 0.5,

      isShowAAVC: false,
      aavcAccountModel: null,

      initDataAAVC: null,
      historyData: [],

      isLicenceData: false,
      licenceImage: '',
      licenceValue: '',
      licenceState: '',

      showResponseView: false,
      plateNumber: null,
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
          if (this.state.showResponseView) {
            this.setState({ showResponseView: false });
          } else {
            this.setState({
              isShowPlateView: false,
              isShowMainBtnGroup: true,
              selMainBtnIndex: 0,
              selTabIndex: 0,
              isShowSetting: false,
              showResponseView: false,
            });
          }
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
    console.log("se:" + index)
    if (index == 0) {
      this.actionPlate();
    } else if (index == 1) {
      this.actionScanALPR();
    } else if (index == 2) {
      this.actionName();
    } else if (index == 3) {
      this.actionVIN();
    } else if (index == 4) {
      this.actionDL(true);
    } else if (index == 5) {
      this.openDLScanPage()
    } else if (index == 6) {
      this.actionHistory();
    } else if (index == 7) {
      this.actionStatus();
    } else if (index == 8) {
      this.actionHazmat();
    } else if (index == 9) {
      let dict = JSON.parse(await SharedUtility.getString('dict'));
      
      this.setState({
        selMainBtnIndex: 10,
        isShowPlateView: false,
        isShowMainBtnGroup: false,
        initDataAAVC: dict
      });
    } else if (index == 10) {
      DeviceBrightness.setBrightnessLevel(
        this.state.appBrightness > 0.6 ? 0.2 : 1,
      );
      this.setState({
        appBrightness: this.state.appBrightness > 0.6 ? 0.1 : 1,
      });
    } else if (index == 11) {
      let _am = JSON.parse(await SharedUtility.getString('am'));
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
    // NumberPlateScanner().then((result) => {
    //   // alert(JSON.stringify(result));
    // });
    this.props.navigation.navigate("plate-scan", {
      onGoBack: (plateNumber) => {
        if (plateNumber) {
          global.plateNumber = plateNumber;
          this.setState({
            selMainBtnIndex: 0,
            isShowPlateView: true,
            isShowMainBtnGroup: false,
          });
        }
      }
    });
  };

  openDLScanPage = () => {
    this.props.navigation.navigate("dl-scan", {
      onGoBack: (scanData) => {
        let resultWithoutSpace = scanData.split('\n').join('');
        var idValue = 'NA'
        var stateValue = 'NA'

        let _tempArray = resultWithoutSpace.split('DAQ')
        let _tempArray2 = resultWithoutSpace.split('DAJ')
        if (_tempArray.length > 1) {
          if (_tempArray[1].length > 15) {
            idValue = _tempArray[1].replace('\n', '').substring(0, 15)
          }
        }
        if (_tempArray2.length > 1) {
          if (_tempArray2[1].length > 2) {
            stateValue = _tempArray2[1].substring(0, 2)
          }
        }

        this.setState({
          licenceImage: '',
          licenceValue: idValue,
          licenceState: stateValue,
          isLicenceData: true,
          isShowPlateView: true,
          isShowMainBtnGroup: false,
        }, () => {
          this.actionDL(false)
        })
      }
    });
  }

  closeLicenceView = () => {
    this.setState({
      isLicenceData: false,
      licenceImage: '',
      licenceValue: ''
    })
  }

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

  actionDL = (isClear) => {
    if (isClear) {
      this.setState({
        licenceState: '',
        licenceValue: ''
      }, () => {
        this.setState({
          selMainBtnIndex: 4,
          isShowPlateView: true,
          isShowMainBtnGroup: false
        });
      });
    }
    else {
      this.setState({
        selMainBtnIndex: 4,
        isShowPlateView: true,
        isShowMainBtnGroup: false
      });
    }

  };

  actionStatus = () => {
    this.setState({
      selMainBtnIndex: 8,
      isShowPlateView: false,
      isShowMainBtnGroup: false,
    });
  };

  actionHazmat = () => {
    this.setState({
      selMainBtnIndex: 9,
      isShowPlateView: false,
      isShowMainBtnGroup: false,
    });
  };

  actionHistory = () => {
    // this.setState({
    //   selMainBtnIndex: 0,
    //   isShowPlateView: true,
    //   isShowMainBtnGroup: false,
    // });

    // this.setState({
    //   // plateResObj: resObj,
    //   selTabIndex: 2,
    // }, () => {
    //   this.getHistory()
    //   this.refs.scrollRef.scrollTo({
    //     x: 2 * Constants.WINDOW_WIDTH,
    //     y: 0,
    //     animated: true,
    //   });
    // });
    this.setState({
      selMainBtnIndex: 6,
      isShowPlateView: false,
      isShowMainBtnGroup: false,
      isHistoryView: true,
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

  getHistory = () => {
    showPageLoader(true);
    this.apiManager.GetHistory((response) => {
      showPageLoader(false);
      if (response.ICHist != null && response.ICHist.length > 0) {
        this.setState({
          historyData: response.ICHist,
        });
      }
      // alert(JSON.stringify(response));
    });
  };

  historyView = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          height: 70,
        }}
        onPress={async () => {
          showPageLoader(true);
          let result = await this.getRunResult(item.RIN);
          showPageLoader(false);

          if (result && result !== -1) {
            this.setState({
              plateResObj: result,
              selTabIndex: 1,
            }, () => {
              this.refs.scrollRef.scrollTo({
                x: 1 * Constants.WINDOW_WIDTH,
                y: 0,
                animated: true,
              });
            });
          }
        }} >
        <Text
          style={{
            color: 'white',
            fontWeight: '600',
            height: 32,
            marginTop: 7,
          }}>
          {item.VPL}
        </Text>
        <View
          style={{
            height: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'white',
            }}>
            {item.NAM}
          </Text>
          <Text
            style={{
              color: 'white',
            }}>
            {item.RDT}
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: 'white',
            width: '100%',
          }}
        />
      </TouchableOpacity>
    );
  };

  CreateRequest = (Request) => {
    console.log('Creating Requests');

    let RequestURL = '';
    if (!!SharedUtility.sharedSettingModel.serverAddress) {
      RequestURL =
        'https://' +
        SharedUtility.sharedSettingModel.serverAddress +
        '/api/v1beta/icrequest?' +
        Request;
    } else {
      RequestURL =
        'https://' +
        SharedUtility.sharedSettingModel.Def_Server_Address +
        '/api/v1beta/icrequest?' +
        Request;
    }

    console.log('before encoding : ' + RequestURL);

    let enCoded = RequestURL.replace(' ', '%20');

    console.log('after encoding : ' + enCoded);

    return enCoded;
  };

  BuildRspLn = (Id, Val, lf) => {
    let txt = '';
    let str = Val?.trim();
    if (str && str.length > 0) {
      if (lf) txt = Id + ' ' + str + '\r\n';
      else txt = Id + ' ' + str + ' ';
    }
    return txt;
  };

  COUNTCALL = 21;

  getRunResult = async (RIN) => {
    try {
      this._RIN = RIN;
      console.log('Starting getRunRequest with RIN of ', RIN);

      let RequestURL = this.CreateRequest('RIN=' + RIN + '&DMV=FULLREQUEST');

      let apiKey = (await SharedUtility.GetSharedAPIKey('')).getAPIKey();
      // console.warn('LINE 145 >> getRunResult >> apiKey: ', apiKey)
      let Rsp = '';
      let DMV = '';
      let Key = '';

      let DMVResp = null; // PlateRunRes_DMVRspModel
      console.log('request url :' + RequestURL);
      console.log('apiKey :' + apiKey);

      let sr = await this.apiManager.MakeRequest(RequestURL, apiKey, null);
      console.log('LINE 117 PlateInputView >>>> MakeRequest : ' + sr);
      // let prrModel = JsonConvert.DeserializeObject<PlateRunResModel> (sr.Response); //PlateRunResModel
      let prrModel = new PlateRunResModel(sr);
      let count = 0;
      let DLNumber = '';

      let returnObject = {
        imgPhoto: null,
        tvKey: null,
        tvResp: null,
        webViewPercentMatch: null,
        webViewRes: null,
      };

      // NSRange range = new NSRange ();

      //WHILE LOOP TO GET THE RESULT
      while ((!Rsp || Rsp.length < 1) && count < this.COUNTCALL) {
        sr = await this.apiManager.MakeRequest(RequestURL, apiKey, null);
        console.log('MakeRequest Response -> : ', JSON.stringify(sr, null, 4));

        if (!sr) {
          console.log('SR is null will continue to next while loop: >>');
          continue;
        }
        console.log('LINE 154: Each step response in while loop : ', sr);
        prrModel = new PlateRunResModel(sr);

        Key = prrModel.Keywords;
        Key += '\r\n\r\n\r\n';
        Key += prrModel.NCICKeywords;
        console.log('Key valud :>>>>> LINE 162: ', Key);
        if (Key && Key.length > 0) {
          if (Key.indexOf('ALERT') > 0)
            Key = '<font color=#FFFF00>' + Key + '</font>';
          else if (Key.indexOf('HIT') > 0)
            Key = '<font color=#FF0000>' + Key + '</font>';
          Key = Key.replace('\r\n', '<br>');
        }
        console.log('Key value updated :>>>>> LINE 162: ', Key);
        if (prrModel.RspModel != null) {
          Rsp = prrModel.RspModel.TxtMsgRsp + prrModel.RspModel.NCICRsp;

          this.NTS = prrModel.RspModel.Notes;
          this.CSN = prrModel.RspModel.CaseNo;

          DMVResp = prrModel.RspModel.dmvRsp;
        }

        DMV = this.BuildRspLn('NAM:', DMVResp?.Name, true);
        DMV += this.BuildRspLn('DOB:', DMVResp?.DOB, false);
        DMV += this.BuildRspLn('AGE:', DMVResp?.Age, true);
        DMV += this.BuildRspLn('SSN:', DMVResp?.SSN, true);

        let dl = this.BuildRspLn('OLN:', DMVResp?.DLNumber, false);

        DLNumber = DMVResp?.DLNumber;
        // range = new NSRange(DMV.Length + 3, dl.Length - 4);

        DMV += dl;

        DMV += this.BuildRspLn('PTS:', DMVResp?.Points, true);
        DMV += this.BuildRspLn('EXP:', DMVResp?.DLExp, true);
        DMV += this.BuildRspLn(
          'LIC:',
          DMVResp?.PlateState + ' ' + DMVResp?.PlateNumber,
          true,
        );
        DMV += this.BuildRspLn('VIN:', DMVResp?.VIN, true);
        DMV += this.BuildRspLn(
          'VEH:',
          DMVResp?.VehYear +
          ' ' +
          DMVResp?.VehMake +
          ' ' +
          DMVResp?.VehModel +
          ' ' +
          DMVResp?.VehColor,
          true,
        );
        DMV += this.BuildRspLn('LIY:', DMVResp?.VehYear, true);

        count++;
        console.log(
          'End of While in one Loop Check result >>> Key:' +
          Key +
          '   DMV : ' +
          DMV +
          '   RSP : ' +
          Rsp,
        );
        //Thread.Sleep(1000);
        console.log('Rsp.Length >> : ', Rsp.Length);
        console.log(
          'this.COUNTCALL >> count >> : Rsp.Length > ',
          Rsp.Length,
          count,
          this.COUNTCALL,
        );

        if ((Rsp && Rsp.Length >= 1) || count >= this.COUNTCALL) {
          console.log('Will Break Here :>>>>> LINE 217: Rsp> ', Rsp);
          console.log('Current Count Value: >> ', count);
          break;
        }

        console.log('before sleep: ', new Date());
        await Utils.sleep(2000);
        console.log('after sleep: ', new Date());
        // await Task.Delay (2200);
      }

      let TSRsp = Rsp;
      let TSDMV = DMV;
      let TSKey = Key;

      //var TSDMVResp = DMVResp;
      this.GlblDMVResp = DMVResp;

      console.log('LINE 198:  DMVResp >> ', JSON.stringify(DMVResp, null, 4));

      console.log(
        'TSDMV : ' + TSDMV + ' TSKey : ' + TSKey + ' TSRsp : ' + TSRsp,
      );
      //					webViewRes.LoadData(TSRsp, "text/html", "UTF-8", null);
      let baseUrl = 'https://' + SharedUtility.sharedSettingModel.serverAddress;

      // NSMutableAttributedString attrDMV = new NSMutableAttributedString (DMV);

      // attrDMV.AddAttribute (UIStringAttributeKey.ForegroundColor, UIColor.White, new NSRange (0, TSDMV.Length));

      // attrDMV.AddAttribute (UIStringAttributeKey.Link, new NSString (DLNumber), range);
      // attrDMV.AddAttribute (UIStringAttributeKey.ForegroundColor, UIColor.Yellow, range);
      // //tvResp.Text = TSDMV;
      // tvResp.AttributedText = attrDMV;
      // tvResp.Editable = false;
      // tvResp.ShouldInteractWithUrl = (UITextView arg1, NSUrl arg2, NSRange arg3) => {

      //   this.InvokeOnMainThread (() => {

      //     console.log (arg2.ToString ());
      //     moveSlideBar (btnRequest);

      //     BaseVC.setCurSlideBar (3);

      //     BaseVC.hiddenAllMainButttons ();

      //     onDlNumber_action (arg2.ToString ());

      //   });
      //   return false;
      // };

      returnObject.tvResp = DMV;

      // var attr = new NSAttributedStringDocumentAttributes ();
      // var nsError = new NSError ();
      // attr.DocumentType = NSDocumentType.HTML;

      // var myHtmlData = NSData.FromString (TSKey, NSStringEncoding.Unicode);
      // NSAttributedString attrstring = new NSAttributedString (myHtmlData, attr, ref nsError);
      // tvKey.AttributedText = attrstring;
      // //tvKey.Text = attrstring.ToString ();
      // tvKey.TextColor = UIColor.Yellow;
      // tvKey.Editable = false;

      returnObject.tvKey = TSKey;
      returnObject.webViewRes = {
        html: TSRsp.toString(),
        baseUrl: baseUrl.toString(),
      };

      // webViewRes.LoadHtmlString (TSRsp, baseUrl);
      if (prrModel.RspModel != null) {
        if (prrModel.RspModel.PercentMatch != null) {
          returnObject.webViewPercentMatch = {
            html: prrModel.RspModel.PercentMatch.toString(),
            baseUrl: baseUrl.toString(),
          };
          // webViewPercentMatch.LoadHtmlString (prrModel.RspModel.PercentMatch, baseUrl);
        } else {
          //nlHPercentMatch.Constant = 0;
        }
      }

      console.log('Retrieving Photo for RIN ' + RIN);

      RequestURL = this.CreateRequest('PHRIN=' + RIN);

      let tmpRes = await this.apiManager.MakeRequest(RequestURL, apiKey, null); // ServiceResponse

      console.log('tempRes:', typeof tmpRes, tmpRes?.ReqPhotos);
      // tmpRes = JSON.parse(tmpRes)
      // var jObj = Newtonsoft.Json.Linq.JObject.Parse (tmpres.Response);

      // var photosObj = jObj ["ReqPhotos"];
      // var photo = photosObj ["Photo"];

      let photo = tmpRes?.ReqPhotos?.Photo;
      console.log('photo: ', photo);

      let photoList = photo;

      // List<string> photos = JsonConvert.DeserializeObject<List<string>> (photoList);
      // string temp = photos [0];

      let temp = photoList[0];

      if (temp?.toLowerCase() != 'no photo') {
        // InvokeOnMainThread (() => {

        // UIImage image = Global.DecodeBase64ToImage (temp);
        // imgPhoto.ContentMode = UIViewContentMode.ScaleAspectFill;
        // imgPhoto.ClipsToBounds = true;

        if (temp == null) {
          // imgPhoto.Image = new UIImage ("images/defaultimg.png");
          returnObject.imgPhoto = require('../../assets/images/defaultimg.png');
        } else {
          // from base64 to image
          returnObject.imgPhoto = { uri: `data:image/png;base64,${temp}` };
          // imgPhoto.Image = image;
        }

        // });
      } else {
        // TODO show default image and move to response tab

        // imgPhoto.ContentMode = UIViewContentMode.ScaleAspectFill;
        // imgPhoto.ClipsToBounds = true;

        // moveSlideBar (btnResponse);
        // imgPhoto.Image = new UIImage ("images/defaultimg.png");

        returnObject.imgPhoto = require('../../assets/images/defaultimg.png');
      }
      // open response page

      return returnObject;
    } catch (e) {
      console.log('LINE 344 > PlateInputView >>  Exception : ', e);
      Alert.alert(
        'InfoCop',
        'Failed to request, try again after a moment.' + e.message,
      );
      return null;
    }
  };

  render() {
    return (
      <>
        <KeyboardAvoidingView
          // enabled = {Platform.OS == 'ios'}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <MainTopHeader
            onTapEdit={() => {
              if (this.state.plateResObj && this.state.selTabIndex === 1) {
                this.props.navigation.navigate("notes", { plateResObj: this.state.plateResObj })
              }
            }}
            onTapCopy={async () => {
              if (this.state.plateResObj && this.state.selTabIndex === 1) {
                try {
                  const result = await Share.share({
                    message:
                      JSON.stringify(this.state.plateResObj.GlblDMVResp),
                  });
                } catch (error) {
                  Alert.alert(error.message);
                }
              }
            }}
            onTapSettings={async () => {
              this.setState({ isShowSetting: true });
            }}
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
                showResponseView: false,
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
                onTapLock={() => { }}
                onTapButtonItem={this.onTapMainBtnGroup}
              />
            )}

            {this.state.isShowMainBtnGroup == false &&
              this.state.isShowPlateView == true && (
                <>
                  <MainSegBar
                    selIndex={this.state.selTabIndex}
                    onTapSeg={(index) => {
                      if (index == 2) {
                        this.getHistory();
                      }
                      this.refs.scrollRef.scrollTo({
                        x: index * Constants.WINDOW_WIDTH,
                        y: 0,
                        animated: true,
                      });
                      this.setState({ selTabIndex: index });
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
                      this.setState({ selTabIndex: index });
                      if (index == 2) {
                        this.getHistory();
                      }
                    }}
                    keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={{ alignItems: 'center' }}
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

                              if (this.state.isShowMainBtnGroup == false
                                && this.state.isShowPlateView == true) {
                                this.setState({
                                  plateResObj: resObj,
                                  selTabIndex: 1,
                                }, () => {
                                  this.refs.scrollRef.scrollTo({
                                    x: 1 * Constants.WINDOW_WIDTH,
                                    y: 0,
                                    animated: true,
                                  });
                                });
                              }
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

                              if (this.state.isShowMainBtnGroup == false
                                && this.state.isShowPlateView == true) {
                                this.setState({
                                  plateResObj: resObj,
                                  selTabIndex: 1,
                                });
                                this.refs.scrollRef.scrollTo({
                                  x: 1 * Constants.WINDOW_WIDTH,
                                  y: 0,
                                  animated: true,
                                });
                              }
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

                              if (this.state.isShowMainBtnGroup == false
                                && this.state.isShowPlateView == true) {
                                this.setState({
                                  plateResObj: resObj,
                                  selTabIndex: 1,
                                });
                                this.refs.scrollRef.scrollTo({
                                  x: 1 * Constants.WINDOW_WIDTH,
                                  y: 0,
                                  animated: true,
                                });
                              }
                            }}
                          />
                        )}

                        {this.state.selMainBtnIndex == 4 && (
                          <DLNumberView
                            // initDLNumber={''}
                            initDLNumber={this.state.licenceValue + ''}
                            initDLState={this.state.licenceState + ''}
                            onMoveToResponse={(resObj) => {
                              // resobj :  imgPhoto: null,
                              // tvKey: null,
                              // tvResp: null,
                              // webViewPercentMatch: null,
                              // webViewRes: null,
                              // TODO : 1. init response view with resObj:
                              //        2. moveTabBar to response view.

                              if (this.state.isShowMainBtnGroup == false
                                && this.state.isShowPlateView == true) {
                                this.setState({
                                  plateResObj: resObj,
                                  selTabIndex: 1,
                                });
                                this.refs.scrollRef.scrollTo({
                                  x: 1 * Constants.WINDOW_WIDTH,
                                  y: 0,
                                  animated: true,
                                });
                              }
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
                        }}>
                        <FlatList
                          style={{
                            flex: 1,
                            width: '95%',
                          }}
                          data={this.state.historyData}
                          renderItem={this.historyView}
                        />
                      </View>
                    </View>
                  </ScrollView>
                </>
              )}

            {this.state.selMainBtnIndex == 10 &&
              this.state.isShowMainBtnGroup == false && (
              <UserProfileView
                initDataAAVC={this.state.initDataAAVC}
                onMoveToResponse={() => {
                  this.setState({
                    isShowMainBtnGroup: true
                  })
                }}
                onCancel={() => {
                  this.setState({
                    isShowMainBtnGroup: true
                  });
                }}
              />
            )}
            {this.state.selMainBtnIndex == 1 &&
              this.state.isShowMainBtnGroup == false && <ALPRScanView />}

            {this.state.selMainBtnIndex == 8 &&
              this.state.isShowMainBtnGroup == false && <StatusView />}

            {this.state.selMainBtnIndex == 9 &&
              this.state.isShowMainBtnGroup == false && <HAZMATView />}

            {this.state.selMainBtnIndex == 6 &&
              this.state.isShowMainBtnGroup == false && !this.state.showResponseView &&
              <HistoryView
                onMoveToResponse={(showResponseView, resObj) => {
                  this.setState({ showResponseView: showResponseView, plateResObj: resObj });
                }} />}

            {this.state.showResponseView && this.state.plateResObj !== null &&
              <View style={{ flex: 1, marginHorizontal: 10, marginTop: 5 }}>
                <ResponseView resObj={this.state.plateResObj} />
              </View>}

            {/* {this.state.isLicenceData && <LicenceResultView licenceValue={this.state.licenceValue} licenceImage={this.state.licenceImage} closeLicenceView = {this.closeLicenceView} />} */}
            {/* {this.state.isLicenceData && <DLNumberView
              initDLNumber={this.state.licenceValue + ''}
              initDLState={this.state.licenceState + ''}
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
            />} */}

          </ImageBackground>
        </KeyboardAvoidingView>

        <SettingsModal
          isShow={this.state.isShowSetting}
          onTapClose={() => {
            this.setState({ isShowSetting: false });
          }}
        />

        <AAVC
          isShow={this.state.isShowAAVC}
          isFromMain={true}
          aavcAccountModel={this.state.aavcAccountModel}
          initDataAAVC={this.state.initDataAAVC}
          LoginCompletionEvent={(am) => {
            // this.gotoTouchRegisterPageFromAAVC(am);
            this.setState({
              isShowAAVC: false,
            });
          }}
          OnBack={() => {
            console.log("------------------aaaaaaa1")
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

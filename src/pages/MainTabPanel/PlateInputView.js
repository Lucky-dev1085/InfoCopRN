import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Constants from '../../utils/Constants';
import {DotsIcon, MenuIcon, BackIcon} from '../../components/HeaderBar';

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

import Geolocation from 'react-native-geolocation-service';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
} from 'react-native-permissions';
import {PlateRunResModel} from '../../utils/models';
import Utils from '../../utils/Utils';

const IconClose = <Icon name="close" size={24} color="white" />;
const IconEdit = <Icon name="edit" size={24} color="white" />;
const IconCopy = <Icon name="copy1" size={24} color="white" />;

const IconDownArrow = <Icon name="caretdown" size={15} color="white" />;


class PlateInputView extends React.Component {
  apiManager = new API_Manager();
  _RIN = '';
  GlblDMVResp = null; //PlateRunRes_DMVRspModel

  NTS = '';
  CSN = '';

  constructor(props) {
    super(props);

    this.state = {
      isHideFull: true,
      isHideRand: true,
      isHideClear: true,
      isShowPlateType: false,

      plateNumber: global.plateNumber ? global.plateNumber : null,
      plateState: SharedUtility.defaultState,
      plateType: null,

      isShowPlateStatePickerModal: false,
      isShowVehicleTypePicker: false,
    };   
  }

  componentDidMount() {
    this.changeButtonLocation(true, false);
    global.plateNumber = null;
  }

  changeButtonLocation = (both, isOnlyFull) => {
    this.setState({
      isHideRand: !both && isOnlyFull,
      isHideFull: !both && !isOnlyFull,
      isHideClear: false,
    });
  };

  onFullForPlate = async (typeid, plate, state) => {
    let reqId = await this.getPlateRun(typeid, plate, state);

    if(reqId == -1){
      return -1;
    }
    // if(reqId == null){
    //   return null;
    // }
    let resObj = await this.getRunResult(reqId);

    return resObj;
  };

  CreateRequest = (Request) => {
    console.log('Creating Requests');

    let RequestURL = '';
    if (!!SharedUtility.sharedSettingModel.serverAddress) {
      RequestURL = 'https://' + SharedUtility.sharedSettingModel.serverAddress + '/api/v1beta/icrequest?' + Request;
    } else {
      RequestURL = 'https://' + SharedUtility.sharedSettingModel.Def_Server_Address + '/api/v1beta/icrequest?' + Request;
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
      returnObject.webViewRes = {html: TSRsp.toString(), baseUrl: baseUrl.toString()};

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
          returnObject.imgPhoto = require('../../../assets/images/defaultimg.png');
        } else {
          // from base64 to image
          returnObject.imgPhoto = {uri: `data:image/png;base64,${temp}`};
          // imgPhoto.Image = image;
        }

        // });
      } else {
        // TODO show default image and move to response tab

        // imgPhoto.ContentMode = UIViewContentMode.ScaleAspectFill;
        // imgPhoto.ClipsToBounds = true;

        // moveSlideBar (btnResponse);
        // imgPhoto.Image = new UIImage ("images/defaultimg.png");

        returnObject.imgPhoto = require('../../../assets/images/defaultimg.png');
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

  getPlateRun = async (type, plate, state) => {
    try {
  
      let RequestURL = '';
      let params = '';
      if(type == 2){
        // 2 : Full
        // /api/v1beta/icrequest?&LIC &LIS &LIY
        params = 'LIC=' + plate + '&LIS=' + state + '&LIY=2018'+ '&TYP='+type        
      }else if(type == 1){
        // 1:  Random
        // /api/v1beta/icrequest?&LIC &LIS &LIY &TYP &ORI
        params = 'LIC=' + plate + '&LIS=' + state + '&LIY=2018' + '&TYP='+type+'&ORI=' + SharedUtility.ORI         
      }

      if(this.state.isShowPlateType && !Utils.isNullOrEmptyStr(this.state.plateType)){
        params += '&LIT=' + this.state.plateType
      }
      

      RequestURL = this.CreateRequest(params);

      let req = await this.ExecuteRequest(RequestURL);
      if(req == null || req == -1){
        return req;
      }
      console.log('getPlateRun RequestID is ' + req.RequestID);
      return req.RequestID;
    } catch (e) {
      console.log('LINE 407 >> BACKGROUND_PROC getPlateRun error : > ' ,  e.message);
      return null;
    }
  };

  getCurrentLocation = () => {
    return new Promise(async (resolve, reject) => {
      let hasLocationPermission = false;
      try {
        let result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            hasLocationPermission = true;
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }

        let resultCoarse = await check(
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        );
        switch (resultCoarse) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            hasLocationPermission = true;
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      } catch (error) {}

      if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            resolve(position);
          },
          (error) => {
            console.log('getCurrentPosition : error: ', error);
            reject(error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        Alert.alert('Location Error', 'It is needed to get location, please allow and try again.', [
          {
            text:'Cancel',
            style:'cancel'
          },
          {
            text:'Ok',
            style:'default',
            onPress:()=>{
              if (Platform.OS == 'ios') {        

                requestMultiple([            
                  PERMISSIONS.IOS.LOCATION_ALWAYS
                ]).then((statues) => {
                  console.log('PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION: >> ', statuses[PERMISSIONS.IOS.LOCATION_ALWAYS]);
                  
                });
              } else {
              
      
                requestMultiple([            
                  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                  PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
                ]).then((statues) => {
                  console.log('PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION: >> ', statues[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]);
                  console.log('PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION: >> ', statues[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]);
                  
                });
              }
            }

          },
          
        ])
       
        resolve(null);
      }
    });
  };

  ExecuteRequest = async (Request) => {
    // showPageLoader(true);

    try {
      console.log('Executing Request ' + Request);

      let apiKey = (await SharedUtility.GetSharedAPIKey('')).getAPIKey();
      let position = await this.getCurrentLocation();
      
      if (position != null) {
        let lati = position.coords.latitude;
        let lon = position.coords.longitude;

        let stuff = [lati.toString(), lon.toString()];

        let res = await this.apiManager.MakeRequestPlate(
          Request,
          apiKey,
          stuff,
        );

        console.log('res : ' + res);
        return res;
      } else {
        // showPageLoader(false);
        // Alert.alert(
        //   'InfoCop',
        //   'Failed to get your location, please try again after check your location permission.',
        // );
        return -1;
      }
    } catch (ex) {
      // showPageLoader(false);
      Alert.alert('InfoCop', ex.message);
      console.log('Exception of CreateRequest : ' + ex.message);
      return null;
    }
  };

  onTapFull = async () => {
    if (!this.isValidAllFields()) {
      return;
    }
    showPageLoader(true);
    let result = await this.onFullForPlate(
      2,
      this.state.plateNumber,
      this.state.plateState,
    );
    showPageLoader(false);
    // alert(JSON.stringify(result))
    // this.setState({

    // })
    if (result && result != -1 && this.props.onMoveToResponse) {
      console.log('getRunResult return object after ', result);
      // Utils.sleep(200)
      result.RIN = this._RIN;
      result.NTS = this.NTS;
      result.CSN = this.CSN;
      result.GlblDMVResp = this.GlblDMVResp;
      this.props.onMoveToResponse(result);
    }
  };  

  isValidAllFields = () => {
    // TODO : Validate For PlateInput boxes values
    //{ "First Name", "Middle Name", "Last Name", "Suffix", "DOB", "Sex", "State" };

    if (!this.state.plateNumber) {
      Alert.alert('Validation Error', 'Please input Plate Number');
      return false;
    }

    if (!this.state.plateState) {
      Alert.alert('Validation Error', 'Please select Plate State');
      return false;
    }

    if (
      this.state.isShowPlateType == true &&
      Utils.isNullOrEmptyStr(this.state.plateType)
    ) {
      Alert.alert('Validation Error', 'Please select Plat Type');
      return false;
    }

    // if()
    // let count = curtitles.Length;

    // for (int i = 0; i < count; i++) {

    //   // int tag = i + 10;

    //   // UITextField tf = (UITextField)viewInput.ViewWithTag (tag);

    //   if (string.IsNullOrEmpty (tf.Text)) {

    //     // BTProgressHUD.ShowToast ("Please fill the " + curtitles[i] , false, 1200);

    //     return false;
    //   }

    // }

    return true;
  };

  onTapRandom = async () => {
    if (!this.isValidAllFields()) {
      return;
    }

    showPageLoader(true);

    let result = await this.onFullForPlate(
      1,
      this.state.plateNumber,
      this.state.plateState,
    );
    showPageLoader(false);
    if (result && result != -1 && this.props.onMoveToResponse) {
      console.log('getRunResult return object after ', result);
      result.RIN = this._RIN;
      result.NTS = this.NTS;
      result.CSN = this.CSN;
      result.GlblDMVResp = this.GlblDMVResp;
      this.props.onMoveToResponse(result);
    }
  };

  onTapClear = () => {
    this.clearRequestFields();
  };

  clearRequestFields ()
		{
		
      this.setState({
        plateNumber: null,
        plateType: null,
        plateState: SharedUtility.defaultState,
        isShowPlateType: false,
      })

      this.changeButtonLocation (true, false);

		}


  render() {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.label}>Plate Number</Text>
          <TextInput
            style={styles.InputText}
            value={this.state.plateNumber}
            keyboardType={'default'}
            autoCapitalize="characters"
            onChangeText={(text) => {
              this.setState({plateNumber: text.toUpperCase()});
            }}
            placeholder={''}
            onSubmitEditing={() => {}}
          />
          <Text style={styles.label}>Plate State</Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({isShowPlateStatePickerModal: true});
            }}>
            <TextInput
              style={styles.InputText}
              value={this.state.plateState}
              editable={false}
              placeholder={''}
              onSubmitEditing={() => {}}
            />
            <View style={{position: 'absolute', right: 5, top: 5}}>
              {IconDownArrow}
            </View>
          </TouchableOpacity>

          {this.state.isShowPlateType && (
            <>
              <Text style={styles.label}>Vehicle Type</Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({isShowVehicleTypePicker: true});
                }}>
                <TextInput
                  style={styles.InputText}
                  value={this.state.plateType}
                  editable={false}
                  placeholder={''}
                  onSubmitEditing={() => {}}
                />
                <View style={{position: 'absolute', right: 5, top: 5}}>
                  {IconDownArrow}
                </View>
              </TouchableOpacity>
            </>
          )}

          <ReqPanel
            isHideRand={this.state.isHideRand}
            isHideFull={this.state.isHideFull}
            isHideClear={this.state.isHideClear}
            onTapFull={() => {
              this.onTapFull();
            }}
            onTapRand={() => {
              this.onTapRandom();
            }}
            onTapClear={() => {
              this.onTapClear();
            }}
          />
        </View>
        <PickerModal
          pickList={SharedUtility.StateList}
          selectedIndex={0}
          onTapSelect={(index, val) => {
            let showVehicleType = val != SharedUtility.defaultState;
            
            this.setState({
              plateState: val,
              isShowPlateStatePickerModal: false,
              isShowPlateType: showVehicleType,
              plateType: showVehicleType ? this.state.plateType : null,
            });
            if (showVehicleType) {
              this.changeButtonLocation(false, true);
            } else {
              this.changeButtonLocation(true, false);
            }
          }}
          onTapClose={() => {
            this.setState({isShowPlateStatePickerModal: false});
          }}
          isShow={this.state.isShowPlateStatePickerModal}
        />

        <PickerModal
          pickList={SharedUtility.VehicleList}
          selectedIndex={0}
          onTapSelect={(index, val) => {
            
            this.setState({
              plateType: val,
              isShowVehicleTypePicker: false,
            });
          }}
          onTapClose={() => {
            this.setState({isShowVehicleTypePicker: false});
          }}
          isShow={this.state.isShowVehicleTypePicker}
        />
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();
  const route = useRoute();
  return <PlateInputView {...props} navigation={navigation} route={route} />;
}

const styles = StyleSheet.create({
  container: {
    width: Constants.WINDOW_WIDTH * 0.9,
    alignItems: 'stretch',
    paddingTop: 10,
  },
  label: {
    fontSize: 13,
    color: 'white',
    marginTop: 5,
  },
  mainBtn: {
    backgroundColor: Constants.blackTrans,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
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

  mainBtnTitle: {
    color: Constants.white,
    fontSize: 18,
  },
});

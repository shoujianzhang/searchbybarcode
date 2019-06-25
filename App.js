import React, { Component } from 'react';
import { Alert, TouchableOpacity, Image, StyleSheet, View, Linking, Platform } from 'react-native';
import {
  Icon
} from 'native-base';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

export default class BarcodeScan extends Component {
  constructor(props) {
    super(props);
    this._handleTourch = this._handleTourch.bind(this);
    this._handleCameraType = this._handleCameraType.bind(this);
    this.state = {
      torchOn: false,
      backCameraOn: true,
    }
    this.isBarcodeRead = false;
  }

  _requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
      return result === PermissionsAndroid.RESULTS.GRANTED || result === true
    }
    return true
  }

  _onBarCodeRead = (e) => {
    if (!this.isBarcodeRead) {
      this.isBarcodeRead = true;
      console.log("Barcode value is" + e.data, "Barcode type is" + e.type);
      Alert.alert(
        null,
        e.data,
        [
          {text: 'Cancel', onPress: () => {this.isBarcodeRead = false}},
          {text: 'Open with brower', onPress: () => this._openReadByBrower(e)},
        ],
        { cancelable: false }
      )
    }
  }

  // open read data by brower.
  _openReadByBrower(e) {
    Linking.canOpenURL(e.data)
      .then((supported) => {
        if (!supported) {
          return Linking.openURL('https://www.google.co.jp/search?q=' + e.data);
        } else {
          return Linking.openURL(e.data);
        }
      })
      .catch((err) => console.error('An error occurred', err));
    this.isBarcodeRead = false;
  }

  // toggle flash light.
  _handleTourch(value) {
    if (value === true) {
      this.setState({ torchOn: false });
    } else {
      this.setState({ torchOn: true });
    }
  }
  
  // toggle camera between front and back.
  _handleCameraType(value) {
    if (value === true) {
      this.setState({ backCameraOn: false });
    } else {
      this.setState({ backCameraOn: true });
    }
  }

  componentDidMount = () => {
    ({ _, status }) => {
      if (status !== 'PERMISSION_GRANTED') {
        this._requestPermissions()
      }
    }
  }
   
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          ref={cam => this.camera = cam}
          flashMode={this.state.torchOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          type={this.state.backCameraOn ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
          captureAudio={false}
          barCodeTypes={[RNCamera.Constants.BarCodeType.ean8, RNCamera.Constants.BarCodeType.ean13, RNCamera.Constants.BarCodeType.upce]}
          onBarCodeRead={this._onBarCodeRead}
        >
          <BarcodeMask edgeColor={'green'} showAnimatedLine={false}/>
        </RNCamera>
        <View style={styles.bottomOverlayLeft}>
          <TouchableOpacity onPress={() => this._handleTourch(this.state.torchOn)}>
            <View style={[styles.iconContainer, this.state.torchOn === true ? styles.lightOn : null]}>
              <Icon type={Platform.OS === 'ios' ? 'AntDesign' : 'MaterialCommunityIcons'} name={Platform.OS === 'ios' ? 'eye' : 'flashlight' } style={ styles.icon }/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._handleCameraType(this.state.backCameraOn)}>
            <View style={styles.iconContainer}>
              <Icon type={Platform.OS === 'ios' ? 'AntDesign' : 'MaterialCommunityIcons'} name={Platform.OS === 'ios' ? 'camera' : 'camera-switch'} style={styles.icon}/>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.bottomOverlayRight, {height: 0, opacity: 0}]}>
          <TouchableOpacity onPress={() => this._handleCameraType(this.state.backCameraOn)}>
              <Icon type="AntDesign" name={ 'closecircle'} style={styles.closeIcon}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  bottomOverlayLeft: {
    position: "absolute",
    width: "100%",
    flex: 20,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  bottomOverlayRight: {
    position: "absolute",
    width: "100%",
    flex: 20,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  icon: {
    color: 'black',
  },
  closeIcon: {
    color: '#007AFF',
    marginTop: 10,
    marginRight: 10,
    fontSize: 40,
  },
  iconContainer: {
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: '#808080',
    opacity: 1.00,
    borderRadius: 23,
    paddingHorizontal: 8,
    paddingTop: 9,
    paddingBottom: 7,
  },
  lightOn: {
    backgroundColor: 'white',
    opacity: 1.00,
  },
});
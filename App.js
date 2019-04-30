
import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground, Image, ScrollView, FlatList, Modal} from 'react-native';
import RNAndroidInstalledApps from 'react-native-android-installed-apps';
import AppLink from 'react-native-app-link';
import SendIntentAndroid from 'react-native-send-intent';
import FirstView from "./JS/first"

type Props = {};

const plus = require("./assets/plus.png");
const background = require("./assets/background.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const res = deviceHeight/720

export default class App extends Component<Props> {

  constructor() {
    super();
    this.state = {
      modalvisible: false,
      totalApps: [],
      clonedApps: []
    }
  }

  componentDidMount() {
    RNAndroidInstalledApps.getNonSystemApps()
      .then(apps => {
        for (var i = 0; i < apps.length; i ++)
          if (apps [i].packageName == "com.grid") {
            apps.splice(i, 1);
            break;
          }
        this.setState({
          totalApps: apps
        })
      })
      .catch(error => alert(error));

      AsyncStorage.getItem("saved_apps_temp").then((data) => {
        if (data != null) 
          this.setState({clonedApps: JSON.parse(data)})
      }).done();
  }

  setModalVisible(visible) {
    this.setState({modalvisible: visible})
  }

  click_eachApp_selected(item, index) {
    SendIntentAndroid.openApp(item.packageName).then((wasOpened) => {});
  }

  clickPlusBtn() {
    this.setModalVisible(true)
  }

  clickCloneBtn() {
    console.log('=============', this.state.appSelections)
    this.state.appSelections.push({
      appName: 'plus',
      icon: '',
    });

    this.setModalVisible(false)
  }

  getCloneableApps() {
    const {totalApps, clonedApps} = this.state;

    var cloneableApps = [];

    totalApps.forEach((app) => {
      for (var i = 0; i < clonedApps.length; i ++)
        if (app.appName == clonedApps [i].appName) return;
      
      cloneableApps.push(app);
    })

    return cloneableApps;
  }

  onPressClone(clonedApps) {    
    this.setState({
      clonedApps: clonedApps
    })
    AsyncStorage.removeItem("saved_apps_temp")
    AsyncStorage.setItem("saved_apps_temp", JSON.stringify(clonedApps))
    this.setModalVisible(false);
  }

  render() {
    var base64Icon = 'data:image/png;base64,';

    var clonedApps = this.state.clonedApps.slice();
    clonedApps.push({});

    return (
      <View style={styles.container}>
          <ImageBackground source={background} style={{width:deviceWidth, height:deviceHeight}}>
            <View style={{flex:1}} />
            <Text style={{color:'white', textAlign:'center', fontSize:res*25}}>My Dual</Text>
            <FlatList
              data= {clonedApps}
              keyExtractor={(item, index) => index}
              extraData= {this.state}
              renderItem={ ({item, index}) => {
                if (Object.keys(item).length == 0) {
                  return <TouchableOpacity style={{alignSelf:'center', width:deviceWidth/8, height:deviceWidth/8, borderRadius: 8, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent: 'center', marginLeft:deviceWidth*0.1}} onPress={() => this.clickPlusBtn()}>
                  <Image source={plus} style={{width:deviceWidth/15, height:deviceWidth/15}} />
                </TouchableOpacity>
                }
                return (<TouchableOpacity style={{width:deviceWidth/3.3, borderRadius:5, alignItems:'center', padding: deviceWidth * 0.03, margin: deviceWidth * 0.01}} onPress={() => this.click_eachApp_selected(item, index)}>
                  <Image resizeMode="contain" style={{width: deviceWidth/10, height: deviceWidth/10}} source={{uri: base64Icon + item.icon}}/>
                  <Text style={{color:'white', textAlign:'center'}}>{item.appName}</Text>
                </TouchableOpacity>);
              }}
              numColumns={3}
            />

            <View style={{flex:1}} />

            <FirstView
              modalvisible={this.state.modalvisible}
              setModalVisible={this.setModalVisible.bind(this)}
              totalApps={this.state.totalApps}
              clonedApps={this.state.clonedApps}
              onPressClone={this.onPressClone.bind(this)}/>

          </ImageBackground>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%', 
    height: '100%',
    backgroundColor:'#fff'
  },
  icon: {
    width: 22,
    height: 22,
  },
  navbar: {
    height: 80,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  menuImg: {
    width: 40,
    height: 30,
    marginVertical: 36,
    marginLeft: 20,
  },
  filterImg: {
    width: 30,
    height: 30,
    marginVertical: 36,
    marginRight: 12,
  },
  titleLbl1: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 36,
    alignItems: 'center',
    height: 30,
  },
  notitleLbl: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#00000000',
    width: 40,
    height: 30,
    marginVertical: 36,
  },
});
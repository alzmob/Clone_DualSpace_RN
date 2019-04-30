
import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground, Image, ScrollView, FlatList, Modal} from 'react-native';

type Props = {};

const check = require("../assets/check.png");
const uncheck = require("../assets/uncheck.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const res = deviceHeight/720

export default class Tab1 extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      clonedApps: [],
      isGot: false,
      app_count: 0
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("saved_apps_temp").then((data) => {
      if (data != null) 
        this.setState({app_count: JSON.parse(data).length})
    }).done();
  }

  click_eachApp(item, index) {
    const i = this.getSelStatus(item);
    let {clonedApps} = this.state;

    if (i == -1) {
      clonedApps.push(item);
      this.setState({app_count: this.state.app_count+1})
    }
    else {
      clonedApps.splice(i, 1);
      this.setState({app_count: this.state.app_count-1})
    }
    
    this.setState({clonedApps});

//    let {appSelections} = this.state;
//    appSelections[index] = !appSelections[index];
//    this.setState({appSelections});
//    SendIntentAndroid.openApp(item.packageName).then((wasOpened) => {});
  }

  getSelStatus(app) {
    let {clonedApps, isGot} = this.state;
    if (!isGot && clonedApps.length == 0 && this.props.clonedApps.length > 0) {
      clonedApps = this.props.clonedApps.slice();
      this.setState({
        clonedApps,
        isGot: true
      });
    }
    for (var i = 0; i < clonedApps.length; i ++)
      if (app.appName == clonedApps [i].appName)
        return i;
    return -1;
  }

  onPressClone() {
    const {clonedApps} = this.state;
    this.props.onPressClone(clonedApps);
  }

  render() {
    var base64Icon = 'data:image/png;base64,';

    return (
      <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.modalvisible}
          onRequestClose={() => this.props.setModalVisible(false)}>
          <View style={{ width:deviceWidth*0.95, height:deviceHeight*0.7, alignItems:'center', alignSelf: 'center', marginTop:deviceHeight*0.25}}>
            <View style={{width:deviceWidth*0.95, backgroundColor:'#e1e1e1', height:deviceHeight*0.1, borderTopLeftRadius:20, borderTopRightRadius:20, alignItems:'center', justifyContent: 'center', }}>
              <Text style={{color:'blue', fontSize:res*20}}>App to My Dual ({this.state.app_count} / {this.props.totalApps.length})</Text>
            </View>
            <View style={{height:deviceHeight*0.5, width:deviceWidth*0.95, backgroundColor:'white'}}>
              <FlatList
                data= {this.props.totalApps}
                keyExtractor={(item, index) => index}
                extraData= {[this.state, this.props]}
                renderItem={ ({item, index}) => {
                  
                 return (
                  <TouchableOpacity 
                      style={{width:deviceWidth/3.3, borderRadius:5, alignItems:'center', backgroundColor: '#00000000', padding: deviceWidth * 0.03, margin: deviceWidth * 0.01}} onPress={() => this.click_eachApp(item, index)}>
                    <ImageBackground resizeMode="contain" style={{width: deviceWidth/10, height: deviceWidth/10}} source={{uri: base64Icon + item.icon}}>
                      <Image source={this.getSelStatus(item) != -1 ? check  : uncheck} style={{width:deviceWidth/25, height:deviceWidth/25, position:'absolute', top:-5, right:-5}} />
                    </ImageBackground>
                    <Text style={{color:'black', textAlign:'center'}}>{item.appName}</Text>
                  </TouchableOpacity>);
                }}
                numColumns={3}
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent:'space-between', backgroundColor:'white', width:deviceWidth*0.95, height:deviceHeight*0.1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity style={{width:deviceWidth*0.4, height:deviceHeight/18, borderWidth:1, borderColor:'#e1e1e1', borderRadius:5, justifyContent:'center'}} onPress={() => this.props.setModalVisible(false)}>
                <Text style={{textAlign: 'center', color:'black'}}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{width:deviceWidth*0.4, height:deviceHeight/18, backgroundColor:'green', borderRadius:5, marginLeft:deviceWidth*0.05, justifyContent:'center'}} onPress={() => this.onPressClone()}>
                <Text style={{textAlign: 'center', color:'white'}}>CLONE</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
    );
  }
}

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Picker,
  SectionList,
  TouchableHighlight,
  TextInput,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { italic, bold, yellow } from 'ansi-colors';
import Axios from 'axios';
import { thisExpression } from '@babel/types';

var hometeam = null;
var awayteam = null;
var basti = false;
var player= null;

function ItemHome({ title }) {
  return (
    <TouchableHighlight style={styles.item} onPress={() => {
      hometeam = title;
    }}>
      <Text style={styles.title}>{title}</Text>
    </TouchableHighlight>
  );
}
function ItemAway({ title }) {
  return (
    <TouchableHighlight style={styles.item} onPress={() => {
      awayteam = title
    }}>
      <Text style={styles.title}>{title}</Text>
    </TouchableHighlight>
  );
}
function Players({ title }) {
  return (
    <TouchableHighlight style={styles.item2} onPress={() => {
      player = title
    }}>
      <Text style={styles.title}>{title}</Text>
    </TouchableHighlight>
  );
}

//These data need to be changed
const DATA = [
  {
    title: 'Teams',
    data: ['Pizza', 'Burger', 'Risotto', 'Chicken', 'Apple', 'Banana'
    ,'Burger', 'Risotto', 'Chicken', 'Apple', 'Banana'],
  },
];
const teamA = [
  {
    title: 'TeamA',
    data: ['Pizza', 'Burger', 'Risotto', 'Chicken', 'Apple', 'Banana'
    ,'Burger', 'Risotto', 'Chicken', 'Apple', 'Banana'],
  },
];
const teamB = [
  {
    title: 'TeamB',
    data: ['Pizza', 'Burger', 'Risotto', 'Chicken', 'Apple', 'Banana'
    ,'Burger', 'Risotto', 'Chicken', 'Apple', 'Banana'],
  },
];
var actionp = [];
var xxx = [];
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      count: 0,
      saveaction:false,
      newgameView: false,
      cleanCourtView: false,
      homet:'Select Home Team',
      awayt:'Select Away Team',
      mousex : 0,
      mousey: 0,
      selectedTeam: 'Team',
      selectedPerson:'Person',
      selectedPlayer:'Player',
      type:'',
      text: '',
      homeScore: '00',
      awayScore: '00',
      actions:[],

      //home team oyuncuları doldur
      home_players: [],
      //away team oyuncuları doldur
      away_players: [],
      //tum takımlar
      teams: [],
      
      match_id:'',

      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
      startDisable: false,
      currentMinutes: '00',
      currentSecond: '00',
      scoreaction: false,
    }
  }
  
  componentDidMount(){
    Axios.get('https://basket-back.herokuapp.com/teams').then(function(response){
      
      console.log(response.data)
      
      //x = JSON.parse("[" + string + "]");
      //alert('x');
      var of = JSON.stringify(response);
      response.data.map((item) => xxx.push(item));
      
      
    })
    .catch(function(error){
      console.log(error)
    })
    this.setState({ teams: xxx });


  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  onButtonStart = () => {
 
    let timer = setInterval(() => {
 
      var num = (Number(this.state.seconds_Counter) + 1).toString(),
        count = this.state.minutes_Counter;
 
      if (Number(this.state.seconds_Counter) == 59) {
        count = (Number(this.state.minutes_Counter) + 1).toString();
        num = '00';
      }
 
      this.setState({
        minutes_Counter: count.length == 1 ? '0' + count : count,
        seconds_Counter: num.length == 1 ? '0' + num : num
      });
    }, 1000);
    this.setState({ timer });
 
    this.setState({startDisable : true})
  }

  onButtonStop = () => {
    clearInterval(this.state.timer);
    this.setState({startDisable : false})
  }
 
  onButtonClear = () => {
    this.setState({
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
    });
  }
  
  newGame= () => {

    this.setState({ newgameView: true });
    this.setState({ teams: xxx})
    //alert(this.state.teams);
    this.setState({ actions:[], homet:'Select Home Team', awayt:'Select Away Team' ,homeScore:'00', awayScore:'00'});
    actionp = [];
    this.onButtonStop();
    this.onButtonClear();
  }
  
  cleanCourt= () => {
    alert('You clean the game');
    this.setState({ actions:[], homet:'Select Home Team', awayt:'Select Away Team' ,homeScore:'00', awayScore:'00'});
    actionp = [];
    this.onButtonStop();
    this.onButtonClear();
  }
  closeNewGame= () => {
    this.setState({ newgameView: false });
    this.setState({ saveaction: false });
    this.setState({ scoreaction: false });
  }
  saveNewGame= () => {

    
    this.setState({ homet: hometeam });
    this.setState({ awayt: awayteam });
    this.onButtonStart();
    this.closeNewGame();

    //generate random match id
    var length           = 10;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.setState({ match_id: result });   

  }
  saveAction= () => {
    this.setState({ saveaction: true,
    currentMinutes: this.state.minutes_Counter,
    currentSecond: this.state.seconds_Counter,    
    });
    //alert(this.state.mousey);
    //actions.push(this.state.mousey);
    var player1 = []
    var player2 = []

     Axios.get('https://basket-back.herokuapp.com/players?team=' + this.state.homet).then(function(response){
      console.log(response.data)
      response.data.map((item) => player1.push(item));
      //alert(hey)

    })
    .catch(function(error){
      console.log(error)
    })
    this.setState({home_players: player1})

    Axios.get('https://basket-back.herokuapp.com/players?team=' + this.state.awayt).then(function(response){
      console.log(response.data)
      response.data.map((item) => player2.push(item));
      //alert(hey)

    })
    .catch(function(error){
      console.log(error)
    })
    this.setState({away_players: player2})

  }
  scoreAction= () => {
    /*
    Axios.post('/insert',{
      "match_id": "sadsadshsadadjdjsadsasad", 
      "away_team_name": "Heat", 
      "home_team_name": "Hawks", 
      "player_id": 1629121, 
      "description": "asdsadasd",
        "x": 17.0,
        "y": 18.5, 
        "time": 254,
        "type": "asadsa",
        "current_home_score": 0,
        "current_away_score": 0,
        "home_action": true
    })
      .then(function (response) {
        console.log(response);
      })

    */
    this.setState({ scoreaction: true,
    });
    
   
  } 
  giveAction= () => {
    
    actionp.push(<View style={{ width:50, height:50, top: this.state.mousey, left:this.state.mousex, position:'absolute'}}> 
    <Text style={{ color:'red', fontSize:40, fontWeight: 'bold'}}>X</Text>
    </View>);
    this.setState({ actions: actionp, selectedPlayer: player });
    this.closeNewGame();

    /*
      var hash = 0, len = this.state.selectedPlayer.length;
      for (var i = 0; i < len; i++) {
        hash  = ((hash << 5) - hash) + this.state.selectedPlayer.charCodeAt(i);
        hash |= 0; // to 32bit integer
      }*/
      var home = true;
      if (this.state.selectedTeam === this.state.awayt){
        home = false
      }
      
      
    Axios.post('https://basket-back.herokuapp.com/insert',{
      "match_id": this.state.match_id, 
      "away_team_name": this.state.awayt, 
      "home_team_name": this.state.homet, 
      "player_id": player, 
      "description": this.state.text,
        "x": this.state.mousex,
        "y": this.state.mousey, 
        "time": parseInt(this.state.currentMinutes)*60 + parseInt(this.state.currentSecond),
        "type": this.state.type,
        "current_home_score": parseInt(this.state.homeScore),
        "current_away_score": parseInt(this.state.awayScore),
        "home_action": home
    })
      .then(function (response) {
        console.log(response);
      })

    
    
   
  }
  saveScore= () => {
    this.closeNewGame();
    
  } 

  renderitemm(item){
    return(
      <View style={{ width:50, height:50, top: this.state.mousey, left:this.state.mousex,backgroundColor:'pink', position:'absolute'}}> 
      <Text>{item}</Text>
    </View>
    
    );
  }
 
  _onMouseMove(e) {
    this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
   
  render() {
    const x = this.state.mousex;
    const y = this.state.mousey;
    var deneme;
  return (
    <>
      <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.headerText}>My BasketballApp</Text>
        </View>
        
        <View style={styles.buttons}>
          <Text style={{alignSelf: 'flex-start',color: 'brown', textAlign:'center',alignSelf:'center', fontSize: 25, fontWeight:'bold', width:'30%',
          height:'80%', position:'relative', borderRadius:5, backgroundColor:'#ffb366'}}>
            {this.state.homet} / {this.state.awayt}
          </Text>
          <TouchableHighlight style={{alignSelf:'center'}} onPress={this.scoreAction} >
          <Text style={{color: 'brown', textAlign:'center',alignSelf:'center', fontSize: 35, fontWeight:'bold', width:'100%',height:'80%', 
          position:'relative', borderRadius:5, backgroundColor:'#ffb366'}}>
          Score: {this.state.homeScore} : {this.state.awayScore} 
          </Text>
          </TouchableHighlight>
          <Button color='#ffb366'  title="New Game" onPress={this.newGame} style={{width:'40%'}}/> 
          <Button  color='#ffb366' title="Clean Court" onPress={this.cleanCourt} style={{width:'40%'}}/>
          
          <Text style={{ alignSelf: 'center', color: 'brown', fontSize: 50, textAlign:'center', width:'20%',height:'80%',fontWeight:'bold', 
          position:'relative', borderRadius:5, backgroundColor:'#ffb366'}}>
            {this.state.minutes_Counter} : {this.state.seconds_Counter} 
            </Text>
        </View>
        <View
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView} onTouchStart={(e) => {
            if (!this.state.saveaction)
              this.setState({ mousex:e.nativeEvent.pageX-20, mousey: e.nativeEvent.pageY-140 });
            }}> 
          

          <TouchableHighlight style={styles.court} onPress={this.saveAction} onSelectionChange={(event) => alert(event.nativeEvent.selection)}>
            <Image style={styles.image}  source={require('../public/basketballCourt.png')} onPress={this.saveAction}/> 
          </TouchableHighlight> 
          
          {deneme = this.state.actions.map((item) => item)}

          

          <View style={styles.court2}>
            <View style={ this.state.scoreaction ?styles.scoreActive: styles.score}>
            <View style={styles.closeButton}>
              <Button  color='brown'  title="SAVE " onPress={this.saveScore}/> 
              <Button  color='brown'  title="CLOSE" onPress={this.closeNewGame}/>
              </View>

              
                <Text style = {{color: 'brown', fontSize:26, fontWeight:'bold', textAlign:'center'}}>Write Current Score</Text>
                <Text style = {{color: 'brown', fontSize:20, fontWeight:'bold', textAlign:'center'}}>Home Team - Away Team</Text>
                <View  style = {{flexDirection:'row', justifyContent:'space-around', alignSelf:'center'}}>
                <TextInput
                    style={{ height: 100 ,width:'30%', borderColor: 'gray', borderWidth: 1 ,backgroundColor:'white' , borderRadius:20}}
                    textStyle={{text:'center'}}
                    label='homeScore'
                    value={this.state.homeScore}
                    onChangeText={homeScore => this.setState({ homeScore })}
                  />
                    <Text>-</Text>
                    <TextInput 
                    style={{ height: 100,width:'30%', borderColor: 'gray', borderWidth: 1, backgroundColor:'white' , borderRadius:20, paddingLeft:10}}
                    label='awayScore'
                    value={this.state.awayScore}
                    onChangeText={awayScore => this.setState({ awayScore })}
                  />
                </View>
            </View>

          <View style={ this.state.saveaction ?styles.infoActive: styles.info}>
             <View style={styles.closeButton}>
              <Button  color='brown'  title="SAVE " onPress={this.giveAction}/> 
              <Button  color='brown'  title="CLOSE" onPress={this.closeNewGame}/> 
              </View>

              <View style = {{height:'25%', flexDirection:'row', justifyContent:'space-around',}}>
                <View  style = {{borderRadius:20,backgroundColor:'rgba(255, 204, 153, 0.8)', width:'35%'}}>
                <Text style = {{color: 'brown', fontSize:26, fontWeight:'bold'}}>Positions:</Text>
                    <Text style = {{color: 'brown', fontSize:20, fontWeight:'bold'}}>X: {this.state.mousex},</Text>
                    <Text style = {{color: 'brown', fontSize:20, fontWeight:'bold'}}>Y: {this.state.mousey}</Text>
                </View >

                <View style = {{borderRadius:20,backgroundColor:'rgba(255, 204, 153, 0.8)', width:'35%' }}>
                  <Text style = {{color: 'brown', fontSize:26, fontWeight:'bold'}}>TimeStamp:</Text>
                  <Text style={{ alignSelf: 'center', color: 'brown', fontSize: 30, textAlign:'center', width:'60%', height: '60%',fontWeight:'bold', borderRadius:20, backgroundColor:'white'}}>
                  {this.state.currentMinutes} : {this.state.currentSecond} 
                  </Text>
                </View >

              </View>

              <View style = {{ height:'25%' ,flexDirection:'row', justifyContent:'space-around',}}>
                <View style = {{borderRadius:20,backgroundColor:'rgba(255, 204, 153, 0.8)', width:'30%' }}>
                  <Text style = {{color: 'brown', fontSize:26, fontWeight:'bold'}}>Select Team</Text>
                  <Picker
                      selectedValue={this.state.selectedTeam}
                      style={{height: 50, width: '100%', color:'brown', fontSize:26}}
                      textStyle={{fontSize:26}}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({selectedTeam: itemValue})
                        
                      }>
                      <Picker.Item fontSize= '26' color= 'brown' label={this.state.homet} value={this.state.homet} />
                      <Picker.Item color= 'brown' label={this.state.awayt}  value={this.state.awayt} />
                    </Picker>
                </View>

                <View style = {{borderRadius:20,backgroundColor:'rgba(255, 204, 153, 0.8)', width:'30%' }}>
                <Text style = {{color: 'brown', fontSize:26, fontWeight:'bold'}}>Select Person</Text>
                  <Picker
                      selectedValue={this.state.selectedPerson}
                      style={{height: 50, width: '100%', color:'brown', fontSize:26}}
                      textStyle={{fontSize:26}}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({selectedPerson: itemValue})
                      }>
                      <Picker.Item fontSize= '26' color= 'brown' label='Player' value='Player' />
                      <Picker.Item color= 'brown' label='Coach'  value='Coach' />
                      <Picker.Item color= 'brown' label='Team'  value='Team' />
                    </Picker>
                  
                </View>

                <View style = {{borderRadius:20,backgroundColor:'rgba(255, 204, 153, 0.8)', width:'30%' }}>
                <Text style = {{color: 'brown', fontSize:26, fontWeight:'bold'}}>Select Player</Text>
                <ScrollView style={{width:'100%', borderRadius:5, padding:5}}>
                {this.state.home_players.map((item, key) =>
                    <Players title={item} /> )}
                {this.state.away_players.map((item, key) =>
                    <Players title={item} /> )}
                  
                </ScrollView>
                </View>   

              </View>

              <View style = {{ height:'25%' ,flexDirection:'row', justifyContent:'space-around',}}>
                <View style = {{borderRadius:20,backgroundColor:'rgba(255, 204, 153, 0.8)', width:'30%' }}>
                <Text style = {{color: 'brown', fontSize:26, fontWeight:'bold'}}>Write Action Type</Text>
                <TextInput placeholder={"Write Action Type"}
                    style={{ height: 80, borderColor: 'gray', borderWidth: 1, backgroundColor:'white', borderRadius:20, paddingLeft:10,}}
                    label='Action'
                    value={this.state.type}
                    onChangeText={type => this.setState({ type })}
                  />
                </View>

                <View style = {{borderRadius:20,backgroundColor:'rgba(255, 204, 153, 0.8)', width:'30%' }}>
                <Text style = {{color: 'brown', fontSize:26, fontWeight:'bold'}}>Write Current Score</Text>
                <Text style = {{color: 'brown', fontSize:20, fontWeight:'bold'}}>Home Team - Away Team</Text>
                <View  style = {{flexDirection:'row', justifyContent:'space-around'}}>
                <TextInput
                    style={{ height: 40 ,width:100, borderColor: 'gray', borderWidth: 1 ,backgroundColor:'white' , borderRadius:20}}
                    textStyle={{text:'center'}}
                    label='homeScore'
                    value={this.state.homeScore}
                    onChangeText={homeScore => this.setState({ homeScore })}
                  />
                    <Text>-</Text>
                    <TextInput 
                    style={{ height: 40,width:100, borderColor: 'gray', borderWidth: 1, backgroundColor:'white' , borderRadius:20, paddingLeft:10}}
                    label='awayScore'
                    value={this.state.awayScore}
                    onChangeText={awayScore => this.setState({ awayScore })}
                  />
                </View>
                </View>

                <View style = {{borderRadius:20,backgroundColor:'rgba(255, 204, 153, 0.8)', width:'30%' }}>
                <Text style = {{color: 'brown', fontSize:26, fontWeight:'bold'}}>Description</Text>
                <TextInput placeholder={"Write Description"}
                    style={{ height: 80, borderColor: 'gray', borderWidth: 1 ,backgroundColor:'white', borderRadius:20, paddingLeft:10}}
                    label='Description'
                    value={this.state.text}
                    onChangeText={text => this.setState({ text })}
                  />
                  
                </View>                
              </View>
          </View>

         
          <View style={ this.state.newgameView ?styles.newgameActive: styles.newgame}>
              <View style={styles.closeButton}>
              <Button  color='brown'  title="SAVE " onPress={this.saveNewGame}/> 
              <Button  color='brown'  title="CLOSE" onPress={this.closeNewGame}/> 
              </View>
      
              <Text style={{color: 'brown', fontSize:20, alignSelf:'center', fontWeight:"bold"}}>
                Select Home and Away Teams
              </Text>

              <View style={{ width: '55%',flexDirection:'row', alignSelf:'center', alignItems: 'center', justifyContent: 'space-between',}}>
                <Text style={{color: 'black', fontSize:20, alignSelf:'center', fontWeight:"bold", }}>
                  Select Home Team
                </Text>
                <Text style={{color: 'black', fontSize:20, alignSelf:'center', fontWeight:"bold"}}>
                Away Team
                </Text>
              </View>
              <View  style={{flexDirection:'row', 
              width:'80%', height:'70%', 
              marginHorizontal:100 ,
              borderRadius:20, }}>
              <ScrollView style={{width:'20%', borderRadius:20, padding:10}}>
              {this.state.teams.map((item, key) =>
                    <ItemHome title={item} /> )}
              </ScrollView>

              <ScrollView style={{width:'20%', borderRadius:20, padding:10}}>
              {this.state.teams.map((item, key) =>
                    <ItemAway title={item} /> )}
                
              </ScrollView>
              </View>
              
          </View>
          </View>

        </View>
      
    </>
  );
  }
}


const styles = StyleSheet.create({
  header:{
    flex:1,
    backgroundColor: '#cc7a00',
    position: 'relative',
  },
  headerText:{
    fontSize:25,
    fontStyle: 'italic',
    fontWeight:'bold',
    color: 'white',
    textShadowColor: 'brown',
    fontFamily: 'monospace',
    textShadowRadius: 5,
  },
  buttons:{
    width: '100%',
    height: '20%',
    flex: 2,
    marginTop: 5,
    flexDirection: 'row',
    fontSize: 16,
    justifyContent: 'space-around',
  },
  newgame:{

    display: 'none',
  },
  newgameActive:{
    backgroundColor: 'rgba(255, 179, 102, 0.8)',
    borderRadius: 20,
    width: '80%',
    height: '100%',
    flex: 1,
    position: "relative",
    alignSelf: 'center',
    display: 'flex',
  },
  closeButton:{
    width: '15%',
    height: '10%',
    marginTop: 20,
    marginRight: 20,
    alignSelf:'flex-end',
    justifyContent: 'space-between',
    flexDirection:'row',
  },
  scrollView: {
    backgroundColor: 'white',
    flex: 15,
    padding: 30,
    
  },
  court: {
    backgroundColor: 'pink',
    flex:1,
    borderRadius: 20,
    
  },
  court2: {
    flex:1,
    borderRadius: 20,
    position:'absolute',
    alignSelf: 'center',
    width:'90%',
    height:'90%',
    marginTop:50
    
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: "absolute",
  },
  infoActive:{
    backgroundColor: 'rgba(255, 179, 102, 0.8)',
    borderRadius: 20,
    width: '80%',
    height: '100%',
    flex: 1,
    position: "relative",
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  },
  info:{
    display: 'none',
  },
  scoreActive:{
    backgroundColor: 'rgba(255, 179, 102, 0.8)',
    borderRadius: 20,
    width: '70%',
    flex: 1,
    position: "relative",
    alignSelf: 'center',
    display: 'flex',
  },
  score:{
    display: 'none',
  },
  item: {
    backgroundColor: '#dddddd',
    padding: 10,
    marginVertical: 2,
    borderRadius:20,
  },
  itemActive:{
    backgroundColor: '#aaaaaa',
  },
  item2: {
   
    borderRadius:20,
  },
  title: {
    fontSize: 24,
  },
});



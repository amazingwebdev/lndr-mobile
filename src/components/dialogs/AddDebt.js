import React, { Component } from 'react';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import ActionSheet from 'react-native-actionsheet'
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  ScrollView,
  View,
  Image
} from 'react-native';

import styles from '../../screens/styles';
import dialog from './dialog_styles';

const CANCEL_INDEX = 0
const FRIEND_MOCK_DATA = [{name: "tim"}, {name: "matt"}];
const OPTIONS = ["cancel", "tim", "matt"];

const RADIO_OWED_DEFAULT = {
  owe: 'I owe this debt',
  owed: 'The debt is owed to me'
};

export default class AddDebt extends Component {

  constructor(props) {
     super(props);

     this.state = {
       friends: FRIEND_MOCK_DATA,
       selectedFriend: "Select a friend",
       validFriend: false,
       amount: 0,
       currencyType: "USD",
       owed: 0,
       radioLabels: RADIO_OWED_DEFAULT
     };

     this.validateAndCreateDebt = this.validateAndCreateDebt.bind(this)
     this.handleFriendSelected = this.handleFriendSelected.bind(this)
     this.updateOwedAmount = this.updateOwedAmount.bind(this)
     this.showFriendSelection = this.showFriendSelection.bind(this)
  }

  validateAndCreateDebt() {
    console.log("Debt process.");
  }

  showFriendSelection() {
    this.friendActionSheet.show()
  }

  updateRadioLabels(amount) {
    var radioLabels = RADIO_OWED_DEFAULT,
        state = this.state;

    if (state.validFriend) {
      var selectedFriend = state.selectedFriend;
      var money = amount + " " + state.currencyType;

      radioLabels = {
        owe: "I owe " + selectedFriend + " " + money,
        owed: selectedFriend + " owes me " + money
      };
    }

    this.setState({
      radioLabels: radioLabels
    })
  }

  handleFriendSelected(index) {

    var validFriend = index > 0,
        selectedFriend = validFriend ? OPTIONS[index] : "Select a friend";

    this.setState({
      selectedFriend: selectedFriend,
      validFriend: validFriend
    })

    this.updateRadioLabels(this.state.amount);
  }

  updateOwedAmount(amount) {
    this.setState({
      amount: amount,
    })

    this.updateRadioLabels(amount);
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={dialog.payment_row}>
           <Text style={dialog.payment_curr}>$</Text>
           <TextInput
            onChangeText = {(amount) => this.updateOwedAmount(amount)}
            keyboardType={'numeric'}
            style={dialog.payment_amount}>
              </TextInput>
           <Text style={dialog.payment_curr}>USD</Text>
        </View>
        <TextInput
          placeholder="Enter debt memo here"
          style={[dialog.dialog_margins, {marginTop: 10}]}
          onChangeText = {(memo) => this.setState({memo: memo})}
          value = {this.state.memo}/>
         <Text style={dialog.select_friend} onPress={this.showFriendSelection}>{this.state.selectedFriend}</Text>
         <ActionSheet
           ref={o => this.friendActionSheet = o}
           title="Select a friend"
           options={OPTIONS}
           cancelButtonIndex={CANCEL_INDEX}
           onPress={this.handleFriendSelected}
         />
         <RadioForm
           ref={(oweRadioForm) => { this.oweRadioForm = oweRadioForm;}}
           styles = {[dialog.dialog_margins, {marginTop: 10}]}
           radio_props={[
             {label: this.state.radioLabels.owe, value: 0 },
             {label: this.state.radioLabels.owed, value: 1 }
           ]}
           initial={0}
           buttonColor={'#03A9F4'}
           formHorizontal={false}
           labelHorizontal={true}
           animation={true}
           onPress={(owed) => {this.setState({owed:owed})}}
         />
        <TouchableHighlight
          onPress={() => this.validateAndCreateDebt()}
          style={[dialog.dialog_button, {backgroundColor: '#FFF'}]}>
          <Text style={dialog.dialog_text}>Confirm Debt</Text>
        </TouchableHighlight>
      </ScrollView>
    );
  }
}

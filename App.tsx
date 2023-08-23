/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import SecureKeystore from 'react-native-secure-keystore';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const KEY_ALIAS = 'master-key-alias-123';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [text, setText] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    SecureKeystore.clearKeys();
    SecureKeystore.generateKey(KEY_ALIAS, true, 0);
  }, []);

  function encrypt() {
    if (!text) {
      return setEncrypted('Text is empty');
    }
    setEncrypted('Encrypting...');
    SecureKeystore.encryptData(KEY_ALIAS, text)
      .then(r => setEncrypted(r))
      .catch(e => setEncrypted(JSON.stringify(e)));
  }

  function decrypt() {
    setDecrypted('Decrypting...');
    SecureKeystore.decryptData(KEY_ALIAS, encrypted)
      .then(r => setDecrypted(r))
      .catch(e => setDecrypted(JSON.stringify(e)));
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Enter text to Encrypt"
            onChangeText={value => {
              setText(value);
            }}
          />
          <Button title={'Encrypt'} onPress={encrypt} />
          <Text selectable>Encrypted: {encrypted}</Text>

          <Button title={'Decrypt'} onPress={decrypt} />
          <Text selectable>Decrypted: {decrypted}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    gap: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;

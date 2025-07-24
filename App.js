import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import app from './firebase';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "289576671551-t16to93e6kg7uvv6lmgebippmeukdv90.apps.googleusercontent.com",
    redirectUri: "http://localhost:19006",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('✅ Login Success! Access Token:', authentication.accessToken);
  
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent:"center", alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Welcome to Todo App 🚀</Text>
      <Button
        disabled={!request}
        title="Sign in with Google"
        onPress={() => promptAsync()}
      />
    </View>
  );
}

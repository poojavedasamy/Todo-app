import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '289576671551-t16to93e6kg7uvv6lmgebippmeukdv90.apps.googleusercontent.com',
    redirectUri: 'http://localhost:19006',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('✅ Login successful');
      console.log(authentication);
    }
  }, [response]);

  return { promptAsync };
}; 

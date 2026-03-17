import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from '~/redux/store';
import AppContent from '~/navigation/AppContent';
import Toast from 'react-native-toast-message';
import { toastConfig } from '~/utils/toast/toastConfig';
import { initLanguage } from './src/i18n/initLanguage';
import { ThemeProvider, useTheme } from '~/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PermissionService from '~/permissions/PermissionService';
import { navigationRef } from '~/helper/navigationService';

function RootApp() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <AppContent />
      <Toast config={toastConfig} />
    </>
  );
}

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      PermissionService.loadPermissions();
      await initLanguage();
      setReady(true);
    };
    bootstrap();
  }, []);

  //   useEffect(() => {
  //   AsyncStorage.setItem('SECURITY_2FA', JSON.stringify(twoFA));
  // }, [twoFA]);

  // useEffect(() => {
  //   AsyncStorage.setItem('SECURITY_BIOMETRIC', JSON.stringify(biometric));
  // }, [biometric]);

  const queryClient = new QueryClient();
  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SafeAreaProvider>

          <ThemeProvider>
            <NavigationContainer ref={navigationRef}>
              <RootApp />
            </NavigationContainer>
          </ThemeProvider>

        </SafeAreaProvider>
      </Provider>
    </QueryClientProvider>

  );
}

export default App;
